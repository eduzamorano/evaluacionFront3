<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <h2 class="mb-4 text-center text-primary fw-bold">Selecciona una Pauta</h2>
    <div v-if="loading" class="text-center my-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else>
      <table class="table table-hover table-bordered shadow-sm custom-table">
        <thead class="table-light">
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Fecha de creación</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pauta in pautas" :key="pauta.id_pauta">
            <td>{{ pauta.nombre }}</td>
            <td>{{ pauta.descripcion }}</td>
            <td>{{ pauta.fecha_creacion ? pauta.fecha_creacion.substring(0, 10) : '' }}</td>
            <td>
              <router-link :to="`/evaluaciones/nueva?idPauta=${pauta.id_pauta}`" class="btn btn-outline-primary btn-sm">
                Evaluar
              </router-link>
            </td>
          </tr>
        </tbody>

      </table>
      <div v-if="pautas.length === 0" class="text-center text-muted">No hay pautas disponibles.</div>
    </div>
    <EvaluacionSetup v-if="showSetup" :id-pauta="idPautaSeleccionada" @cerrar="showSetup = false" />
    <div class="text-center mt-4">
      
    </div>
  </div>
</template>

<script>
import { getPautas } from '../services/PautaService';
import EvaluacionSetup from './EvaluacionSetup.vue';
import '../styles/ListaPautas.css';
import { AuthService } from '../services/AuthService'

export default {
  name: 'ListaPautas',
  components: { EvaluacionSetup },
  data() {
    return {
      user: AuthService.getUser(),
      pautas: [],
      loading: true,
      showSetup: false,
      idPautaSeleccionada: null
    };
  },
  async mounted() {
    try {
      const todasLasPautas = await getPautas();
      this.pautas = todasLasPautas.filter(p => p.categoria_id === 3); // categoría Empresa
    } catch (e) {
      alert('Error al cargar las pautas');
    } finally {
      this.loading = false;
    }
}
,
  methods: {
    abrirSetupModal(id) {
      this.idPautaSeleccionada = id;
      this.showSetup = true;
    }
  }
};
</script> 