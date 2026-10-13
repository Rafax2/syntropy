
"use client";

import { useState } from "react";
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
} from "lucide-react";

const initialTasks = [
  {
    id: 1,
    title: "Avanzar en mi proyecto de programación",
    project: "Desarrollo",
    priority: "Alta",
    color: "#ede7ff",
    done: false,
  },
  {
    id: 2,
    title: "Estudiar para la universidad",
    project: "Universidad",
    priority: "Media",
    color: "#dff7eb",
    done: false,
  },
  {
    id: 3,
    title: "Revisar pendientes del trabajo",
    project: "Trabajo",
    priority: "Baja",
    color: "#ffeddc",
    done: true,
  },
];

const projects = [
  {
    name: "Syntropy",
    description: "Mi centro de productividad",
    progress: 35,
    color: "#9475ff",
    icon: Layers3,
  },
  {
    name: "Universidad",
    description: "Estudios y entregas",
    progress: 68,
    color: "#38b98a",
    icon: NotebookPen,
  },
  {
    name: "Proyectos personales",
    description: "Ideas y desarrollo",
    progress: 48,
    color: "#f5a64a",
    icon: Target,
  },
];

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
  const [tasks, setTasks] = useState(initialTasks);
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const completed = tasks.filter((task) => task.done).length;
  const pending = tasks.filter((task) => !task.done).length;

  const visibleTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  }

  function addTask() {
    const title = window.prompt("¿Qué tarea quieres añadir?");
    if (!title?.trim()) return;

    setTasks((current) => [
      ...current,
      {
        id: Date.now(),
        title: title.trim(),
        project: "Personal",
        priority: "Media",
        color: "#ede7ff",
        done: false,
      },
    ]);
  }

  return (
    <div className="min-h-screen bg-[#f7f7fb] text-[#28253d]">
      {sidebarOpen && (
        <button
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
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#a38bff] text-[#28243e]">
              <Layers3 size={23} />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">syntropy</h1>
              <p className="text-xs text-white/50">Tu espacio personal</p>
            </div>
          </div>
          <button
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
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              onClick={() => {
                setActiveNav(label);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition ${
                activeNav === label
                  ? "bg-[#a38bff] font-semibold text-[#28243e]"
                  : "text-white/65 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === "Tareas" && (
                <span className="ml-auto text-xs">{pending}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-3 flex items-center gap-2 text-[#c6b6ff]">
            <Flame size={19} />
            <span className="text-sm font-semibold">Sigue avanzando</span>
          </div>
          <p className="mb-4 text-xs leading-5 text-white/55">
            Cada pequeño paso cuenta. Organiza tu día y alcanza tus objetivos.
          </p>
          <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[65%] rounded-full bg-[#a38bff]" />
          </div>
          <p className="mt-2 text-right text-[10px] text-white/45">
            Tu progreso personal
          </p>
        </div>

        <button className="mt-4 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-white/60 hover:bg-white/10">
          <Settings size={18} />
          Configuración
        </button>
      </aside>

      <main className="min-h-screen lg:ml-[258px]">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-[#eae8f2] bg-[#f7f7fb]/90 px-5 backdrop-blur-xl sm:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-xl border border-[#e8e5f0] bg-white p-2 lg:hidden"
              aria-label="Abrir menú"
            >
              <Menu size={19} />
            </button>
            <div>
              <p className="text-xs text-[#89869d]">Tu espacio / Hoy</p>
              <h2 className="text-lg font-bold">{activeNav}</h2>
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
                Organiza tus proyectos, enfócate en lo importante y convierte
                tus objetivos en progreso real.
              </p>
              <button
                onClick={addTask}
                className="mt-6 flex items-center gap-2 rounded-xl bg-[#302a49] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#494065]"
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
                <h3 className="text-lg font-bold">Tu resumen</h3>
                <p className="mt-1 text-sm text-[#89869d]">
                  Una vista rápida de tu actividad.
                </p>
              </div>
              <span className="text-xs text-[#89869d]">Datos de ejemplo</span>
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
                subtitle="En esta sesión"
                icon={CircleCheck}
                color="bg-[#ddf7e9] text-[#29966c]"
                trend="Buen trabajo"
              />
              <StatCard
                title="Proyectos activos"
                value="3"
                subtitle="En marcha"
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

          <section className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
            <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <h3 className="font-bold">Mis tareas</h3>
                  <p className="mt-1 text-xs text-[#918da3]">
                    Lo que tienes entre manos
                  </p>
                </div>
                <button
                  onClick={addTask}
                  className="flex items-center gap-1 rounded-lg bg-[#f0ebff] px-3 py-2 text-xs font-semibold text-[#7556d5] hover:bg-[#e7dfff]"
                >
                  <Plus size={15} />
                  Añadir
                </button>
              </div>

              <div className="space-y-2">
                {visibleTasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 rounded-xl p-3 transition hover:bg-[#faf9fd]"
                  >
                    <button
                      onClick={() => toggleTask(task.id)}
                      aria-label={
                        task.done ? "Reabrir tarea" : "Completar tarea"
                      }
                      className={
                        task.done ? "text-[#39ad82]" : "text-[#c3bfd1]"
                      }
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
                          task.priority === "Alta"
                            ? "#ffe5e5"
                            : task.priority === "Media"
                              ? "#fff0d9"
                              : "#e5f7eb",
                        color:
                          task.priority === "Alta"
                            ? "#c65a5a"
                            : task.priority === "Media"
                              ? "#b27a24"
                              : "#34845b",
                      }}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
                {visibleTasks.length === 0 && (
                  <p className="py-8 text-center text-sm text-[#9692a7]">
                    No se encontraron tareas.
                  </p>
                )}
              </div>

              <button
                onClick={() => setActiveNav("Tareas")}
                className="mt-4 flex w-full items-center justify-center gap-2 border-t border-[#f0eef5] pt-4 text-xs font-semibold text-[#817b9b] hover:text-[#7556d5]"
              >
                Ver todas las tareas
                <ArrowUpRight size={15} />
              </button>
            </div>

            <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-bold">Proyectos activos</h3>
                  <p className="mt-1 text-xs text-[#918da3]">
                    Tus objetivos en marcha
                  </p>
                </div>
                <button
                  onClick={() => setActiveNav("Proyectos")}
                  aria-label="Ver proyectos"
                  className="rounded-lg p-2 text-[#918da3] hover:bg-[#f5f2ff]"
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>

              <div className="space-y-5">
                {projects.map((project) => {
                  const Icon = project.icon;
                  return (
                    <div key={project.name}>
                      <div className="mb-3 flex items-center gap-3">
                        <div
                          className="flex h-10 w-10 items-center justify-center rounded-xl"
                          style={{
                            background: `${project.color}20`,
                            color: project.color,
                          }}
                        >
                          <Icon size={19} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold">
                            {project.name}
                          </p>
                          <p className="mt-1 truncate text-xs text-[#9692a7]">
                            {project.description}
                          </p>
                        </div>
                        <span className="text-xs font-bold text-[#77728e]">
                          {project.progress}%
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-[#f0eef6]">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${project.progress}%`,
                            background: project.color,
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => setActiveNav("Proyectos")}
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl border border-[#eceaf3] py-3 text-xs font-semibold text-[#77728e] hover:bg-[#faf9fd]"
              >
                Explorar proyectos
                <ArrowUpRight size={15} />
              </button>
            </div>
          </section>

          <footer className="pb-2 text-center text-xs text-[#aaa6b8]">
            Syntropy · Organiza tu presente, construye tu futuro.
          </footer>
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
  return (
    <div className="rounded-2xl border border-[#eceaf3] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#33215b]/5">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-[#89869d]">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
        </div>
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