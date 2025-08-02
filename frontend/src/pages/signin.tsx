import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // ${import.meta.env.VITE_API_URL}
    window.location.href = `${import.meta.env.VITE_API_URL}/login`;
  };

  return (
    <div className="font-sans">
      {/* Navbar */}
      <header className="flex justify-between items-center px-8 py-4 shadow-md">
        <h1 className="text-xl font-bold text-red-500">TaskList</h1>
        <div className="space-x-4">
          <Button variant="ghost" onClick={() => navigate("/features")}>Features</Button>
          <Button variant="ghost" onClick={() => navigate("/pricing")}>Pricing</Button>
          <Button onClick={handleLogin}>Sign in</Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-b from-white to-gray-100">
        <h2 className="text-4xl font-bold mb-4">Clarity. Finally.</h2>
        <p className="text-gray-600 mb-6">Join thousands using TaskList to organize work and life in one place.</p>
        <Button onClick={handleLogin}>Get Started Free</Button>
        <div className="mt-10">
          <img
            src="/assets/tasklist-hero.png" // Replace with your screenshot
            alt="TaskList Demo"
            className="mx-auto rounded-md shadow-lg w-full max-w-xl"
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12">
          <FeatureCard
            title="Capture tasks instantly"
            description="Add tasks quickly with intuitive inputs."
          />
          <FeatureCard
            title="Stay organized and focused"
            description="Sort by due dates, priorities, and project context."
          />
          <FeatureCard
            title="Simplify your planning"
            description="Visualize your week and manage your workflow clearly."
          />
          <FeatureCard
            title="Your team's shared workspace"
            description="Collaborate across projects with ease."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 py-8 text-center text-sm text-gray-600">
        <p>© {new Date().getFullYear()} TaskList. All rights reserved.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 hover:shadow-xl transition duration-300">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p>{description}</p>
    </div>
  );
}
