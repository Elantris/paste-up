import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { html as htmlLanguage } from "@codemirror/lang-html"
import { materialDark } from "@uiw/codemirror-theme-material"
import ReactCodeMirror from "@uiw/react-codemirror"
import html from "prettier/plugins/html"
import prettier from "prettier/standalone"
import { FC, useContext, useEffect, useRef, useState } from "react"
import ProjectContext from "./ProjectContext"
import { CardTemplateProps } from "./types"

const CardTemplateEditModal: FC<{
  isOpen: boolean
  onClose: () => void
  cardTemplate?: CardTemplateProps | null
  onDelete?: (cardTemplateId: string) => void
  onSave?: (update: { id: string } & Partial<CardTemplateProps>) => void
}> = ({ isOpen, onClose, cardTemplate, onDelete, onSave }) => {
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

  useEffect(() => {
    if (cardTemplate) {
      setContent(cardTemplate.content)
    }
  }, [cardTemplate])

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

  const handleClose = () => {
    setIsDeleting(false)
    setValidationErrors({})
    onClose()
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
    handleClose()
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
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose()} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Card Template</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!validationErrors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                ref={nameRef}
                defaultValue={cardTemplate?.name}
                onFocus={() =>
                  validationErrors.name &&
                  setValidationErrors((prev) => ({ ...prev, name: "" }))
                }
              />
              <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!validationErrors.content}>
              <FormLabel>Content</FormLabel>
              <Box minH="15rem">
                <ReactCodeMirror
                  height="15rem"
                  theme={materialDark}
                  extensions={[htmlLanguage({})]}
                  value={content}
                  onChange={(value) => setContent(value)}
                  onFocus={() =>
                    setValidationErrors((prev) => ({ ...prev, content: "" }))
                  }
                  onBlur={() => handleFormat()}
                />
              </Box>
              <FormErrorMessage>{validationErrors.content}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          {childInstanceCount ? (
            <Tooltip
              label={`dependencies (${childInstanceCount})`}
              placement="right"
            >
              <Button colorScheme="red" disabled>
                Delete
              </Button>
            </Tooltip>
          ) : (
            <Button colorScheme="red" onClick={() => handleDelete()}>
              {isDeleting ? "Confirm Delete" : "Delete"}
            </Button>
          )}

          <ButtonGroup>
            <Button onClick={() => handleClose()}>Cancel</Button>
            <Button colorScheme="blue" onClick={() => handleSave()}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CardTemplateEditModal
