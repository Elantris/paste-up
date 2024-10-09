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
  pageClassName: "w-[210mm] h-fit min-h-[297mm] p-[0.39in] bg-white text-black",
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
  updateListItem?: (
    ListType: ListType,
    id: string,
    updates: Partial<CardTemplateProps | CardInstanceProps>,
  ) => void
  removeListItem?: (listType: ListType, id: string) => void
  renderedCards: RenderedCardsProps[]
}

const ProjectContext = createContext<ProjectContextProps>({
  project: null,
  renderedCards: [],
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
          return [
            ...prev,
            {
              cardInstanceId: cardInstance.id,
              content: mustache.render(
                cardTemplate.content,
                cardInstance.attributes,
              ),
              amount: cardInstance.amount,
              isHidden: cardInstance.isHidden,
            },
          ]
        } catch {
          return [
            ...prev,
            {
              cardInstanceId: cardInstance.id,
              content: "",
              amount: 0,
              isError: true,
            },
          ]
        }
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

  const updateListItem: ProjectContextProps["updateListItem"] = (
    listType,
    id,
    updates,
  ) => {
    if (!project?.[listType]) {
      return
    }
    handleProjectChange({
      [listType]: project[listType].map((item) =>
        item.id === id ? Object.assign({}, item, updates) : item,
      ),
    })
  }

  const removeListItem: ProjectContextProps["removeListItem"] = (
    listType,
    id,
  ) => {
    if (!project?.[listType]) {
      return
    }
    handleProjectChange({
      [listType]: project[listType].filter((item) => item.id !== id),
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
        updateListItem,
        removeListItem,
        renderedCards,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
