<template>
  <div class="modal-backdrop" @click.self="close">
    <div class="modal-dialog modal-lg shadow-lg">
      <div class="modal-content">
        <div class="modal-header bg-light">
          <h5 class="modal-title text-primary fw-bold"><i class="fas fa-comments me-2"></i>Historial del Chat</h5>
          <button type="button" class="btn-close" @click="close" aria-label="Cerrar"></button>
        </div>
        <div class="modal-body p-4">
          <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Cargando...</span>
            </div>
            <p class="mt-2">Cargando historial...</p>
          </div>
          <div v-else-if="error" class="alert alert-danger">
            <i class="fas fa-exclamation-triangle me-2"></i>{{ error }}
          </div>
          <div v-else-if="chatHistory.length === 0" class="alert alert-info">
            <i class="fas fa-info-circle me-2"></i>No hay historial de chat para mostrar.
          </div>
          <div v-else class="chat-history-container">
            <table class="table table-hover align-middle">
              <thead class="table-light">
                <tr>
                  <th scope="col" class="text-center" style="width: 180px;"><i class="fas fa-clock me-2"></i>Fecha y Hora</th>
                  <th scope="col"><i class="fas fa-user me-2"></i>Remitente</th>
                  <th scope="col"><i class="fas fa-comment-dots me-2"></i>Mensaje</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="message in chatHistory" :key="message.IDMensaje">
                  <td class="text-center"><small>{{ formatFecha(message.FechaHora) }}</small></td>
                  <td class="fw-bold">{{ message.Remitente }}</td>
                  <td>{{ message.Mensaje }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <div class="modal-footer bg-light">
          <button type="button" class="btn btn-secondary" @click="close"><i class="fas fa-times me-2"></i>Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getEvidencias } from '../services/EvaluacionService';

export default {
  name: 'ChatHistoryModal',
  props: {
    idChat: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      error: null,
      chatHistory: [],
    };
  },
  watch: {
    idChat: {
      immediate: true,
      handler(newVal) {
        if (newVal) {
          this.fetchChatHistory();
        }
      },
    },
  },
  methods: {
    async fetchChatHistory() {
      this.loading = true;
      this.error = null;
      try {
        this.chatHistory = await getEvidencias(this.idChat);
      } catch (error) {
        this.error = 'Error al cargar el historial del chat.';
        console.error(error);
      } finally {
        this.loading = false;
      }
    },
    close() {
      this.$emit('close');
    },
    formatFecha(fecha) {
      if (!fecha) return 'Fecha no disponible';
      try {
        const date = new Date(fecha);
        if (isNaN(date)) return 'Fecha inválida';
        return date.toLocaleString('es-CL', { 
          year: 'numeric', 
          month: '2-digit', 
          day: '2-digit', 
          hour: '2-digit', 
          minute: '2-digit' 
        });
      } catch (e) {
        return 'Fecha inválida';
      }
    },
  },
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
  transition: opacity 0.3s ease;
}

.modal-dialog {
  width: 80%;
  max-width: 900px;
  transform: translateY(-20px);
  transition: transform 0.3s ease;
}

.modal-content {
  background-color: white;
  border: none;
  border-radius: 0.5rem;
}

.chat-history-container {
  max-height: 60vh;
  overflow-y: auto;
}

.table {
    font-size: small;
}

.table-hover tbody tr:hover {
  background-color: #f8f9fa;

}
</style>
