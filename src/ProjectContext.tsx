import { createContext, FC, ReactNode, useEffect, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { CardTemplateProps, ProjectProps } from "./types"

const defaultProject: ProjectProps = {
  id: uuidv4(),
  name: "Untitled Project",
  pageClassName: "",
  cardTemplates: [],
  cardInstances: [],
}

const ProjectContext = createContext<{
  project: ProjectProps | null
  handleProjectChange?: (project: ProjectProps) => void

  importProject?: () => void
  exportProject?: () => void
  saveProject?: () => void

  addCardTemplate?: () => void
  editCardTemplate?: (cardTemplate: CardTemplateProps) => void
  removeCardTemplate?: (cardTemplateId: string) => void
  addCardInstance?: () => void
}>({
  project: null,
})

export const ProjectProvider: FC<{ children: ReactNode }> = ({ children }) => {
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

  const handleProjectChange = (newProject: ProjectProps) => {
    setProject(newProject)
  }

  const saveProject = () => {
    localStorage.setItem("project", JSON.stringify(project))
  }

  return (
    <ProjectContext.Provider
      value={{ project, handleProjectChange, saveProject }}
    >
      {children}
    </ProjectContext.Provider>
  )
}

export default ProjectContext
