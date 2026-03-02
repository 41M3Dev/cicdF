import { useState, useEffect } from "react";

function App() {
  const [tasks, setTasks] = useState([]);
  const [newTitle, setNewTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      const response = await fetch("https://api.aime.abecedaire-studio.com/tasks");
      if (!response.ok) throw new Error("Erreur serveur");
      const data = await response.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError("Impossible de charger les taches");
    } finally {
      setLoading(false);
    }
  }

  async function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;

    try {
      const response = await fetch("https://api.aime.abecedaire-studio.com/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });
      if (!response.ok) throw new Error("Erreur creation");
      const task = await response.json();
      setTasks([task, ...tasks]);
      setNewTitle("");
    } catch (err) {
      setError("Impossible d'ajouter la tache");
    }
  }

  async function toggleTask(task) {
    try {
      const response = await fetch(`https://api.aime.abecedaire-studio.com/tasks/${task.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, done: !task.done }),
      });
      if (!response.ok) throw new Error("Erreur mise a jour");
      const updated = await response.json();
      setTasks(tasks.map((t) => (t.id === task.id ? updated : t)));
    } catch (err) {
      setError("Impossible de modifier la tache");
    }
  }

  async function deleteTask(id) {
    try {
      const response = await fetch(`https://api.aime.abecedaire-studio.com/tasks/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Erreur suppression");
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      setError("Impossible de supprimer la tache");
    }
  }

  return (
    <div className="container">
      <header>
        <h1>Mes Taches</h1>
        <p className="subtitle">Application de gestion de taches</p>
      </header>

      {error && <div className="error">{error}</div>}

      <form onSubmit={addTask} className="add-form">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          placeholder="Nouvelle tache..."
          className="input"
        />
        <button type="submit" className="btn btn-add">
          Ajouter
        </button>
      </form>

      {loading ? (
        <p className="loading">Chargement...</p>
      ) : tasks.length === 0 ? (
        <p className="empty">Aucune tache pour le moment</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li key={task.id} className={`task ${task.done ? "done" : ""}`}>
              <div className="task-content" onClick={() => toggleTask(task)}>
                <span className="checkbox">{task.done ? "[x]" : "[ ]"}</span>
                <span className="task-title">{task.title}</span>
              </div>
              <button
                onClick={() => deleteTask(task.id)}
                className="btn btn-delete"
              >
                Supprimer
              </button>
            </li>
          ))}
        </ul>
      )}

      <footer>
        <p>Cours CI/CD - Liste de taches</p>
      </footer>
    </div>
  );
}

export default App;
