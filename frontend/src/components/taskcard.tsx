import { Trash2, Pencil, Flag, CalendarDays, Save } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Input } from "@/components/ui/input"; // Assuming you use shadcn/ui

export interface Todo {
  id: number;
  title: string;
  description: string;
  status: "PENDING" | "COMPLETED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate?: string;
}

export default function TaskCard({
  todo,
  token,
  onUpdate,
}: {
  todo: Todo;
  token: string;
  onUpdate: () => void;
}) {
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description);

  const isCompleted = todo.status === "COMPLETED";

  const toggleStatus = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...todo,
        status: isCompleted ? "PENDING" : "COMPLETED",
      }),
    });
    onUpdate();
  };

  const deleteTask = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    onUpdate();
  };

  const saveEdit = async () => {
    await fetch(`${import.meta.env.VITE_API_URL}/api/todos/${todo.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        ...todo,
        title: editTitle,
        description: editDescription,
      }),
    });
    setEditMode(false);
    onUpdate();
  };

  const priorityColor = {
    LOW: "bg-green-100 text-green-800",
    MEDIUM: "bg-yellow-100 text-yellow-800",
    HIGH: "bg-red-100 text-red-800",
  };

  return (
    <Card className="rounded-xl p-4 shadow-md space-y-2 relative">
      <div className="flex items-start gap-2">
        <Checkbox checked={isCompleted} onCheckedChange={toggleStatus} />
        <div className="flex-1 space-y-1">
          {editMode ? (
            <>
              <Input
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="text-lg font-semibold w-40"
              />
              <Input
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="text-sm w-40"
              />
            </>
          ) : (
            <>
              <h3 className={cn("text-lg font-semibold", isCompleted && "line-through text-muted-foreground")}>
                {todo.title}
              </h3>
              <p className="text-sm text-muted-foreground">{todo.description}</p>
            </>
          )}
        </div>
        <div className="flex items-center gap-2 absolute top-4 right-4">
          {editMode ? (
            <Save onClick={saveEdit} className="cursor-pointer w-4 h-4 text-green-600" />
          ) : (
            <Pencil onClick={() => setEditMode(true)} className="cursor-pointer w-4 h-4" />
          )}
          <Trash2 onClick={deleteTask} className="cursor-pointer w-4 h-4 text-red-600" />
        </div>
      </div>
      <div className="text-sm flex items-center gap-2">
        <Flag className="w-4 h-4" />
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${priorityColor[todo.priority]}`}>
          {todo.priority}
        </span>
      </div>
      <div className="text-sm text-muted-foreground flex items-center gap-2">
        <CalendarDays className="w-4 h-4" />
        Due: {todo.dueDate ? new Date(todo.dueDate).toLocaleDateString() : "No due date"}
      </div>
    </Card>
  );
}
