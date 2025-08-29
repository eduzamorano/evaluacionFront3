<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <!-- Encabezado con título y botón de nuevo usuario -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary fw-bold mb-0">
        <i class="fas fa-users me-2"></i>
        Gestión de Usuarios
      </h2>
      <button 
        @click="abrirModalCrear" 
        class="btn btn-primary shadow-sm"
      >
        <i class="fas fa-plus me-2"></i>
        Nuevo Usuario
      </button>
    </div>

    <!-- Barra de búsqueda y filtros -->
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-4">
            <div class="input-group">
              <span class="input-group-text bg-light">
                <i class="fas fa-search"></i>
              </span>
              <input 
                v-model="busqueda" 
                type="text" 
                class="form-control" 
                placeholder="Buscar por nombre, email o usuario..."
              />
            </div>
          </div>
          <div class="col-md-3">
            <select v-model="filtroRol" class="form-select">
              <option value="">Todos los roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Evaluador">Evaluador</option>
              <option value="Lector">Lector</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
          <div class="col-md-3">
            <select v-model="filtroEstado" class="form-select">
              <option value="">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <!-- Tabla de usuarios -->
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
        </div>
        
        <div v-else-if="usuariosFiltrados.length === 0" class="text-center py-5 text-muted">
          <i class="fas fa-users fa-2x mb-3"></i>
          <p class="mb-0">No se encontraron usuarios</p>
        </div>

        <div v-else class="table-responsive">
          <table class="table table-hover mb-0 custom-table">
            <thead class="table-light">
              <tr>
                <th>Usuario</th>
                <th>Nombre Completo</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="usuario in usuariosPaginados" :key="usuario.id">
                <td>{{ usuario.usuario }}</td>
                <td>{{ `${usuario.nombre} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno}` }}</td>
                <td>{{ usuario.email }}</td>
                <td>
                  <span class="badge" :class="usuario.rol === 'Administrador' ? 'bg-primary' : usuario.rol === 'Evaluador' ? 'bg-success' : usuario.rol === 'Lector' ? 'bg-info' : 'bg-secondary'">
                    {{ usuario.rol }}
                  </span>
                </td>
                <td>
                  <span 
                    class="badge" 
                    :class="usuario.estado ? 'bg-success' : 'bg-danger'"
                  >
                    {{ usuario.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group">
                    <button 
                      @click="editarUsuario(usuario)" 
                      class="btn btn-sm btn-outline-primary"
                      title="Editar"
                    >
                      <i class="fas fa-edit"></i>
                    </button>
                    <button 
                      v-if="usuario.estado"
                      @click="confirmarDesactivar(usuario)" 
                      class="btn btn-sm btn-outline-danger"
                      title="Desactivar"
                    >
                      <i class="fas fa-user-slash"></i>
                    </button>
                    <button 
                      v-else
                      @click="confirmarReactivar(usuario)" 
                      class="btn btn-sm btn-outline-success"
                      title="Reactivar"
                    >
                      <i class="fas fa-user-check"></i>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Paginación -->
        <div v-if="totalPaginas > 1" class="card-footer bg-white border-top-0">
          <nav class="d-flex justify-content-center">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                <button class="page-link" @click="cambiarPagina(paginaActual - 1)">
                  <i class="fas fa-chevron-left"></i>
                </button>
              </li>
              <li 
                v-for="n in totalPaginas" 
                :key="n" 
                class="page-item"
                :class="{ active: paginaActual === n }"
              >
                <button class="page-link" @click="cambiarPagina(n)">{{ n }}</button>
              </li>
              <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                <button class="page-link" @click="cambiarPagina(paginaActual + 1)">
                  <i class="fas fa-chevron-right"></i>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>

    <!-- Modal de Formulario -->
    <div v-if="showModal">
      <div class="edit-modal-backdrop" @click="cerrarModal"></div>
      <div class="edit-modal-content">
        <div class="edit-modal-header">
          <div class="edit-modal-icon">
            <i class="fas fa-user text-primary"></i>
          </div>
          <h5 class="edit-modal-title">
            {{ usuarioSeleccionado ? 'Editar Usuario' : 'Nuevo Usuario' }}
          </h5>
          <button 
            type="button" 
            class="edit-modal-close" 
            @click="cerrarModal"
            aria-label="Cerrar"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="edit-modal-body">
          <form @submit.prevent="guardarUsuario">
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-user me-1"></i>Usuario
              </label>
              <input 
                v-model="form.usuario" 
                type="text" 
                class="form-control" 
                required
                :disabled="usuarioSeleccionado"
              />
            </div>
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-lock me-1"></i>Contraseña
              </label>
              <div class="input-group">
                <input 
                  v-model="form.password" 
                  :type="mostrarPassword ? 'text' : 'password'" 
                  class="form-control" 
                  :required="!usuarioSeleccionado"
                />
                <button 
                  type="button" 
                  class="btn btn-outline-secondary" 
                  @click="mostrarPassword = !mostrarPassword"
                >
                  <i :class="mostrarPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                </button>
              </div>
              <small v-if="usuarioSeleccionado" class="text-muted">
                Dejar en blanco para mantener la contraseña actual
              </small>
            </div>
            <div class="row">
              <div class="col-md-4 mb-3">
                <label class="form-label">
                  <i class="fas fa-user me-1"></i>Nombre
                </label>
                <input 
                  v-model="form.nombre" 
                  type="text" 
                  class="form-control" 
                  required
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">
                  <i class="fas fa-user me-1"></i>Apellido Paterno
                </label>
                <input 
                  v-model="form.apellidoPaterno" 
                  type="text" 
                  class="form-control" 
                  required
                />
              </div>
              <div class="col-md-4 mb-3">
                <label class="form-label">
                  <i class="fas fa-user me-1"></i>Apellido Materno
                </label>
                <input 
                  v-model="form.apellidoMaterno" 
                  type="text" 
                  class="form-control" 
                  required
                />
              </div>
            </div>
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-envelope me-1"></i>Email
              </label>
              <input 
                v-model="form.email" 
                type="email" 
                class="form-control" 
                required
              />
            </div>
            <div class="mb-3">
              <label class="form-label">
                <i class="fas fa-user-tag me-1"></i>Rol
              </label>
              <select v-model="form.rol" class="form-select" required>
                <option value="Evaluador">Evaluador</option>
                <option value="Administrador">Administrador</option>
                <option value="Lector">Lector</option>
                <option value="Cliente">Cliente</option>
              </select>
            </div>
            <div v-if="usuarioSeleccionado" class="mb-3">
              <div class="form-check form-switch">
                <input 
                  v-model="form.estado" 
                  type="checkbox" 
                  class="form-check-input" 
                  id="estadoSwitch"
                />
                <label class="form-check-label" for="estadoSwitch">
                  <i class="fas fa-toggle-on me-1"></i>Activo
                </label>
              </div>
            </div>
          </form>
        </div>
        <div class="edit-modal-footer">
          <button 
            type="button" 
            class="btn btn-outline-secondary edit-btn-cancel" 
            @click="cerrarModal"
          >
            <i class="fas fa-times me-2"></i>Cancelar
          </button>
          <button 
            type="button" 
            class="btn btn-primary edit-btn-action" 
            @click="guardarUsuario"
            :disabled="guardando"
          >
            <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else :class="usuarioSeleccionado ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
            {{ usuarioSeleccionado ? 'Actualizar' : 'Crear' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modal de Confirmación -->
    <div v-if="showConfirmModal">
      <div class="confirm-modal-backdrop" @click="showConfirmModal = false"></div>
      <div class="confirm-modal-content">
        <div class="confirm-modal-header">
          <div class="confirm-modal-icon">
            <i :class="confirmModalType === 'desactivar' ? 'fas fa-exclamation-triangle text-warning' : 'fas fa-question-circle text-info'"></i>
          </div>
          <h5 class="confirm-modal-title">{{ confirmModalTitle }}</h5>
          <button 
            type="button" 
            class="confirm-modal-close" 
            @click="showConfirmModal = false"
            aria-label="Cerrar"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="confirm-modal-body">
          <p class="confirm-modal-message">{{ confirmModalMessage }}</p>
        </div>
        <div class="confirm-modal-footer">
          <button 
            type="button" 
            class="btn btn-outline-secondary confirm-btn-cancel" 
            @click="showConfirmModal = false"
          >
            <i class="fas fa-times me-2"></i>Cancelar
          </button>
          <button 
            type="button" 
            class="btn confirm-btn-action" 
            :class="confirmModalType === 'desactivar' ? 'btn-danger' : 'btn-success'"
            @click="confirmarAccion"
            :disabled="procesando"
          >
            <span v-if="procesando" class="spinner-border spinner-border-sm me-2"></span>
            <i v-else class="fas fa-check me-2"></i>
            {{ confirmModalType === 'desactivar' ? 'Desactivar' : 'Reactivar' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Toast de Notificación -->
    <div 
      v-if="toast.show" 
      class="toast-container position-fixed bottom-0 end-0 p-3"
    >
      <div 
        class="toast show" 
        role="alert" 
        aria-live="assertive" 
        aria-atomic="true"
      >
        <div class="toast-header" :class="toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'">
          <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-2"></i>
          <strong class="me-auto">{{ toast.title }}</strong>
          <button 
            type="button" 
            class="btn-close btn-close-white" 
            @click="toast.show = false"
          ></button>
        </div>
        <div class="toast-body">
          {{ toast.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getUsuarios, 
  crearUsuario, 
  actualizarUsuario, 
  desactivarUsuario, 
  reactivarUsuario 
} from '../services/UserService';
import '../styles/EstilosTablas.css';
import '../styles/ModalConfirmacion.css';
import '../styles/ModalEdicion.css';

export default {
  name: 'GestionUsuarios',
  data() {
    return {
      usuarios: [],
      cargando: true,
      busqueda: '',
      filtroRol: '',
      filtroEstado: '',
      paginaActual: 1,
      itemsPorPagina: 10,
      showModal: false,
      showConfirmModal: false,
      usuarioSeleccionado: null,
      confirmModalType: '',
      procesando: false,
      guardando: false,
      mostrarPassword: false,
      form: {
        usuario: '',
        password: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        rol: 'usuario',
        estado: true
      },
      toast: {
        show: false,
        type: 'success',
        title: '',
        message: '',
        timeout: null
      }
    };
  },
  computed: {
    usuariosFiltrados() {
      let filtrados = this.usuarios;
      
      // Aplicar filtro de búsqueda
      if (this.busqueda) {
        const busqueda = this.busqueda.toLowerCase();
        filtrados = filtrados.filter(u => 
          u.usuario.toLowerCase().includes(busqueda) ||
          u.nombre.toLowerCase().includes(busqueda) ||
          u.apellidoPaterno.toLowerCase().includes(busqueda) ||
          u.apellidoMaterno.toLowerCase().includes(busqueda) ||
          u.email.toLowerCase().includes(busqueda)
        );
      }
      
      // Aplicar filtro de rol
      if (this.filtroRol) {
        filtrados = filtrados.filter(u => u.rol === this.filtroRol);
      }
      
      // Aplicar filtro de estado
      if (this.filtroEstado) {
        const estado = this.filtroEstado === 'activo';
        filtrados = filtrados.filter(u => u.estado === estado);
      }
      
      return filtrados;
    },
    totalPaginas() {
      return Math.ceil(this.usuariosFiltrados.length / this.itemsPorPagina);
    },
    usuariosPaginados() {
      const inicio = (this.paginaActual - 1) * this.itemsPorPagina;
      return this.usuariosFiltrados.slice(inicio, inicio + this.itemsPorPagina);
    },
    confirmModalTitle() {
      return this.confirmModalType === 'desactivar' 
        ? 'Desactivar Usuario' 
        : 'Reactivar Usuario';
    },
    confirmModalMessage() {
      const nombre = this.usuarioSeleccionado 
        ? `${this.usuarioSeleccionado.nombre} ${this.usuarioSeleccionado.apellidoPaterno}`
        : '';
      return this.confirmModalType === 'desactivar'
        ? `¿Estás seguro de que deseas desactivar al usuario ${nombre}?`
        : `¿Estás seguro de que deseas reactivar al usuario ${nombre}?`;
    }
  },
  watch: {
    busqueda() {
      this.paginaActual = 1;
    },
    filtroRol() {
      this.paginaActual = 1;
    },
    filtroEstado() {
      this.paginaActual = 1;
    },
    showModal(val) {
      document.body.style.overflow = val ? 'hidden' : '';
    },
    showConfirmModal(val) {
      document.body.style.overflow = val ? 'hidden' : '';
    }
  },
  async mounted() {
    await this.cargarUsuarios();
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  },
  methods: {
    async cargarUsuarios() {
      try {
        this.cargando = true;
        const data = await getUsuarios();
        this.usuarios = data;
      } catch (error) {
        this.mostrarToast('Error', error.message, 'error');
      } finally {
        this.cargando = false;
      }
    },
    cambiarPagina(n) {
      if (n >= 1 && n <= this.totalPaginas) {
        this.paginaActual = n;
      }
    },
    abrirModalCrear() {
      this.usuarioSeleccionado = null;
      this.form = {
        usuario: '',
        password: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        rol: 'usuario',
        estado: true
      };
      this.showModal = true;
    },
    editarUsuario(usuario) {
      this.usuarioSeleccionado = usuario;
      this.form = { ...usuario, password: '' };
      this.showModal = true;
    },
    cerrarModal() {
      this.showModal = false;
      this.usuarioSeleccionado = null;
      this.form = {
        usuario: '',
        password: '',
        nombre: '',
        apellidoPaterno: '',
        apellidoMaterno: '',
        email: '',
        rol: 'usuario',
        estado: true
      };
    },
    async guardarUsuario() {
      try {
        this.guardando = true;
        const usuarioData = { ...this.form };
        console.log(usuarioData);
        
        // Si es edición y no se cambió la contraseña, eliminar el campo
        if (this.usuarioSeleccionado && !usuarioData.password) {
          delete usuarioData.password;
        }
        
        if (this.usuarioSeleccionado) {
          await actualizarUsuario(this.usuarioSeleccionado.id_usuario, usuarioData);
          console.log('Id usuario seleccionado', this.usuarioSeleccionado.id_usuario);
          this.mostrarToast('Éxito', 'Usuario actualizado correctamente');
        } else {
          await crearUsuario(usuarioData);
          console.log('Aca estoy tratando de crear el usuario');
          this.mostrarToast('Éxito', 'Usuario creado correctamente');
        }
        
        await this.cargarUsuarios();
        this.cerrarModal();
      } catch (error) {
        console.log('Error con el id', this.usuarioSeleccionado.id_usuario);
        this.mostrarToast('Error', error.message, 'error');
      } finally {
        this.guardando = false;
      }
    },
    confirmarDesactivar(usuario) {
      this.usuarioSeleccionado = usuario;
      this.confirmModalType = 'desactivar';
      this.showConfirmModal = true;
    },
    confirmarReactivar(usuario) {
      this.usuarioSeleccionado = usuario;
      this.confirmModalType = 'reactivar';
      this.showConfirmModal = true;
    },
    async confirmarAccion() {
      try {
        this.procesando = true;
        
        if (this.confirmModalType === 'desactivar') {
          await desactivarUsuario(this.usuarioSeleccionado.id_usuario);
          this.mostrarToast('Éxito', 'Usuario desactivado correctamente');
        } else {
          await reactivarUsuario(this.usuarioSeleccionado.id_usuario);
          this.mostrarToast('Éxito', 'Usuario reactivado correctamente');
        }
        
        await this.cargarUsuarios();
        this.showConfirmModal = false;
      } catch (error) {
        this.mostrarToast('Error', error.message, 'error');
      } finally {
        this.procesando = false;
      }
    },
    mostrarToast(title, message, type = 'success') {
      // Limpiar timeout anterior si existe
      if (this.toast.timeout) {
        clearTimeout(this.toast.timeout);
      }
      
      this.toast = {
        show: true,
        type,
        title,
        message,
        timeout: setTimeout(() => {
          this.toast.show = false;
        }, 5000)
      };
    }
  }
};
</script>

<style scoped>
.toast-container {
  z-index: 1050;
}

.form-check-input:checked {
  background-color: #198754;
  border-color: #198754;
}

/* Animaciones */
.toast {
  transition: opacity 0.3s ease-in-out;
}

.toast.show {
  opacity: 1;
}
</style> 