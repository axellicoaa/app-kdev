"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: string;
  projectId: number;
}

type StatusFilter = "ALL" | "PENDING" | "IN_PROGRESS" | "DONE";
type SortOrder = "asc" | "desc";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  // Inputs del modal
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [dueDate, setDueDate] = useState("");

  const fetchTasks = async () => {
    try {
      const res = await api.get<Task[]>("/kdevfull/tasks/ids", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const filtered = res.data.filter((t) => t.projectId === Number(id));
      setTasks(filtered);
    } catch (err) {
      console.error("Error cargando tareas:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [id]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(
        "/kdevfull/tasks/ids",
        {
          title,
          description,
          status,
          projectId: Number(id),
          dueDate,
        },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setShowModal(false);
      setTitle("");
      setDescription("");
      setStatus("PENDING");
      setDueDate("");
      fetchTasks();
    } catch (err) {
      console.error("Error creando tarea:", err);
    }
  };

  const handleDeleteTask = async (taskId: number) => {
    if (!confirm("¿Seguro que quieres eliminar esta tarea?")) return;
    try {
      await api.delete(`/kdevfull/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (err) {
      console.error("Error eliminando tarea:", err);
    }
  };

  const filteredAndSortedTasks = tasks
    .filter((task) => {
      if (statusFilter === "ALL") return true;
      return task.status === statusFilter;
    })
    .sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });

  const getStatusStyles = (taskStatus: string) => {
    switch (taskStatus) {
      case "DONE":
        return "bg-success/10 text-success border-success/20";
      case "IN_PROGRESS":
        return "bg-warning/10 text-warning border-warning/20";
      default:
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getStatusLabel = (taskStatus: string) => {
    switch (taskStatus) {
      case "DONE":
        return "Completada";
      case "IN_PROGRESS":
        return "En Progreso";
      case "PENDING":
        return "Pendiente";
      default:
        return taskStatus;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-accent"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">
                    Tareas del Proyecto
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Proyecto #{id}
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowModal(true)}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105 flex items-center gap-2"
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
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Nueva Tarea
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Status filter */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-3">
                Filtrar por Estado
              </label>
              <div className="flex flex-wrap gap-2">
                {(
                  ["ALL", "PENDING", "IN_PROGRESS", "DONE"] as StatusFilter[]
                ).map((filterStatus) => (
                  <button
                    key={filterStatus}
                    onClick={() => setStatusFilter(filterStatus)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      statusFilter === filterStatus
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    }`}
                  >
                    {filterStatus === "ALL"
                      ? "Todas"
                      : filterStatus === "PENDING"
                      ? "Pendientes"
                      : filterStatus === "IN_PROGRESS"
                      ? "En Progreso"
                      : "Completadas"}
                  </button>
                ))}
              </div>
            </div>

            {/* Sort by due date */}
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-3">
                Ordenar por Fecha
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setSortOrder("asc")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    sortOrder === "asc"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
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
                      d="M5 15l7-7 7 7"
                    />
                  </svg>
                  Más Próximas
                </button>
                <button
                  onClick={() => setSortOrder("desc")}
                  className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2 ${
                    sortOrder === "desc"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                  }`}
                >
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
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  Más Lejanas
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Mostrando{" "}
              <span className="font-semibold text-foreground">
                {filteredAndSortedTasks.length}
              </span>{" "}
              de{" "}
              <span className="font-semibold text-foreground">
                {tasks.length}
              </span>{" "}
              tareas
            </p>
          </div>
        </div>

        {filteredAndSortedTasks.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border-2 border-dashed border-border bg-card/50">
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-2">
              {statusFilter === "ALL"
                ? "No hay tareas aún"
                : "No hay tareas con este filtro"}
            </h3>
            <p className="text-muted-foreground mb-6">
              {statusFilter === "ALL"
                ? "Comienza creando tu primera tarea"
                : "Intenta cambiar los filtros para ver más tareas"}
            </p>
            {statusFilter === "ALL" && (
              <button
                onClick={() => setShowModal(true)}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
              >
                Crear Primera Tarea
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAndSortedTasks.map((task) => (
              <div
                key={task.id}
                className="group rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1"
              >
                {/* Task header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-2">
                      {task.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                      {task.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-accent"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Task metadata */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
                      {new Date(task.dueDate).toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-lg text-xs font-medium border ${getStatusStyles(
                      task.status
                    )}`}
                  >
                    {getStatusLabel(task.status)}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4 border-t border-border">
                  <button
                    onClick={() => handleDeleteTask(task.id)}
                    className="flex-1 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 hover:border-destructive/20 transition-all flex items-center justify-center gap-2"
                  >
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-2xl shadow-2xl w-full max-w-lg border border-border">
            <div className="p-6 border-b border-border">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    Nueva Tarea
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Completa los detalles de la tarea
                  </p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <form onSubmit={handleCreateTask} className="p-6 space-y-5">
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Título
                </label>
                <input
                  id="title"
                  type="text"
                  placeholder="Ej: Revisar documentación"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Descripción
                </label>
                <textarea
                  id="description"
                  placeholder="Describe la tarea..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all resize-none"
                />
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Estado
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                >
                  <option value="PENDING">Pendiente</option>
                  <option value="IN_PROGRESS">En Progreso</option>
                  <option value="DONE">Completada</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="dueDate"
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Fecha de Vencimiento
                </label>
                <input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                  required
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-lg bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
                >
                  Crear Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
