import { useEffect, useState } from "react";
import axios from "axios";
import TodoCard, { type Todo } from "./todocard";
import AddTodoForm from "./Addtodofrom";

export default function TodoDashboard() {
  const token = localStorage.getItem("token") || "";
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:5000/api/todos", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTodos(res.data);
    } catch (error) {
      console.error("Error fetching todos", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleNewTodo = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev]); // fast local update
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Your To-Dos</h2>
      <AddTodoForm token={token} onAdd={handleNewTodo} />
      {loading ? <p>Loading...</p> : (
        todos.length === 0 ? (
          <p>No todos found.</p>
        ) : (
          todos.map(todo => (
            <TodoCard key={todo.id} todo={todo} token={token} onRefresh={fetchTodos} />
          ))
        )
      )}
    </div>
  );
}
