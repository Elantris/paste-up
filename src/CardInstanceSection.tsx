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
import { FaCopy, FaPencil, FaRegEye, FaRegEyeSlash } from "react-icons/fa6"
import CardInstanceEditModal from "./CardInstanceEditModal"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import SortingModal from "./SortingModal"
import { CardInstanceProps } from "./types"

const CardInstanceSection = () => {
  const {
    project,
    createCardInstance,
    editListSorting,
    updateListItem,
    removeListItem,
    renderedCards,
  } = useContext(ProjectContext)

  const [selectedSorting, setSelectedSorting] = useState<number>(-1)
  const [selectedCardInstance, setSelectedCardInstance] =
    useState<CardInstanceProps | null>(null)
  const [activeModalKey, setActiveModalKey] = useState("")

  if (!project) {
    return <Loading />
  }

  return (
    <Stack bg="gray.600" p="1rem">
      <Heading size="md" color="blue.300" userSelect="none">
        Card Instances
      </Heading>

      <Divider />

      {project.cardInstances.map((cardInstance, index) => (
        <HStack
          key={cardInstance.id}
          role="group"
          position="relative"
          opacity={cardInstance.isHidden ? "0.5" : undefined}
        >
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

          <Heading
            as="h3"
            size="sm"
            noOfLines={1}
            flexGrow={1}
            color={
              renderedCards.find(
                (v) => v.cardInstanceId === cardInstance.id && v.isError,
              )
                ? "red.300"
                : undefined
            }
          >
            {cardInstance.name}
          </Heading>

          <Badge
            flexShrink={0}
            maxW="5rem"
            overflow="hidden"
            textOverflow="ellipsis"
            textTransform="none"
          >
            {
              project.cardTemplates.find(
                (cardTemplate) =>
                  cardTemplate.id === cardInstance.cardTemplateId,
              )?.name
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
            <Tooltip label="Show/Hide" placement="top">
              <IconButton
                aria-label="visibility"
                icon={cardInstance.isHidden ? <FaRegEye /> : <FaRegEyeSlash />}
                onClick={() =>
                  updateListItem?.("cardInstances", cardInstance.id, {
                    isHidden: !cardInstance.isHidden,
                  })
                }
              />
            </Tooltip>
            <Tooltip label="Copy" placement="top">
              <IconButton
                aria-label="copy"
                icon={<FaCopy />}
                onClick={() => createCardInstance?.(cardInstance)}
              />
            </Tooltip>
            <Tooltip label="Edit" placement="top">
              <IconButton
                aria-label="edit"
                icon={<FaPencil />}
                colorScheme="blue"
                onClick={() => {
                  setSelectedCardInstance(cardInstance)
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
        onClick={() => {
          setSelectedCardInstance(null)
          setActiveModalKey("EDITING")
        }}
      >
        Add
      </Button>

      <SortingModal
        isOpen={activeModalKey === "SORTING"}
        onClose={() => setActiveModalKey("")}
        value={selectedSorting}
        onChange={(newSorting) => {
          editListSorting?.("cardInstances", selectedSorting, newSorting)
          setActiveModalKey("")
        }}
      />

      <CardInstanceEditModal
        isOpen={activeModalKey === "EDITING"}
        onClose={() => setActiveModalKey("")}
        cardInstance={selectedCardInstance}
        onDelete={(cardInstanceId) =>
          removeListItem?.("cardInstances", cardInstanceId)
        }
        onSave={(updates) =>
          selectedCardInstance
            ? updateListItem?.(
                "cardInstances",
                selectedCardInstance.id,
                updates,
              )
            : createCardInstance?.(updates)
        }
      />
    </Stack>
  )
}

export default CardInstanceSection
