<template>
  <div class="container my-4">
    <h2 class="mb-4">Reportes Históricos</h2>
    <form @submit.prevent="generarReporte" class="row g-3 align-items-end">
      <div class="col-md-4">
        <label class="form-label">Tipo de Pauta</label>
        <select v-model="idPauta" class="form-select" required>
          <option disabled value="">Seleccione una pauta</option>
          <option v-for="p in pautas" :key="p.id_pauta" :value="p.id_pauta">
            {{ p.nombre }}
          </option>
        </select>
      </div>
      <div class="col-md-3">
        <label class="form-label">Fecha de inicio</label>
        <input v-model="fechaDesde" type="date" class="form-control" required />
      </div>
      <div class="col-md-3">
        <label class="form-label">Fecha de fin</label>
        <input v-model="fechaHasta" type="date" class="form-control" required />
      </div>
      <div class="col-md-2 d-grid">
        <button type="submit" class="btn btn-primary">Generar Reporte</button>
      </div>
    </form>
    <div v-if="error" class="alert alert-danger mt-3">{{ error }}</div>

    <div v-if="reporteData && reporteData.length > 0" class="card shadow mb-4 mt-4">
      <div class="card-header py-3">
        <h6 class="m-0 font-weight-bold text-primary">Datos del Reporte</h6>
      </div>
      <div class="card-body">
        <div class="table-responsive">
          <table class="table table-striped table-hover" id="dataTable" width="100%" cellspacing="0">
            <thead>
              <tr>
                <th v-for="header in reporteHeaders" :key="header">{{ removeQuotes(header) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(row, index) in reporteData" :key="index">
                <td v-for="header in reporteHeaders" :key="header">{{ removeQuotes(row[header]) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <button @click="exportarReporteCSV" class="btn btn-success mt-3">Exportar a CSV</button>
      </div>
    </div>
    <div v-else-if="reporteData && reporteData.length === 0" class="alert alert-info mt-4">
      No hay datos para el rango de fechas y pauta seleccionados.
    </div>
  </div>
</template>

<script>
import { getPautas } from '../services/PautaService';
import { downloadEvaluacionesResumenCSV } from '../services/EvaluacionService';
import '../styles/Reportes.css';

export default {
  name: 'ReportesView',
  data() {
    return {
      pautas: [],
      idPauta: '',
      fechaDesde: '',
      fechaHasta: '',
      error: '',
      reporteData: null, // Para almacenar los datos del reporte
      reporteHeaders: [], // Para almacenar los encabezados del reporte
    };
  },
  async mounted() {
    try {
      this.pautas = await getPautas();
    } catch (e) {
      this.error = e.message;
    }
  },
  methods: {
    // Helper para parsear CSV a un array de objetos
    parseCSV(csvString) {
      const lines = csvString.split('\n').filter(line => line.trim() !== '');
      if (lines.length === 0) return { headers: [], data: [] };

      const headers = lines[0].split(';');
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(';');
        const row = {};
        headers.forEach((header, index) => {
          row[header.trim()] = values[index] ? values[index].trim() : '';
        });
        data.push(row);
      }
      return { headers, data };
    },

    // Helper para convertir array de objetos a CSV
    convertToCSV(data, headers) {
      if (!data || data.length === 0) return '';
      const csvRows = [];
      csvRows.push(headers.join(';')); // Encabezados

      for (const row of data) {
        const values = headers.map(header => {
          const escaped = ('' + row[header]).replace(/"/g, '""');
          return `"${escaped}"`;
        });
        csvRows.push(values.join(';'));
      }
      return csvRows.join('\n');
    },

    // Helper para remover comillas de un string
    removeQuotes(text) {
      if (typeof text === 'string' && text.startsWith('"') && text.endsWith('"')) {
        return text.substring(1, text.length - 1);
      }
      return text;
    },

    async generarReporte() {
      this.error = '';
      this.reporteData = null; // Limpiar datos anteriores
      this.reporteHeaders = []; // Limpiar encabezados anteriores

      if (!this.idPauta || !this.fechaDesde || !this.fechaHasta) {
        this.error = 'Debe completar todos los campos';
        return;
      }
      try {
        const csvString = await downloadEvaluacionesResumenCSV(this.idPauta, this.fechaDesde, this.fechaHasta);
        const parsed = this.parseCSV(csvString);
        this.reporteHeaders = parsed.headers;
        this.reporteData = parsed.data;
      } catch (e) {
        this.error = e.message;
      }
    },

    async exportarReporteCSV() {
      if (!this.reporteData || this.reporteData.length === 0) {
        this.error = 'No hay datos para exportar.';
        return;
      }
      try {
        const csv = this.convertToCSV(this.reporteData, this.reporteHeaders);
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.setAttribute('download', `reporte_pauta_${this.idPauta}_${this.fechaDesde}_a_${this.fechaHasta}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } catch (e) {
        this.error = e.message;
      }
    }
  }
};
</script>

