import {
  Button,
  ButtonGroup,
  CloseButton,
  Dialog,
  Field,
  Input,
  Portal,
} from "@chakra-ui/react"
import { useRef, type FC } from "react"
import { useTranslation } from "react-i18next"

const FolderEditModal: FC<{
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (newValue: string) => void
}> = ({ isOpen, onClose, value, onChange }) => {
  const nameRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleSave = () => {
    onChange(nameRef.current?.value || "")
    onClose()
  }

  return (
    <Dialog.Root
      open={isOpen}
      size="xs"
      placement="center"
      onOpenChange={(e) => {
        if (!e.open) {
          onClose()
        }
      }}
    >
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>{t("folderEdit.title")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label={t("action.close")} />
            </Dialog.CloseTrigger>

            <Dialog.Body>
              <Field.Root>
                <Field.Label>{t("folderEdit.name")}</Field.Label>
                <Input ref={nameRef} defaultValue={value} />
              </Field.Root>
            </Dialog.Body>

            <Dialog.Footer>
              <ButtonGroup>
                <Button variant="subtle" onClick={onClose}>
                  {t("action.cancel")}
                </Button>
                <Button colorPalette="brand" onClick={() => handleSave()}>
                  {t("action.save")}
                </Button>
              </ButtonGroup>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}

export default FolderEditModal
