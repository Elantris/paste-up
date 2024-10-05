import { AddIcon } from "@chakra-ui/icons"
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Skeleton,
  Stack,
} from "@chakra-ui/react"
import { useContext } from "react"
import ProjectContext from "./ProjectContext"

function ProjectEditor() {
  const { project, saveProject } = useContext(ProjectContext)

  if (!project) {
    return (
      <Stack>
        <Skeleton height="20px" />
        <Skeleton height="20px" />
        <Skeleton height="20px" />
      </Stack>
    )
  }

  return (
    <>
      <Box flexGrow={1} p="1rem" overflowY="auto">
        <Flex direction="column" gap="1rem">
          <Stack bg="gray.600" p="1rem">
            <Heading size="md" color="blue.300">
              Project Setting
            </Heading>
            <Divider />
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input type="text" defaultValue={project.name} />
            </FormControl>
            <FormControl>
              <FormLabel>Page Class Name</FormLabel>
              <Input type="text" defaultValue={project.pageClassName} />
            </FormControl>
          </Stack>

          <Stack bg="gray.600" p="1rem">
            <Heading size="md" color="blue.300">
              Card Templates
            </Heading>
            <Divider />
            {project.cardTemplates.map((cardTemplate) => (
              <div key={cardTemplate.id}>{cardTemplate.name}</div>
            ))}
            <Button leftIcon={<AddIcon />}>Add</Button>
          </Stack>

          <Stack bg="gray.600" p="1rem">
            <Heading size="md" color="blue.300">
              Card Instances
            </Heading>
            <Divider />
            {project.cardInstances.map((cardInstance) => (
              <div key={cardInstance.id}>{cardInstance.name}</div>
            ))}
            <Button leftIcon={<AddIcon />}>Add</Button>
          </Stack>
        </Flex>
      </Box>

      <HStack flexShrink={0} p="1rem">
        <Button>Import</Button>
        <Button>Export</Button>
        <Button>Reset</Button>
        <Button colorScheme="blue" onClick={() => saveProject}>
          Save
        </Button>
      </HStack>
    </>
  )
}

export default ProjectEditor
