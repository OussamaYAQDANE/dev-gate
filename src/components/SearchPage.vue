<template>
  <div class="search-page py-5">
    <div class="container">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <button class="btn btn-outline-primary back-button" @click="goBack">
          <i class="bi bi-arrow-left me-2"></i>Back
        </button>
        <h1 class="page-title section-title mb-0">Search</h1>
        <div class="spacer"></div> <!-- Empty element to balance the flexbox -->
      </div>
      
      <div class="search-options mb-3">
        <div class="btn-group w-100">
          <button 
            @click="setSearchType('users')" 
            :class="['btn', searchType === 'users' ? 'btn-primary' : 'btn-outline-primary']"
          >
            <i class="bi bi-person me-1"></i> Users
          </button>
          <button 
            @click="setSearchType('skills')" 
            :class="['btn', searchType === 'skills' ? 'btn-primary' : 'btn-outline-primary']"
          >
            <i class="bi bi-stars me-1"></i> Skills
          </button>
          <button 
            @click="setSearchType('projects')" 
            :class="['btn', searchType === 'projects' ? 'btn-primary' : 'btn-outline-primary']"
          >
            <i class="bi bi-code-square me-1"></i> Projects
          </button>
        </div>
      </div>
      
      <div class="search-box mb-4">
        <input
          v-model="searchQuery"
          type="text"
          :placeholder="getSearchPlaceholder()"
          class="form-control"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="btn btn-primary">
          <i class="bi bi-search me-2"></i> Search
        </button>
      </div>

      <div v-if="loading" class="text-center p-4">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>

      <div v-if="error" class="error-message p-3 mb-4 rounded">
        {{ error }}
      </div>

      <div v-if="searchPerformed && results.length === 0 && !loading" class="no-results text-center p-4">
        <i class="bi bi-search me-2 fs-1 mb-3 d-block"></i>
        <p class="lead" v-if="searchType === 'users'">No users found with this username.</p>
        <p class="lead" v-else-if="searchType === 'skills'">No users found with this skill.</p>
        <p class="lead" v-else>No users found with matching projects.</p>
      </div>

      <div v-if="results.length > 0" class="results-container">
        <h2 class="mb-4">Results ({{ results.length }})</h2>
        <div class="user-cards g-4">
          <div 
            v-for="user in results" 
            :key="user.id" 
            class="user-card card mb-3" 
            @click="goToProfile(user.id)"
          >
            <div class="card-body d-flex align-items-center">
              <div class="user-avatar me-3">
                <!-- Display profile image if available, else default image -->
                <img 
                  :src="user.profilePic || DefaultProfile" 
                  :alt="`Photo of ${user.firstName}`"
                  class="profile-image" 
                />
              </div>
              <div class="user-info">
                <h3 class="mb-1">{{ user.firstName }} {{ user.lastName }}</h3>
                <p class="username text-primary mb-1">@{{ user.username }}</p>
                <p class="joined-date mb-0">
                  <i class="bi bi-calendar me-1"></i> Member since {{ formatDate(user.createdAt) }}
                </p>
                
                <!-- Show matched skill if this is a skill search -->
                <div v-if="searchType === 'skills' && user.matchedSkill" class="matched-skill mt-2">
                  <div class="skill-badge d-flex align-items-center">
                    <i class="bi bi-stars me-1"></i>
                    <span>{{ user.matchedSkill }}</span>
                  </div>
                </div>

                <!-- Show matching project if this is a project search -->
                <div v-if="searchType === 'projects' && user.matchedProject" class="matched-project mt-2">
                  <div class="project-badge d-flex align-items-center">
                    <i class="bi bi-code-square me-1"></i>
                    <span>{{ user.matchedProject.title }}</span>
                  </div>
                  <div v-if="user.matchedProject.stack && user.matchedProject.stack.length > 0" class="tech-stack mt-1">
                    <span v-for="(tech, index) in user.matchedProject.stack" :key="index" class="tech-badge">
                      {{ tech }}
                    </span>
                  </div>
                </div>
              </div>
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
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebase-config';
import DefaultProfile from "@/assets/default-profile.png"; // Import default image

export default {
  name: 'SearchPage',
  setup() {
    const router = useRouter();
    const searchQuery = ref('');
    const results = ref([]);
    const loading = ref(false);
    const error = ref(null);
    const searchPerformed = ref(false);
    const searchType = ref('users'); // 'users', 'skills', or 'projects'
    
    // Function to set search type and clear previous results
    const setSearchType = (type) => {
      if (searchType.value !== type) {
        searchType.value = type;
        results.value = [];
        searchPerformed.value = false;
        error.value = null;
        searchQuery.value = ''; // Optional: clear the search query when changing type
      }
    };

    // Get appropriate placeholder text based on search type
    const getSearchPlaceholder = () => {
      switch (searchType.value) {
        case 'users':
          return 'Enter a username...';
        case 'skills':
          return 'Enter a skill to find users...';
        case 'projects':
          return 'Enter a project title, technology or keyword...';
        default:
          return 'Search...';
      }
    };

    // Main search handler
    const handleSearch = async () => {
      if (!searchQuery.value.trim()) {
        switch (searchType.value) {
          case 'users':
            error.value = 'Please enter a username';
            break;
          case 'skills':
            error.value = 'Please enter a skill';
            break;
          case 'projects':
            error.value = 'Please enter a project title, technology, or keyword';
            break;
        }
        return;
      }

      loading.value = true;
      error.value = null;
      results.value = [];
      searchPerformed.value = true;

      try {
        switch (searchType.value) {
          case 'users':
            results.value = await searchByUsername();
            break;
          case 'skills':
            results.value = await searchByComp();
            break;
          case 'projects':
            results.value = await searchByProjects();
            break;
        }
        
        // Log success to help with debugging
        console.log(`Search completed successfully. Found ${results.value.length} results for ${searchType.value}.`);
        
      } catch (err) {
        console.error('Search error:', err);
        error.value = `An error occurred during the search: ${err.message}`;
      } finally {
        loading.value = false;
      }
    };

    // Search by username
    const searchByUsername = async () => {
      try {
        const usersRef = collection(db, 'users');
        
        // Client-side approach for more flexible searching
        const querySnapshot = await getDocs(usersRef);
        const userResults = [];
        const searchLower = searchQuery.value.toLowerCase();
        
        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          if (userData.username && userData.username.toLowerCase().includes(searchLower)) {
            userResults.push({
              id: doc.id,
              ...userData
            });
          }
        });
        
        return userResults;

      } catch (err) {
        console.error('Username search error:', err);
        throw new Error(`Username search failed: ${err.message}`);
      }
    };

    // Search by skill (competences)
    const searchByComp = async () => {
      try {
        const compResults = [];
        const searchLower = searchQuery.value.toLowerCase();
        
        // Get all users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // Loop through each user
        for (const userDoc of usersSnapshot.docs) {
          try {
            // Get the 'competences' sub-collection for each user
            const compRef = collection(db, 'users', userDoc.id, 'competences');
            const compSnapshot = await getDocs(compRef);

            let matchedSkill = null;

            // Loop through all skills of the user
            for (const compDoc of compSnapshot.docs) {
              const compData = compDoc.data();
              if (compData && compData.name && compData.name.toLowerCase().includes(searchLower)) {
                matchedSkill = compData.name;
                break;
              }
            }

            // If a matching skill is found, add the user
            if (matchedSkill) {
              compResults.push({
                id: userDoc.id,
                ...userDoc.data(),
                matchedSkill: matchedSkill
              });
            }
          } catch (compErr) {
            console.error(`Error processing competences for user ${userDoc.id}:`, compErr);
            // Continue with next user instead of failing entire search
          }
        }
        
        return compResults;

      } catch (err) {
        console.error('Skill search error:', err);
        throw new Error(`Skill search failed: ${err.message}`);
      }
    };

    // Search by projects
    const searchByProjects = async () => {
      try {
        const projectResults = [];
        const searchLower = searchQuery.value.toLowerCase();
        
        // Get all users
        const usersRef = collection(db, 'users');
        const usersSnapshot = await getDocs(usersRef);

        // Loop through each user
        for (const userDoc of usersSnapshot.docs) {
          try {
            const userData = userDoc.data();
            
            // Get the 'projects' sub-collection for each user
            const projectsRef = collection(db, 'users', userDoc.id, 'projects');
            const projectsSnapshot = await getDocs(projectsRef);
            
            // Loop through all projects of the user
            for (const projectDoc of projectsSnapshot.docs) {
              const projectData = projectDoc.data();
              
              // Safety checks
              if (!projectData) continue;
              
              // Check if project title contains the search query
              const titleMatch = projectData.title && 
                               projectData.title.toLowerCase().includes(searchLower);
              
              // Check if project description contains the search query
              const descMatch = projectData.description && 
                              projectData.description.toLowerCase().includes(searchLower);
              
              // Check if any technology in stack contains the search query
              let stackMatch = false;
              if (projectData.stack && Array.isArray(projectData.stack)) {
                stackMatch = projectData.stack.some(tech => 
                  tech.toLowerCase().includes(searchLower)
                );
              }
              
              // If any match is found, add the user with the matched project
              if (titleMatch || descMatch || stackMatch) {
                // Check if user is not already in results
                if (!projectResults.some(user => user.id === userDoc.id)) {
                  projectResults.push({
                    id: userDoc.id,
                    ...userData,
                    matchedProject: {
                      ...projectData,
                      id: projectDoc.id // Add project ID for reference
                    }
                  });
                }
                
                // No need to check other projects if we already found a match
                break;
              }
            }
          } catch (projectErr) {
            console.error(`Error processing projects for user ${userDoc.id}:`, projectErr);
            // Continue with next user instead of failing entire search
          }
        }
        
        return projectResults;

      } catch (err) {
        console.error('Project search error:', err);
        throw new Error(`Project search failed: ${err.message}`);
      }
    };

    // Date formatting
    const formatDate = (timestamp) => {
      if (!timestamp) return 'unknown date';
      try {
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('en-US');
      } catch (err) {
        console.error('Date formatting error:', err);
        return 'invalid date';
      }
    };

    // Go to user profile
    const goToProfile = (userId) => {
      router.push(`${userId}`);
    };
    
    // Return to main page
    const goBack = () => {
      router.push('/');
    };

    return {
      searchQuery,
      searchType,
      results,
      loading,
      error,
      searchPerformed,
      setSearchType,
      getSearchPlaceholder,
      handleSearch,
      formatDate,
      goToProfile,
      goBack,
      DefaultProfile
    };
  }
};
</script>

<style scoped>
@import "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.0/font/bootstrap-icons.css";

.search-page {
  --primary-color: #4dabf7; 
  --secondary-color: #9ca3af;
  --bg-color: #242424;
  --card-bg: #2a2a2a;
  --text-color: #e2e8f0;
  --border-color: #3f3f3f;
  --error-color: #fa5252;
  --tech-bg: rgba(77, 171, 247, 0.15);
  --skill-bg: rgba(77, 171, 247, 0.15);
  color: var(--text-color);
  background-color: var(--bg-color);
  min-height: 80vh;
  padding: 2rem;
}

.container {
  max-width: 800px;
  margin: 0 auto;
}

/* Search options */
.search-options .btn-group {
  background-color: var(--card-bg);
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.search-options .btn {
  flex: 1;
  padding: 0.75rem;
  transition: all 0.3s ease;
  border-color: transparent;
}

.search-options .btn-outline-primary {
  color: var(--primary-color);
  background-color: transparent;
}

.search-options .btn-outline-primary:hover {
  background-color: rgba(77, 171, 247, 0.1);
}

.search-options .btn-primary {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Section title styling similar to profile page */
.section-title {
  color: var(--primary-color);
  font-weight: 600;
  position: relative;
  text-align: center;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
  opacity: 0.8;
}

/* Search box styles */
.search-box {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  background-color: var(--card-bg);
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.search-box input {
  flex: 1;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.05);
  color: var(--text-color);
}

.search-box input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px rgba(77, 171, 247, 0.25);
}

.search-box button {
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.search-box button:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Spinner/Loading */
.spinner-border {
  width: 3rem;
  height: 3rem;
  color: var(--primary-color);
}

/* Error message */
.error-message {
  color: var(--error-color);
  background-color: rgba(250, 82, 82, 0.15);
  border-left: 3px solid var(--error-color);
}

/* No results */
.no-results {
  color: var(--secondary-color);
}

/* Results container */
.results-container {
  background-color: var(--card-bg);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
  border: 1px solid var(--border-color);
}

.results-container h2 {
  color: var(--primary-color);
  font-weight: 600;
  border-bottom: 1px solid var(--border-color);
  padding-bottom: 0.75rem;
}

/* User cards */
.user-cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.user-card {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.03);
  overflow: hidden;
}

.user-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3);
  border-color: var(--primary-color);
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 1.2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  overflow: hidden; /* To ensure image stays in circle */
}

/* Profile image style */
.profile-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-info h3 {
  margin: 0 0 0.25rem 0;
  color: var(--text-color);
  font-weight: 600;
}

.username {
  color: var(--primary-color);
  font-size: 0.9rem;
  font-weight: 500;
}

.joined-date {
  color: var(--secondary-color);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
}

/* Project matches */
.matched-project, .matched-skill {
  background-color: rgba(77, 171, 247, 0.1);
  border-radius: 6px;
  padding: 0.5rem;
  margin-top: 0.75rem;
}

.project-badge, .skill-badge {
  color: var(--primary-color);
  font-weight: 500;
  font-size: 0.9rem;
}

.tech-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.tech-badge {
  background-color: var(--tech-bg);
  color: var(--primary-color);
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  display: inline-block;
}

/* Back button styles */
.back-button {
  border: 1px solid var(--primary-color);
  color: var(--primary-color);
  font-weight: 500;
  transition: all 0.2s ease;
  padding: 0.5rem 1rem;
}

.back-button:hover {
  background-color: var(--primary-color);
  color: white;
  transform: translateY(-2px);
}

.spacer {
  width: 80px; /* Approximately the width of the back button */
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .search-box {
    flex-direction: column;
  }

  .search-box button {
    width: 100%;
    justify-content: center;
  }
  
  .user-card .card-body {
    flex-direction: column;
    text-align: center;
  }
  
  .user-avatar {
    margin-bottom: 1rem;
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
  
  .section-title {
    font-size: 1.5rem;
  }
  
  .spacer {
    display: none;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    gap: 1rem;
  }
  
  .back-button {
    align-self: flex-start;
  }
}
</style>