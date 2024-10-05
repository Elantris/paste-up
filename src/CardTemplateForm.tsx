import { AddIcon } from "@chakra-ui/icons"
import {
  Button,
  ButtonGroup,
  Divider,
  Heading,
  HStack,
  IconButton,
  Stack,
  Tooltip,
} from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaCopy, FaPencil } from "react-icons/fa6"
import CardTemplateEditModal from "./CardTemplateEditModal"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import SortingModal from "./SortingModal"
import { CardTemplateProps } from "./types"

const CardTemplateForm = () => {
  const {
    project,
    handleProjectChange,
    createCardTemplate,
    updateCardTemplate,
    removeCardTemplate,
  } = useContext(ProjectContext)

  const [selectedSorting, setSelectedSorting] = useState<number>(-1)
  const [selectedCardTemplate, setSelectedCardTemplate] =
    useState<CardTemplateProps | null>(null)
  const [isSortingModalOpen, setIsSortingModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  if (!project) {
    return <Loading />
  }

  const handleEditSorting = (newSorting: number) => {
    const targetCardTemplate = { ...project.cardTemplates[selectedSorting] }
    const newCardTemplates = project.cardTemplates.filter(
      (_, index) => index !== selectedSorting,
    )
    newCardTemplates.splice(newSorting, 0, targetCardTemplate)
    handleProjectChange?.({ cardTemplates: newCardTemplates })
    setIsSortingModalOpen(false)
  }

  return (
    <Stack bg="gray.600" p="1rem">
      <Heading size="lg" color="blue.300" userSelect="none">
        Card Templates
      </Heading>

      <Divider />

      {project.cardTemplates.map((cardTemplate, index) => (
        <HStack key={cardTemplate.id} role="group">
          <Button
            flexShrink={0}
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSorting(index)
              setIsSortingModalOpen(true)
            }}
          >
            {index + 1}
          </Button>

          <Heading as="h3" size="sm" flexGrow={1} noOfLines={1}>
            {cardTemplate.name}
          </Heading>

          <ButtonGroup
            size="sm"
            display="none"
            _groupHover={{ display: "flex" }}
          >
            <Tooltip label="Copy" placement="top">
              <IconButton
                aria-label="copy"
                icon={<FaCopy />}
                onClick={() => createCardTemplate?.(cardTemplate.id)}
              />
            </Tooltip>
            <Tooltip label="Edit" placement="top">
              <IconButton
                aria-label="edit"
                icon={<FaPencil />}
                onClick={() => {
                  setSelectedCardTemplate(cardTemplate)
                  setIsEditModalOpen(true)
                }}
              />
            </Tooltip>
          </ButtonGroup>
        </HStack>
      ))}

      <Button
        leftIcon={<AddIcon />}
        size="sm"
        onClick={() => createCardTemplate?.()}
      >
        Add
      </Button>

      <SortingModal
        isOpen={isSortingModalOpen}
        onClose={() => setIsSortingModalOpen(false)}
        value={selectedSorting}
        onChange={(newSorting) => handleEditSorting(newSorting)}
      />

      <CardTemplateEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        cardTemplate={selectedCardTemplate}
        onDelete={(cardTemplateId) => removeCardTemplate?.(cardTemplateId)}
        onSave={(cardTemplateId, updates) =>
          updateCardTemplate?.(cardTemplateId, updates)
        }
      />
    </Stack>
  )
}

export default CardTemplateForm
