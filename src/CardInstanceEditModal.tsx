import {
  Box,
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  HStack,
  Input,
  NativeSelect,
  NumberInput,
  Portal,
  Stack,
  Tag,
} from "@chakra-ui/react"
import { json } from "@codemirror/lang-json"
import { materialDark } from "@uiw/codemirror-theme-material"
import ReactCodeMirror from "@uiw/react-codemirror"
import { useContext, useRef, useState, type FC } from "react"
import ProjectContext from "./ProjectContext"
import type { CardInstanceProps } from "./types"

type CardInstanceEditFormProps = {
  onClose: () => void
  cardInstance: CardInstanceProps | null
  onDelete?: (cardTemplateId: string) => void
  onSave?: (update: CardInstanceProps) => void
}

// Dialog.Content mounts on open and unmounts on close.
const CardInstanceEditForm: FC<CardInstanceEditFormProps> = ({
  onClose,
  cardInstance,
  onDelete,
  onSave,
}) => {
  const { project } = useContext(ProjectContext)

  const nameRef = useRef<HTMLInputElement>(null)
  const folderRef = useRef<HTMLInputElement>(null)
  const cardTemplateIdRef = useRef<HTMLSelectElement>(null)
  const [attributes, setAttributes] = useState(
    cardInstance ? JSON.stringify(cardInstance.attributes, null, 2) : "{}",
  )
  const amountRef = useRef<HTMLInputElement>(null)

  const [isDeleting, setIsDeleting] = useState(false)
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({})

  const folderNames =
    project?.cardInstances.reduce<Set<string>>((prev, cardInstance) => {
      if (cardInstance.folder) {
        prev.add(cardInstance.folder)
      }
      return prev
    }, new Set()) || new Set()

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

  const handleDelete = () => {
    if (!cardInstance) {
      return
    }
    if (!isDeleting) {
      setIsDeleting(true)
      return
    }

    onDelete?.(cardInstance.id)
    onClose()
  }

  const handleSave = () => {
    if (Object.values(validationErrors).filter((v) => v).length) {
      return
    }

    const name = nameRef.current?.value.trim().replace(/\s+/, " ") || ""
    const folder = folderRef.current?.value.trim().replace(/\s+/, " ") || ""
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
      folder,
    })
    onClose()
  }

  return (
    <>
      <Dialog.Header>
        <Dialog.Title>Edit Card Instance</Dialog.Title>
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
              defaultValue={cardInstance?.name || "Untitled"}
              onFocus={() =>
                validationErrors.name &&
                setValidationErrors((prev) => ({ ...prev, name: "" }))
              }
            />
            <Field.ErrorText>{validationErrors.name}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!validationErrors.folder}>
            <Field.Label>Folder</Field.Label>
            <Input
              ref={folderRef}
              defaultValue={cardInstance?.folder || ""}
              onFocus={() =>
                validationErrors.folder &&
                setValidationErrors((prev) => ({ ...prev, folder: "" }))
              }
            />
            {!!folderNames.size && (
              <Field.HelperText>
                <HStack flexWrap="wrap">
                  {Array.from(folderNames).map((folderName) => (
                    <Tag.Root
                      key={folderName}
                      cursor="pointer"
                      onClick={() =>
                        folderRef.current &&
                        (folderRef.current.value = folderName)
                      }
                    >
                      <Tag.Label>{folderName}</Tag.Label>
                    </Tag.Root>
                  ))}
                </HStack>
              </Field.HelperText>
            )}

            <Field.ErrorText>{validationErrors.folder}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!validationErrors.cardTemplateId}>
            <Field.Label>Template</Field.Label>
            <NativeSelect.Root>
              <NativeSelect.Field
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
              </NativeSelect.Field>
              <NativeSelect.Indicator />
            </NativeSelect.Root>
            <Field.ErrorText>{validationErrors.cardTemplateId}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!validationErrors.attributes}>
            <Field.Label>Attributes</Field.Label>
            <Box w="full" minH="15rem">
              <ReactCodeMirror
                height="15rem"
                theme={materialDark}
                extensions={[json()]}
                value={attributes}
                onChange={(value) => setAttributes(value)}
                onFocus={() =>
                  setValidationErrors((prev) => ({
                    ...prev,
                    attributes: "",
                  }))
                }
                onBlur={() => handleFormat()}
              />
            </Box>
            <Field.ErrorText>{validationErrors.attributes}</Field.ErrorText>
          </Field.Root>

          <Field.Root invalid={!!validationErrors.amount}>
            <Field.Label>Amount</Field.Label>
            <NumberInput.Root
              w="full"
              min={1}
              step={1}
              formatOptions={{ maximumFractionDigits: 0 }}
              defaultValue={`${cardInstance?.amount || 1}`}
              onFocus={() =>
                validationErrors.amount &&
                setValidationErrors((prev) => ({ ...prev, amount: "" }))
              }
            >
              <NumberInput.Input ref={amountRef} />
              <NumberInput.Control>
                <NumberInput.IncrementTrigger />
                <NumberInput.DecrementTrigger />
              </NumberInput.Control>
            </NumberInput.Root>
            <Field.ErrorText>{validationErrors.amount}</Field.ErrorText>
          </Field.Root>
        </Stack>
      </Dialog.Body>

      <Dialog.Footer justifyContent="space-between">
        {cardInstance ? (
          <Button colorPalette="red" onClick={() => handleDelete()}>
            {isDeleting ? "Confirm deletion" : "Delete"}
          </Button>
        ) : (
          <div />
        )}
        <ButtonGroup>
          <Button variant="subtle" onClick={onClose}>
            Cancel
          </Button>
          <Button colorPalette="blue" onClick={() => handleSave()}>
            {cardInstance ? "Save" : "Create"}
          </Button>
        </ButtonGroup>
      </Dialog.Footer>
    </>
  )
}

const CardInstanceEditModal: FC<
  CardInstanceEditFormProps & { isOpen: boolean }
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
            <CardInstanceEditForm {...formProps} />
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default CardInstanceEditModal
