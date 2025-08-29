<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <div v-if="alerta.mostrar" :class="['alert', alerta.tipo === 'success' ? 'alert-success' : 'alert-danger', 'mt-3']" role="alert">
      {{ alerta.mensaje }}
    </div>
    <div v-if="cargando" class="d-flex justify-content-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else class="card shadow-sm my-4">
      <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 class="mb-0 fw-bold text-white">Detalle de Evaluación</h5>
        <button class="btn btn-sm btn-outline-light" @click="$router.push({ name: 'lista-evaluaciones' })">Volver</button>
      </div>
      <div class="card-body">
         <h6 class="fw-bold mb-2">Nota total obtenida: 
          <div class="nota-visual mx-auto mb-3">
            {{ resumen.nota_total }}%
          </div>

         </h6>
        <!-- Evaluation Summary Section -->
        <div class="resumen-evaluacion-moderno mb-4">
          <h6 class="fw-bold mb-3 border-bottom pb-2">Resumen de la Evaluación</h6>
          <div class="row">
            <div class="col-md-6">
              <div class="info-item"><i class="fas fa-user me-2"></i><strong>Ejecutivo:</strong> {{ nombre_ejecutivo }} {{ apellido_ejecutivo }}</div>
              <div class="info-item"><i class="fas fa-calendar-alt me-2"></i><strong>Fecha Desde:</strong> {{ resumen.fecha_desde }}</div>
              <div class="info-item"><i class="fas fa-calendar-alt me-2"></i><strong>Fecha Hasta:</strong> {{ resumen.fecha_hasta }}</div>
            </div>
            <div class="col-md-6">
              <div class="info-item"><i class="fas fa-cogs me-2"></i><strong>Gestión:</strong> {{ resumen.id_gestion }}</div>
              <div class="info-item"><i class="fas fa-truck me-2"></i><strong>Orden de Flete:</strong> {{ resumen.orden_flete }}</div>
              <div class="info-item"><i class="fas fa-ticket-alt me-2"></i><strong>Ticket/ID:</strong> {{ resumen.ticket }}</div>
             
            </div>
            <div class="col-md-12">
               <div v-if="resumen.id_pauta == 4" class="info-item"><i class="fas fa-link me-2"></i><strong>Evidencia:</strong> <button class="btn btn-sm btn-outline-primary" @click="openChatModal"><i class="fas fa-comments me-2"></i>Ver Chat {{ resumen.enlace_grabacion }}</button></div>
               <div v-if="resumen.id_pauta != 4" class="info-item"><i class="fas fa-link me-2"></i><strong>Evidencia:</strong> {{ resumen.enlace_grabacion }}</div>
            </div>
          </div>
        </div>

       
        <div v-if="resumen.error_critico" class="alert alert-info mb-0 texto-detalle-uniforme">Error crítico: {{ error_critico.descripcion }}</div>
        <div v-if="detalles.length > 0" class="table-responsive custom-table texto-detalle-uniforme">
          <table class="table table-bordered table-hover detalle-evaluacion">
            <thead>
              <tr class="table-header-sub">
                <th class="text-center">Subatributo</th>
                <th v-if="mostrarColumnaDescripcion" class="text-center">Descripción</th>
                <th class="text-center">Puntaje</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(det, idx) in detalles" :key="idx">
                <td class="text-center">{{ det.Subatributo.nombre_subatributo }}</td>
                <td v-if="mostrarColumnaDescripcion" class="text-center">{{ det.Subatributo.descripcion }}</td>
                <td class="text-center">{{ det.puntaje_obtenido }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="alert alert-info mb-0 texto-detalle-uniforme">
          <b>Observaciones:</b> {{ resumen.observaciones }}
        </div>
      </div>
    </div>
    <ChatHistoryModal v-if="isChatModalVisible" :id-chat="resumen.enlace_grabacion" @close="closeChatModal" />
  </div>
</template>

<script>
import { getEvaluacionTablaCompleta } from '../services/EvaluacionService';
import { getEjecutivo } from '../services/EjecutivoService';
import ChatHistoryModal from './ChatHistoryModal.vue';
import '../styles/DetalleEvaluacion.css';

export default {
  name: 'DetalleEvaluacion',
  components: {
    ChatHistoryModal,
  },
  data() {
    return {
      detalles: [],
      resumen: {},
      error_critico: {},
      nombre_ejecutivo: '',
      mostrarColumnaDescripcion: false,
      cargando: true,
      alerta: { mostrar: false, mensaje: '', tipo: 'success' },
      isChatModalVisible: false,
    };
  },
  async mounted() {
    const id = this.$route.params.id;
    if (!id) {
      this.alerta = { mostrar: true, mensaje: 'ID de evaluación no proporcionado.', tipo: 'danger' };
      this.cargando = false;
      return;
    }
    try {
      const data = await getEvaluacionTablaCompleta(id);

      console.log('JSON recibido en DetalleEvaluacion (tabla-completa):', data);
      this.detalles = data.detalles || [];
      this.resumen = data.resumen || {};
      this.error_critico = data.error_critico || {};

      // Check if any subattribute has a description
      this.mostrarColumnaDescripcion = this.detalles.some(det => det.Subatributo.descripcion && det.Subatributo.descripcion.trim() !== '');

      if (this.resumen.dni_ejecutivo) {
        const ejecutivo = await getEjecutivo(this.resumen.dni_ejecutivo);
        console.log('Datos del ejecutivo:', ejecutivo);
        this.nombre_ejecutivo = ejecutivo.nombre;
        this.apellido_ejecutivo = ejecutivo.apellido_paterno + ' ' + ejecutivo.apellido_materno;
      }

    } catch (error) {
      console.error('Error al cargar el detalle de la evaluación:', error);
      this.alerta = { mostrar: true, mensaje: 'Error al cargar el detalle de la evaluación: ' + error.message, tipo: 'danger' };
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    openChatModal() {
      this.isChatModalVisible = true;
    },
    closeChatModal() {
      this.isChatModalVisible = false;
    },
  },
};
</script> 