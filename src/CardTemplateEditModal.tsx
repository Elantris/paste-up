import {
  Button,
  ButtonGroup,
  Code,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Stack,
  Textarea,
  Tooltip,
  useClipboard,
} from "@chakra-ui/react"
import html from "prettier/plugins/html"
import prettier from "prettier/standalone"
import { FC, useRef, useState } from "react"
import { FaClipboard } from "react-icons/fa6"
import { CardTemplateProps } from "./types"
import { isHTML } from "./utils"

const CardTemplateEditModal: FC<{
  isOpen: boolean
  onClose: () => void
  cardTemplate: CardTemplateProps | null
  onDelete?: (cardTemplateId: string) => void
  onSave?: (cardTemplateId: string, updates: Partial<CardTemplateProps>) => void
}> = ({ isOpen, onClose, cardTemplate, onDelete, onSave }) => {
  const { onCopy, setValue } = useClipboard("")

  const nameRef = useRef<HTMLInputElement>(null)
  const contentRef = useRef<HTMLTextAreaElement>(null)
  const deleteRef = useRef<HTMLInputElement>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [isDeleteInvalid, setIsDeleteInvalid] = useState(false)
  const [isNameInvalid, setIsNameInvalid] = useState(false)
  const [isContentInvalid, setIsContentInvalid] = useState(false)

  const handleFormat = async () => {
    if (!contentRef.current) {
      return
    }
    try {
      const formattedContent = await prettier.format(contentRef.current.value, {
        parser: "html",
        plugins: [html],
      })

      contentRef.current.value = formattedContent
    } catch {
      setIsContentInvalid(true)
      return
    }
  }

  const handleClose = () => {
    setIsDeleting(false)
    setIsDeleteInvalid(false)
    setIsNameInvalid(false)
    setIsContentInvalid(false)
    onClose()
  }

  const handleDelete = () => {
    if (!cardTemplate) {
      return
    }

    setValue(cardTemplate.id)

    if (!isDeleting) {
      setIsDeleting(true)
      return
    }

    if (deleteRef.current?.value !== cardTemplate.id) {
      setIsDeleteInvalid(true)
      return
    }

    onDelete?.(cardTemplate.id)
    handleClose()
  }

  const handleSave = async () => {
    if (!cardTemplate || isNameInvalid || isContentInvalid) {
      return
    }

    const name = nameRef.current?.value || ""
    const content = contentRef.current?.value || ""
    if (!name) {
      setIsNameInvalid(true)
      return
    }
    if (!content || !isHTML(content)) {
      setIsContentInvalid(true)
      return
    }

    onSave?.(cardTemplate.id, { name, content })
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
            <FormControl>
              <FormLabel>Name</FormLabel>
              <Input
                ref={nameRef}
                defaultValue={cardTemplate?.name}
                errorBorderColor="red.300"
                isInvalid={isNameInvalid}
                onFocus={() => isNameInvalid && setIsNameInvalid(false)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Textarea
                ref={contentRef}
                defaultValue={cardTemplate?.content}
                errorBorderColor="red.300"
                isInvalid={isContentInvalid}
                onFocus={() => isContentInvalid && setIsContentInvalid(false)}
                onBlur={() => handleFormat()}
                minH="10rem"
              />
            </FormControl>

            <FormControl display={isDeleting ? "block" : "none"}>
              <FormLabel color="red.300">Enter the card template ID</FormLabel>
              <Input
                ref={deleteRef}
                errorBorderColor="red.300"
                isInvalid={isDeleteInvalid}
                onFocus={() => isDeleteInvalid && setIsDeleteInvalid(false)}
              />
              <FormHelperText>
                <HStack>
                  <Code colorScheme="red">{cardTemplate?.id}</Code>
                  <Tooltip label="Copy to clipboard.">
                    <IconButton
                      aria-label="Clipboard"
                      icon={<FaClipboard />}
                      size="sm"
                      onClick={() => onCopy()}
                    />
                  </Tooltip>
                </HStack>
              </FormHelperText>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          <Button colorScheme="red" onClick={() => handleDelete()}>
            {isDeleting ? "Confirm" : "Delete"}
          </Button>
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
