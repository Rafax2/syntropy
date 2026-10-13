"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function getTasks() {
  const tasks = await prisma.task.findMany({
    include: { project: true },
    orderBy: { createdAt: "desc" },
  });

  return tasks.map((task) => ({
    id: task.id,
    title: task.title,
    project: task.project?.name ?? "Personal",
    projectId: task.projectId,
    priority:
      task.priority === "URGENT"
        ? "Urgente"
        : task.priority === "HIGH"
          ? "Alta"
          : task.priority === "LOW"
            ? "Baja"
            : "Media",
    color: "#ede7ff",
    done: task.status === "DONE",
  }));
}

export async function createTask(
  title: string,
  projectId?: string | null,
) {
  const cleanTitle = title.trim();

  if (!cleanTitle || cleanTitle.length > 200) {
    throw new Error("El título debe tener entre 1 y 200 caracteres.");
  }

  if (projectId) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!project) {
      throw new Error("El proyecto seleccionado no existe.");
    }
  }

  await prisma.task.create({
    data: {
      title: cleanTitle,
      priority: "MEDIUM",
      status: "TODO",
      projectId: projectId || null,
    },
  });

  revalidatePath("/");
}

export async function setTaskDone(id: string, done: boolean) {
  await prisma.task.update({
    where: { id },
    data: {
      status: done ? "DONE" : "TODO",
    },
  });

  revalidatePath("/");
}

export async function deleteTask(id: string) {
  await prisma.task.delete({
    where: { id },
  });

  revalidatePath("/");
}