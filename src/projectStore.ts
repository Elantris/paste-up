import { v4 as uuidv4 } from "uuid"
import { exampleProjects } from "./examples"
import type { ProjectProps } from "./types"

export type ProjectStore = {
  activeProjectId: string
  projects: ProjectProps[]
}

// Every GitHub Pages site under elantris.github.io shares this localStorage.
const STORE_KEY = "paste-up"
// Holds one project; read only while STORE_KEY is empty.
const LEGACY_PROJECT_KEY = "project"

export const createEmptyProject = (name: string): ProjectProps => ({
  id: uuidv4(),
  name,
  pageClassName: "",
  cardTemplates: [],
  cardInstances: [],
})

const isProject = (value: unknown): value is ProjectProps =>
  !!value &&
  typeof value === "object" &&
  Array.isArray((value as ProjectProps).cardTemplates) &&
  Array.isArray((value as ProjectProps).cardInstances)

export const toNewProject = (
  source: Partial<ProjectProps>,
  takenIds: string[],
): ProjectProps => {
  const project = structuredClone(source)
  return {
    id: project.id && !takenIds.includes(project.id) ? project.id : uuidv4(),
    name: project.name || "Untitled Project",
    pageClassName: project.pageClassName ?? "",
    cardTemplates: project.cardTemplates ?? [],
    cardInstances: project.cardInstances ?? [],
  }
}

const readJson = (key: string): unknown => {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "")
  } catch {
    return null
  }
}

const storeOf = (project: ProjectProps): ProjectStore => ({
  activeProjectId: project.id,
  projects: [project],
})

export const loadProjectStore = (): ProjectStore => {
  const saved = readJson(STORE_KEY) as Partial<ProjectStore> | null
  const projects = Array.isArray(saved?.projects)
    ? saved.projects.filter(isProject)
    : []
  if (projects.length) {
    const activeProject =
      projects.find((project) => project.id === saved?.activeProjectId) ??
      projects[0]
    return { activeProjectId: activeProject.id, projects }
  }

  const legacyProject = readJson(LEGACY_PROJECT_KEY)
  if (isProject(legacyProject)) {
    return storeOf(toNewProject(legacyProject, []))
  }

  return storeOf(toNewProject(exampleProjects[0].project, []))
}

export const saveProjectStore = (store: ProjectStore) => {
  localStorage.setItem(STORE_KEY, JSON.stringify(store))
}
