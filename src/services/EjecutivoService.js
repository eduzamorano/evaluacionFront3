import { fetchWithAuth } from './AuthService';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

export async function getEjecutivos() {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos`);
  if (!res.ok) throw new Error('Error al cargar ejecutivos');
  return await res.json();
}


export async function getEjecutivo(id) {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos/${id}`);
  if (!res.ok) throw new Error('Error al cargar ejecutivo');
  return await res.json();
}

export async function crearEjecutivo(ejecutivo) {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos`, {
    method: 'POST',
    body: JSON.stringify(ejecutivo)
  });
  if (!res.ok) throw new Error('Error al crear ejecutivo');
  return await res.json();
}

export async function actualizarEjecutivo(id, ejecutivo) {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(ejecutivo)
  });
  if (!res.ok) throw new Error('Error al actualizar ejecutivo');
  return await res.json();
}

export async function getGruposEjecutivos() {
  const res = await fetchWithAuth(`${API_BASE}/grupos-ejecutivos`);
  if (!res.ok) throw new Error('Error al cargar grupos');
  return await res.json();
}


export async function desactivarEjecutivo(id) {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) throw new Error('Error al desactivar ejecutivo');
  return await res.json();
}

export async function reactivarEjecutivo(id) {
  const res = await fetchWithAuth(`${API_BASE}/ejecutivos/${id}/reactivar`, {
    method: 'PUT'
  });
  if (!res.ok) throw new Error('Error al reactivar ejecutivo');
  return await res.json();
} 