import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
  Stack,
} from "@chakra-ui/react"
import { html as htmlLanguage } from "@codemirror/lang-html"
import { materialLight } from "@uiw/codemirror-theme-material"
import ReactCodeMirror from "@uiw/react-codemirror"
import html from "prettier/plugins/html"
import prettier from "prettier/standalone"
import { useContext, useRef, useState, type FC } from "react"
import { Tooltip } from "./components/ui/tooltip"
import ProjectContext from "./ProjectContext"
import type { CardTemplateProps } from "./types"

type CardTemplateEditFormProps = {
  onClose: () => void
  cardTemplate: CardTemplateProps | null
  onDelete?: (cardTemplateId: string) => void
  onSave?: (update: { id: string } & Partial<CardTemplateProps>) => void
}

// Dialog.Content mounts on open and unmounts on close.
const CardTemplateEditForm: FC<CardTemplateEditFormProps> = ({
  onClose,
  cardTemplate,
  onDelete,
  onSave,
}) => {
  const { project } = useContext(ProjectContext)

  const nameRef = useRef<HTMLInputElement>(null)
  const [content, setContent] = useState(cardTemplate?.content || "")

  const [isDeleting, setIsDeleting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const childInstanceCount =
    project?.cardInstances.filter(
      (cardInstance) => cardInstance.cardTemplateId === cardTemplate?.id,
    )?.length || 0

  const handleFormat = async () => {
    try {
      const formattedContent = await prettier.format(content, {
        parser: "html",
        plugins: [html],
      })
      setContent(formattedContent)
    } catch {
      setValidationErrors((prev) => ({
        ...prev,
        content: "Invalid HTML structure.",
      }))
      return
    }
  }

  const handleDelete = () => {
    if (!cardTemplate || childInstanceCount) {
      return
    }
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }

    onDelete?.(cardTemplate.id)
    onClose()
  }

  const handleSave = async () => {
    if (
      !cardTemplate ||
      Object.values(validationErrors).filter((v) => v).length
    ) {
      return
    }

    const name = nameRef.current?.value || ""
    if (!name) {
      setValidationErrors((prev) => ({ ...prev, name: "Name is required." }))
      return
    }

    if (!content) {
      setValidationErrors((prev) => ({
        ...prev,
        content: "Content is required.",
      }))
      return
    }

    onSave?.({
      id: cardTemplate.id,
      name,
      content,
    })
    onClose()
  }

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Edit Card Template</Dialog.Title>
      </Dialog.Header>
      <Dialog.CloseTrigger asChild>
        <CloseButton size="sm" />
      </Dialog.CloseTrigger>

      <Dialog.Body>
        <Stack>
          <Field.Root invalid={!!validationErrors.name}>
            <Field.Label>Name</Field.Label>
            <Input
              ref={nameRef}
              defaultValue={cardTemplate?.name}
              onFocus={() =>
                validationErrors.name &&
                setValidationErrors((prev) => ({ ...prev, name: "" }))
              }
            />
            <Field.ErrorText>{validationErrors.name}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!validationErrors.content}>
            <Field.Label>Content</Field.Label>
            <Box w="full" minH="15rem">
              <ReactCodeMirror
                height="15rem"
                theme={materialLight}
                extensions={[htmlLanguage({})]}
                value={content}
                onChange={(value) => setContent(value)}
                onFocus={() =>
                  setValidationErrors((prev) => ({
                    ...prev,
                    content: "",
                  }))
                }
                onBlur={() => handleFormat()}
              />
            </Box>
            <Field.ErrorText>{validationErrors.content}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </Dialog.Body>

      <Dialog.Footer justifyContent="space-between">
        {childInstanceCount ? (
          <Tooltip
            content={`dependencies (${childInstanceCount})`}
            positioning={{
              placement: "right",
            }}
          >
            <Button colorPalette="red" disabled>
              Delete
            </Button>
          </Tooltip>
        ) : (
          <Button colorPalette="red" onClick={() => handleDelete()}>
            {isDeleting ? "Confirm Delete" : "Delete"}
          </Button>
        )}

        <ButtonGroup>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button colorPalette="blue" onClick={() => handleSave()}>
            Save
          </Button>
        </ButtonGroup>
      </Dialog.Footer>
    </>
  )
}

const CardTemplateEditModal: FC<
  CardTemplateEditFormProps & { isOpen: boolean }
> = ({ isOpen, ...formProps }) => {
  return (
    <Dialog.Root
      open={isOpen}
      size="xl"
      placement="center"
      onOpenChange={(e) => {
        if (!e.open) {
          formProps.onClose()
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <CardTemplateEditForm {...formProps} />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default CardTemplateEditModal
