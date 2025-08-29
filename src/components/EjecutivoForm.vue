<template>
  <div v-if="show">
    <div class="edit-modal-backdrop" @click="$emit('cancel')"></div>
    <div class="edit-modal-content">
      <div class="edit-modal-header">
        <div class="edit-modal-icon">
          <i class="fas fa-user-tie text-primary"></i>
        </div>
        <h5 class="edit-modal-title">{{ isEdit ? `Editar Ejecutivo` : 'Registrar Nuevo Ejecutivo' }}</h5>
        <button type="button" class="edit-modal-close" @click="$emit('cancel')" aria-label="Cerrar">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="edit-modal-body">
        <form @submit.prevent="onSubmit">
          <div class="row g-3">
            <div class="col-md-6">
              <label class="form-label">
                <i class="fas fa-user me-1"></i>Nombre
              </label>
              <input v-model="form.nombre" type="text" class="form-control" required />
              <div v-if="errors.nombre" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.nombre }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <i class="fas fa-user me-1"></i>Apellido Paterno
              </label>
              <input v-model="form.apellido_paterno" type="text" class="form-control" required />
              <div v-if="errors.apellido_paterno" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.apellido_paterno }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <i class="fas fa-user me-1"></i>Apellido Materno
              </label>
              <input v-model="form.apellido_materno" type="text" class="form-control" required />
              <div v-if="errors.apellido_materno" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.apellido_materno }}
              </div>
            </div>
            <div class="col-md-6">
              <label class="form-label">
                <i class="fas fa-id-card me-1"></i>DNI
              </label>
              <input v-model="form.dni" type="text" class="form-control" required />
              <div v-if="errors.dni" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.dni }}
              </div>
            </div>
            <div class="col-12">
              <label class="form-label">
                <i class="fas fa-envelope me-1"></i>Correo Electrónico
              </label>
              <input v-model="form.correo_electronico" type="email" class="form-control" required />
              <div v-if="errors.correo_electronico" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.correo_electronico }}
              </div>
            </div>
            <div class="col-12">
              <label class="form-label">
                <i class="fas fa-users me-1"></i>Grupo
              </label>
              <select v-model="form.id_grupo" class="form-select" required>
                <option value="" disabled>Seleccione un grupo</option>
                <option v-for="grupo in grupos" :key="grupo.id" :value="grupo.id">
                  {{ grupo.nombre }}
                </option>
              </select>
              <div v-if="errors.id_grupo" class="text-danger small mt-1">
                <i class="fas fa-exclamation-circle me-1"></i>{{ errors.id_grupo }}
              </div>
            </div>
          </div>
        </form>
      </div>
      <div class="edit-modal-footer">
        <button type="button" class="btn btn-outline-secondary edit-btn-cancel" @click="$emit('cancel')">
          <i class="fas fa-times me-2"></i>Cancelar
        </button>
        <button type="button" class="btn btn-primary edit-btn-action" @click="onSubmit" :disabled="guardando">
          <span v-if="guardando" class="spinner-border spinner-border-sm me-2"></span>
          <i v-else :class="isEdit ? 'fas fa-save' : 'fas fa-plus'" class="me-2"></i>
          {{ isEdit ? 'Actualizar' : 'Crear' }} Ejecutivo
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'EjecutivoForm',
  props: {
    show: Boolean,
    isEdit: Boolean,
    ejecutivo: Object,
    guardando: Boolean,
    grupos: Array
  },
  data() {
    return {
      form: {
        nombre: '',
        apellido_paterno: '',
        apellido_materno: '',
        dni: '',
        correo_electronico: '',
        id_grupo: ''
      },
      errors: {}
    }
  },
  watch: {
    ejecutivo: {
      immediate: true,
      handler(val) {
        if (val) {
          this.form = { ...val };
          if (!this.form.id_grupo && val.GrupoEjecutivo) {
            this.form.id_grupo = val.GrupoEjecutivo.id;
          }
        } else {
          this.form = {
            nombre: '',
            apellido_paterno: '',
            apellido_materno: '',
            dni: '',
            correo_electronico: '',
            id_grupo: ''
          };
        }
      }
    }
  },
  methods: {
    validate() {
      this.errors = {};
      if (!this.form.nombre) this.errors.nombre = 'El nombre es obligatorio.';
      if (!this.form.apellido_paterno) this.errors.apellido_paterno = 'El apellido paterno es obligatorio.';
      if (!this.form.apellido_materno) this.errors.apellido_materno = 'El apellido materno es obligatorio.';
      if (!this.form.dni) this.errors.dni = 'El DNI es obligatorio.';
      if (!this.form.correo_electronico) this.errors.correo_electronico = 'El correo es obligatorio.';
      else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(this.form.correo_electronico)) this.errors.correo_electronico = 'Correo inválido.';
      if (!this.form.id_grupo) this.errors.id_grupo = 'El grupo es obligatorio.';
      return Object.keys(this.errors).length === 0;
    },
    onSubmit() {
      if (this.validate()) {
        this.$emit('save', { ...this.form });
      }
    }
  }
}
</script>

<style scoped>
/* Los estilos están en ModalEdicion.css */
</style> 