import React, { useState, useEffect } from 'react';
import { getTasksByWeddingId, addTask, deleteTask } from '../services/TaskService';
import '../styles/Tasks.css';

const Tasks = ({ weddingId, providers }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    Name: '',
    Status__c: 'Not yet',
    Due_date__c: '',
    Assigned_To__c: '',
    Wedding__c: weddingId
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const data = await getTasksByWeddingId(weddingId);
      setTasks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setTasks([]);
    }
  };

  const handleAdd = async () => {
    try {
      await addTask(newTask);
      setNewTask({ Name: '', Status__c: 'Not yet', Due_date__c: '', Assigned_To__c: '', Wedding__c: weddingId });
      fetchTasks();
    } catch (error) {
      console.error('Erreur ajout tâche :', error);
      alert('Erreur : ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      fetchTasks();
    } catch (error) {
      console.error('Erreur suppression tâche :', error);
    }
  };

  return (
    <div className="task-section">
      <h3>Checklist des Tâches</h3>

      <div className="task-form">
        <input
          type="text"
          placeholder="Nom de la tâche"
          value={newTask.Name}
          onChange={(e) => setNewTask({ ...newTask, Name: e.target.value })}
        />
        <input
          type="date"
          value={newTask.Due_date__c}
          onChange={(e) => setNewTask({ ...newTask, Due_date__c: e.target.value })}
        />
        <select
          value={newTask.Status__c}
          onChange={(e) => setNewTask({ ...newTask, Status__c: e.target.value })}
        >
          <option value="Not yet">Not yet</option>
          <option value="Processing">Processing</option>
          <option value="Finished">Finished</option>
        </select>
        <select
          value={newTask.Assigned_To__c}
          onChange={(e) => setNewTask({ ...newTask, Assigned_To__c: e.target.value })}
        >
          <option value="">-- Choisir un prestataire --</option>
          {providers?.map((p) => (
            <option key={p.Id} value={p.Id}>{p.Name}</option>
          ))}
        </select>
        <button onClick={handleAdd}>Ajouter</button>
      </div>

      <ul className="task-list">
        {tasks.length === 0 ? (
          <li>Aucune tâche pour le moment.</li>
        ) : (
          tasks.map(task => (
            <li key={task.Id}>
              <strong>{task.Name}</strong> – {task.Due_date__c} <br />
              Statut : {task.Status__c} <br />
              Assignée à : {task.Assigned_To__r?.Name || 'Non défini'}
              <button className="delete-btn" onClick={() => handleDelete(task.Id)}>Supprimer</button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default Tasks;
