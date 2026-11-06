import {
  Button,
  CloseButton,
  Code,
  Dialog,
  Heading,
  HStack,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react"
import { useContext, type ReactNode } from "react"
import { LuCircleHelp, LuPlus } from "react-icons/lu"
import { exampleProjects } from "./examples"
import ProjectContext from "./ProjectContext"

const steps: { title: string; body: ReactNode }[] = [
  {
    title: "Design a card template",
    body: (
      <>
        A template is the HTML for one printed piece. Style it with Tailwind
        classes and size it in millimeters to match the text area it covers, for
        example <Code>w-[56mm] h-[32mm]</Code>. <Code>{"{{title}}"}</Code> fills
        in an attribute as plain text, and <Code>{"{{{effect}}}"}</Code> keeps
        HTML such as <Code>{"<b>"}</Code>.
      </>
    ),
  },
  {
    title: "Add card instances",
    body: (
      <>
        Each instance fills a template with one card's attributes, written as
        JSON. Amount sets how many copies print. Folders group instances, and
        the eye icon hides an instance or a whole folder from the pages.
      </>
    ),
  },
  {
    title: "Check the pages",
    body: (
      <>
        The preview shows A4 pages as they print. A row of pieces that does not
        fit moves to the next page. Page Class Name adds Tailwind classes to
        every page, for example <Code>flex flex-wrap gap-[2mm]</Code> to leave
        space between pieces.
      </>
    ),
  },
  {
    title: "Print and cut",
    body: (
      <>
        Open the browser's print dialog with Ctrl + P (⌘ + P on a Mac). Keep the
        scale at 100% and turn on background graphics so colored pieces print.
        Cut along each piece's border and lay it over its card's text; a card
        sleeve holds it in place.
      </>
    ),
  },
  {
    title: "Save and share",
    body: (
      <>
        Projects save in this browser. The project menu in the header switches
        between them or starts a new one, and Delete in Project Setting removes
        the current one. Export downloads the current project as a JSON file,
        and Import adds one as a new project, so a translation can move between
        computers or translators. The buttons below add the example projects.
      </>
    ),
  },
]

const InstructionModal = () => {
  const { addProject } = useContext(ProjectContext)

  return (
    <Dialog.Root size="lg" placement="center" scrollBehavior="inside">
      <Dialog.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          color="colorPalette.contrast"
          _hover={{ bg: "brand.700" }}
          _expanded={{ bg: "brand.700" }}
        >
          <LuCircleHelp />
          Instructions
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>How to use Paste Up</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Body>
              <Stack gap="1.25rem">
                <Text>
                  Paste Up prints card translations on small pieces of paper.
                  Cut each piece out and lay it over the card's text, so the
                  translation covers the original words and the rest of the
                  artwork stays visible.
                </Text>
                {steps.map((step, index) => (
                  <Stack key={step.title} gap="0.25rem">
                    <Heading as="h3" size="md" color="brand.fg">
                      {index + 1}. {step.title}
                    </Heading>
                    <Text>{step.body}</Text>
                  </Stack>
                ))}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer justifyContent="space-between" alignItems="end">
              <Stack gap="0.5rem">
                <Text textStyle="sm" color="fg.muted">
                  Add an example project
                </Text>
                <HStack wrap="wrap">
                  {exampleProjects.map((example) => (
                    <Dialog.ActionTrigger key={example.label} asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addProject?.(example.project)}
                      >
                        <LuPlus />
                        {example.label}
                      </Button>
                    </Dialog.ActionTrigger>
                  ))}
                </HStack>
              </Stack>
              <Dialog.ActionTrigger asChild>
                <Button colorPalette="brand">Got it</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default InstructionModal
