// src/components/TaskForm.tsx
import React, { useState, useEffect } from 'react';

interface TaskFormProps {
  initialData?: any; // Para edição
  onSubmit: (data: any) => void;
  onCancel?: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [nome, setNome] = useState(initialData?.nome || '');
  const [descricao, setDescricao] = useState(initialData?.descricao || '');
  const [concluido, setConcluido] = useState(initialData?.concluido || false);

  useEffect(() => {
    if (initialData) {
      setNome(initialData.nome || '');
      setDescricao(initialData.descricao || '');
      setConcluido(initialData.concluido || false);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ nome, descricao, concluido });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
      <h3 style={{ marginTop: '0', marginBottom: '15px', color: '#333' }}>{initialData ? 'Editar Tarefa' : 'Adicionar Nova Tarefa'}</h3>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
          style={{ width: 'calc(100% - 12px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Descrição:</label>
        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          rows={3}
          style={{ width: 'calc(100% - 12px)', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
        />
      </div>
      <div style={{ marginBottom: '15px', display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={concluido}
          onChange={(e) => setConcluido(e.target.checked)}
          style={{ marginRight: '8px' }}
        />
        <label style={{ fontWeight: 'bold' }}>Concluído</label>
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 }}>
          {initialData ? 'Salvar Alterações' : 'Adicionar Tarefa'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} style={{ padding: '10px 20px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', flex: 1 }}>
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default TaskForm;