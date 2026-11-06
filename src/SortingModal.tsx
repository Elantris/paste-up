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

const SortingModal: FC<{
  isOpen: boolean
  onClose: () => void
  value: number
  onChange: (newValue: number) => void
}> = ({ isOpen, onClose, value, onChange }) => {
  const sortingRef = useRef<HTMLInputElement>(null)
  const { t } = useTranslation()

  const handleSave = () => {
    if (!sortingRef.current) {
      return
    }
    const newValue = Math.max(Number(sortingRef.current?.value || 0) - 1, 0)
    onChange(newValue)
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
              <Dialog.Title>{t("sorting.title")}</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" aria-label={t("action.close")} />
            </Dialog.CloseTrigger>

            <Dialog.Body>
              <Field.Root>
                <Field.Label>{t("sorting.moveTo")}</Field.Label>
                <Input
                  ref={sortingRef}
                  defaultValue={`${value + 1}`}
                  onFocus={() => sortingRef.current?.select()}
                />
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

export default SortingModal
