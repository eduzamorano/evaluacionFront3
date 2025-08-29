<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <div class="card shadow animate__animated animate__fadeInDown">
      <div class="card-header bg-gradient-primary text-white d-flex align-items-center">
        <i class="fas fa-cogs fa-lg me-2"></i>
        <h5 class="mb-0">Configurar Evaluación {{ pauta.nombre }}</h5>
      </div>
      <div class="card-body">
        <form @submit.prevent="abrirModalConfirmacion">
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-4">
              <label class="form-label">Ejecutivo a evaluar</label>
              <select v-model="idEjecutivo" class="form-select form-select-sm" required>
                <option disabled value="">Seleccione un ejecutivo</option>
                <option v-for="ej in ejecutivos" :key="ej.id_ejecutivo" :value="ej.id_ejecutivo">
                  {{ ej.GrupoEjecutivo?.nombre || 'Sin grupo' }} - {{ ej.nombre }} {{ ej.apellido_paterno }} {{ ej.apellido_materno }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Fecha desde</label>
              <input v-model="fechaDesde" type="date" class="form-control form-control-sm" required />
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Fecha hasta</label>
              <input v-model="fechaHasta" type="date" class="form-control form-control-sm" required />
            </div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-12 col-md-4">
              <label class="form-label">Gestión</label>
              <select v-model="idGestion" class="form-select form-select-sm" required>
                <option disabled value="">Seleccione una gestión</option>
                <option v-for="gestion in gestiones" :key="gestion.id" :value="gestion.id">
                  {{ gestion.nombre_gestion }} - {{ gestion.descripcion }}
                </option>
              </select>
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Orden de Flete</label>
              <input v-model="flete" type="text" class="form-control form-control-sm" placeholder="Ingrese Orden Flete" required />
            </div>
            <div class="col-12 col-md-4">
              <label class="form-label">Ticket/ID</label>
              <input v-model="ticket" type="text" class="form-control form-control-sm" placeholder="Ingrese Ticket/ID" />
            </div>
          </div>
          <div class="row g-3 mb-3">
            <div class="col-12">
              <label class="form-label">Evidencia(URL/ID Chat)</label>
              <input v-model="enlace" type="text" class="form-control form-control-sm" placeholder="Evidencia(URL/ID Chat)" />
            </div>
          </div>
          <div class="mb-3 form-check">
            <input type="checkbox" v-model="errorCritico" class="form-check-input" id="errorCriticoCheck">
            <label class="form-check-label" for="errorCriticoCheck">¿Hubo error crítico?</label>
          </div>
          <div v-if="errorCritico" class="mb-3">
            <label class="form-label">Seleccione Error Crítico</label>
            <select v-model="errorCriticoSeleccionado" class="form-select form-select-sm" required>
              <option disabled value="">Seleccione un error crítico</option>
              <option v-for="error in erroresCriticos" :key="error.id_error_critico" :value="error.id_error_critico">
                {{ error.descripcion }}
              </option>
            </select>
            {{ console.log(errorCriticoSeleccionado ) }}
          </div>
          <div class="d-flex justify-content-end gap-2 mt-4">
            <button v-if="Number(pauta.categoria_id) === 3" type="button" class="btn btn-outline-secondary" @click="$router.push('/pautas/lista?idPauta=3')">
              <i class="fas fa-times me-1"></i> Cancelar
            </button>
            <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
              <i class="fas fa-arrow-right me-1"></i> Continuar
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Modal de confirmación -->
    <transition name="fade">
      <div v-if="showModal" class="vue-modal-backdrop">
        <div class="vue-modal-content card shadow-lg animate__animated animate__fadeInDown">
          <div class="modal-header bg-gradient-primary text-white d-flex align-items-center">
            <i class="fas fa-clipboard-check fa-lg me-2"></i>
            <h5 class="modal-title flex-grow-1">Confirmar datos de la evaluación</h5>
            <button type="button" class="modal-close-btn btn btn-light btn-sm" @click="showModal = false" aria-label="Cerrar">
              <i class="fas fa-times"></i>
            </button>
          </div>
          <div class="modal-body p-4">
            <table class="table table-borderless mb-2 detalle-evaluacion">
              <tbody>
                <!-- Ejecutivo en una sola fila con una celda expandida -->
                <tr>
                  <td class="fw-bold">Ejecutivo:</td>
                  <td class="text-end" colspan="3">
                    {{ ejecutivoSeleccionado ? ejecutivoSeleccionado.nombre + ' ' + ejecutivoSeleccionado.apellido_paterno + ' ' + ejecutivoSeleccionado.apellido_materno : '' }}
                  </td>
                </tr>

                <!-- Fecha desde y hasta en la misma fila -->
                <tr>
                  <td class="fw-bold">Fecha desde:</td>
                  <td class="text-end">{{ fechaDesde }}</td>
                  <td class="fw-bold">Fecha hasta:</td>
                  <td class="text-end">{{ fechaHasta }}</td>
                </tr>

                <!-- Enlace en una fila completa -->
                <tr>
                  <td class="fw-bold">Enlace:</td>
                  <td class="text-end" colspan="3">{{ enlace }}</td>
                </tr>

                <!-- Pregunta de error crítico y su valor en una sola fila -->
                <tr>
                  <td class="fw-bold">¿Error crítico?</td>
                  <td class="text-end">{{ errorCritico ? 'Sí' : 'No' }}</td>
                  <td colspan="2"></td>
                </tr>

                <!-- Detalle de error crítico si aplica, en la misma fila en dos columnas -->
                <tr v-if="errorCritico && errorCriticoSeleccionado">
                  <td class="fw-bold">Error crítico:</td>
                  <td class="text-end" colspan="3">
                    {{ errorCriticoSeleccionadoDescripcion }}
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="alert alert-warning mb-0 mt-3">
              <i class="bi bi-exclamation-triangle me-2"></i>
              Revisa bien los datos antes de continuar.
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-end gap-2">
            <button type="button" class="btn btn-outline-secondary" @click="showModal = false">
              <i class="fas fa-arrow-left me-1"></i> No, volver
            </button>
            <button type="button" class="btn btn-success" @click="confirmarContinuar">
              <i class="fas fa-check me-1"></i> Sí, continuar
            </button>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import '../styles/EvaluacionSetup.css';
import { getEjecutivos, crearEvaluacionResumen, getErroresCriticosPorPauta, getPauta, getGestionesPorCategoria } from '../services/PautaService';
import { AuthService } from '../services/AuthService'

export default {
  name: 'EvaluacionSetup',
  props: {
    idPauta: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      user: AuthService.getUser(),
      ejecutivos: [],
      gestiones: [],
      idEjecutivo: '',
      idGestion: '',
      fechaDesde: '',
      fechaHasta: '',
      flete: '',
      ticket: '',
      gestion: '',
      enlace: '',
      errorCritico: false,
      erroresCriticos: [],
      errorCriticoSeleccionado: null,
      pauta: {},
      showModal: false
    };
  },
  computed: {
    ejecutivoSeleccionado() {
      return this.ejecutivos.find(ej => ej.id_ejecutivo == this.idEjecutivo);
    },
    gestionSeleccionada() {
      return this.gestiones.find(g => g.id == this.idGestion);
    },
    errorCriticoSeleccionadoObj() {
      return this.erroresCriticos.find(e => e.id == this.errorCriticoSeleccionado);
    },
    errorCriticoSeleccionadoDescripcion() {
      const obj = this.erroresCriticos.find(e => e.id_error_critico == this.errorCriticoSeleccionado);
      return obj ? obj.descripcion : '';
    },
    isFormValid() {
      if (!this.idEjecutivo || !this.fechaDesde || !this.fechaHasta || !this.idGestion || !this.flete) {
        return false;
      }
      if (this.errorCritico && !this.errorCriticoSeleccionado) {
        console.log('Error crítico seleccionado:', this.errorCriticoSeleccionado);
        return false;
      }
      return true;
    }
  },
  async mounted() {
    try {
      const [ejecutivosData, erroresData, pautaData] = await Promise.all([
        getEjecutivos(),
        getErroresCriticosPorPauta(this.idPauta),
        getPauta(this.idPauta)
      ]);
      this.ejecutivos = ejecutivosData
        .filter(ejecutivo => ejecutivo.estado)
        .sort((a, b) => {
          const grupoA = a.GrupoEjecutivo?.nombre || '';
          const grupoB = b.GrupoEjecutivo?.nombre || '';
          return grupoA.localeCompare(grupoB, 'es', { sensitivity: 'base' });
        });
      this.erroresCriticos = erroresData.filter(error => error.activo);
      this.pauta = pautaData;
      console.log('Pauta cargada:', this.pauta);

      if (this.pauta && this.pauta.categoria_id) {
        const gestionesData = await getGestionesPorCategoria(this.pauta.categoria_id);
        this.gestiones = gestionesData;
        console.log('Gestiones cargadas:', this.gestiones);
      } else {
        console.warn('La pauta cargada no tiene categoria_id. No se cargarán las gestiones.');
        this.gestiones = [];
      }
    } catch (error) {
      console.error('Error al cargar datos iniciales:', error);
      alert('Error al cargar los datos iniciales: ' + error.message);
    }
  },
  methods: {
    abrirModalConfirmacion() {
      if (this.isFormValid) {
        this.showModal = true;
      } else {
        alert('Por favor, complete todos los campos requeridos.');
      }
    },
    async confirmarContinuar() {
      this.showModal = false;
      try {
        const payload = {
          id_pauta: Number(this.idPauta),
          dni_ejecutivo: parseInt(this.idEjecutivo),
          fecha: new Date().toISOString(), //Fecha actual
          fecha_desde: this.fechaDesde ? new Date(this.fechaDesde).toISOString() : undefined,
          fecha_hasta: this.fechaHasta ? new Date(this.fechaHasta).toISOString() : undefined,
          ticket: Number(this.ticket),
          orden_flete: Number(this.flete),
          id_gestion: Number(this.idGestion),
          enlace_grabacion: this.enlace,
          error_critico: this.errorCritico,
          descripcion_error_critico: this.errorCritico ? String(this.errorCriticoSeleccionado) : null,
          nota_total: null,
          id_evaluador: this.user.id_usuario
        };
        console.log("Payload enviado al backend:", payload);
        const resumen = await crearEvaluacionResumen(payload);
        const idEvaluacionResumen = resumen.id || resumen.id_evaluacion_resumen;
        this.$router.push({
          name: 'formulario-evaluacion',
          params: { id: this.idPauta },
          query: { idEvaluacionResumen }
        });
      } catch (error) {
        console.error('Error al crear evaluación resumen:', error);
        alert('Error al crear la evaluación: ' + error.message);
      }
    }
  }
};
</script>

<style scoped>
.evaluacion-setup-pagina {
  background: linear-gradient(120deg, #f8fafc 60%, #e2efd9 100%);
  min-height: 100vh;
  padding-bottom: 2rem;
}
.bg-gradient-primary {
  background: linear-gradient(90deg, #4dc3fa 0%, #007bff 100%) !important;
}
.vue-modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(44, 62, 80, 0.25);
  z-index: 1040;
  display: flex;
  align-items: center;
  justify-content: center;
}
.vue-modal-content {
  background: #fff;
  border-radius: 18px;
  min-width: 350px;
  max-width: 540px;
  width: 100%;
  box-shadow: 0 8px 32px 0 rgba(44,62,80,0.18);
  padding: 0;
  overflow: hidden;
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
