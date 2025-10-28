"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import api from "@/lib/api";

export default function NewProject() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const name = (
      form.elements.namedItem("name") as HTMLInputElement
    ).value.trim();
    const description = (
      form.elements.namedItem("description") as HTMLInputElement
    ).value.trim();

    if (!name || !description) {
      setError("Por favor completa todos los campos.");
      return;
    }

    try {
      await api.post(
        "/kdevfull/projects",
        { name, description },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      router.push("/dashboard");
    } catch (err) {
      console.error("Error creando proyecto:", err);
      setError("No se pudo crear el proyecto, intenta de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-3xl px-6 py-12">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Crear Nuevo Proyecto
          </h2>
          <p className="text-muted-foreground">
            Completa los detalles para crear un nuevo proyecto.
          </p>
        </div>

        <form
          onSubmit={handleCreate}
          className="space-y-6 rounded-2xl border border-border bg-card p-8 shadow-sm"
        >
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Nombre del Proyecto
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Ej: Sistema de Gestión"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
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
              name="description"
              rows={4}
              placeholder="Describe tu proyecto..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all resize-none"
            />
          </div>

          {error && (
            <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all hover:scale-105"
            >
              Crear Proyecto
            </button>
            <button
              type="button"
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border border-border bg-card px-6 py-3 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
