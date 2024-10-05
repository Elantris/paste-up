import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { FC, useRef } from "react"

const SortingModal: FC<{
  isOpen: boolean
  onClose: () => void
  value: number
  onChange: (newSorting: number) => void
}> = ({ isOpen, onClose, value, onChange }) => {
  const sortingRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    if (!sortingRef.current) {
      return
    }
    const newSorting = Math.max(Number(sortingRef.current?.value || 0) - 1, 0)
    onChange(newSorting)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Change Sorting</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <FormLabel>Move to</FormLabel>
            <Input
              ref={sortingRef}
              defaultValue={`${value + 1}`}
              onFocus={() => sortingRef.current?.select()}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <ButtonGroup>
            <Button onClick={onClose}>Cancel</Button>
            <Button colorScheme="blue" onClick={() => handleSave()}>
              Save
            </Button>
          </ButtonGroup>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default SortingModal
