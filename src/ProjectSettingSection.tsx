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
import { useTranslation } from "react-i18next"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"

const ProjectSettingSection = () => {
  const { project, handleProjectChange, removeProject } =
    useContext(ProjectContext)
  const { t } = useTranslation()
  const nameRef = useRef<HTMLInputElement>(null)
  const pageClassNameRef = useRef<HTMLInputElement>(null)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})
  const [isDeleting, setIsDeleting] = useState(false)

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
      setValidationErrors((prev) => ({
        ...prev,
        name: t("error.nameRequired"),
      }))
      return
    }

    handleProjectChange?.({
      name,
      pageClassName: pageClassNameRef.current?.value || "",
    })
  }

  const handleDelete = () => {
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }
    removeProject?.(project.id)
  }

  return (
    <Stack bg="bg.panel" borderWidth="1px" p="1rem" userSelect="none">
      <Heading size="xl" color="brand.fg">
        {t("projectSetting.title")}
      </Heading>

      <Separator />

      <Field.Root invalid={!!validationErrors.name}>
        <Field.Label>{t("projectSetting.name")}</Field.Label>
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
        <Field.Label>{t("projectSetting.pageClassName")}</Field.Label>
        <Input
          ref={pageClassNameRef}
          defaultValue={project.pageClassName}
          className="font-mono"
        />
      </Field.Root>

      <HStack justify="space-between">
        <Button
          colorPalette="red"
          variant={isDeleting ? "solid" : "subtle"}
          onClick={() => handleDelete()}
          onBlur={() => setIsDeleting(false)}
        >
          {isDeleting ? t("action.confirmDelete") : t("action.delete")}
        </Button>
        <HStack>
          <Button variant="subtle" onClick={() => handleReset()}>
            {t("action.reset")}
          </Button>
          <Button colorPalette="brand" onClick={() => handleSave()}>
            {t("action.save")}
          </Button>
        </HStack>
      </HStack>
    </Stack>
  )
}

export default ProjectSettingSection
