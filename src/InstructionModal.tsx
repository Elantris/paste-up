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
import { useContext } from "react"
import { Trans, useTranslation } from "react-i18next"
import { LuCircleHelp, LuPlus } from "react-icons/lu"
import { exampleProjects } from "./examples"
import type { MessageKey } from "./i18n/i18n"
import ProjectContext from "./ProjectContext"

const steps: { title: MessageKey; body: MessageKey }[] = [
  { title: "instructions.templateTitle", body: "instructions.templateBody" },
  { title: "instructions.instancesTitle", body: "instructions.instancesBody" },
  { title: "instructions.pagesTitle", body: "instructions.pagesBody" },
  { title: "instructions.printTitle", body: "instructions.printBody" },
  { title: "instructions.saveTitle", body: "instructions.saveBody" },
]

const codeSamples = {
  size: <Code>w-[56mm] h-[32mm]</Code>,
  plain: <Code>{"{{title}}"}</Code>,
  html: <Code>{"{{{effect}}}"}</Code>,
  tag: <Code>{"<b>"}</Code>,
  pageClass: <Code>flex flex-wrap gap-[2mm]</Code>,
}

const InstructionModal = () => {
  const { addProject } = useContext(ProjectContext)
  const { t } = useTranslation()

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
          {t("header.instructions")}
        </Button>
      </Dialog.Trigger>

      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t("instructions.title")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label={t("action.close")} />
            </Dialog.CloseTrigger>

            <Dialog.Body>
              <Stack gap="1.25rem">
                <Text>{t("instructions.intro")}</Text>
                {steps.map((step, index) => (
                  <Stack key={step.title} gap="0.25rem">
                    <Heading as="h3" size="md" color="brand.fg">
                      {index + 1}. {t(step.title)}
                    </Heading>
                    <Text>
                      <Trans i18nKey={step.body} components={codeSamples} />
                    </Text>
                  </Stack>
                ))}
              </Stack>
            </Dialog.Body>

            <Dialog.Footer justifyContent="space-between" alignItems="end">
              <Stack gap="0.5rem">
                <Text textStyle="sm" color="fg.muted">
                  {t("instructions.addExample")}
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
                <Button colorPalette="brand">{t("instructions.gotIt")}</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default InstructionModal
