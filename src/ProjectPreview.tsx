import { Box } from "@chakra-ui/react"
import { Fragment, useContext } from "react"
import ProjectContext from "./ProjectContext"

function ProjectPreview() {
  const { project, renderedCards } = useContext(ProjectContext)

  return (
    <Box id="page" className={project?.pageClassName}>
      {renderedCards
        .filter((card) => card.content && !card.isHidden)
        .map((card) => (
          <Fragment key={card.cardInstanceId}>
            {Array.from({ length: card.amount }).map((_, index) => (
              <Box
                key={index}
                dangerouslySetInnerHTML={{ __html: card.content }}
              />
            ))}
          </Fragment>
        ))}
    </Box>
  )
}

export default ProjectPreview
