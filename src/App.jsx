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
    <>
      {/* Matrix rain background */}
      <div className="matrix-bg">
        <div className="matrix-col">01001101011000010111010001110010011010010111100000110001</div>
        <div className="matrix-col">10110100110010101100011011101010111001001101001011101000</div>
        <div className="matrix-col">01110011011110010111001101110100011001010110110100101110</div>
        <div className="matrix-col">01100010011100100110010101100001011000110110100000101110</div>
        <div className="matrix-col">01100001011000110110001101100101011100110111001100101110</div>
        <div className="matrix-col">01100100011001010110001101110010011110010111000001110100</div>
        <div className="matrix-col">01110000011100100110111101111000011110010010111000101110</div>
        <div className="matrix-col">01110010011011110110111101110100010000000110010001100001</div>
        <div className="matrix-col">01110011011010000110010101101100011011000010000000101101</div>
        <div className="matrix-col">01100101011110000110010101100011001000000010111100101110</div>
      </div>

      {/* CRT scanline overlay */}
      <div className="scanline-overlay"></div>

      {/* Top Navbar */}
      <nav className="navbar">
        <div className="nav-left">
          <span className="nav-logo">
            <span className="nav-logo-bracket">[</span>
            <span className="nav-logo-text">DRK</span>
            <span className="nav-logo-bracket">]</span>
          </span>
          <span className="nav-separator">|</span>
          <span className="nav-link active">_tasks</span>
          <span className="nav-link">_logs</span>
          <span className="nav-link">_network</span>
          <span className="nav-link">_config</span>
        </div>
        <div className="nav-right">
          <span className="nav-status">
            <span className="nav-status-dot"></span>
            ENCRYPTED
          </span>
          <span className="nav-separator">|</span>
          <span className="nav-uptime">SYS_UP: 99.7%</span>
          <span className="nav-separator">|</span>
          <span className="nav-user">root@darknet</span>
        </div>
      </nav>

      <div className="container">
        <header>
          <h1>Mes Taches</h1>
          <p className="subtitle">task_manager --mode=darknet</p>
        </header>

        {error && <div className="error">{error}</div>}

        <form onSubmit={addTask} className="add-form">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="inject_task --new..."
            className="input"
          />
          <button type="submit" className="btn btn-add">
            EXEC
          </button>
        </form>

        {loading ? (
          <p className="loading">Decrypting data...</p>
        ) : tasks.length === 0 ? (
          <p className="empty">No active processes</p>
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
                  KILL
                </button>
              </li>
            ))}
          </ul>
        )}

        <footer>
          <p>darknet_academy // ci-cd module</p>
        </footer>
      </div>
    </>
  );
}

export default App;
