import { fetchWithAuth } from './AuthService';
import { API_URL } from '../config';

const API_BASE = `${API_URL}/api`;

export async function getUsuarios() {
  const res = await fetchWithAuth(`${API_BASE}/usuarios`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al cargar usuarios');
  }
  return await res.json();
}

export async function getUsuario(id) {
  const res = await fetchWithAuth(`${API_BASE}/usuarios/${id}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al cargar usuario');
  }
  return await res.json();
}

export async function crearUsuario(usuario) {
  const res = await fetchWithAuth(`${API_BASE}/usuarios`, {
    method: 'POST',
    body: JSON.stringify(usuario)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al crear usuario');
  }
  return await res.json();
}

export async function actualizarUsuario(id, usuario) {
  const res = await fetchWithAuth(`${API_BASE}/usuarios/${id}`, {
    method: 'PUT',
    body: JSON.stringify(usuario)
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al actualizar usuario');
  }
  return await res.json();
}

export async function desactivarUsuario(id) {
  const res = await fetchWithAuth(`${API_BASE}/usuarios/${id}`, {
    method: 'DELETE'
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al desactivar usuario');
  }
  return await res.json();
}

export async function reactivarUsuario(id) {
  const res = await fetchWithAuth(`${API_BASE}/usuarios/${id}/reactivar`, {
    method: 'POST'
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error al reactivar usuario');
  }
  return await res.json();
} 