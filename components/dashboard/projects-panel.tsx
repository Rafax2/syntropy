"use client";

import { useEffect, useState } from "react";
import {
ArrowUpRight,
FolderKanban,
Layers3,
NotebookPen,
Plus,
Target,
Trash2,
} from "lucide-react";

import {
createProject,
deleteProject,
getProjects,
} from "@/app/actions/projects";

export type DashboardProject = {
id: string;
name: string;
description: string;
color: string;
createdAt: string;
totalTasks: number;
completedTasks: number;
progress: number;
};

type ProjectsPanelProps = {
onProjectsChange: (count: number) => void;
onOpenProjects: () => void;
onOpenProject: (project: DashboardProject) => void;
};

const projectColors = [
"#9475ff",
"#38b98a",
"#f5a64a",
"#65a9e8",
"#e879b9",
];

const projectIcons = [Layers3, NotebookPen, Target, FolderKanban];

export default function ProjectsPanel({
onProjectsChange,
onOpenProjects,
onOpenProject,
}: ProjectsPanelProps) {
const [projects, setProjects] = useState<DashboardProject[]>([]);
const [loading, setLoading] = useState(true);
const [busy, setBusy] = useState(false);
const [error, setError] = useState("");

async function refreshProjects() {
try {
setError("");


  const data = await getProjects();

  setProjects(data);
  onProjectsChange(data.length);
} catch (err) {
  console.error("Error cargando proyectos:", err);
  setError("No se pudieron cargar los proyectos.");
} finally {
  setLoading(false);
}


}

useEffect(() => {
void refreshProjects();
}, []);

async function handleCreateProject() {
const name = window.prompt("Nombre del proyecto:");


if (!name?.trim()) return;

const description =
  window.prompt("Descripción del proyecto (opcional):") ?? "";

const color =
  projectColors[projects.length % projectColors.length];

setBusy(true);
setError("");

try {
  await createProject(name, description, color);
  await refreshProjects();
} catch (err) {
  console.error("Error creando proyecto:", err);

  setError(
    err instanceof Error
      ? err.message
      : "No se pudo crear el proyecto.",
  );
} finally {
  setBusy(false);
}


}

async function handleDeleteProject(project: DashboardProject) {
const confirmed = window.confirm(
`¿Eliminar el proyecto "${project.name}"? Las tareas se conservarán, pero quedarán sin proyecto.`,
);


if (!confirmed) return;

setBusy(true);
setError("");

try {
  await deleteProject(project.id);
  await refreshProjects();
} catch (err) {
  console.error("Error eliminando proyecto:", err);
  setError("No se pudo eliminar el proyecto.");
} finally {
  setBusy(false);
}


}

return ( <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 sm:p-6"> <div className="mb-5 flex items-center justify-between gap-3"> <div> <h3 className="font-bold">Proyectos activos</h3> <p className="mt-1 text-xs text-[#918da3]">
Tus objetivos en marcha </p> </div>


    <button
      type="button"
      onClick={handleCreateProject}
      disabled={busy}
      aria-label="Crear proyecto"
      title="Crear proyecto"
      className="rounded-lg bg-[#f0ebff] p-2 text-[#7556d5] hover:bg-[#e7dfff] disabled:opacity-50"
    >
      <Plus size={18} />
    </button>
  </div>

  {error && (
    <div
      role="alert"
      className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-700"
    >
      {error}

      <button
        type="button"
        onClick={() => void refreshProjects()}
        className="ml-2 font-semibold underline"
      >
        Reintentar
      </button>
    </div>
  )}

  {loading ? (
    <div className="space-y-4 py-2">
      <div className="h-14 animate-pulse rounded-xl bg-[#f5f3fa]" />
      <div className="h-14 animate-pulse rounded-xl bg-[#f5f3fa]" />
      <div className="h-14 animate-pulse rounded-xl bg-[#f5f3fa]" />
    </div>
  ) : projects.length === 0 ? (
    <div className="py-8 text-center">
      <FolderKanban
        size={28}
        className="mx-auto mb-3 text-[#c3bfd1]"
      />

      <p className="text-sm font-medium text-[#77728e]">
        Todavía no tienes proyectos.
      </p>

      <p className="mt-1 text-xs text-[#9692a7]">
        Crea tu primer proyecto para empezar.
      </p>

      <button
        type="button"
        onClick={handleCreateProject}
        disabled={busy}
        className="mt-4 rounded-xl bg-[#302a49] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#494065] disabled:opacity-50"
      >
        Crear proyecto
      </button>
    </div>
  ) : (
    <div className="space-y-5">
      {projects.map((project, index) => {
        const Icon = projectIcons[index % projectIcons.length];

        return (
          <div
            key={project.id}
            className="rounded-xl transition hover:bg-[#faf9fd]"
          >
            <div className="mb-3 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenProject(project)}
                aria-label={`Abrir proyecto ${project.name}`}
                title={`Abrir ${project.name}`}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:brightness-95"
                style={{
                  background: `${project.color}20`,
                  color: project.color,
                }}
              >
                <Icon size={19} />
              </button>

              <div className="min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => onOpenProject(project)}
                  className="block max-w-full truncate text-left text-sm font-semibold hover:text-[#7556d5]"
                  title={`Abrir ${project.name}`}
                >
                  {project.name}
                </button>

                <p className="mt-1 truncate text-xs text-[#9692a7]">
                  {project.description || "Sin descripción"}
                </p>
              </div>

              <span className="shrink-0 text-xs font-bold text-[#77728e]">
                {project.progress}%
              </span>

              <button
                type="button"
                onClick={() => void handleDeleteProject(project)}
                disabled={busy}
                aria-label={`Eliminar proyecto ${project.name}`}
                title="Eliminar proyecto"
                className="shrink-0 rounded-lg p-2 text-[#aaa6b8] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                <Trash2 size={15} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => onOpenProject(project)}
              className="block w-full cursor-pointer text-left"
              aria-label={`Ver progreso del proyecto ${project.name}`}
            >
              <div className="mb-1.5 h-1.5 overflow-hidden rounded-full bg-[#f0eef6]">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${project.progress}%`,
                    background: project.color,
                  }}
                />
              </div>

              <p className="text-[10px] text-[#9692a7]">
                {project.completedTasks} de {project.totalTasks} tareas completadas
              </p>
            </button>
          </div>
        );
      })}
    </div>
  )}

  <button
    type="button"
    onClick={onOpenProjects}
    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#eceaf3] py-3 text-xs font-semibold text-[#77728e] hover:bg-[#faf9fd]"
  >
    Explorar proyectos
    <ArrowUpRight size={15} />
  </button>
</div>


);
}
