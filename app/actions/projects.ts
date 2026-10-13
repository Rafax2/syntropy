"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

const PROJECT_COLORS = [
"#A78BFA",
"#F9A8D4",
"#86EFAC",
"#93C5FD",
"#FDBA74",
];

export async function getProjects() {
const projects = await prisma.project.findMany({
include: {
tasks: {
select: {
id: true,
status: true,
},
},
},
orderBy: {
createdAt: "desc",
},
});

return projects.map((project) => {
const completedTasks = project.tasks.filter(
(task) => task.status === "DONE",
).length;


return {
  id: project.id,
  name: project.name,
  description: project.description,
  color: project.color,
  createdAt: project.createdAt.toISOString(),
  totalTasks: project.tasks.length,
  completedTasks,
  progress:
    project.tasks.length === 0
      ? 0
      : Math.round(
          (completedTasks / project.tasks.length) * 100,
        ),
};


});
}

export async function createProject(
name: string,
description = "",
color = PROJECT_COLORS[0],
) {
const cleanName = name.trim();
const cleanDescription = description.trim();

if (!cleanName || cleanName.length > 100) {
throw new Error(
"El nombre debe tener entre 1 y 100 caracteres.",
);
}

if (cleanDescription.length > 1000) {
throw new Error(
"La descripción no puede superar los 1000 caracteres.",
);
}

const safeColor = PROJECT_COLORS.includes(color)
  ? color
  : PROJECT_COLORS[0];

const project = await prisma.project.create({
data: {
name: cleanName,
description: cleanDescription,
color: safeColor,
},
});

revalidatePath("/");

return {
id: project.id,
name: project.name,
};
}

export async function deleteProject(id: string) {
if (!id || typeof id !== "string") {
throw new Error("El proyecto seleccionado no es válido.");
}

await prisma.project.delete({
where: { id },
});

revalidatePath("/");

return { success: true };
}
