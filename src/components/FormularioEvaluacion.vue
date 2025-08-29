<template>
    <div class="container-fluid" style="max-width: 1200px; margin: 0 auto; padding: 1rem;">
        <div v-if="alerta.mostrar" :class="['alert', alerta.tipo === 'success' ? 'alert-success' : 'alert-danger', 'mt-3']" role="alert">
          {{ alerta.mensaje }}
        </div>
        <div v-if="guardando" class="spinner-guardando-backdrop">
          <div class="spinner-border text-primary spinner-guardando" role="status">
            <span class="visually-hidden">Guardando...</span>
          </div>
        </div>
        <div class="d-flex align-items-center justify-content-between mb-4">
          <button
            class="btn btn-outline-secondary btn-sm d-flex align-items-center gap-2"
            style="width: fit-content;"
            @click="$router.push('/')"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 1-.5.5H2.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 1 1 .708.708L2.707 7.5H14.5A.5.5 0 0 1 15 8z"/>
            </svg>
            Volver
          </button>
          <h2 class="mb-0 text-primary fw-bold flex-grow-1 text-center" style="font-size:1.5rem;">{{ pauta.nombre }}</h2>
          <div style="width: 80px;"></div>
        </div>
        <form @submit.prevent="abrirConfirmacion">
          <div class="table-responsive">
            <table class="table table-bordered align-middle shadow-sm custom-table">
              <thead>
                <tr class="table-header-main">
                  <th colspan="4" class="text-center align-middle">Pauta de Calidad Voz Inbound</th>
                  <th colspan="2" class="text-center align-middle border-start border-dark">Nota</th>
                </tr>
                <tr class="table-header-sub">
                  <th class="text-center">Atributos</th>
                  <th v-if="columnasVisibles.nombre_subatributo" class="text-center">Sub Atributo</th>
                  <th v-if="columnasVisibles.descripcion" class="text-center">Descripción</th>
                  <th v-if="columnasVisibles.explicativo" class="text-center">Explicativo</th>
                  <th v-if="columnasVisibles.porcentaje_evaluacion" class="text-center border-start border-dark">% Evaluación</th>
                  <th class="text-center">% Total</th>
                </tr>
              </thead>
              <tbody>
                <template v-for="atributo in pauta.atributos" :key="atributo.id_atributo">
                  <tr v-for="(sub, idx) in atributo.subatributos" :key="sub.id_subatributo" class="table-row">
                    <td v-if="idx === 0" :rowspan="atributo.subatributos.length" class="align-middle fw-semibold bg-atributo">{{ atributo.nombre_atributo }}</td>
                    <td v-if="columnasVisibles.nombre_subatributo">{{ sub.nombre_subatributo }}</td>
                    <td v-if="columnasVisibles.descripcion">{{ sub.descripcion }}</td>
                    <td v-if="columnasVisibles.explicativo" class="explicativo-cell">{{ sub.explicativo }}</td>
                    <td v-if="columnasVisibles.porcentaje_evaluacion" class="border-start border-dark text-center">{{ sub.porcentaje_evaluacion }}%</td>
                    <td class="text-center">
                      <input 
                        v-model.number="respuestas[sub.id_subatributo]" 
                        type="number" 
                        min="0" 
                        :max="sub.porcentaje_evaluacion" 
                        class="form-control form-control-sm text-center" 
                        style="width: 80px; margin: 0 auto;"
                        @input="validarPorcentaje($event, sub.id_subatributo, sub.porcentaje_evaluacion)"
                      />
                      <small v-if="errores[sub.id_subatributo]" class="text-danger d-block mt-1">{{ errores[sub.id_subatributo] }}</small>
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
            <div class="mb-3">
              <div class="mb-3">
                <label class="form-label">Comentarios (máx. 600 caracteres):</label>
                <textarea
                  v-model="observaciones"
                  class="form-control"
                  maxlength="600"
                  rows="4"
                  placeholder="Ingrese comentarios opcionales sobre la evaluación...">
                </textarea>
                <div class="form-text text-end">
                  {{ observaciones.length }} / 600 caracteres
                </div>
              </div>

            </div>
          </div>

    
          <div class="mb-3" v-if="errorCritico">
            <label class="form-label">Descripción error crítico (1 a 7):</label>
            <input v-model.number="descripcionErrorCritico" type="number" min="1" max="7" class="form-control" />
          </div>
    
          <button type="submit" class="btn btn-primary">Enviar Evaluación</button>
        </form>

        <!-- Modal de confirmación Vue puro -->
        <div v-if="showConfirmModal">
          <div class="vue-modal-backdrop"></div>
          <div class="vue-modal-content">
            <div class="modal-header bg-primary text-white">
              <h5 class="modal-title">Confirmar envío de evaluación</h5>
              <button type="button" class="modal-close-btn" @click="showConfirmModal = false" aria-label="Cerrar">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9" fill="transparent"/>
                  <path d="M6.5 6.5L13.5 13.5M13.5 6.5L6.5 13.5" stroke="#444" stroke-width="1.7" stroke-linecap="round"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p>¿Estás seguro de que deseas enviar esta evaluación? Una vez enviada, no podrás modificarla.</p>
              <table class="table table-borderless mb-3 detalle-evaluacion">
                <tbody>
                  <tr>
                    <td class="fw-bold">Nota final:</td>
                    <td class="text-end text-primary" style="font-size:1.2rem;"><b>{{ notaFinal.toFixed(2) }}%</b></td>
                  </tr>
                </tbody>
              </table>
              <div class="alert alert-warning mb-0"><i class="bi bi-exclamation-triangle"></i> Revisa bien tus respuestas antes de confirmar.</div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-outline-secondary" @click="showConfirmModal = false">Cancelar</button>
              <button type="button" class="btn btn-success" @click="confirmarEnvio">Confirmar y Enviar</button>
            </div>
          </div>
        </div>

        <!-- Modal de feedback éxito/error -->
        <div v-if="alerta.mostrar" class="vue-modal-backdrop">
          <div class="vue-modal-content" role="dialog" aria-modal="true" aria-labelledby="feedbackTitle">
            <div class="modal-header" :class="alerta.tipo === 'success' ? 'bg-success text-white' : 'bg-danger text-white'">
              <h5 class="modal-title" id="feedbackTitle">{{ alerta.tipo === 'success' ? '¡Éxito!' : 'Error' }}</h5>
            </div>
            <div class="modal-body text-center py-2 px-3">
              <p class="mb-0">{{ alerta.mensaje }}</p>
            </div>
            <div class="modal-footer d-flex justify-content-center py-2">
              <button type="button" class="btn btn-primary" @click="cerrarAlerta">Aceptar</button>
            </div>
          </div>
        </div>
    </div>
  </template>
  
  <script>
  import '../styles/FormularioEvaluacion.css';
  import { getPautaDetalle, actualizarNotaTotalObservaciones, crearDetalleMasivo } from '../services/PautaService';
  
  export default {
    name: 'FormularioEvaluacion',
    data() {
      return {
        pauta: { atributos: [] },
        respuestas: {},
        errores: {},
        // Datos de setup
        idEvaluacionResumen: '',
        enlaceEvaluacion: '',
        errorCritico: false,
        nivelErrorCritico: null,
        showConfirmModal: false,
        notaFinal: 0,
        alerta: { mostrar: false, mensaje: '', tipo: 'success' },
        guardando: false,
        observaciones: ''
      };
    },
    computed: {
      columnasVisibles() {
        if (!this.pauta.atributos.length) {
          return {
            nombre_subatributo: true,
            descripcion: true,
            explicativo: true,
            porcentaje_evaluacion: true
          };
        }
        const allSubs = this.pauta.atributos.flatMap(a => a.subatributos);
        return {
          nombre_subatributo: allSubs.some(sub => sub.nombre_subatributo && sub.nombre_subatributo.trim() !== ''),
          descripcion: allSubs.some(sub => sub.descripcion && sub.descripcion.trim() !== ''),
          explicativo: allSubs.some(sub => sub.explicativo && sub.explicativo.trim() !== ''),
          porcentaje_evaluacion: allSubs.some(sub => sub.porcentaje_evaluacion != null)
        };
      }
    },
    async mounted() {
      try {
        const idPauta = this.$route.params.id;
        this.idEvaluacionResumen = this.$route.query.idEvaluacionResumen;
        console.log('ID recibido en FormularioEvaluacion (query):', this.idEvaluacionResumen);
        const data = await getPautaDetalle(idPauta);
        // Asegurarse de que la estructura de datos sea correcta
        if (!data) {
          throw new Error('No se recibieron datos');
        }
        // Si los datos vienen en un array, tomamos el primer elemento
        const pautaData = Array.isArray(data) ? data[0] : data;
        if (!pautaData || !pautaData.Atributos) {
          throw new Error(`Formato de datos inválido: falta la propiedad Atributos. Datos recibidos: ${JSON.stringify(pautaData)}`);
        }
        // Transformar los datos y crear el objeto de respuestas
        const respuestas = {};
        const errores = {};
        this.pauta = {
          ...pautaData,
          atributos: pautaData.Atributos.map(atributo => {
            // Inicializar respuestas para cada subatributo
            if (atributo.Subatributos) {
              atributo.Subatributos.forEach(sub => {
                if (sub && sub.id_subatributo) {
                  respuestas[sub.id_subatributo] = '';
                  errores[sub.id_subatributo] = '';
                }
              });
            }
            return {
              ...atributo,
              subatributos: atributo.Subatributos || []
            };
          })
        };
        // Asignar los objetos de respuestas y errores
        this.respuestas = respuestas;
        this.errores = errores;
      } catch (error) {
        console.error('Error completo:', error);
        alert('Error al cargar la pauta de evaluación: ' + error.message);
      }
    },
    methods: {
      validarPorcentaje(event, idSubatributo, maxPorcentaje) {
        const valor = event.target.value;
        this.errores[idSubatributo] = '';
        
        if (valor === '' || valor === null) {
          this.errores[idSubatributo] = 'Campo requerido';
          return;
        }
        
        if (isNaN(valor) || valor < 0) {
          this.errores[idSubatributo] = 'Debe ser un número positivo';
          this.respuestas[idSubatributo] = 0;
          return;
        }
        
        if (valor > maxPorcentaje) {
          this.errores[idSubatributo] = `Máximo permitido: ${maxPorcentaje}%`;
          this.respuestas[idSubatributo] = null;//maxPorcentaje;
          return;
        }
        
        // Asegurar que sea un número entero
        this.respuestas[idSubatributo] = Math.round(Number(valor));
      },
      abrirConfirmacion() {
        // Validar que todos los campos estén completos
        const hayErrores = Object.keys(this.respuestas).some(id => {
          const valor = this.respuestas[id];
          if (valor === '' || valor === null || valor === undefined) {
            this.errores[id] = 'Campo requerido';
            return true;
          }
          return false;
        });
        
        if (hayErrores) {
          this.alerta = { 
            mostrar: true, 
            mensaje: 'Por favor complete todos los campos requeridos', 
            tipo: 'danger' 
          };
          return;
        }
        
        // Calcula la nota final sumando los porcentajes ingresados
        this.notaFinal = Object.values(this.respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
        this.showConfirmModal = true;
      },
      async confirmarEnvio() {
        this.showConfirmModal = false;
        await this.enviarEvaluacion();
      },
      async enviarEvaluacion() {
        this.guardando = true;
        try {
          // 1. Calcular nota final (suma de los porcentajes ingresados)
          const notaTotal = Object.values(this.respuestas).reduce((sum, val) => sum + (Number(val) || 0), 0);
          const detalles = [];
          
          this.pauta.atributos.forEach(atributo => {
            atributo.subatributos.forEach(sub => {
              const puntaje = Number(this.respuestas[sub.id_subatributo]) || 0;
              detalles.push({
                id_evaluacion_resumen: this.idEvaluacionResumen,
                id_subatributo: sub.id_subatributo,
                puntaje_obtenido: puntaje,
                observaciones: ''
              });
            });
          });
          
          // 2. Actualizar nota total
          console.log('Actualizando nota total:', { id: this.idEvaluacionResumen, nota_total: notaTotal });
          await actualizarNotaTotalObservaciones(this.idEvaluacionResumen, notaTotal, this.observaciones);
          
          // 3. Enviar detalles masivos
          console.log('Detalles enviados a la API:', detalles);
          await crearDetalleMasivo(detalles);
          
          this.alerta = { mostrar: true, mensaje: '¡Evaluación guardada exitosamente!', tipo: 'success' };
        } catch (error) {
          this.alerta = { mostrar: true, mensaje: 'Error al guardar la evaluación: ' + error.message, tipo: 'danger' };
        }
        this.guardando = false;
      },
      cerrarAlerta() {
        this.alerta.mostrar = false;
        if (this.alerta.tipo === 'success') {
          this.$router.push('/');
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .vue-modal-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(44, 62, 80, 0.35);
    z-index: 1040;
  }
  .vue-modal-content {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 1050;
    background: #fff;
    border-radius: 12px;
    min-width: 340px;
    max-width: 95vw;
    box-shadow: 0 8px 32px 0 rgba(44,62,80,0.18);
    padding: 0;
    overflow: hidden;
  }
  .spinner-guardando-backdrop {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(44, 62, 80, 0.18);
    z-index: 2000;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .spinner-guardando {
    width: 3rem;
    height: 3rem;
  }
  input[type="number"]::-webkit-inner-spin-button,
  input[type="number"]::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  </style>
  