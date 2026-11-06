import { Box, Button, Flex, HStack, Input } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import { useTranslation } from "react-i18next"
import CardInstanceSection from "./CardInstanceSection"
import CardTemplateSection from "./CardTemplateSection"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import ProjectSettingSection from "./ProjectSettingSection"

function ProjectEditor() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { project, addProject } = useContext(ProjectContext)
  const { t } = useTranslation()
  const [isExporting, setIsExporting] = useState(false)

  if (!project) {
    return <Loading />
  }

  const handleImport = () => {
    const fileInput = fileRef.current
    const file = fileInput?.files?.[0]
    if (!fileInput || !file) {
      return
    }
    fileInput.value = ""

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (!json || typeof json !== "object" || Array.isArray(json)) {
          return
        }
        addProject?.(json)
      } catch (error) {
        console.error(error)
      }
    }
    reader.readAsText(file)
  }

  const handleExport = () => {
    if (!project) {
      return
    }

    setIsExporting(true)

    const json = JSON.stringify(project, null, 2)
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json)
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `${project.name}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()

    setTimeout(() => {
      setIsExporting(false)
    })
  }

  return (
    <>
      <Box flexGrow={1} p="1rem" overflowY="auto">
        <Flex key={project.id} direction="column" gap="1rem">
          <ProjectSettingSection />
          <CardTemplateSection />
          <CardInstanceSection />
        </Flex>
      </Box>

      <HStack flexShrink={0} justify="end" p="1rem 2rem">
        <Button variant="subtle" onClick={() => fileRef.current?.click()}>
          {t("action.import")}
        </Button>
        <Input
          ref={fileRef}
          type="file"
          hidden
          accept=".json,application/json"
          onChange={() => handleImport()}
        />
        <Button
          variant="subtle"
          disabled={isExporting}
          onClick={() => handleExport()}
        >
          {t("action.export")}
        </Button>
      </HStack>
    </>
  )
}

export default ProjectEditor
