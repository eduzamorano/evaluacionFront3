<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="text-primary fw-bold mb-0">
        <i class="fas fa-user-tie me-2"></i> Gestión de Ejecutivos
      </h2>
      <button class="btn btn-primary shadow-sm" @click="abrirNuevo">
        <i class="fas fa-plus me-2"></i> Nuevo Ejecutivo
      </button>
    </div>
    <div class="card shadow-sm mb-4">
      <div class="card-body">
        <div class="row g-3">
          <div class="col-md-5">
            <div class="input-group">
              <span class="input-group-text bg-light"><i class="fas fa-search"></i></span>
              <input v-model="busqueda" type="text" class="form-control" placeholder="Buscar por nombre, DNI o correo..." />
            </div>
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
    <div class="card shadow-sm">
      <div class="card-body p-0">
        <div v-if="cargando" class="text-center py-5">
          <div class="spinner-border text-primary" role="status"><span class="visually-hidden">Cargando...</span></div>
        </div>
        <div v-else-if="ejecutivosFiltrados.length === 0" class="text-center py-5 text-muted">
          <i class="fas fa-user-tie fa-2x mb-3"></i>
          <p class="mb-0">No se encontraron ejecutivos</p>
        </div>
        <div v-else class="table-responsive">
          <table class="table table-hover mb-0 custom-table">
            <thead class="table-light">
              <tr>
                <th>Nombre Completo</th>
                <th>DNI</th>
                <th>Correo</th>
                <th>Grupo</th>
                <th>Estado</th>
                <th class="text-end">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="ej in ejecutivosPaginados" :key="ej.id_ejecutivo">
                <td>{{ ej.nombre }} {{ ej.apellido_paterno }} {{ ej.apellido_materno }}</td>
                <td>{{ ej.dni }}</td>
                <td>{{ ej.correo_electronico }}</td>
                <td>{{ ej.GrupoEjecutivo?.nombre || 'Sin grupo' }}</td>
                <td>
                  <span class="badge" :class="ej.estado ? 'bg-success' : 'bg-danger'">
                    {{ ej.estado ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="text-end">
                  <div class="btn-group">
                    <button class="btn btn-sm btn-outline-primary" @click="editarEjecutivo(ej)" title="Editar"><i class="fas fa-edit"></i></button>
                    <button v-if="ej.estado" class="btn btn-sm btn-outline-danger" @click="confirmarDesactivar(ej)" title="Desactivar"><i class="fas fa-user-slash"></i></button>
                    <button v-else class="btn btn-sm btn-outline-success" @click="confirmarReactivar(ej)" title="Reactivar"><i class="fas fa-user-check"></i></button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div v-if="totalPaginas > 1" class="card-footer bg-white border-top-0">
          <nav class="d-flex justify-content-center">
            <ul class="pagination pagination-sm mb-0">
              <li class="page-item" :class="{ disabled: paginaActual === 1 }">
                <button class="page-link" @click="cambiarPagina(paginaActual - 1)"><i class="fas fa-chevron-left"></i></button>
              </li>
              <li v-for="n in totalPaginas" :key="n" class="page-item" :class="{ active: paginaActual === n }">
                <button class="page-link" @click="cambiarPagina(n)">{{ n }}</button>
              </li>
              <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
                <button class="page-link" @click="cambiarPagina(paginaActual + 1)"><i class="fas fa-chevron-right"></i></button>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <!-- Formulario Modal -->
    <EjecutivoForm
      :show="showForm"
      :isEdit="!!ejecutivoSeleccionado"
      :ejecutivo="ejecutivoSeleccionado"
      :guardando="guardando"
      :grupos="grupos"
      @save="guardarEjecutivo"
      @cancel="cerrarForm"
    />
    <!-- Modal de Confirmación -->
    <ConfirmModal
      :show="showConfirm"
      :title="confirmTitle"
      :message="confirmMessage"
      :confirmText="confirmText"
      :confirmClass="confirmClass"
      @confirm="confirmarAccion"
      @cancel="cerrarConfirm"
    />
    <!-- Toast de feedback -->
    <div v-if="toast.show" class="toast-container position-fixed bottom-0 end-0 p-3">
      <div class="toast show" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header" :class="toast.type === 'success' ? 'bg-success text-white' : 'bg-danger text-white'">
          <i :class="toast.type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle'" class="me-2"></i>
          <strong class="me-auto">{{ toast.title }}</strong>
          <button type="button" class="btn-close btn-close-white" @click="toast.show = false"></button>
        </div>
        <div class="toast-body">{{ toast.message }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEjecutivos, crearEjecutivo, actualizarEjecutivo, desactivarEjecutivo, reactivarEjecutivo, getGruposEjecutivos } from '../services/EjecutivoService';
import EjecutivoForm from './EjecutivoForm.vue';
import ConfirmModal from './ConfirmModal.vue';
import '../styles/EstilosTablas.css';
import '../styles/ModalConfirmacion.css';
import '../styles/ModalEdicion.css';

export default {
  name: 'GestionEjecutivos',
  components: { EjecutivoForm, ConfirmModal },
  data() {
    return {
      ejecutivos: [],
      cargando: true,
      busqueda: '',
      filtroEstado: '',
      paginaActual: 1,
      itemsPorPagina: 10,
      showForm: false,
      showConfirm: false,
      ejecutivoSeleccionado: null,
      guardando: false,
      confirmType: '',
      toast: { show: false, type: 'success', title: '', message: '', timeout: null },
      grupos: []
    };
  },
  computed: {
    ejecutivosFiltrados() {
      let filtrados = this.ejecutivos;
      if (this.busqueda) {
        const b = this.busqueda.toLowerCase();
        filtrados = filtrados.filter(ej =>
          (ej.nombre && ej.nombre.toLowerCase().includes(b)) ||
          (ej.apellido_paterno && ej.apellido_paterno.toLowerCase().includes(b)) ||
          (ej.apellido_materno && ej.apellido_materno.toLowerCase().includes(b)) ||
          (ej.dni && ej.dni.toLowerCase().includes(b)) ||
          (ej.correo_electronico && ej.correo_electronico.toLowerCase().includes(b))
        );
      }
      if (this.filtroEstado) {
        const estado = this.filtroEstado === 'activo';
        filtrados = filtrados.filter(ej => ej.estado === estado);
      }
      return filtrados;
    },
    totalPaginas() {
      return Math.ceil(this.ejecutivosFiltrados.length / this.itemsPorPagina) || 1;
    },
    ejecutivosPaginados() {
      const start = (this.paginaActual - 1) * this.itemsPorPagina;
      return this.ejecutivosFiltrados.slice(start, start + this.itemsPorPagina);
    },
    confirmTitle() {
      return this.confirmType === 'desactivar' ? 'Desactivar Ejecutivo' : 'Reactivar Ejecutivo';
    },
    confirmMessage() {
      if (!this.ejecutivoSeleccionado) return '';
      const nombre = `${this.ejecutivoSeleccionado.nombre} ${this.ejecutivoSeleccionado.apellido_paterno}`;
      return this.confirmType === 'desactivar'
        ? `¿Estás seguro de que deseas desactivar a ${nombre}? Su estado cambiará a inactivo.`
        : `¿Estás seguro de que deseas reactivar a ${nombre}? Su estado cambiará a activo.`;
    },
    confirmText() {
      return this.confirmType === 'desactivar' ? 'Desactivar' : 'Reactivar';
    },
    confirmClass() {
      return this.confirmType === 'desactivar' ? 'btn-danger' : 'btn-success';
    }
  },
  watch: {
    busqueda() { this.paginaActual = 1; },
    filtroEstado() { this.paginaActual = 1; }
  },
  async mounted() {
    await Promise.all([
      this.cargarEjecutivos(),
      this.cargarGrupos()
    ]);
  },
  methods: {
    async cargarEjecutivos() {
      try {
        this.cargando = true;
        this.ejecutivos = await getEjecutivos();
      } catch (e) {
        this.mostrarToast('Error', e.message, 'error');
      } finally {
        this.cargando = false;
      }
    },
    async cargarGrupos() {
      try {
        this.grupos = await getGruposEjecutivos();
      } catch (e) {
        this.grupos = [];
        this.mostrarToast('Error', 'No se pudieron cargar los grupos', 'error');
      }
    },
    cambiarPagina(n) {
      if (n >= 1 && n <= this.totalPaginas) this.paginaActual = n;
    },
    abrirNuevo() {
      this.ejecutivoSeleccionado = null;
      this.showForm = true;
    },
    editarEjecutivo(ej) {
      this.ejecutivoSeleccionado = ej;
      this.showForm = true;
    },
    cerrarForm() {
      this.showForm = false;
      this.ejecutivoSeleccionado = null;
    },
    async guardarEjecutivo(ejecutivo) {
      this.guardando = true;
      try {
        if (this.ejecutivoSeleccionado) {
          await actualizarEjecutivo(this.ejecutivoSeleccionado.id_ejecutivo, ejecutivo);
        } else {
          await crearEjecutivo(ejecutivo);
        }
        this.mostrarToast('Éxito', this.ejecutivoSeleccionado ? 'Ejecutivo actualizado correctamente' : 'Ejecutivo creado correctamente');
        await this.cargarEjecutivos();
        this.cerrarForm();
      } catch (e) {
        this.mostrarToast('Error', e.message, 'error');
      } finally {
        this.guardando = false;
      }
    },
    confirmarDesactivar(ej) {
      this.ejecutivoSeleccionado = ej;
      this.confirmType = 'desactivar';
      this.showConfirm = true;
    },
    confirmarReactivar(ej) {
      this.ejecutivoSeleccionado = ej;
      this.confirmType = 'reactivar';
      this.showConfirm = true;
    },
    async confirmarAccion() {
      try {
        if (this.confirmType === 'desactivar') {
          await desactivarEjecutivo(this.ejecutivoSeleccionado.id_ejecutivo);
          this.mostrarToast('Éxito', 'Ejecutivo desactivado exitosamente.');
        } else {
          await reactivarEjecutivo(this.ejecutivoSeleccionado.id_ejecutivo);
          this.mostrarToast('Éxito', 'Ejecutivo reactivado exitosamente.');
        }
        await this.cargarEjecutivos();
        this.cerrarConfirm();
      } catch (e) {
        this.mostrarToast('Error', e.message, 'error');
      }
    },
    cerrarConfirm() {
      this.showConfirm = false;
      this.ejecutivoSeleccionado = null;
    },
    mostrarToast(title, message, type = 'success') {
      if (this.toast.timeout) clearTimeout(this.toast.timeout);
      this.toast = {
        show: true,
        type,
        title,
        message,
        timeout: setTimeout(() => { this.toast.show = false; }, 5000)
      };
    }
  }
}
</script>

<style scoped>
.toast-container { 
  z-index: 1050; 
}
</style> 