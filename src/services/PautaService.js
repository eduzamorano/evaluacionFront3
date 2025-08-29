import { fetchWithAuth } from './AuthService';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

export async function getPautaDetalle(idPauta) {
  const res = await fetchWithAuth(`${API_BASE}/pautas/detalle/${idPauta}`);
  if (!res.ok) {
    throw new Error(`Error al cargar la pauta: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getPauta(idPauta) {
  const res = await fetchWithAuth(`${API_BASE}/pautas/${idPauta}`);
  if (!res.ok) {
    throw new Error(`Error al cargar la pauta: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getPautas() {
  const res = await fetchWithAuth(`${API_BASE}/pautas`);
  if (!res.ok) {
    throw new Error(`Error al cargar las pautas: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getEjecutivos() {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos`);
  if (!res.ok) {
    throw new Error(`Error al cargar los ejecutivos: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function crearEvaluacionResumen(payload) {
  const res = await fetchWithAuth(`${API_BASE}/evaluaciones-resumen`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    throw new Error(`Error al crear evaluación resumen: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function crearEvaluacionDetalle(payload) {
  const res = await fetchWithAuth(`${API_BASE}/evaluaciones`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    throw new Error(`Error al crear evaluación detalle: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function enviarEvaluacion(payload) {
  const res = await fetchWithAuth(`${API_BASE}/evaluacion`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
  return res;
}

export async function actualizarNotaTotalObservaciones(id, nota_total, observaciones) {
  const res = await fetchWithAuth(`${API_BASE}/evaluaciones-resumen/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ nota_total, observaciones })
  });
  if (!res.ok) throw new Error(`Error al actualizar nota: ${res.status} ${res.statusText}`);
  return await res.json();
}

export async function crearDetalleMasivo(detalles) {
  const res = await fetchWithAuth(`${API_BASE}/evaluaciones/detalle-masivo`, {
    method: 'POST',
    body: JSON.stringify(detalles)
  });
  if (!res.ok) throw new Error(`Error al crear detalles: ${res.status} ${res.statusText}`);
  return await res.json();
}

export async function getErroresCriticosPorPauta(idPauta) {
  const res = await fetchWithAuth(`${API_BASE}/errores-criticos/pauta/${idPauta}`);
  if (!res.ok) {
    throw new Error(`Error al cargar los errores críticos: ${res.status} ${res.statusText}`);
  }
  return await res.json();
}

export async function getGestionesPorCategoria(idCategoria) {
  const res = await fetchWithAuth(`${API_BASE}/gestiones/categoria/${idCategoria}`);
  if (!res.ok) {
    throw new Error(`Error al cargar las gestiones: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();
  if (data.success) {
    return data.data;
  }
  throw new Error(data.message || 'Error al cargar las gestiones');
} 