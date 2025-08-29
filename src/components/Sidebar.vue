<template>
  <div class="sidebar-container">
    <div class="sidebar-heading text-center py-4 primary-text fs-4 fw-bold border-bottom d-flex align-items-center justify-content-center">
      <img src="/logov1.jpeg" alt="Logo" class="sidebar-logo"/>
    </div>
    <div class="list-group list-group-flush sidebar-list">
      <router-link 
        v-if="canAccessRoute('dashboard')"
        to="/dashboard" class="list-group-item list-group-item-action sidebar-link">
        <i class="fas fa-tachometer-alt me-2"></i> Dashboard
      </router-link>

      <div class="ps-2 mt-2">
        <div class="sidebar-section-title mb-1" v-if="canAccessRoute('nueva-evaluacion')">
          <i class="fas fa-file-alt me-2"></i> Evaluaciones
       

        <!-- Activador de submenú -->
        <a href="#" @click.prevent="submenuVisible = !submenuVisible" class="list-group-item list-group-item-action sidebar-link">
          <i class="fas fa-plus-circle me-2"></i> Nueva Evaluación
          <i :class="submenuVisible ? 'fas fa-chevron-up float-end' : 'fas fa-chevron-down float-end'"></i>
        </a>
      </div>
        <!-- Submenú -->
        <div v-if="submenuVisible" class="ms-4">
          <router-link
            v-if="canAccessRoute('nueva-evaluacion')"
            :to="{ name: 'nueva-evaluacion', query: { idPauta: 4 } }"
            custom
            v-slot="{ navigate, isExactActive }"
          >
            <a
              href="#"
              @click="navigate"
              :class="['list-group-item', 'list-group-item-action', 'sidebar-link', { 'router-link-exact-active': isExactActive && $route.query.idPauta == 4 }]"
            >
              <i class="fas fa-hashtag me-2"></i> RRSS
            </a>
          </router-link>
          <router-link
            v-if="canAccessRoute('nueva-evaluacion')"
            :to="{ name: 'nueva-evaluacion', query: { idPauta: 1 } }"
            custom
            v-slot="{ navigate, isExactActive }"
          >
            <a
              href="#"
              @click="navigate"
              :class="['list-group-item', 'list-group-item-action', 'sidebar-link', { 'router-link-exact-active': isExactActive && $route.query.idPauta == 1 }]"
            >
              <i class="fas fa-hashtag me-2"></i> Back Office
            </a>
          </router-link>
          <router-link
            v-if="canAccessRoute('lista-pautas')"
            :to="{ name: 'lista-pautas', query: { idPauta: 3 } }"
            custom
            v-slot="{ navigate }"
          >
            <a
              href="#"
              @click="navigate"
              :class="['list-group-item', 'list-group-item-action', 'sidebar-link', { 'router-link-exact-active': ($route.name === 'lista-pautas' || $route.name === 'nueva-evaluacion') && ($route.query.idPauta == 2 || $route.query.idPauta == 3) }]"
            >
              <i class="fas fa-hashtag me-2"></i> Empresa
            </a>
          </router-link>
        </div>

        <!-- Listado al mismo nivel -->
        <router-link v-if="canAccessRoute('lista-evaluaciones')" to="/evaluaciones" class="list-group-item list-group-item-action sidebar-link mt-1">
          <i class="fas fa-list me-2"></i> Listar Evaluaciones
        </router-link>
      </div>

      <router-link v-if="canAccessRoute('reportes')" to="/reportes" class="list-group-item list-group-item-action sidebar-link mt-3">
        <i class="fas fa-chart-line me-2"></i> Reportes Históricos
      </router-link>
      <router-link
        v-if="canAccessRoute('usuarios')"
        to="/usuarios"
        class="list-group-item list-group-item-action sidebar-link mt-2">
        <i class="fas fa-users me-2"></i> Gestión de Usuarios
      </router-link>
      <router-link
        v-if="canAccessRoute('ejecutivos')"
        to="/ejecutivos"
        class="list-group-item list-group-item-action sidebar-link mt-2">
        <i class="fas fa-users me-2"></i> Gestión de Ejecutivos
      </router-link>

      <router-link v-if="canAccessRoute('configuraciones')" to="/configuraciones" class="list-group-item list-group-item-action sidebar-link mt-2">
        <i class="fas fa-cogs me-2"></i> Configuraciones
      </router-link>
    </div>
  </div>
</template>

<script>
import { AuthService } from '../services/AuthService';
import { canAccessRoute } from '../utils/permissions';

export default {
  name: 'AppSidebar',
  data() {
    return {
      submenuVisible: false,
      user: AuthService.getUser()
    }
  },
  methods: {
    canAccessRoute
  },
  mounted() {
    // Si estás en una ruta hija, mostrar el submenú automáticamente
    const path = this.$route.path;
    if (path.includes('/evaluacion/rrss') || path.includes('/evaluacion/backoffice') || path.includes('/evaluacion/empresa')) {
      this.submenuVisible = true;
    }
  }
}
</script>

<style scoped>
.sidebar-container {
  width: 100%;
  max-width: 280px;
  min-width: 250px;
  height: 100%;
  background: linear-gradient(135deg, #e2efd9 0%, #f8fafc 100%);
  box-shadow: 2px 0 8px 0 rgba(44,62,80,0.04);
}

.sidebar-heading {
  background: #fff;
  border-radius: 0 0 18px 18px;
  font-size: 1.3rem;
  letter-spacing: 1px;
  color: #007bff;
  padding: 1rem;
}

.sidebar-list {
  margin-top: 10px;
  padding: 0 1rem;
  overflow-y: auto;
  max-height: calc(100vh - 120px);
}

.sidebar-link {
  color: #333;
  font-weight: 500;
  border: none;
  border-radius: 8px;
  margin-bottom: 4px;
  transition: background 0.18s, color 0.18s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-link:hover,
.sidebar-link.router-link-exact-active {
  background: #e3f0fc;
  color: #007bff;
}

.sidebar-section-title {
  font-size: 1.05rem;
  font-weight: 600;
  color: #4dc3fa;
  margin-bottom: 0.3rem;
  margin-top: 0.5rem;
}

.ms-4 .sidebar-link {
  padding-left: 2rem;
  font-size: 0.9rem;
}

@media (max-width: 767.98px) {
  .sidebar-container {
    width: 100%;
    max-width: 280px;
    min-width: 250px;
  }
  
  .sidebar-heading {
    font-size: 1.1rem;
    padding: 0.75rem;
  }
  
  .sidebar-list {
    padding: 0 0.75rem;
  }
}

@media (min-width: 768px) {
  .sidebar-container {
    width: 280px;
  }
}

.sidebar-heading {
  /* Asegúrate de que el contenedor padre tenga una altura definida o que el padding (py-4)
     le dé la altura suficiente para que 'height: 100%' de la imagen funcione.
     El 'py-4' de Bootstrap ya añade padding vertical. */
  /* Puedes añadir una altura mínima si lo necesitas, ej: min-height: 60px; */
  /* Asegúrate de que no haya padding o margin no deseado dentro del sidebar-heading
     que esté creando el espacio blanco que quieres eliminar alrededor de la imagen. */
  padding-top: 0 !important; /* Elimina el padding top de py-4 */
  padding-bottom: 0 !important; /* Elimina el padding bottom de py-4 */
  /* Si aún hay espacio, revisa los márgenes o padding del div o de elementos circundantes */

  /* Para que el texto "fs-4 fw-bold" no quede pegado al logo si no tiene margen-right*/
  /* Si el texto debe seguir ahí, y el logo tiene que ir a la izquierda, la estructura del div flex
     tendrá que cambiar. Asumo que el objetivo es que SÓLO el logo llene la altura del div */
}

.sidebar-heading img.sidebar-logo {
  height: 30%;  /* La imagen llenará el 100% del alto de su contenedor padre. */
  width: 30%;   /* La imagen llenará el 100% del ancho de su contenedor padre. */
  object-fit: cover; /* Esto es clave: la imagen se ajustará para cubrir todo el espacio
                        disponible manteniendo su relación de aspecto, recortando lo necesario
                        si la relación de aspecto no coincide con la del contenedor.
                        De esta forma, no habrá "espacios en blanco" dentro del área de la imagen. */
  display: block; /* Elimina cualquier posible espacio en blanco extra que pueda aparecer
                      debido a que las imágenes son elementos inline por defecto. */
  margin: 0;     /* Asegura que no haya márgenes alrededor de la imagen. */
  padding: 0;    /* Asegura que no haya relleno alrededor de la imagen. */
}
</style>