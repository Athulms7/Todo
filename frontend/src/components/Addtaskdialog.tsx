import { useState } from "react";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import axios from "axios";

export default function AddTaskDialog({ onAdd }: { onAdd: (todo: any) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", priority: "MEDIUM", dueDate: "" });
  const token = localStorage.getItem("token") || "";

  const handleSubmit = async () => {
    const res = await axios.post("http://localhost:5000/api/todos", {
      ...form,
      dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : null,
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    onAdd(res.data.todo);
    setOpen(false);
    setForm({ title: "", description: "", priority: "MEDIUM", dueDate: "" });
  };

  return (
    <Dialog  open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default">+ Add a Task</Button>
      </DialogTrigger>
      <DialogContent className="space-y-4">
        <h2 className="text-xl font-bold">Create Task</h2>
        <Input
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />
        <Textarea
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <Input
          type="date"
          value={form.dueDate}
          onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
        />
        <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="LOW">Low</SelectItem>
            <SelectItem value="MEDIUM">Medium</SelectItem>
            <SelectItem value="HIGH">High</SelectItem>
          </SelectContent>
        </Select>
        <Button onClick={handleSubmit}>Create</Button>
      </DialogContent>
    </Dialog>
  );
}
