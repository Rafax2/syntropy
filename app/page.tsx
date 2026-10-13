"use client";

import ProjectDetails from "@/components/dashboard/project-details";
import type { DashboardProject } from "@/components/dashboard/projects-panel";
import { useCallback, useEffect, useState } from "react";
import {
Layers3,
LayoutDashboard,
CheckSquare,
FolderKanban,
CalendarDays,
NotebookPen,
Target,
Clock3,
Settings,
Plus,
Search,
Bell,
ArrowUpRight,
CircleCheck,
Circle,
Flame,
Menu,
X,
Trash2,
} from "lucide-react";

import {
getTasks,
createTask,
setTaskDone,
deleteTask,
} from "@/app/actions/tasks";

import ProjectsPanel from "@/components/dashboard/projects-panel";

type DashboardTask = {
id: string;
title: string;
project: string;
projectId: string | null;
priority: string;
color: string;
done: boolean;
};

const navigation = [
{ label: "Dashboard", icon: LayoutDashboard },
{ label: "Tareas", icon: CheckSquare },
{ label: "Proyectos", icon: FolderKanban },
{ label: "Calendario", icon: CalendarDays },
{ label: "Notas", icon: NotebookPen },
{ label: "Hábitos y objetivos", icon: Target },
{ label: "Seguimiento del tiempo", icon: Clock3 },
];

export default function Home() {
const [tasks, setTasks] = useState<DashboardTask[]>([]);
const [activeNav, setActiveNav] = useState("Dashboard");
const [sidebarOpen, setSidebarOpen] = useState(false);
const [search, setSearch] = useState("");
const [tasksLoading, setTasksLoading] = useState(true);
const [taskError, setTaskError] = useState("");
const [taskBusy, setTaskBusy] = useState(false);
const [projectCount, setProjectCount] = useState(0);

const [selectedProject, setSelectedProject] =
useState<DashboardProject | null>(null);

const refreshTasks = useCallback(async () => {
try {
setTaskError("");


  const data = await getTasks();
  setTasks(data);
} catch (error) {
  console.error("Error cargando tareas:", error);

  setTaskError(
    "No se pudieron cargar las tareas. Inténtalo de nuevo.",
  );
} finally {
  setTasksLoading(false);
}


}, []);

useEffect(() => {
void refreshTasks();
}, [refreshTasks]);

const completed = tasks.filter((task) => task.done).length;
const pending = tasks.filter((task) => !task.done).length;

const visibleTasks = tasks.filter((task) =>
task.title.toLowerCase().includes(search.toLowerCase()),
);

async function addTask() {
const title = window.prompt("¿Qué tarea quieres añadir?");


if (!title?.trim() || taskBusy) return;

setTaskBusy(true);
setTaskError("");

try {
  await createTask(title.trim());
  await refreshTasks();
} catch (error) {
  console.error("Error creando tarea:", error);
  setTaskError("No se pudo crear la tarea.");
} finally {
  setTaskBusy(false);
}


}

async function addProjectTask() {
if (!selectedProject || taskBusy) return;


const title = window.prompt(
  `Nueva tarea para "${selectedProject.name}":`,
);

if (!title?.trim()) return;

setTaskBusy(true);
setTaskError("");

try {
  await createTask(title.trim(), selectedProject.id);
  await refreshTasks();
} catch (error) {
  console.error("Error creando tarea del proyecto:", error);
  setTaskError("No se pudo crear la tarea del proyecto.");
} finally {
  setTaskBusy(false);
}


}

async function toggleTask(id: string) {
const task = tasks.find((item) => item.id === id);


if (!task || taskBusy) return;

setTaskBusy(true);
setTaskError("");

try {
  await setTaskDone(id, !task.done);
  await refreshTasks();
} catch (error) {
  console.error("Error actualizando tarea:", error);
  setTaskError("No se pudo actualizar la tarea.");
} finally {
  setTaskBusy(false);
}


}

async function removeTask(id: string) {
const task = tasks.find((item) => item.id === id);


if (!task || taskBusy) return;

const confirmed = window.confirm(
  `¿Seguro que quieres eliminar "${task.title}"?`,
);

if (!confirmed) return;

setTaskBusy(true);
setTaskError("");

try {
  await deleteTask(id);
  await refreshTasks();
} catch (error) {
  console.error("Error eliminando tarea:", error);
  setTaskError("No se pudo eliminar la tarea.");
} finally {
  setTaskBusy(false);
}


}

function navigateTo(label: string) {
setSelectedProject(null);
setActiveNav(label);
setSidebarOpen(false);
setTaskError("");
}

return ( <div className="min-h-screen bg-[#f7f7fb] text-[#28253d]">
{sidebarOpen && (
<button
type="button"
aria-label="Cerrar menú"
onClick={() => setSidebarOpen(false)}
className="fixed inset-0 z-40 bg-black/30 lg:hidden"
/>
)}


  <aside
    className={`fixed inset-y-0 left-0 z-50 flex w-[258px] flex-col bg-[#28243e] px-5 py-6 text-white transition-transform lg:translate-x-0 ${
      sidebarOpen ? "translate-x-0" : "-translate-x-full"
    }`}
  >
    <div className="mb-10 flex items-center justify-between gap-3 px-2">
      <button
        type="button"
        onClick={() => navigateTo("Dashboard")}
        className="flex items-center gap-3 text-left"
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#a38bff] text-[#28243e]">
          <Layers3 size={23} />
        </div>

        <div>
          <h1 className="text-xl font-bold tracking-tight">
            syntropy
          </h1>
          <p className="text-xs text-white/50">
            Tu espacio personal
          </p>
        </div>
      </button>

      <button
        type="button"
        className="lg:hidden"
        onClick={() => setSidebarOpen(false)}
        aria-label="Cerrar menú"
      >
        <X size={20} />
      </button>
    </div>

    <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">
      Workspace
    </p>

    <nav className="flex flex-col gap-1">
      {navigation.map(({ label, icon: Icon }) => {
        const isActive = selectedProject
          ? label === "Proyectos" && activeNav === "Proyectos"
          : activeNav === label;

        return (
          <button
            key={label}
            type="button"
            onClick={() => navigateTo(label)}
            className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
              isActive
                ? "bg-[#a38bff] font-semibold text-[#28243e]"
                : "text-white/65 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon size={18} />
            <span>{label}</span>

            {label === "Tareas" && (
              <span className="ml-auto text-xs">
                {pending}
              </span>
            )}

            {label === "Proyectos" && (
              <span className="ml-auto text-xs">
                {projectCount}
              </span>
            )}
          </button>
        );
      })}
    </nav>

    <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-3 flex items-center gap-2 text-[#c6b6ff]">
        <Flame size={19} />
        <span className="text-sm font-semibold">
          Sigue avanzando
        </span>
      </div>

      <p className="mb-4 text-xs leading-5 text-white/55">
        Cada pequeño paso cuenta. Organiza tu día y alcanza tus
        objetivos.
      </p>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-[65%] rounded-full bg-[#a38bff]" />
      </div>

      <p className="mt-2 text-right text-[10px] text-white/45">
        Tu progreso personal
      </p>
    </div>

    <button
      type="button"
      onClick={() => navigateTo("Configuración")}
      className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 hover:bg-white/10"
    >
      <Settings size={18} />
      Configuración
    </button>
  </aside>

  <main className="min-h-screen lg:ml-[258px]">
    <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eae8f2] bg-[#f7f7fb]/90 px-5 backdrop-blur-xl sm:px-8">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="rounded-xl border border-[#e8e5f0] bg-white p-2 lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu size={19} />
        </button>

        <div className="min-w-0">
          <p className="truncate text-xs text-[#89869d]">
            Tu espacio / {selectedProject ? "Proyectos" : "Hoy"}
          </p>

          <h2 className="truncate text-lg font-bold">
            {selectedProject
              ? selectedProject.name
              : activeNav}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <label className="hidden items-center gap-2 rounded-xl border border-[#e8e5f0] bg-white px-3 py-2.5 sm:flex">
          <Search size={17} className="text-[#9692a8]" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar tareas..."
            className="w-36 bg-transparent text-sm outline-none placeholder:text-[#aaa6b8]"
          />
        </label>

        <button
          type="button"
          aria-label="Notificaciones"
          className="rounded-xl border border-[#e8e5f0] bg-white p-2.5 text-[#716d84]"
        >
          <Bell size={18} />
        </button>

        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#ffe3d1] text-sm font-bold text-[#9b5a36]">
          R
        </div>
      </div>
    </header>

    <div className="mx-auto max-w-[1440px] space-y-8 p-5 sm:p-8">
      {taskError && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{taskError}</span>

          <button
            type="button"
            onClick={() => void refreshTasks()}
            className="font-semibold underline"
          >
            Reintentar
          </button>
        </div>
      )}

      {selectedProject ? (
        <ProjectDetails
          project={selectedProject}
          tasks={tasks.filter(
            (task) => task.projectId === selectedProject.id,
          )}
          loading={tasksLoading}
          busy={taskBusy}
          onBack={() => setSelectedProject(null)}
          onCreateTask={() => void addProjectTask()}
          onToggleTask={(id) => void toggleTask(id)}
          onDeleteTask={(id) => void removeTask(id)}
        />
      ) : (
        <>
          {activeNav === "Dashboard" && (
            <>
              <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-r from-[#ded5ff] via-[#eee8ff] to-[#d9f5e9] p-7 sm:p-9">
                <div className="relative z-10 max-w-xl">
                  <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-[#7460bb]">
                    TU PRODUCTIVIDAD, A TU MANERA
                  </p>

                  <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">
                    Un paso a la vez.
                    <br />
                    Grandes cosas suceden.
                  </h3>

                  <p className="mt-3 max-w-md text-sm leading-6 text-[#6c6883]">
                    Organiza tus proyectos, enfócate en lo importante
                    y convierte tus objetivos en progreso real.
                  </p>

                  <button
                    type="button"
                    onClick={() => void addTask()}
                    disabled={taskBusy}
                    className="mt-6 flex items-center gap-2 rounded-xl bg-[#302a49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#494065] disabled:cursor-wait disabled:opacity-60"
                  >
                    <Plus size={17} />
                    Nueva tarea
                  </button>
                </div>

                <div className="pointer-events-none absolute -right-8 -top-16 h-64 w-64 rounded-full border-[36px] border-white/25 sm:right-12 sm:top-[-70px] sm:h-80 sm:w-80" />

                <div className="pointer-events-none absolute bottom-[-85px] right-24 h-52 w-52 rounded-full bg-white/25 blur-2xl" />
              </section>

              <section>
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg font-bold">
                      Tu resumen
                    </h3>

                    <p className="mt-1 text-sm text-[#89869d]">
                      Una vista rápida de tu actividad.
                    </p>
                  </div>

                  <span className="text-xs text-[#89869d]">
                    {tasksLoading
                      ? "Cargando datos..."
                      : "Datos de SQLite"}
                  </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  <StatCard
                    title="Tareas pendientes"
                    value={String(pending)}
                    subtitle="Por completar"
                    icon={CheckSquare}
                    color="bg-[#eee8ff] text-[#7959dc]"
                    trend="Organiza tu día"
                  />

                  <StatCard
                    title="Completadas"
                    value={String(completed)}
                    subtitle="Tareas finalizadas"
                    icon={CircleCheck}
                    color="bg-[#ddf7e9] text-[#29966c]"
                    trend="Buen trabajo"
                  />

                  <StatCard
                    title="Proyectos activos"
                    value={String(projectCount)}
                    subtitle="Proyectos guardados"
                    icon={FolderKanban}
                    color="bg-[#ffeadb] text-[#d47d3b]"
                    trend="Sigue progresando"
                  />

                  <StatCard
                    title="Tiempo registrado"
                    value="0 h"
                    subtitle="Hoy"
                    icon={Clock3}
                    color="bg-[#dff1ff] text-[#478dc4]"
                    trend="Registra tu tiempo"
                  />
                </div>
              </section>
            </>
          )}

          {(activeNav === "Dashboard" ||
            activeNav === "Tareas" ||
            activeNav === "Proyectos") && (
            <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
              <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold">
                      {activeNav === "Proyectos"
                        ? "Mis tareas personales"
                        : "Mis tareas"}
                    </h3>

                    <p className="mt-1 text-xs text-[#918da3]">
                      Lo que tienes entre manos
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => void addTask()}
                    disabled={taskBusy}
                    className="flex items-center gap-1 rounded-lg bg-[#f0ebff] px-3 py-2 text-xs font-semibold text-[#7556d5] hover:bg-[#e7dfff] disabled:opacity-50"
                  >
                    <Plus size={15} />
                    Añadir
                  </button>
                </div>

                {tasksLoading ? (
                  <div className="space-y-3 py-5">
                    <div className="h-12 animate-pulse rounded-xl bg-[#f5f3fa]" />
                    <div className="h-12 animate-pulse rounded-xl bg-[#f5f3fa]" />
                    <div className="h-12 animate-pulse rounded-xl bg-[#f5f3fa]" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {visibleTasks
                      .filter((task) =>
                        activeNav === "Proyectos"
                          ? task.projectId === null
                          : true,
                      )
                      .map((task) => (
                        <div
                          key={task.id}
                          className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#faf9fd]"
                        >
                          <button
                            type="button"
                            onClick={() => void toggleTask(task.id)}
                            disabled={taskBusy}
                            aria-label={
                              task.done
                                ? "Reabrir tarea"
                                : "Completar tarea"
                            }
                            className={`shrink-0 disabled:opacity-50 ${
                              task.done
                                ? "text-[#39ad82]"
                                : "text-[#c3bfd1]"
                            }`}
                          >
                            {task.done ? (
                              <CircleCheck size={21} />
                            ) : (
                              <Circle size={21} />
                            )}
                          </button>

                          <div className="min-w-0 flex-1">
                            <p
                              className={`truncate text-sm font-medium ${
                                task.done
                                  ? "text-[#a5a1b3] line-through"
                                  : "text-[#39354e]"
                              }`}
                            >
                              {task.title}
                            </p>

                            <p className="mt-1 text-xs text-[#9692a7]">
                              {task.project}
                            </p>
                          </div>

                          <span
                            className="shrink-0 rounded-lg px-2 py-1 text-[10px] font-semibold"
                            style={{
                              background:
                                task.priority === "Urgente" ||
                                task.priority === "Alta"
                                  ? "#ffe5e5"
                                  : task.priority === "Media"
                                    ? "#fff0d9"
                                    : "#e5f7eb",
                              color:
                                task.priority === "Urgente" ||
                                task.priority === "Alta"
                                  ? "#c65a5a"
                                  : task.priority === "Media"
                                    ? "#b27a24"
                                    : "#34845b",
                            }}
                          >
                            {task.priority}
                          </span>

                          <button
                            type="button"
                            onClick={() => void removeTask(task.id)}
                            disabled={taskBusy}
                            aria-label={`Eliminar ${task.title}`}
                            title="Eliminar tarea"
                            className="shrink-0 rounded-lg p-2 text-[#aaa6b8] transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      ))}

                    {visibleTasks.filter((task) =>
                      activeNav === "Proyectos"
                        ? task.projectId === null
                        : true,
                    ).length === 0 && (
                      <div className="py-8 text-center">
                        <CheckSquare
                          size={28}
                          className="mx-auto mb-3 text-[#c3bfd1]"
                        />

                        <p className="text-sm font-medium text-[#77728e]">
                          {search
                            ? "No se encontraron tareas."
                            : "Todavía no tienes tareas."}
                        </p>

                        <p className="mt-1 text-xs text-[#9692a7]">
                          {search
                            ? "Prueba con otro término de búsqueda."
                            : "Crea una tarea para empezar a organizarte."}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigateTo("Tareas")}
                  className="mt-4 flex w-full items-center justify-center gap-2 border-t border-[#f0eef5] pt-4 text-xs font-semibold text-[#817b9b] hover:text-[#7556d5]"
                >
                  Ver todas las tareas
                  <ArrowUpRight size={15} />
                </button>
              </div>

              <ProjectsPanel
                onProjectsChange={setProjectCount}
                onOpenProjects={() => {
                  setSelectedProject(null);
                  setActiveNav("Proyectos");
                }}
                onOpenProject={(project) => {
                  setSelectedProject(project);
                  setActiveNav("Proyectos");
                  setTaskError("");
                }}
              />
            </section>
          )}

          {activeNav !== "Dashboard" &&
            activeNav !== "Tareas" &&
            activeNav !== "Proyectos" && (
              <section className="rounded-2xl border border-[#eceaf3] bg-white p-8 sm:p-12">
                <div className="mx-auto max-w-md text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eee8ff] text-[#7959dc]">
                    {activeNav === "Calendario" ? (
                      <CalendarDays size={26} />
                    ) : activeNav === "Notas" ? (
                      <NotebookPen size={26} />
                    ) : activeNav === "Hábitos y objetivos" ? (
                      <Target size={26} />
                    ) : activeNav === "Configuración" ? (
                      <Settings size={26} />
                    ) : (
                      <Clock3 size={26} />
                    )}
                  </div>

                  <h3 className="mt-5 text-xl font-bold">
                    {activeNav}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#9692a7]">
                    Esta sección todavía está en desarrollo.
                    Puedes seguir gestionando tus tareas y proyectos
                    desde el dashboard.
                  </p>

                  <button
                    type="button"
                    onClick={() => navigateTo("Dashboard")}
                    className="mt-6 rounded-xl bg-[#302a49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#494065]"
                  >
                    Volver al dashboard
                  </button>
                </div>
              </section>
            )}

          <footer className="pb-2 text-center text-xs text-[#aaa6b8]">
            Syntropy · Organiza tu presente, construye tu futuro.
          </footer>
        </>
      )}
    </div>
  </main>
</div>


);
}

type StatCardProps = {
title: string;
value: string;
subtitle: string;
icon: typeof CheckSquare;
color: string;
trend: string;
};

function StatCard({
title,
value,
subtitle,
icon: Icon,
color,
trend,
}: StatCardProps) {
return ( <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#33215b]/5"> <div className="mb-5 flex items-start justify-between gap-3"> <div> <p className="text-xs font-medium text-[#89869d]">{title}</p> <p className="mt-2 text-3xl font-bold tracking-tight">
{value} </p> </div>


    <div className={`rounded-xl p-3 ${color}`}>
      <Icon size={20} />
    </div>
  </div>

  <div className="flex items-center justify-between gap-2">
    <span className="text-xs text-[#9692a7]">{subtitle}</span>
    <span className="text-[10px] font-medium text-[#8a85a1]">
      {trend}
    </span>
  </div>
</div>


);
}
