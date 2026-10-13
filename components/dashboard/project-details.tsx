"use client";

import {
  ArrowLeft,
  CheckCircle2,
  Circle,
  FolderKanban,
  Plus,
  Trash2,
} from "lucide-react";

import type { DashboardProject } from "@/components/dashboard/projects-panel";

type ProjectTask = {
  id: string;
  title: string;
  project: string;
  projectId: string | null;
  priority: string;
  color: string;
  done: boolean;
};

type ProjectDetailsProps = {
  project: DashboardProject;
  tasks: ProjectTask[];
  loading: boolean;
  busy: boolean;
  onBack: () => void;
  onCreateTask: () => void;
  onToggleTask: (id: string) => void;
  onDeleteTask: (id: string) => void;
};

export default function ProjectDetails({
  project,
  tasks,
  loading,
  busy,
  onBack,
  onCreateTask,
  onToggleTask,
  onDeleteTask,
}: ProjectDetailsProps) {
  const completedTasks = tasks.filter((task) => task.done).length;
  const pendingTasks = tasks.length - completedTasks;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  return (
    <section className="space-y-6">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-sm font-semibold text-[#77728e] transition hover:text-[#7556d5]"
      >
        <ArrowLeft size={17} />
        Volver al dashboard
      </button>

      <div className="rounded-2xl border border-[#eceaf3] bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-4">
            <div
              className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl"
              style={{
                background: `${project.color}20`,
                color: project.color,
              }}
            >
              <FolderKanban size={26} />
            </div>

            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider text-[#9692a7]">
                Detalles del proyecto
              </p>

              <h3 className="mt-1 break-words text-2xl font-bold">
                {project.name}
              </h3>

              <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-[#89869d]">
                {project.description || "Este proyecto no tiene descripción."}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCreateTask}
            disabled={busy}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-[#302a49] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#494065] disabled:opacity-50"
          >
            <Plus size={17} />
            Nueva tarea
          </button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl bg-[#f7f5fc] p-4">
            <p className="text-xs text-[#89869d]">Total de tareas</p>
            <p className="mt-2 text-2xl font-bold">{tasks.length}</p>
          </div>

          <div className="rounded-xl bg-[#fff4e8] p-4">
            <p className="text-xs text-[#a8794d]">Pendientes</p>
            <p className="mt-2 text-2xl font-bold">{pendingTasks}</p>
          </div>

          <div className="rounded-xl bg-[#e7f8ef] p-4">
            <p className="text-xs text-[#34845b]">Completadas</p>
            <p className="mt-2 text-2xl font-bold">{completedTasks}</p>
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between gap-3">
            <span className="text-sm font-semibold">Progreso del proyecto</span>
            <span className="text-sm font-bold">{progress}%</span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-[#f0eef6]">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${progress}%`,
                background: project.color,
              }}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 sm:p-6">
        <div className="mb-5">
          <h4 className="font-bold">Tareas del proyecto</h4>
          <p className="mt-1 text-xs text-[#918da3]">
            Tareas vinculadas a {project.name}
          </p>
        </div>

        {loading ? (
          <div className="space-y-3">
            <div className="h-14 animate-pulse rounded-xl bg-[#f5f3fa]" />
            <div className="h-14 animate-pulse rounded-xl bg-[#f5f3fa]" />
          </div>
        ) : tasks.length === 0 ? (
          <div className="py-10 text-center">
            <FolderKanban
              size={30}
              className="mx-auto mb-3 text-[#c3bfd1]"
            />

            <p className="text-sm font-semibold text-[#77728e]">
              Este proyecto todavía no tiene tareas.
            </p>

            <p className="mt-1 text-xs text-[#9692a7]">
              Crea una tarea para comenzar a trabajar en él.
            </p>

            <button
              type="button"
              onClick={onCreateTask}
              disabled={busy}
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#f0ebff] px-4 py-2.5 text-xs font-semibold text-[#7556d5] hover:bg-[#e7dfff] disabled:opacity-50"
            >
              <Plus size={15} />
              Crear primera tarea
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#faf9fd]"
              >
                <button
                  type="button"
                  onClick={() => onToggleTask(task.id)}
                  disabled={busy}
                  aria-label={
                    task.done ? "Reabrir tarea" : "Completar tarea"
                  }
                  className={`shrink-0 disabled:opacity-50 ${
                    task.done ? "text-[#39ad82]" : "text-[#c3bfd1]"
                  }`}
                >
                  {task.done ? (
                    <CheckCircle2 size={21} />
                  ) : (
                    <Circle size={21} />
                  )}
                </button>

                <p
                  className={`min-w-0 flex-1 break-words text-sm font-medium ${
                    task.done
                      ? "text-[#a5a1b3] line-through"
                      : "text-[#39354e]"
                  }`}
                >
                  {task.title}
                </p>

                <span className="shrink-0 rounded-lg bg-[#f0ebff] px-2 py-1 text-[10px] font-semibold text-[#7556d5]">
                  {task.priority}
                </span>

                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  disabled={busy}
                  aria-label={`Eliminar ${task.title}`}
                  title="Eliminar tarea"
                  className="shrink-0 rounded-lg p-2 text-[#aaa6b8] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}