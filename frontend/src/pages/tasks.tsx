// src/pages/tasks.tsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { getTasks, createTask, updateTask, deleteTask } from '../lib/api';
import { isAuthenticated } from '../lib/auth';
import TaskForm from '../components/TaskForm';  
import type { TaskData } from '../types';

const TasksPage: React.FC = () => {
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<TaskData | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/login');
      return;
    }
    fetchTasks();
  }, [router]);

  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao carregar tarefas.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (taskData: Omit<TaskData, 'taskId'>) => {
    try {
      await createTask(taskData);
      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao adicionar tarefa.');
      }
    }
  };

  const handleUpdateTask = async (id: number, taskData: Omit<TaskData, 'taskId'>) => {
    try {
      await updateTask(id, taskData);
      await fetchTasks();
      setEditingTask(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Erro ao atualizar tarefa.');
      }
    }
  };

  const handleDeleteTask = async (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir esta tarefa?')) {
      try {
        await deleteTask(id);
        await fetchTasks();
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Erro ao excluir tarefa.');
        }
      }
    }
  };

  const startEditing = (task: TaskData) => {
    setEditingTask(task);
  };

  const cancelEditing = () => {
    setEditingTask(null);
  };

  if (loading) return <p style={{ textAlign: 'center', fontSize: '1.2em', color: '#555' }}>Carregando tarefas...</p>;
  if (error) return <p style={{ color: '#dc3545', textAlign: 'center', fontSize: '1.1em' }}>Erro: {error}</p>;

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '25px', color: '#333' }}>Minhas Tarefas</h2>

      <TaskForm
        initialData={editingTask ?? undefined}
        onSubmit={(data) => {
                              if (editingTask?.taskId !== undefined) {
                                handleUpdateTask(editingTask.taskId, data);
                              } else {
                                handleCreateTask(data);
                              }
                            }}
        onCancel={editingTask ? cancelEditing : undefined}
      />

      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontSize: '1.1em' }}>Nenhuma tarefa encontrada. Adicione uma!</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: '0' }}>
          {tasks.map((task) => (
            <li key={task.taskId} style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', marginBottom: '10px', display: 'flex', flexDirection: 'column', backgroundColor: task.concluido ? '#e6ffe6' : 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ margin: '0', color: '#007bff' }}>{task.nome}</h3>
                <span style={{ fontSize: '0.9em', color: '#666' }}>ID: {task.taskId}</span>
              </div>
              <p style={{ margin: '0 0 10px 0', color: '#555' }}>{task.descricao}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 'bold', color: task.concluido ? '#28a745' : '#ffc107' }}>
                  Status: {task.concluido ? 'Concluída' : 'Pendente'}
                </span>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={() => startEditing(task)} style={{ padding: '8px 15px', backgroundColor: '#ffc107', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Editar
                  </button>
                  <button onClick={() => {if (typeof task.taskId === 'number') handleDeleteTask(task.taskId);}} style={{ padding: '8px 15px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksPage;
