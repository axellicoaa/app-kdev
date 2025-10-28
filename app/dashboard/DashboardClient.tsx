"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import Header from "@/components/Header";

interface Project {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  ownerId: number;
}

export default function DashboardClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchProjects = async () => {
    try {
      const res = await api.get<Project[]>("/kdevfull/projects", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects(res.data);
    } catch (err) {
      console.error("Error cargando proyectos:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("¿Seguro que quieres eliminar este proyecto?")) return;
    try {
      await api.delete(`/kdevfull/projects/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error eliminando proyecto:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-7xl px-6 py-12">
        {projects.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-secondary mb-6">
              <svg
                className="w-10 h-10 text-muted-foreground"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              No tienes proyectos aún
            </h3>
            <p className="text-muted-foreground mb-6">
              Comienza creando tu primer proyecto
            </p>
            <button
              onClick={() => router.push("/nuevo-proyecto")}
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              Crear Primer Proyecto
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className="mb-5 inline-flex items-center justify-center w-14 h-14 rounded-xl bg-secondary group-hover:bg-accent/10 transition-colors">
                  <svg
                    className="w-7 h-7 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>

                <h3 className="text-xl font-semibold text-foreground mb-2 line-clamp-1">
                  {project.name}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                  {project.description}
                </p>

                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-6">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>
                    Creado:{" "}
                    {new Date(project.createdAt).toLocaleDateString("es-ES", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                  >
                    Ver detalles
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
