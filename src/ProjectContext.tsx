import mustache from "mustache"
import { createContext, FC, ReactNode, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import {
  CardInstanceProps,
  CardTemplateProps,
  ListType,
  ProjectProps,
  RenderedCardsProps,
} from "./types"

const defaultProject: ProjectProps = {
  id: uuidv4(),
  name: "Untitled Project",
  pageClassName: "",
  cardTemplates: [],
  cardInstances: [],
}
const defaultCardTemplateContent = `
<div class="w-[63mm] min-h-[30mm] border border-black text-center text-[8pt]">
  <div class="text-[12pt] font-bold">{{title}}</div>
  <div>{{body}}</div>
</div>
`.trim()

type ProjectContextProps = {
  project: ProjectProps | null
  handleProjectChange?: (updates: Partial<ProjectProps>) => void

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
})

export const ProjectProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [project, setProject] = useState<ProjectProps | null>(null)

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

  useEffect(() => {
    const raw = localStorage.getItem("project") || ""
    try {
      const saved = JSON.parse(raw)
      setProject(saved)
    } catch {
      setProject(defaultProject)
    }
  }, [])

  const handleProjectChange: ProjectContextProps["handleProjectChange"] = (
    updates,
  ) => {
    const newProject = Object.assign({}, project || defaultProject, updates)
    if (updates["cardInstances"]) {
      newProject.cardInstances.sort(
        (a, b) =>
          (a.folder || "~").charCodeAt(0) - (b.folder || "~").charCodeAt(0) ||
          a.name.localeCompare(b.name),
      )
    }
    setProject(newProject)
    localStorage.setItem("project", JSON.stringify(newProject))
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
        handleProjectChange,
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
