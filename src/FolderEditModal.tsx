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

const FolderEditModal: FC<{
  isOpen: boolean
  onClose: () => void
  value: string
  onChange: (newValue: string) => void
}> = ({ isOpen, onClose, value, onChange }) => {
  const nameRef = useRef<HTMLInputElement>(null)

  const handleSave = () => {
    onChange(nameRef.current?.value || "")
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xs" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Folder</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <FormControl>
            <FormLabel>Folder Name</FormLabel>
            <Input ref={nameRef} defaultValue={value} />
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

export default FolderEditModal
