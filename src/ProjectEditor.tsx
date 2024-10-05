import { Box, Button, Flex, HStack } from "@chakra-ui/react"
import { useContext } from "react"
import CardInstanceForm from "./CardInstanceForm"
import CardTemplateForm from "./CardTemplateForm"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import ProjectSettingForm from "./ProjectSettingForm"

function ProjectEditor() {
  const { project } = useContext(ProjectContext)

  if (!project) {
    return <Loading />
  }

  return (
    <>
      <Box flexGrow={1} p="1rem" overflowY="auto">
        <Flex direction="column" gap="1rem">
          <ProjectSettingForm />
          <CardTemplateForm />
          <CardInstanceForm />
        </Flex>
      </Box>

      <HStack flexShrink={0} p="1rem">
        <Button>Import</Button>
        <Button>Export</Button>
      </HStack>
    </>
  )
}

export default ProjectEditor
