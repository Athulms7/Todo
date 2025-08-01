import React, { useState } from "react";
import axios from "axios";
import { type Todo } from "./todocard";

interface Props {
  token: string;
  onAdd: (newTodo: Todo) => void;
}

export default function AddTodoForm({ token, onAdd }: Props) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/todos`, {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    onAdd(res.data.todo); // immediately show the todo
    setForm({ title: "", description: "", priority: "MEDIUM", dueDate: "" });
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
      <h3>Add New Todo</h3>
      <input
        placeholder="Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
        required
      />
      <br />
      <textarea
        placeholder="Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <br />
      <select
        value={form.priority}
        onChange={(e) => setForm({ ...form, priority: e.target.value })}
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
      <button type="submit">Create Todo</button>
    </form>
  );
}
