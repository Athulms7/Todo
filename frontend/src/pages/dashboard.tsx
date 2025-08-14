
import NavBar from "@/components/navbar"
import TaskListPage from "@/components/tasklistpage"
import { useEffect } from "react";

export default function Dashboard() {
  useEffect(()=>{
    console.log("here")
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("token", token);
      window.history.replaceState({}, document.title, "/dashboard");
    }
  },[]);
  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <TaskListPage />
    </div>
  );
}
