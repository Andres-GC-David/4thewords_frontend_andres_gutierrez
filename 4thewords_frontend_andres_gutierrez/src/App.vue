<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'

const isNavbarCollapsed = ref(true);

function toggleNavbar() {
  isNavbarCollapsed.value = !isNavbarCollapsed.value;
}
</script>

<template>
  <div class="app-container">
    <header class="app-header">
      <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
          <RouterLink to="/" class="navbar-brand">Leyendas Ticas</RouterLink>
          <button class="navbar-toggler" type="button" @click="toggleNavbar" :class="{ collapsed: isNavbarCollapsed }" aria-controls="navbarNav" aria-expanded="!isNavbarCollapsed" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" :class="{ show: !isNavbarCollapsed }" id="navbarNav">
            <ul class="navbar-nav ms-auto">
              <li class="nav-item">
                <RouterLink to="/" class="nav-link">Home</RouterLink>
              </li>
              <li class="nav-item">
                <RouterLink to="/crear" class="nav-link">Agregar Leyenda</RouterLink>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <main class="app-main">
      <RouterView />
    </main>
    <footer class="app-footer bg-dark text-white text-center py-3">
      <p>&copy; 2025 Leyendas Ticas. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  width: 100%;
}

.app-header {
  flex-shrink: 0;
  width: 100%;
}

.app-main {
  flex-grow: 1;
  padding: 1rem;
  background-color: #f9f9f9;
  width: 100%;
}

.app-footer {
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .app-main {
    padding: 0.5rem;
  }

  .navbar-nav {
    text-align: center;
  }

  .navbar-brand {
    font-size: 1.2rem;
  }

  .app-footer p {
    font-size: 0.8rem;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .navbar-brand {
    font-size: 1.5rem;
  }

  .navbar-nav .nav-link {
    font-size: 1rem;
  }

  .app-footer p {
    font-size: 0.9rem;
  }
}

@media (min-width: 1025px) {
  .navbar-brand {
    font-size: 2rem;
  }

  .navbar-nav .nav-link {
    font-size: 1.2rem;
  }

  .app-main {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
  }

  .app-footer p {
    font-size: 1rem;
  }
}
</style>