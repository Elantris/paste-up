import { AddIcon } from "@chakra-ui/icons"
import {
  Badge,
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

const CardTemplateSection = () => {
  const {
    project,
    createCardTemplate,
    editListSorting,
    updateListItem,
    removeListItem,
  } = useContext(ProjectContext)

  const [selectedSorting, setSelectedSorting] = useState<number>(-1)
  const [selectedCardTemplate, setSelectedCardTemplate] =
    useState<CardTemplateProps | null>(null)
  const [activeModalKey, setActiveModalKey] = useState("")

  if (!project) {
    return <Loading />
  }

  return (
    <Stack bg="gray.600" p="1rem">
      <Heading size="md" color="blue.300" userSelect="none">
        Card Templates
      </Heading>

      <Divider />

      {project.cardTemplates.map((cardTemplate, index) => (
        <HStack key={cardTemplate.id} role="group" position="relative">
          <Button
            flexShrink={0}
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedSorting(index)
              setActiveModalKey("SORTING")
            }}
          >
            {index + 1}
          </Button>

          <Heading as="h3" size="sm" noOfLines={1} flexGrow={1}>
            {cardTemplate.name}
          </Heading>

          <Badge
            flexShrink={0}
            maxW="5rem"
            overflow="hidden"
            textOverflow="ellipsis"
            textTransform="none"
          >
            {
              project.cardInstances.filter(
                (cardInstance) =>
                  cardInstance.cardTemplateId === cardTemplate.id,
              ).length
            }
          </Badge>

          <ButtonGroup
            size="sm"
            display="none"
            _groupHover={{ display: "flex" }}
            position="absolute"
            right="0"
            bg="gray.600"
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
                colorScheme="blue"
                onClick={() => {
                  setSelectedCardTemplate(cardTemplate)
                  setActiveModalKey("EDITING")
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
        isOpen={activeModalKey === "SORTING"}
        onClose={() => setActiveModalKey("")}
        value={selectedSorting}
        onChange={(newSorting) => {
          editListSorting?.("cardTemplates", selectedSorting, newSorting)
          setActiveModalKey("")
        }}
      />

      <CardTemplateEditModal
        isOpen={activeModalKey === "EDITING"}
        onClose={() => setActiveModalKey("")}
        cardTemplate={selectedCardTemplate}
        onDelete={(cardTemplateId) =>
          removeListItem?.("cardTemplates", cardTemplateId)
        }
        onSave={(cardTemplateId, updates) =>
          updateListItem?.("cardTemplates", cardTemplateId, updates)
        }
      />
    </Stack>
  )
}

export default CardTemplateSection
