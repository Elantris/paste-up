import { createContext, FC, ReactNode, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CardInstanceProps, CardTemplateProps, ProjectProps } from "./types"
import { getMaxIndex } from "./utils"

const defaultProject: ProjectProps = {
  id: uuidv4(),
  name: "Untitled Project",
  pageClassName: "",
  cardTemplates: [],
  cardInstances: [],
}

type ProjectContextProps = {
  project: ProjectProps | null
  handleProjectChange?: (updates: Partial<ProjectProps>) => void
  importProject?: () => void
  exportProject?: () => void

  createCardTemplate?: (cardTemplateId?: string) => void
  updateCardTemplate?: (
    cardTemplateId: string,
    updates: Partial<CardTemplateProps>,
  ) => void
  removeCardTemplate?: (cardTemplateId: string) => void

  createCardInstance?: () => void
  updateCardInstance?: (cardInstance: Partial<CardInstanceProps>) => void
  removeCardInstance?: (cardInstanceId: string) => void
}

const ProjectContext = createContext<ProjectContextProps>({
  project: null,
})

export const ProjectProvider: FC<{
  children: ReactNode
}> = ({ children }) => {
  const [project, setProject] = useState<ProjectProps | null>(null)

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

    const maxIndex = getMaxIndex(
      project?.cardTemplates.map((cardTemplate) => cardTemplate.name) || [],
      targetCardTemplate
        ? new RegExp(`^${targetCardTemplate.name} (\\d+)$`)
        : /^Untitled (\d+)$/,
    )

    const newCardTemplate: CardTemplateProps = targetCardTemplate
      ? {
          id: uuidv4(),
          name: `${targetCardTemplate.name} ${maxIndex + 1}`,
          content: targetCardTemplate.content,
        }
      : {
          id: uuidv4(),
          name: `Untitled ${maxIndex + 1}`,
          content: "<div></div>",
        }

    handleProjectChange({
      cardTemplates: [...(project?.cardTemplates || []), newCardTemplate],
    })
  }
  const updateCardTemplate: ProjectContextProps["updateCardTemplate"] = (
    cardTemplateId,
    updates,
  ) => {
    handleProjectChange({
      cardTemplates: project?.cardTemplates.map((cardTemplate) =>
        cardTemplate.id === cardTemplateId
          ? Object.assign({}, cardTemplate, updates)
          : cardTemplate,
      ),
    })
  }
  const removeCardTemplate: ProjectContextProps["removeCardTemplate"] = (
    cardTemplateId,
  ) => {
    handleProjectChange({
      cardTemplates: project?.cardTemplates.filter(
        (cardTemplate) => cardTemplate.id !== cardTemplateId,
      ),
    })
  }

  return (
    <ProjectContext.Provider
      value={{
        project,
        handleProjectChange,
        createCardTemplate,
        updateCardTemplate,
        removeCardTemplate,
      }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
