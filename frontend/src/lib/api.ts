// src/lib/api.ts
import { getToken, removeToken } from './auth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface ApiOptions extends RequestInit {
  headers?: HeadersInit;
}

async function fetcher<T>(url: string, options: ApiOptions = {}): Promise<T> {
  const token = getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeToken();
      window.location.href = '/login';
    }

    const errorData = await response.json().catch(() => ({ message: 'Erro desconhecido' }));
    throw new Error(errorData.message || 'Ocorreu um erro na API');
  }

  return response.json();
}


// Funções de API
export const login = async (credentials: any): Promise<{ access_token: string }> => {
  return fetcher('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
};

export const getTasks = async (): Promise<any[]> => {
  return fetcher('/tarefas', { method: 'GET' });
};

export const createTask = async (taskData: any): Promise<any> => {
  return fetcher('/tarefas', {
    method: 'POST',
    body: JSON.stringify(taskData),
  });
};

export const updateTask = async (id: number, taskData: any): Promise<any> => {
  return fetcher(`/tarefas/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(taskData),
  });
};

export const deleteTask = async (id: number): Promise<void> => {
  return fetcher(`/tarefas/${id}`, { method: 'DELETE' });
};
