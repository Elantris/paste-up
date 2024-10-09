import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"

const ProjectSettingSection = () => {
  const { project, handleProjectChange } = useContext(ProjectContext)
  const nameRef = useRef<HTMLInputElement>(null)
  const pageClassNameRef = useRef<HTMLInputElement>(null)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  if (!project) {
    return <Loading />
  }

  const handleReset = () => {
    if (nameRef.current) {
      nameRef.current.value = project.name
    }
    if (pageClassNameRef.current) {
      pageClassNameRef.current.value = project.pageClassName
    }
  }

  const handleSave = () => {
    if (Object.values(validationErrors).filter((v) => v).length) {
      return
    }

    const name = nameRef.current?.value
    if (!name) {
      setValidationErrors((prev) => ({ ...prev, name: "Name is required." }))
      return
    }

    handleProjectChange?.({
      name,
      pageClassName: pageClassNameRef.current?.value || "",
    })
  }

  return (
    <Stack bg="gray.600" p="1rem" userSelect="none">
      <Heading size="md" color="blue.300">
        Project Setting
      </Heading>

      <Divider />

      <FormControl isInvalid={!!validationErrors.name}>
        <FormLabel>Name</FormLabel>
        <Input
          ref={nameRef}
          defaultValue={project.name}
          onFocus={() =>
            validationErrors.name &&
            setValidationErrors((prev) => ({ ...prev, name: "" }))
          }
        />
        <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
      </FormControl>
      <FormControl>
        <FormLabel>Page Class Name</FormLabel>
        <Input
          ref={pageClassNameRef}
          defaultValue={project.pageClassName}
          className="font-mono"
        />
      </FormControl>

      <HStack justify="flex-end">
        <Button onClick={() => handleReset()}>Reset</Button>
        <Button colorScheme="blue" onClick={() => handleSave()}>
          Save
        </Button>
      </HStack>
    </Stack>
  )
}

export default ProjectSettingSection
