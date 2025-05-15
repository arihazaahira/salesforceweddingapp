import React, { useState, useEffect } from 'react';
import { getTasksByWeddingId, addTask, deleteTask } from '../services/TaskService';
import '../styles/Tasks.css';

const TaskChecklist = ({ weddingId, providers }) => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    Name: '',
    Status__c: 'Not yet',
    Due_date__c: '',
    Assigned_To__c: '',
    Type__c: '',
    Wedding__c: weddingId,
  });

  const typeOptions = ['DJ', 'Florist', 'Photographe', 'Dresser', 'Makeup Artist', 'logistics Manager', 'Food Provider'];
  const statusOptions = ['Not yet', 'Processing', 'Finished'];

  useEffect(() => {
    fetchTasks();
  }, [weddingId]);

  const fetchTasks = async () => {
    try {
      const data = await getTasksByWeddingId(weddingId);
      setTasks(data);
    } catch (error) {
      console.error('Erreur lors du chargement des tâches:', error);
      setTasks([]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async () => {
    const { Name, Due_date__c, Type__c } = newTask;
    if (!Name || !Due_date__c || !Type__c) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      await addTask({ ...newTask, Wedding__c: weddingId });
      setNewTask({
        Name: '',
        Status__c: 'Not yet',
        Due_date__c: '',
        Assigned_To__c: '',
        Type__c: '',
        Wedding__c: weddingId
      });
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

  const filteredProviders = providers?.filter((p) => p.Type__c === newTask.Type__c);

  return (
    <div className="task-section">
      <h3>Checklist des Tâches</h3>

      <div className="form-group">
        <input
          type="text"
          name="Name"
          placeholder="Nom de la tâche"
          value={newTask.Name}
          onChange={handleChange}
        />

        <input
          type="date"
          name="Due_date__c"
          value={newTask.Due_date__c}
          onChange={handleChange}
        />

        <select name="Type__c" value={newTask.Assigned_To__c} onChange={handleChange}>
          <option value="">--Choisir un prestataire--</option>
          {typeOptions.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>

        <select name="Status__c" value={newTask.Status__c} onChange={handleChange}>
          {statusOptions.map((status) => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>

        <button className="add-btn" onClick={handleAdd}>Ajouter</button>
      </div>

      {tasks.length === 0 ? (
        <p>Aucune tâche pour le moment.</p>
      ) : (
        <table className="task-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Échéance</th>
              <th>Assigned</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <tr key={task.Id}>
                <td>{task.Name}</td>
                <td>{task.Due_date__c}</td>
                <td>{task.Assigned_To__c}</td>
                <td>{task.Status__c}</td>
                <td>
                  <button className="delete-btn" onClick={() => handleDelete(task.Id)}>Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TaskChecklist;
