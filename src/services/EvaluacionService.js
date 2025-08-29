/* EvaluacionService.js */

import { fetchWithAuth } from './AuthService';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

export async function getEvaluaciones() {
  const response = await fetchWithAuth(`${API_BASE}/evaluaciones-resumen`);
  if (!response.ok) throw new Error('Error al obtener resumen de evaluaciones');
  return await response.json();
}

export async function getEvidencias(id) {
  const res = await fetchWithAuth(`${API_BASE}/evidencias/${id}`);
  if (!res.ok) throw new Error('Error al cargar evidencias');
  return await res.json();
}

export async function getEvaluacionDetalle(id) {
  const response = await fetchWithAuth(`${API_BASE}/evaluaciones/${id}`);
  if (!response.ok) throw new Error('Error al obtener detalle de evaluación');
  return await response.json();
}

export async function getEvaluacionDetallePorResumen(id) {
  const response = await fetchWithAuth(`${API_BASE}/evaluaciones/detalle-por-resumen/${id}`);
  if (!response.ok) throw new Error('Error al obtener detalle de evaluación por resumen');
  //console.log("detalle de evaluacion por resumen "+response.json());
  return await response.json();
}

export async function getEvaluacionTablaCompleta(id) {
  const response = await fetchWithAuth(`${API_BASE}/evaluaciones/tabla-completa/${id}`);
  if (!response.ok) throw new Error('Error al obtener la tabla completa de la evaluación');
  return await response.json();
}

// Descargar CSV de evaluaciones resumen
export async function downloadEvaluacionesResumenCSV(id_pauta, fecha_desde, fecha_hasta) {
  const url = `${API_BASE}/evaluaciones-csv?id_pauta=${id_pauta}&fecha_desde=${fecha_desde}&fecha_hasta=${fecha_hasta}`;
  //console.log("url: "+url);
  const response = await fetchWithAuth(url);
  if (!response.ok) throw new Error('No se pudo generar el reporte CSV error: '+response.statusText);
  return await response.text();
} 