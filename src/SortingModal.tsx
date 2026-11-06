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

const SortingModal: FC<{
  isOpen: boolean
  onClose: () => void
  value: number
  onChange: (newValue: number) => void
}> = ({ isOpen, onClose, value, onChange }) => {
  const sortingRef = useRef<HTMLInputElement>(null)

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
              <Dialog.Title>Edit Sorting</Dialog.Title>
            </Dialog.Header>
            <Dialog.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Dialog.CloseTrigger>

            <Dialog.Body>
              <Field.Root>
                <Field.Label>Move to</Field.Label>
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
                  Cancel
                </Button>
                <Button colorPalette="blue" onClick={() => handleSave()}>
                  Save
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
