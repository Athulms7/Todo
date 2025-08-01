import { useEffect, useState } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import AddTaskDialog from "./Addtaskdialog"
import TaskCard, { type Todo } from "./taskcard";
import { CalendarIcon } from "lucide-react";

export default function TaskListPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState({ status: "", priority: "", search: "" });
  const token = localStorage.getItem("token") || "";
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");


  const fetchTodos = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/todos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setTodos(res.data);
  } catch (err: any) {
    if (err.response?.data?.msg === "Token has expired") {
      localStorage.removeItem("token");
      window.location.href = "/";
    } else {
      console.error("Failed to fetch todos:", err);
    }
  }
};


  const handleAdd = (newTodo: Todo) => {
    setTodos(prev => [newTodo, ...prev]);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const filtered = todos
  .filter((todo) => {
    const matchStatus = filter.status ? todo.status === filter.status : true;
    const matchPriority = filter.priority ? todo.priority === filter.priority : true;
    const matchSearch = filter.search
      ? todo.title.toLowerCase().includes(filter.search.toLowerCase())
      : true;

    return matchStatus && matchPriority && matchSearch;
  })
  .sort((a, b) => {
    const aDate = a.dueDate ? new Date(a.dueDate).getTime() : 0;
    const bDate = b.dueDate ? new Date(b.dueDate).getTime() : 0;
    return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
  });


  return (
    <div className="px-8 py-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Task List</h1>
        <div className="mr-60">
          <AddTaskDialog onAdd={handleAdd} />
        </div>
        
      </div>

      <div className="flex flex-wrap gap-2 mb-6 pl-40">
        <Input
          placeholder="Search tasks..."
          className="w-64"
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
        />
        <Select onValueChange={(v) => setFilter({ ...filter, status: v })}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(v) => setFilter({ ...filter, priority: v })}>
          <SelectTrigger className="w-36"><SelectValue placeholder="All Priorities" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        <Button
  variant="outline"
  onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
>
<CalendarIcon size={16} className="mr-2" />Due Date{sortOrder === "asc" ? "↑" : "↓"}
</Button>

      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(todo => (
          <TaskCard key={todo.id} todo={todo} token={token} onUpdate={fetchTodos} />
        ))}
      </div>
    </div>
  );
}