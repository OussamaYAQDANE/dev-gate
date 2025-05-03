<template>
  <div class="card h-100">
    <div class="card-body">
      <h5 class="card-title">Répartition des compétences</h5>
      <div v-if="isLoading" class="text-center py-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>
      <div v-else-if="totalSkills === 0" class="text-center py-4">
        <p class="text-muted">Aucune compétence ajoutée</p>
      </div>
      <div v-else class="chart-container">
        <canvas ref="skillsChartCanvas" id="skillsDistributionChart"></canvas>
      </div>
      <div v-if="totalSkills > 0" class="chart-legend mt-3">
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color beginner">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Débutant ({{ numBeginner }})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color intermediate">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Intermédiaire ({{ numIntermediate }})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color advanced">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Avancé ({{ numAdvanced }})</span>
        </div>
        <div class="legend-item d-inline-block mr-3">
          <span class="legend-color expert">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>Expert ({{ numExpert }})</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '@/firebase/firebase-config.js';
import Chart from 'chart.js/auto';

// État des données
const numBeginner = ref(0);
const numIntermediate = ref(0);
const numAdvanced = ref(0);
const numExpert = ref(0);
const isLoading = ref(true);
const error = ref(null);

// Référence au canvas du graphique
const skillsChartCanvas = ref(null);
let skillsChartInstance = null;
let skillsDataUnsubscribe = null;
let authUnsubscribe = null;

// Calculer le nombre total de compétences
const totalSkills = computed(() => {
  return numBeginner.value + numIntermediate.value + numAdvanced.value + numExpert.value;
});

// Couleurs pour chaque niveau
const chartColors = {
  beginner: 'rgba(255, 193, 7, 0.8)', // jaune
  intermediate: 'rgba(52, 152, 219, 0.8)', // bleu
  advanced: 'rgba(46, 204, 113, 0.8)', // vert
  expert: 'rgba(155, 89, 182, 0.8)' // violet
};

// Fonction pour créer le graphique
const initSkillsChart = () => {
  try {
    // Détruire l'instance précédente si elle existe
    if (skillsChartInstance) {
      skillsChartInstance.destroy();
      skillsChartInstance = null;
    }

    // Vérifier si le canvas existe et si nous avons des données
    if (!skillsChartCanvas.value || totalSkills.value === 0) return;

    // Obtenir le contexte du canvas
    const ctx = skillsChartCanvas.value.getContext('2d');
    if (!ctx) return;

    // Préparer les données pour le graphique
    const labels = [];
    const data = [];
    const colors = [];
    
    // Ajouter uniquement les niveaux qui ont des compétences
    if (numBeginner.value > 0) {
      labels.push('Débutant');
      data.push(numBeginner.value);
      colors.push(chartColors.beginner);
    }
    
    if (numIntermediate.value > 0) {
      labels.push('Intermédiaire');
      data.push(numIntermediate.value);
      colors.push(chartColors.intermediate);
    }
    
    if (numAdvanced.value > 0) {
      labels.push('Avancé');
      data.push(numAdvanced.value);
      colors.push(chartColors.advanced);
    }
    
    if (numExpert.value > 0) {
      labels.push('Expert');
      data.push(numExpert.value);
      colors.push(chartColors.expert);
    }

    // Créer le graphique
    skillsChartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { 
            display: false 
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percent = ((context.raw / total) * 100).toFixed(1);
                return `${context.label}: ${context.raw} (${percent}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });

    // Ajouter un observateur de redimensionnement
    const ro = new ResizeObserver(() => {
      if (skillsChartInstance) {
        skillsChartInstance.resize();
      }
    });
    
    ro.observe(skillsChartCanvas.value);
    
    // Nettoyer l'observateur au démontage
    onBeforeUnmount(() => {
      ro.disconnect();
    });

  } catch (err) {
    console.error("Erreur lors de l'initialisation du graphique:", err);
    error.value = "Impossible de charger le graphique";
  }
};

// Charger les données utilisateur depuis Firestore
const loadUserSkillsData = async (userId) => {
  if (!userId) return;
  
  try {
    isLoading.value = true;
    error.value = null;
    
    // Option 1: Chargement unique
    // const userDoc = await getDoc(doc(db, "users", userId));
    
    // Option 2: Écouter les changements en temps réel (recommandé)
    if (skillsDataUnsubscribe) {
      skillsDataUnsubscribe();
    }
    
    skillsDataUnsubscribe = onSnapshot(doc(db, "users", userId), (userDoc) => {
      if (userDoc.exists()) {
        const userData = userDoc.data();
        
        // Récupérer les compteurs de compétences
        numBeginner.value = userData.numbeginner || 0;
        numIntermediate.value = userData.numintermediate || 0;
        numAdvanced.value = userData.numadvanced || 0;
        numExpert.value = userData.numexpert || 0;
        
        // Réinitialiser le graphique avec les nouvelles données
        initSkillsChart();
      } else {
        console.log("Aucune donnée utilisateur trouvée");
        // Réinitialiser les compteurs à zéro
        numBeginner.value = 0;
        numIntermediate.value = 0;
        numAdvanced.value = 0;
        numExpert.value = 0;
      }
      
      isLoading.value = false;
    }, (err) => {
      console.error("Erreur lors de la récupération des données:", err);
      error.value = "Impossible de charger les données";
      isLoading.value = false;
    });
    
  } catch (err) {
    console.error("Erreur lors du chargement des données:", err);
    error.value = "Impossible de charger les données";
    isLoading.value = false;
  }
};

// Surveiller l'état d'authentification
onMounted(() => {
  const auth = getAuth();
  
  authUnsubscribe = onAuthStateChanged(auth, (user) => {
    if (user) {
      loadUserSkillsData(user.uid);
    } else {
      // L'utilisateur n'est pas connecté
      isLoading.value = false;
      numBeginner.value = 0;
      numIntermediate.value = 0;
      numAdvanced.value = 0;
      numExpert.value = 0;
    }
  });
});

// Observer les changements dans les données pour mettre à jour le graphique
watch([numBeginner, numIntermediate, numAdvanced, numExpert], () => {
  initSkillsChart();
});

// Nettoyer les écouteurs lors du démontage du composant
onBeforeUnmount(() => {
  if (skillsDataUnsubscribe) {
    skillsDataUnsubscribe();
  }
  
  if (authUnsubscribe) {
    authUnsubscribe();
  }
  
  if (skillsChartInstance) {
    skillsChartInstance.destroy();
    skillsChartInstance = null;
  }
});
</script>

<style scoped>
.chart-container {
  position: relative;
  height: 300px;
  width: 100%;
  margin: 0 auto;
}

.chart-legend {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 1rem;
}

.legend-item {
  display: flex;
  align-items: center;
  margin: 0.5rem 0.75rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 0.5rem;
}

.beginner {
  background-color: rgba(255, 193, 7, 0.8);
}

.intermediate {
  background-color: rgba(52, 152, 219, 0.8);
}

.advanced {
  background-color: rgba(46, 204, 113, 0.8);
}

.expert {
  background-color: rgba(155, 89, 182, 0.8);
}

/* Styles pour les petits écrans */
@media (max-width: 768px) {
  .chart-container {
    height: 250px;
  }
  
  .chart-legend {
    flex-direction: column;
    align-items: center;
  }
  
  .legend-item {
    margin: 0.25rem 0;
  }
}
</style>