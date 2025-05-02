<template>
    <div class="search-page">
      <div class="container">
        <h1 class="page-title">Rechercher des Utilisateurs</h1>
        
        <div class="search-box">
          <input
            v-model="usernameQuery"
            type="text"
            placeholder="Entrez un username, une compétence..."
            
          />
          <button @click="handle">
            <i class="material-icons">search</i> Rechercher
          </button>
        </div>
  
        <div v-if="loading" class="loading">
          <div class="spinner"></div>
        </div>
  
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
  
        <div v-if="searchPerformed && results.length === 0" class="no-results">
          Aucun utilisateur trouvé avec ce username ou compétence.
        </div>
  
        <div v-if="results.length > 0" class="results-container">
          <h2>Résultats ({{ results.length }})</h2>
          <div class="user-cards">
            <div v-for="user in results" :key="user.id" class="user-card" @click="goToProfile(user.id)">
              <div class="user-avatar">
                {{ user.firstName?.charAt(0) || '' }}{{ user.lastName?.charAt(0) || '' }}
              </div>
              <div class="user-info">
                <h3>{{ user.firstName }} {{ user.lastName }}</h3>
                <p class="username">@{{ user.username }}</p>
                <p class="joined-date">Membre depuis {{ formatDate(user.createdAt) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { collection, query, where, getDocs } from 'firebase/firestore';
  import { db } from '../firebase/firebase-config';
  
  export default {
    name: 'SearchPage',
    setup() {
      const router = useRouter();
      const usernameQuery = ref('');
      const results = ref([]);
      const loading = ref(false);
      const error = ref(null);
      const searchPerformed = ref(false);
      
  
      // Rechercher par username
      const searchByUsername = async () => {
        if (!usernameQuery.value.trim()) {
          error.value = 'Veuillez entrer un username';
          return;
        }
  
        loading.value = true;
        error.value = null;
        results.value = [];
        searchPerformed.value = true;
  
        try {
          const usersRef = collection(db, 'users');
          const q = query(
            usersRef,
            where('username', '>=', usernameQuery.value),
            where('username', '<=', usernameQuery.value + '\uf8ff')
          );
          
          const querySnapshot = await getDocs(q);
          
          querySnapshot.forEach((doc) => {
            results.value.push({
              id: doc.id,
              ...doc.data()
            });
          });
  
        } catch (err) {
          console.error('Erreur de recherche:', err);
          error.value = 'Une erreur est survenue lors de la recherche 1';
        } finally {
          loading.value = false;
        }
      };
  
      // Rechercher par compétence
      const searchByComp = async () => {
  if (!usernameQuery.value.trim()) {
    error.value = 'Veuillez entrer une compétence';
    return;
  }

  loading.value = true;
  error.value = null;
  results.value = [];
  searchPerformed.value = true;

  try {
    // On récupère tous les utilisateurs
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);

    // On parcourt chaque utilisateur
    for (const userDoc of usersSnapshot.docs) {
      // On récupère la sous-collection 'competences' pour chaque utilisateur
      const compRef = collection(userDoc.ref, 'competences');
      const compSnapshot = await getDocs(compRef);

      let foundCompetence = false;

      // On parcourt toutes les compétences de l'utilisateur
      compSnapshot.forEach((compDoc) => {
        // On vérifie si le nom de la compétence contient la compétence recherchée
        if (compDoc.data().name.toLowerCase().includes(usernameQuery.value.toLowerCase())) {
          foundCompetence = true;
        }
      });

      // Si une compétence correspondante est trouvée, on ajoute l'utilisateur
      if (foundCompetence) {
        results.value.push({
          id: userDoc.id,
          ...userDoc.data(),
          competences: compSnapshot.docs.map(doc => doc.data().name)
        });
      }
    }

  } catch (err) {
    console.error('Erreur de recherche par compétence:', err);
    error.value = 'Une erreur est survenue lors de la recherche 2';
  } finally {
    loading.value = false;
  }
};

  
      // Formatage de la date
      const formatDate = (timestamp) => {
        if (!timestamp) return 'date inconnue';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('fr-FR');
      };
  
      // Aller au profil utilisateur
      const goToProfile = (userId) => {
        router.push(`${userId}`);
      };
      const handle = () => {
        searchByComp();
        searchByUsername();
      }
  
      return {
        handle,
        usernameQuery,
        results,
        loading,
        error,
        searchPerformed,
        searchByUsername,
        searchByComp,
        formatDate,
        goToProfile
      };
    }
  };
  </script>
  
  <style scoped>
  .search-page {
    padding: 2rem;
    min-height: 80vh;
  }
  
  .container {
    max-width: 800px;
    margin: 0 auto;
  }
  
  .page-title {
    text-align: center;
    margin-bottom: 2rem;
    color: #333;
  }
  
  .search-box {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .search-box input {
    flex: 1;
    padding: 0.75rem 1rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
  }
  
  .search-box button {
    padding: 0 1.5rem;
    background: #202020;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .search-box button:hover {
    background: #333;
  }
  
  .loading {
    display: flex;
    justify-content: center;
    padding: 2rem;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    border-top: 4px solid #202020;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .error-message {
    color: #d32f2f;
    padding: 1rem;
    background: #fde8e8;
    border-radius: 4px;
    margin-bottom: 1rem;
  }
  
  .no-results {
    text-align: center;
    padding: 2rem;
    color: #666;
  }
  
  .results-container {
    margin-top: 2rem;
  }
  
  .user-cards {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .user-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    border: 1px solid #eee;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .user-card:hover {
    background: #f5f5f5;
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
  
  .user-avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: #202020;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    flex-shrink: 0;
  }
  
  .user-info {
    flex: 1;
  }
  
  .user-info h3 {
    margin: 0 0 0.25rem 0;
    color: #333;
  }
  
  .username {
    margin: 0 0 0.25rem 0;
    color: #666;
    font-size: 0.9rem;
  }
  
  .joined-date {
    margin: 0;
    color: #888;
    font-size: 0.8rem;
  }
  
  @media (max-width: 768px) {
    .search-box {
      flex-direction: column;
    }
  
    .search-box button {
      justify-content: center;
      padding: 0.75rem;
    }
  }
  </style>
  