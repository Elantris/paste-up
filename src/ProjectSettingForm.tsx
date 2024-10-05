import {
  Button,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
} from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"

const ProjectSettingForm = () => {
  const { project, handleProjectChange } = useContext(ProjectContext)
  const nameRef = useRef<HTMLInputElement>(null)
  const pageClassNameRef = useRef<HTMLInputElement>(null)
  const [isNameInvalid, setIsNameInvalid] = useState(false)

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
    const name = nameRef.current?.value
    if (!name) {
      setIsNameInvalid(true)
      return
    }

    handleProjectChange?.({
      name,
      pageClassName: pageClassNameRef.current?.value || "",
    })
  }

  return (
    <Stack bg="gray.600" p="1rem" userSelect="none">
      <Heading size="lg" color="blue.300">
        Project Setting
      </Heading>

      <Divider />

      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          ref={nameRef}
          defaultValue={project.name}
          errorBorderColor="red.300"
          isInvalid={isNameInvalid}
          onFocus={() => isNameInvalid && setIsNameInvalid(false)}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Page Class Name</FormLabel>
        <Input ref={pageClassNameRef} defaultValue={project.pageClassName} />
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

export default ProjectSettingForm
