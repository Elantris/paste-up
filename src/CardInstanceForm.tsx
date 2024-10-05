import { AddIcon } from "@chakra-ui/icons"
import { Button, Divider, Heading, Stack } from "@chakra-ui/react"
import { useContext } from "react"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"

const CardInstanceForm = () => {
  const { project } = useContext(ProjectContext)

  if (!project) {
    return <Loading />
  }

  return (
    <Stack bg="gray.600" p="1rem">
      <Heading size="lg" color="blue.300" userSelect="none">
        Card Instances
      </Heading>

      <Divider />

      {project.cardInstances.map((cardInstance) => (
        <div key={cardInstance.id}>{cardInstance.name}</div>
      ))}

      <Button leftIcon={<AddIcon />}>Add</Button>
    </Stack>
  )
}

export default CardInstanceForm
