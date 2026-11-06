import {
  Button,
  Field,
  Heading,
  HStack,
  Input,
  Separator,
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
    <Stack bg="bg.panel" borderWidth="1px" p="1rem" userSelect="none">
      <Heading size="xl" color="blue.fg">
        Project Setting
      </Heading>

      <Separator />

      <Field.Root invalid={!!validationErrors.name}>
        <Field.Label>Name</Field.Label>
        <Input
          ref={nameRef}
          defaultValue={project.name}
          onFocus={() =>
            validationErrors.name &&
            setValidationErrors((prev) => ({ ...prev, name: "" }))
          }
        />
        <Field.ErrorText>{validationErrors.name}</Field.ErrorText>
      </Field.Root>
      <Field.Root>
        <Field.Label>Page Class Name</Field.Label>
        <Input
          ref={pageClassNameRef}
          defaultValue={project.pageClassName}
          className="font-mono"
        />
      </Field.Root>

      <HStack justify="flex-end">
        <Button variant="subtle" onClick={() => handleReset()}>
          Reset
        </Button>
        <Button colorPalette="blue" onClick={() => handleSave()}>
          Save
        </Button>
      </HStack>
    </Stack>
  )
}

export default ProjectSettingSection
