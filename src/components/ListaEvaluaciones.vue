<template>
  <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
    <h2 class="mb-4 text-primary fw-bold">Listado de Evaluaciones</h2>
    <div v-if="alerta.mostrar" :class="['alert', alerta.tipo === 'success' ? 'alert-success' : 'alert-danger', 'mt-3']" role="alert">
      {{ alerta.mensaje }}
    </div>
    <div class="mb-3 d-flex flex-wrap gap-2 align-items-center">
      <input v-model="busqueda" class="form-control form-control-sm" style="max-width: 220px;" placeholder="Buscar por pauta, ejecutivo o fecha..." />
      <router-link to="/" class="btn btn-secondary btn-sm">Volver a Inicio</router-link>
    </div>
    <div v-if="cargando" class="d-flex justify-content-center my-4">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Cargando...</span>
      </div>
    </div>
    <div v-else-if="evaluacionesFiltradas.length === 0" class="alert alert-info">
      No se encontraron evaluaciones.
    </div>
    <div v-else class="table-responsive">
      <table class="table table-bordered table-hover shadow-sm custom-table">
        <thead>
          <tr class="table-header-main">
            <th class="text-center">Pauta</th>
            <th class="text-center">RUN Ejecutivo</th>
            <th class="text-center">Fecha</th>
            <th class="text-center">Nota Final</th>
            <th class="text-center">Estado</th>
            <th class="text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="evaluacion in evaluacionesPaginadas" :key="evaluacion.id_evaluacion_resumen" 
              :class="['table-row', { 'error-critico-row': tieneErrorCritico(evaluacion) }]">
            <td class="text-center">{{ obtenerNombrePauta(evaluacion.id_pauta) }}</td>
            <td class="text-center">{{ evaluacion.Ejecutivo?.dni || evaluacion.dni_ejecutivo }}</td>
            <td class="text-center">{{ formatearFecha(evaluacion.fecha) }}</td>
            <td class="text-center fw-semibold">{{ evaluacion.nota_total === null || evaluacion.nota_total === undefined ? '-': evaluacion.nota_total.toFixed(0) }}</td>
            <td class="text-center">{{ evaluacion.estado }}</td>
            <td class="text-center">
              <!-- Botón Aprobar solo visible para administradores -->
              <button 
                v-if="esAdministrador" 
                class="btn btn-sm btn-outline-success me-1" 
                @click="aprobarEvaluacion(evaluacion.id_evaluacion_resumen)"
                :disabled="evaluacion.estado === 'Aprobado' || evaluacionesAprobando.includes(evaluacion.id_evaluacion_resumen)"
                :title="evaluacion.estado === 'Aprobado' ? 'Ya está aprobada' : 'Aprobar evaluación'"
              >
                <span v-if="evaluacionesAprobando.includes(evaluacion.id_evaluacion_resumen)" class="spinner-border spinner-border-sm me-1" role="status"></span>
                {{ evaluacion.estado === 'Aprobado' ? 'Aprobada' : 'Aprobar' }}
              </button>
              <button class="btn btn-sm btn-outline-primary" @click="verDetalle(evaluacion.id_evaluacion_resumen)">Ver detalle</button>
            </td>
          </tr>
        </tbody>
      </table>
      <!-- Paginación -->
      <nav v-if="totalPaginas > 1" class="d-flex justify-content-center mt-3">
        <ul class="pagination pagination-sm mb-0">
          <li class="page-item" :class="{ disabled: paginaActual === 1 }">
            <button class="page-link" @click="cambiarPagina(paginaActual - 1)" :disabled="paginaActual === 1">&laquo;</button>
          </li>
          <li v-for="n in totalPaginas" :key="n" class="page-item" :class="{ active: paginaActual === n }">
            <button class="page-link" @click="cambiarPagina(n)">{{ n }}</button>
          </li>
          <li class="page-item" :class="{ disabled: paginaActual === totalPaginas }">
            <button class="page-link" @click="cambiarPagina(paginaActual + 1)" :disabled="paginaActual === totalPaginas">&raquo;</button>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import { getEvaluaciones } from '../services/EvaluacionService';
import { getPautas } from '../services/PautaService';
import { fetchWithAuth } from '../services/AuthService';
import { API_URL } from '../config';
import { isAdmin } from '../utils/permissions';
import '../styles/ListaEvaluaciones.css';

export default {
  name: 'ListaEvaluaciones',
  data() {
    return {
      evaluaciones: [],
      pautas: [],
      cargando: true,
      alerta: { mostrar: false, mensaje: '', tipo: 'success' },
      busqueda: '',
      paginaActual: 1,
      tamanoPagina: 10,
      evaluacionesAprobando: [] // Array para trackear evaluaciones que se están aprobando
    };
  },
  computed: {
    esAdministrador() {
      return isAdmin();
    },
    evaluacionesFiltradas() {
      if (!this.busqueda) return this.evaluaciones;
      const b = this.busqueda.toLowerCase();
      return this.evaluaciones.filter(e =>
        (e.nombre_ejecutivo && e.nombre_ejecutivo.toLowerCase().includes(b)) ||
        (e.fecha && e.fecha.toLowerCase().includes(b)) ||
        (this.obtenerNombrePauta(e.id_pauta) && this.obtenerNombrePauta(e.id_pauta).toLowerCase().includes(b))
      );
    },
    totalPaginas() {
      return Math.ceil(this.evaluacionesFiltradas.length / this.tamanoPagina) || 1;
    },
    evaluacionesPaginadas() {
      const start = (this.paginaActual - 1) * this.tamanoPagina;
      return this.evaluacionesFiltradas.slice(start, start + this.tamanoPagina);
    }
  },
  watch: {
    busqueda() {
      this.paginaActual = 1;
    }
  },
  async mounted() {
    try {
      // Cargar pautas y evaluaciones en paralelo
      const [pautasData, evaluacionesData] = await Promise.all([
        getPautas(),
        getEvaluaciones()
      ]);
      
      this.pautas = pautasData;
      this.evaluaciones = evaluacionesData;
    } catch (error) {
      console.error('Error al cargar datos:', error);
      this.alerta = { mostrar: true, mensaje: 'Error al cargar el listado: ' + error.message, tipo: 'danger' };
    } finally {
      this.cargando = false;
    }
  },
  methods: {
    tieneErrorCritico(evaluacion) {
      // Verificar si la evaluación tiene error crítico
      // Puede ser un boolean true/false o tener descripción de error crítico
      return evaluacion.error_critico === true || 
             (evaluacion.descripcion_error_critico && evaluacion.descripcion_error_critico !== null && evaluacion.descripcion_error_critico !== '');
    },
    async aprobarEvaluacion(idEvaluacion) {
      try {
        // Agregar a la lista de evaluaciones que se están aprobando
        this.evaluacionesAprobando.push(idEvaluacion);
        
        // Llamar al endpoint para aprobar la evaluación
        const response = await fetchWithAuth(`${API_URL}/api/evaluaciones-resumen/${idEvaluacion}`, {
          method: 'PUT',
          body: JSON.stringify({ estado: 'Aprobado' })
        });
        
        if (!response.ok) {
          throw new Error(`Error al aprobar evaluación: ${response.status} ${response.statusText}`);
        }
        
        // Actualizar el estado en la lista local
        const evaluacionIndex = this.evaluaciones.findIndex(e => e.id_evaluacion_resumen === idEvaluacion);
        if (evaluacionIndex !== -1) {
          this.evaluaciones[evaluacionIndex].estado = 'Aprobado';
        }
        
        // Mostrar mensaje de éxito
        this.alerta = { 
          mostrar: true, 
          mensaje: 'Evaluación aprobada exitosamente', 
          tipo: 'success' 
        };
        
        // Ocultar mensaje después de 3 segundos
        setTimeout(() => {
          this.alerta.mostrar = false;
        }, 3000);
        
      } catch (error) {
        console.error('Error al aprobar evaluación:', error);
        this.alerta = { 
          mostrar: true, 
          mensaje: 'Error al aprobar la evaluación: ' + error.message, 
          tipo: 'danger' 
        };
      } finally {
        // Remover de la lista de evaluaciones que se están aprobando
        const index = this.evaluacionesAprobando.indexOf(idEvaluacion);
        if (index > -1) {
          this.evaluacionesAprobando.splice(index, 1);
        }
      }
    },
    obtenerNombrePauta(idPauta) {
      if (!idPauta) return 'Sin pauta';
      const pauta = this.pautas.find(p => p.id_pauta === idPauta);
      return pauta ? pauta.nombre : `Pauta ${idPauta}`;
    },
    verDetalle(id) {
      this.$router.push(`/evaluaciones/detalle/${id}`);
    },
    cambiarPagina(n) {
      if (n >= 1 && n <= this.totalPaginas) {
        this.paginaActual = n;
      }
    },
    formatearFecha1(fecha) {
      if (!fecha) return '';
      const d = new Date(fecha);
      if (isNaN(d)) return fecha;
      return d.toLocaleDateString('es-CL', { day: '2-digit', month: '2-digit', year: 'numeric' });
    },
    formatearFecha(fecha) {
      if (!fecha) return '';

      // Si ya es un objeto Date
      if (Object.prototype.toString.call(fecha) === '[object Date]') {
        return fecha.toLocaleDateString('es-CL', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
      }

      // Si es string tipo ISO o SQL
      const fechaStr = String(fecha);
      const [f] = fechaStr.split(/[T ]/); // captura antes de "T" o espacio
      const [anio, mes, dia] = f.split('-');

      if (!anio || !mes || !dia) return fechaStr;

      return `${dia}-${mes}-${anio}`;
    }
  }
};
</script> 