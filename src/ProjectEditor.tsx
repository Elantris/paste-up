import { Box, Button, Flex, HStack, Input } from "@chakra-ui/react"
import { useContext, useRef, useState } from "react"
import CardInstanceSection from "./CardInstanceSection"
import CardTemplateSection from "./CardTemplateSection"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import ProjectSettingForm from "./ProjectSettingForm"

function ProjectEditor() {
  const fileRef = useRef<HTMLInputElement>(null)
  const { project, handleProjectChange } = useContext(ProjectContext)
  const [isLoading, setIsLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)

  if (!project) {
    return <Loading />
  }

  const handleImport = () => {
    const file = fileRef.current?.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        if (typeof json !== "object") {
          return
        }
        setIsLoading(true)
        handleProjectChange?.(json)
        setTimeout(() => {
          setIsLoading(false)
        })
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
        {isLoading ? (
          <Loading />
        ) : (
          <Flex direction="column" gap="1rem">
            <ProjectSettingForm />
            <CardTemplateSection />
            <CardInstanceSection />
          </Flex>
        )}
      </Box>

      <HStack flexShrink={0} justify="end" p="1rem 2rem">
        <Button onClick={() => fileRef.current?.click()}>Import</Button>
        <Input
          ref={fileRef}
          type="file"
          hidden
          accept="*.json"
          onChange={() => handleImport()}
        />
        <Button disabled={isExporting} onClick={() => handleExport()}>
          Export
        </Button>
      </HStack>
    </>
  )
}

export default ProjectEditor
