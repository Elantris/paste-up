import mustache from "mustache"
import { createContext, useState, type FC, type ReactNode } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  createEmptyProject,
  loadProjectStore,
  saveProjectStore,
  toNewProject,
  type ProjectStore,
} from "./projectStore"
import type {
  CardInstanceProps,
  CardTemplateProps,
  ListType,
  ProjectProps,
  RenderedCardsProps,
} from "./types"

const defaultCardTemplateContent = `
<div class="w-[63mm] min-h-[30mm] border border-black text-center text-[8pt]">
  <div class="text-[12pt] font-bold">{{title}}</div>
  <div>{{body}}</div>
</div>
`.trim()

const compareFolderNames = (a = "", b = "") => {
  if (a === b) {
    return 0
  }
  if (!a) {
    return 1
  }
  if (!b) {
    return -1
  }
  return a.localeCompare(b)
}

type ProjectContextProps = {
  project: ProjectProps | null
  projects: ProjectProps[]
  handleProjectChange?: (updates: Partial<ProjectProps>) => void
  addProject?: (source?: Partial<ProjectProps>) => void
  switchProject?: (projectId: string) => void
  removeProject?: (projectId: string) => void

  createCardTemplate?: (cardTemplateId?: string) => void
  createCardInstance?: (cardInstance: Omit<CardInstanceProps, "id">) => void
  editListSorting?: (listType: ListType, from: number, to: number) => void
  updateListItems?: (
    ListType: ListType,
    updates: ({ id: string } & Partial<
      CardTemplateProps | CardInstanceProps
    >)[],
  ) => void
  removeListItems?: (listType: ListType, ids: string[]) => void
  renderedCards?: RenderedCardsProps[]
}

const ProjectContext = createContext<ProjectContextProps>({
  project: null,
  projects: [],
})

export const ProjectProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [store, setStore] = useState<ProjectStore>(loadProjectStore)
  const project =
    store.projects.find((item) => item.id === store.activeProjectId) ??
    store.projects[0]

  const commitStore = (nextStore: ProjectStore) => {
    setStore(nextStore)
    saveProjectStore(nextStore)
  }

  const renderedCards =
    project?.cardInstances.reduce<RenderedCardsProps[]>(
      (prev, cardInstance) => {
        const cardTemplate = project?.cardTemplates.find(
          (cardTemplate) => cardTemplate.id === cardInstance.cardTemplateId,
        )
        if (!cardTemplate || !cardInstance.amount) {
          return prev
        }

        try {
          prev.push({
            cardInstanceId: cardInstance.id,
            content: mustache.render(
              cardTemplate.content,
              cardInstance.attributes,
            ),
            amount: cardInstance.amount,
            isHidden: cardInstance.isHidden,
          })
        } catch {
          prev.push({
            cardInstanceId: cardInstance.id,
            content: "",
            amount: 0,
            isError: true,
          })
        }
        return prev
      },
      [],
    ) || []

  const handleProjectChange: ProjectContextProps["handleProjectChange"] = (
    updates,
  ) => {
    const newProject = { ...project, ...updates, id: project.id }
    if (updates["cardInstances"]) {
      newProject.cardInstances.sort(
        (a, b) =>
          compareFolderNames(a.folder, b.folder) ||
          a.name.localeCompare(b.name),
      )
    }
    commitStore({
      ...store,
      projects: store.projects.map((item) =>
        item.id === project.id ? newProject : item,
      ),
    })
  }

  const addProject: ProjectContextProps["addProject"] = (source) => {
    const newProject = source
      ? toNewProject(
          source,
          store.projects.map((item) => item.id),
        )
      : createEmptyProject()
    commitStore({
      activeProjectId: newProject.id,
      projects: [...store.projects, newProject],
    })
  }

  const switchProject: ProjectContextProps["switchProject"] = (projectId) => {
    if (store.projects.some((item) => item.id === projectId)) {
      commitStore({ ...store, activeProjectId: projectId })
    }
  }

  const removeProject: ProjectContextProps["removeProject"] = (projectId) => {
    const remaining = store.projects.filter((item) => item.id !== projectId)
    const projects = remaining.length ? remaining : [createEmptyProject()]
    commitStore({
      activeProjectId:
        store.activeProjectId === projectId
          ? projects[0].id
          : store.activeProjectId,
      projects,
    })
  }

  const createCardTemplate: ProjectContextProps["createCardTemplate"] = (
    cardTemplateId,
  ) => {
    const targetCardTemplate = cardTemplateId
      ? project?.cardTemplates.find(
          (cardTemplate) => cardTemplate.id === cardTemplateId,
        )
      : null

    const newCardTemplate: CardTemplateProps = {
      id: uuidv4(),
      name: targetCardTemplate?.name || "Untitled",
      content: targetCardTemplate?.content || defaultCardTemplateContent,
    }

    handleProjectChange({
      cardTemplates: [...(project?.cardTemplates || []), newCardTemplate],
    })
  }

  const createCardInstance: ProjectContextProps["createCardInstance"] = (
    cardInstance,
  ) => {
    const newCardInstance: CardInstanceProps = {
      ...cardInstance,
      id: uuidv4(),
    }

    handleProjectChange({
      cardInstances: [...(project?.cardInstances || []), newCardInstance],
    })
  }

  const editListSorting: ProjectContextProps["editListSorting"] = (
    listType,
    from,
    to,
  ) => {
    const target = project?.[listType]?.[from]
    if (!target) {
      return
    }
    const newList = project[listType].filter((_, index) => index !== from)
    newList.splice(to, 0, target)
    handleProjectChange({ [listType]: newList })
  }

  const updateListItems: ProjectContextProps["updateListItems"] = (
    listType,
    updates,
  ) => {
    if (!project?.[listType]) {
      return
    }
    const updatesMap = updates.reduce<
      Record<string, Partial<CardTemplateProps | CardInstanceProps>>
    >((prev, update) => {
      prev[update.id] = update
      return prev
    }, {})
    handleProjectChange({
      [listType]: project[listType].map((item) =>
        updatesMap[item.id]
          ? Object.assign({}, item, updatesMap[item.id])
          : item,
      ),
    })
  }

  const removeListItems: ProjectContextProps["removeListItems"] = (
    listType,
    ids,
  ) => {
    if (!project?.[listType]) {
      return
    }
    const idSet = new Set(ids)
    handleProjectChange({
      [listType]: project[listType].filter((item) => !idSet.has(item.id)),
    })
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        projects: store.projects,
        handleProjectChange,
        addProject,
        switchProject,
        removeProject,
        createCardTemplate,
        createCardInstance,
        editListSorting,
        updateListItems,
        removeListItems,
        renderedCards,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
