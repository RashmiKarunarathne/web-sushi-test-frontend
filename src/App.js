import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const baseUrl = "http://localhost:8080";
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [heading, setHeading] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");

  const handleFormSubmit = (event) => {
    event.preventDefault();
    const todoData = {
      heading: heading,
      description: description,
      status: status,
    };

    if (editTask) {
      axios
        .put(`${baseUrl}/todo/${editTask._id}`, todoData) // Ensure this URL is correct
        .then((response) => {
          console.log("Task updated successfully:", response.data);
          setEditTask(null);
          fetchTasks();
        })
        .catch((error) => {
          console.error("Error updating task:", error);
        });
    } else {
      axios
        .post(`${baseUrl}/todo`, todoData)
        .then((response) => {
          console.log("Task created successfully:", response.data);
          fetchTasks();
        })
        .catch((error) => {
          console.error("Error creating task:", error);
        });
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setHeading("");
    setDescription("");
    setStatus("");
    setEditTask(null);
  };

  const handleDelete = (id) => {
    axios
      .delete(`${baseUrl}/todo/${editTask._id}`)
      .then((response) => {
        setTasks(tasks.filter((task) => task._id !== id));
        console.log("Task deleted successfully:", response.data);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const handleUpdate = (event) => {
    event.preventDefault();
    const todoData = {
      heading: heading,
      description: description,
      status: status,
    };
    console.log("Updated todo data:", todoData);
    handleFormSubmit(event);
  };

  const handleEditTask = (id) => {
    if (!tasks || tasks.length === 0) {
      console.error("No tasks available to edit");
      return;
    }

    const taskToEdit = tasks.find((task) => task._id === id);
    if (taskToEdit) {
      setEditTask(taskToEdit);
      setHeading(taskToEdit.heading);
      setDescription(taskToEdit.description);
      setStatus(taskToEdit.status);
      setShowForm(true);
    } else {
      console.error("Task not found");
    }
  };

  const fetchTasks = () => {
    axios
      .get(`${baseUrl}/todo`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <div className="card">
          <button onClick={toggleForm}>Create a Task</button>
          {showForm && (
            <form onSubmit={handleFormSubmit} className="form">
              <div className="form-group">
                <label htmlFor="headingInput">Heading : </label>
                <input
                  type="text"
                  id="headingInput"
                  name="heading"
                  value={heading}
                  onChange={(e) => setHeading(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="descriptionInput">Description : </label>
                <input
                  id="descriptionInput"
                  name="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="statusInput">Status : </label>
                <input
                  type="text"
                  id="statusInput"
                  name="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  placeholder="Pending / Done"
                />
              </div>
              <button type="submit">{editTask ? "Update" : "Save"}</button>
            </form>
          )}
        </div>
        <div className="table-container">
          <table className="records-table">
            <thead>
              <tr>
                <th>Heading</th>
                <th>Description</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((record) => (
                <tr key={record._id}>
                  <td>{record.heading}</td>
                  <td>{record.description}</td>
                  <td>{record.status}</td>
                  <td>
                    <button
                      className="edit-btn"
                      onClick={() => handleEditTask(record._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(record._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="space"></div>
      </header>
    </div>
  );
}

export default App;
