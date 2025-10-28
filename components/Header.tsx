"use client";

import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <svg
                className="w-6 h-6 text-primary-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h1
              id="title"
              onClick={() => router.push("/dashboard")}
              className="text-2xl font-bold text-foreground cursor-pointer"
            >
              Proyectos
            </h1>
          </div>

          {/* Center: Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <button
              onClick={() => router.push("/nuevo-proyecto")}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Nuevo Proyecto
            </button>
            <button className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Nosotros
            </button>
          </nav>

          {/* Right: Logout */}
          <button
            onClick={handleLogout}
            className="rounded-lg bg-destructive px-5 py-2.5 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-all hover:scale-105"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}
