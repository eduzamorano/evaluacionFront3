<template>
  <div v-if="show">
    <div class="confirm-modal-backdrop" @click="$emit('cancel')"></div>
    <div class="confirm-modal-content">
      <div class="confirm-modal-header">
        <div class="confirm-modal-icon">
          <i :class="iconClass"></i>
        </div>
        <h5 class="confirm-modal-title">{{ title }}</h5>
        <button type="button" class="confirm-modal-close" @click="$emit('cancel')" aria-label="Cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="confirm-modal-body">
        <p class="confirm-modal-message">{{ message }}</p>
      </div>
      <div class="confirm-modal-footer">
        <button type="button" class="btn btn-outline-secondary confirm-btn-cancel" @click="$emit('cancel')">
          <i class="fas fa-times me-2"></i>Cancelar
        </button>
        <button type="button" :class="['btn', confirmClass, 'confirm-btn-action']" @click="$emit('confirm')">
          <i :class="confirmIconClass" class="me-2"></i>{{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: Boolean,
    title: String,
    message: String,
    confirmText: {
      type: String,
      default: 'Confirmar'
    },
    confirmClass: {
      type: String,
      default: 'btn-danger'
    }
  },
  computed: {
    iconClass() {
      return this.confirmClass.includes('danger') 
        ? 'fas fa-exclamation-triangle text-warning' 
        : 'fas fa-question-circle text-info';
    },
    confirmIconClass() {
      return this.confirmClass.includes('danger') 
        ? 'fas fa-check' 
        : 'fas fa-check';
    }
  }
}
</script>

<style scoped>
/* Los estilos están en ModalConfirmacion.css */
</style> 