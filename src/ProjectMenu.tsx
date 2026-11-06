import { Button, Menu, Portal, Span } from "@chakra-ui/react"
import { useContext } from "react"
import { LuChevronDown, LuFolderOpen, LuPlus } from "react-icons/lu"
import ProjectContext from "./ProjectContext"

const ProjectMenu = () => {
  const { project, projects, addProject, switchProject } =
    useContext(ProjectContext)

  return (
    <Menu.Root positioning={{ placement: "bottom-start" }}>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          maxW="20rem"
          color="colorPalette.contrast"
          _hover={{ bg: "brand.700" }}
          _expanded={{ bg: "brand.700" }}
        >
          <LuFolderOpen />
          <Span truncate>{project?.name}</Span>
          <LuChevronDown />
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="16rem" maxW="24rem">
            <Menu.RadioItemGroup
              value={project?.id}
              onValueChange={(e) => switchProject?.(e.value)}
            >
              <Menu.ItemGroupLabel>Projects</Menu.ItemGroupLabel>
              {projects.map((item) => (
                <Menu.RadioItem key={item.id} value={item.id}>
                  <Menu.ItemText truncate>{item.name}</Menu.ItemText>
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
            <Menu.Separator />
            <Menu.Item value="new-project" onSelect={() => addProject?.()}>
              <LuPlus />
              New project
            </Menu.Item>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default ProjectMenu
