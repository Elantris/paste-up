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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Select,
  Stack,
} from "@chakra-ui/react"
import { json } from "@codemirror/lang-json"
import { materialDark } from "@uiw/codemirror-theme-material"
import ReactCodeMirror from "@uiw/react-codemirror"
import { FC, useContext, useEffect, useRef, useState } from "react"
import ProjectContext from "./ProjectContext"
import { CardInstanceProps } from "./types"

const CardInstanceEditModal: FC<{
  isOpen: boolean
  onClose: () => void
  cardInstance?: CardInstanceProps | null
  onDelete?: (cardTemplateId: string) => void
  onSave?: (updates: CardInstanceProps) => void
}> = ({ isOpen, onClose, cardInstance, onDelete, onSave }) => {
  const { project } = useContext(ProjectContext)

  const nameRef = useRef<HTMLInputElement>(null)
  const cardTemplateIdRef = useRef<HTMLSelectElement>(null)
  const [attributes, setAttributes] = useState(
    JSON.stringify(cardInstance?.attributes || {}),
  )
  const amountRef = useRef<HTMLInputElement>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  useEffect(() => {
    setAttributes(
      cardInstance ? JSON.stringify(cardInstance.attributes, null, 2) : "{}",
    )
  }, [cardInstance])

  const handleFormat = async () => {
    try {
      const formattedAttributes = JSON.stringify(
        JSON.parse(attributes),
        null,
        2,
      )
      setAttributes(formattedAttributes)
    } catch {
      setValidationErrors((prev) => ({
        ...prev,
        attributes: "Invalid JSON value.",
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
    if (!cardInstance) {
      return
    }
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }

    onDelete?.(cardInstance.id)
    handleClose()
  }

  const handleSave = () => {
    if (Object.values(validationErrors).filter((v) => v).length) {
      return
    }

    const name = nameRef.current?.value || ""
    const cardTemplateId = cardTemplateIdRef.current?.value || ""
    const amount = Number(amountRef.current?.value || 0)
    if (!name) {
      setValidationErrors((prev) => ({ ...prev, name: "Name is required." }))
      return
    }
    if (!cardTemplateId) {
      setValidationErrors((prev) => ({
        ...prev,
        cardTemplateId: "Template ID is required.",
      }))
      return
    }
    if (!amount || isNaN(amount) || amount < 0) {
      setValidationErrors((prev) => ({
        ...prev,
        amount: "Amount must be a positive number.",
      }))
      return
    }

    onSave?.({
      id: cardInstance?.id || "",
      name,
      cardTemplateId,
      attributes: JSON.parse(attributes),
      amount,
      isHidden: cardInstance?.isHidden ?? false,
    })
    handleClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={() => handleClose()} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Card Instance</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Stack>
            <FormControl isInvalid={!!validationErrors.name}>
              <FormLabel>Name</FormLabel>
              <Input
                ref={nameRef}
                defaultValue={cardInstance?.name || "Untitled"}
                onFocus={() =>
                  validationErrors.name &&
                  setValidationErrors((prev) => ({ ...prev, name: "" }))
                }
              />
              <FormErrorMessage>{validationErrors.name}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!validationErrors.cardTemplateId}>
              <FormLabel>Template</FormLabel>
              <Select
                ref={cardTemplateIdRef}
                defaultValue={cardInstance?.cardTemplateId}
                onFocus={() =>
                  validationErrors.cardTemplateId &&
                  setValidationErrors((prev) => ({
                    ...prev,
                    cardTemplateId: "",
                  }))
                }
              >
                {project?.cardTemplates.map((cardTemplate, index) => (
                  <option key={cardTemplate.id} value={cardTemplate.id}>
                    {index + 1}. {cardTemplate.name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>
                {validationErrors.cardTemplateId}
              </FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!validationErrors.attributes}>
              <FormLabel>Attributes</FormLabel>
              <Box minH="15rem">
                <ReactCodeMirror
                  height="15rem"
                  theme={materialDark}
                  extensions={[json()]}
                  value={attributes}
                  onChange={(value) => setAttributes(value)}
                  onFocus={() =>
                    setValidationErrors((prev) => ({ ...prev, attributes: "" }))
                  }
                  onBlur={() => handleFormat()}
                />
              </Box>
              <FormErrorMessage>{validationErrors.attributes}</FormErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!validationErrors.amount}>
              <FormLabel>Amount</FormLabel>
              <NumberInput
                min={1}
                step={1}
                precision={0}
                defaultValue={`${cardInstance?.amount || 1}`}
                onFocus={() =>
                  validationErrors.amount &&
                  setValidationErrors((prev) => ({ ...prev, amount: "" }))
                }
              >
                <NumberInputField ref={amountRef} />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormErrorMessage>{validationErrors.amount}</FormErrorMessage>
            </FormControl>
          </Stack>
        </ModalBody>

        <ModalFooter justifyContent="space-between">
          {!!cardInstance && (
            <Button colorScheme="red" onClick={() => handleDelete()}>
              {isDeleting ? "Confirm deletion" : "Delete"}
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

export default CardInstanceEditModal
