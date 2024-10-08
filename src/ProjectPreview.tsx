import { Box } from "@chakra-ui/react"
import mustache from "mustache"
import { Fragment, useContext } from "react"
import ProjectContext from "./ProjectContext"

function ProjectPreview() {
  const { project } = useContext(ProjectContext)

  return (
    <Box id="page" className={project?.pageClassName}>
      {project?.cardInstances.map((cardInstance) => {
        const cardTemplate = project?.cardTemplates.find(
          (cardTemplate) => cardTemplate.id === cardInstance.cardTemplateId,
        )
        if (!cardTemplate || !cardInstance.amount) {
          return null
        }
        const content = mustache.render(
          cardTemplate.content,
          cardInstance.attributes,
        )

        return (
          <Fragment key={cardInstance.id}>
            {Array.from({ length: cardInstance.amount }).map((_, index) => (
              <Box
                key={index}
                display="inline-block"
                verticalAlign="top"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ))}
          </Fragment>
        )
      })}
    </Box>
  )
}

export default ProjectPreview
