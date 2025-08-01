import React, { useState } from "react";
import axios from "axios";

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
  createdAt?: string;
}

interface Props {
  todo: Todo;
  token: string;
  onRefresh: () => void;
}

const TodoCard: React.FC<Props> = ({ todo, token, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dueDate: todo.dueDate?.split("T")[0] || "",
  });

  const updateTodo = async () => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      ...form,
      status: todo.status,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setIsEditing(false);
    onRefresh();
  };

  const toggleStatus = async () => {
    await axios.put(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      ...todo,
      status: todo.status === "PENDING" ? "COMPLETED" : "PENDING",
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onRefresh();
  };

  const deleteTodo = async () => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onRefresh();
  };

  return (
    <div style={{ border: "1px solid #ccc", padding: 12, borderRadius: 6, marginBottom: 10 }}>
      {isEditing ? (
        <>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
          />
          <br />
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
          />
          <br />
          <select
            value={form.priority}
            onChange={(e) => setForm({ ...form, priority: e.target.value as Todo["priority"] })}
          >
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
          </select>
          <br />
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <br />
          <button onClick={updateTodo}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </>
      ) : (
        <>
          <h3>{todo.title}</h3>
          <p>{todo.description}</p>
          <p>Status: {todo.status}</p>
          <p>Priority: {todo.priority}</p>
          <p>Due: {todo.dueDate?.split("T")[0] || "None"}</p>
          <button onClick={toggleStatus}>
            Mark as {todo.status === "PENDING" ? "Completed" : "Pending"}
          </button>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <button onClick={deleteTodo}>Delete</button>
        </>
      )}
    </div>
  );
};

export default TodoCard;
