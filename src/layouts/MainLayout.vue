<template>
  <div class="d-flex main-bg" id="wrapper">
    <!-- Botón de menú para móviles -->
    <button 
      class="btn btn-primary d-md-none menu-toggle" 
      @click="toggleSidebar"
      :class="{ 'active': sidebarVisible }"
    >
      <i class="fas" :class="sidebarVisible ? 'fa-times' : 'fa-bars'"></i>
    </button>

    <!-- Overlay para móviles cuando el menú está abierto -->
    <div 
      v-if="sidebarVisible" 
      class="sidebar-overlay d-md-none"
      @click="toggleSidebar"
    ></div>

    <!-- Sidebar -->
    <div 
      class="sidebar-bg border-end" 
      id="sidebar-wrapper"
      :class="{ 'sidebar-visible': sidebarVisible }"
    >
      <AppSidebar />
    </div>

    <div id="page-content-wrapper">
      <header class="main-header bg-gradient-primary text-white p-3 d-flex justify-content-between align-items-center shadow-sm">
        <div class="d-flex align-items-center gap-2">

        </div>
        <div class="d-flex align-items-center gap-2 gap-md-3">
          <span class="fw-semibold d-none d-lg-inline">
            <i class="fas fa-user-circle me-1"></i> 
            Bienvenido, {{ user?.nombre || 'Usuario' }}
            <small class="ms-2">({{ user?.rol || 'Rol' }})</small>
          </span>
          <span class="fw-semibold d-inline d-lg-none">
            <i class="fas fa-user-circle me-1"></i> 
            {{ user?.nombre || 'Usuario' }}
          </span>
          <span class="text-white-50 small d-none d-md-inline">
            <i class="fas fa-code me-1"></i>v{{ appVersion }}
          </span>
          <button @click="logout" class="btn btn-light btn-sm px-2 px-md-3 shadow-sm">
            <i class="fas fa-sign-out-alt me-1 d-none d-sm-inline"></i>
            <span class="d-inline d-sm-none">Salir</span>
            <span class="d-none d-sm-inline">Salir</span>
          </button>
        </div>
      </header>
      <main class="container-fluid main-content-area animate__animated animate__fadeIn">
        <router-view :key="$route.fullPath" />
      </main>
    </div>

    <!-- Modal Info ZLabs -->
    <div v-if="showInfoModal" class="zlabs-modal-backdrop">
      <div class="zlabs-modal-content">
        <div class="zlabs-modal-body">
       
            <p><span class="fs-5 fw-bold">   <i class="fas fa-info-circle me-2"></i> Acerca de</span></p>
            <p><span class="fs-6 fw-bold">App realizada por Azenion - 2025</span></p>
            <p><span class="fs-6 text-muted">Versión {{ appVersion }}</span></p>
            <img src="https://azenion.ezamorano.cl/img/Azenion_horizontal_s.png" alt="Azenion">
            <a href="https://azenion.ezamorano.cl" target="_blank">https://azenion.ezamorano.cl</a>
        </div>
        <button class="zlabs-modal-close" @click="showInfoModal = false" aria-label="Cerrar">&times;</button>
      </div>
    </div>
  </div>
</template>

<script>
import AppSidebar from '@/components/Sidebar.vue'
import { AuthService } from '../services/AuthService'
import packageJson from '../../package.json'

export default {
  name: 'MainLayout',
  components: {
    AppSidebar
  },
  data() {
    return {
      user: AuthService.getUser(),
      sidebarVisible: false,
      showInfoModal: false,
      appVersion: packageJson.version
    }
  },
  methods: {
    logout() {
      AuthService.logout()
      this.$router.push('/login')
    },
    toggleSidebar() {
      this.sidebarVisible = !this.sidebarVisible;
      // Bloquear el scroll del body cuando el menú está abierto
      document.body.style.overflow = this.sidebarVisible ? 'hidden' : '';
    },
    handleKeydown(e) {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'i' || e.key === 'I')) {
        e.preventDefault();
        this.showInfoModal = true;
      }
      if (e.key === 'Escape' && this.showInfoModal) {
        this.showInfoModal = false;
      }
    }
  },
  mounted() {
    window.addEventListener('keydown', this.handleKeydown);
  },
  beforeUnmount() {
    window.removeEventListener('keydown', this.handleKeydown);
  },
  watch: {
    // Cerrar el menú al cambiar de ruta en móviles
    '$route'() {
      if (window.innerWidth < 768) {
        this.sidebarVisible = false;
        document.body.style.overflow = '';
      }
    }
  }
}
</script>

<style scoped>
.main-bg {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-header {
  background: linear-gradient(135deg, #4e73df 0%, #224abe 100%);
}

.main-header .fw-semibold {
  color: #cccccc; /* Gris claro */
}

.main-content-area {
  padding: 0.5rem;
  min-height: calc(100vh - 64px);
}

/* Estilos para el logo del header */
.header-logo {
  height: 32px;
  margin-right: 8px;
}

/* Estilos para el botón de menú móvil */
.menu-toggle {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1030;
  width: 40px;
  height: 40px;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0,0,0,0.15);
}

.menu-toggle.active {
  background-color: #dc3545;
}

/* Overlay para móviles */
.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1020;
}

/* Estilos responsive para el sidebar */
#sidebar-wrapper {
  transition: transform 0.3s ease-in-out;
}

@media (max-width: 767.98px) {
  #sidebar-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 1030;
    transform: translateX(-100%);
  }

  #sidebar-wrapper.sidebar-visible {
    transform: translateX(0);
  }

  .main-content-area {
    padding: 0.25rem;
    margin-top: 3rem;
  }
}

@media (min-width: 768px) {
  .menu-toggle {
    display: none;
  }
  
  .main-content-area {
    padding: 1rem;
  }
}

@media (min-width: 1200px) {
  .main-content-area {
    padding: 1rem;
  }
}

.zlabs-modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 62, 80, 0.25);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.zlabs-modal-content {
  background: #fff;
  border-radius: 16px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px 0 rgba(44,62,80,0.18);
  padding: 2rem 2.5rem 1.5rem 2.5rem;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.zlabs-modal-body {
  margin-bottom: 1rem;
  text-align: center;
}
.zlabs-modal-close {
  position: absolute;
  top: 10px;
  right: 16px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #888;
  cursor: pointer;
  transition: color 0.2s;
}
.zlabs-modal-close:hover {
  color: #224abe;
}
</style>

