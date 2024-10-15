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
import { FC, useContext, useState } from "react"
import {
  FaAngleDown,
  FaAngleUp,
  FaCopy,
  FaPencil,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6"
import CardInstanceEditModal from "./CardInstanceEditModal"
import FolderEditModal from "./FolderEditModal"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import { CardInstanceProps, FolderProps } from "./types"

const CardInstanceItem: FC<{
  cardInstance: CardInstanceProps
  onEdit?: (cardInstance: CardInstanceProps) => void
}> = ({ cardInstance, onEdit }) => {
  const { project, renderedCards, createCardInstance, updateListItems } =
    useContext(ProjectContext)

  return (
    <HStack
      role="group"
      position="relative"
      opacity={cardInstance.isHidden ? "0.5" : undefined}
    >
      <IconButton
        aria-label="visibility"
        icon={cardInstance.isHidden ? <FaRegEyeSlash /> : <FaRegEye />}
        size="sm"
        variant="ghost"
        onClick={() =>
          updateListItems?.("cardInstances", [
            {
              id: cardInstance.id,
              isHidden: !cardInstance.isHidden,
            },
          ])
        }
      />

      <Heading
        as="h3"
        size="sm"
        noOfLines={1}
        flexGrow={1}
        color={
          renderedCards?.find(
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
          project!.cardTemplates.find(
            (cardTemplate) => cardTemplate.id === cardInstance.cardTemplateId,
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
            onClick={() => onEdit?.(cardInstance)}
          />
        </Tooltip>
      </ButtonGroup>
    </HStack>
  )
}

const CardInstanceFolder: FC<{
  folder: FolderProps<CardInstanceProps>
  onFolderEdit?: () => void
  onItemEdit?: (cardInstance: CardInstanceProps) => void
}> = ({ folder, onFolderEdit, onItemEdit }) => {
  const { updateListItems } = useContext(ProjectContext)
  const [isExpanded, setIsExpanded] = useState(false)

  const isFolderHidden = folder.items.every((v) => v.isHidden)

  return (
    <Stack
      maxH={isExpanded ? `${32 + 40 * folder.items.length}px` : "32px"}
      overflow="hidden"
    >
      <HStack
        role="group"
        position="relative"
        opacity={isFolderHidden ? "0.5" : undefined}
      >
        <ButtonGroup size="sm" variant="ghost" gap="0" spacing={0}>
          <IconButton
            aria-label="toggle"
            icon={isExpanded ? <FaAngleUp /> : <FaAngleDown />}
            onClick={() => setIsExpanded(!isExpanded)}
          />
          <IconButton
            aria-label="visibility"
            icon={isFolderHidden ? <FaRegEyeSlash /> : <FaRegEye />}
            onClick={() => {
              updateListItems?.(
                "cardInstances",
                folder.items.map((cardInstance) => ({
                  id: cardInstance.id,
                  isHidden: !isFolderHidden,
                })),
              )
            }}
          />
        </ButtonGroup>
        <Heading as="h3" size="sm" noOfLines={1} flexGrow={1} color="blue.300">
          {folder.name}
        </Heading>
        <ButtonGroup
          size="sm"
          display="none"
          _groupHover={{ display: "flex" }}
          position="absolute"
          right="0"
          bg="gray.600"
        >
          <Tooltip label="Edit" placement="top">
            <IconButton
              aria-label="edit"
              icon={<FaPencil />}
              colorScheme="blue"
              onClick={onFolderEdit}
            />
          </Tooltip>
        </ButtonGroup>
      </HStack>

      <Stack ml="1rem" pl="calc(1rem - 1px)" borderLeft="1px solid gray">
        {folder.items.map((cardInstance) => (
          <CardInstanceItem
            key={cardInstance.id}
            cardInstance={cardInstance}
            onEdit={onItemEdit}
          />
        ))}
      </Stack>
    </Stack>
  )
}

const CardInstanceSection = () => {
  const { project, createCardInstance, updateListItems, removeListItems } =
    useContext(ProjectContext)

  const [selectedCardInstance, setSelectedCardInstance] =
    useState<CardInstanceProps | null>(null)
  const [selectedFolder, setSelectedFolder] =
    useState<FolderProps<CardInstanceProps> | null>(null)
  const [activeModalKey, setActiveModalKey] = useState("")

  if (!project) {
    return <Loading />
  }

  const folders = project.cardInstances
    .reduce<FolderProps<CardInstanceProps>[]>((prev, cardInstance) => {
      if (!cardInstance.folder) {
        return prev
      }
      const folder = prev.find((v) => v.name === cardInstance.folder)
      if (folder) {
        folder.items.push(cardInstance)
      } else {
        prev.push({ name: cardInstance.folder, items: [cardInstance] })
      }
      return prev
    }, [])
    .sort((a, b) => a.name.localeCompare(b.name))

  return (
    <Stack p="1rem" bg="gray.600">
      <Heading size="md" color="blue.300" userSelect="none">
        Card Instances
      </Heading>

      <Divider />

      {folders.map((folder) => (
        <CardInstanceFolder
          key={folder.name}
          folder={folder}
          onFolderEdit={() => {
            setSelectedFolder(folder)
            setActiveModalKey("FOLDER")
          }}
          onItemEdit={(cardInstance) => {
            setSelectedCardInstance(cardInstance)
            setActiveModalKey("EDITING")
          }}
        />
      ))}

      <Divider />

      {project.cardInstances
        .filter((cardInstance) => !cardInstance.folder)
        .map((cardInstance) => (
          <CardInstanceItem
            key={cardInstance.id}
            cardInstance={cardInstance}
            onEdit={() => {
              setSelectedCardInstance(cardInstance)
              setActiveModalKey("EDITING")
            }}
          />
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

      <FolderEditModal
        isOpen={activeModalKey === "FOLDER"}
        onClose={() => setActiveModalKey("")}
        value={selectedFolder?.name || ""}
        onChange={(newValue) =>
          updateListItems?.(
            "cardInstances",
            selectedFolder?.items?.map((v) => ({ ...v, folder: newValue })) ||
              [],
          )
        }
      />

      <CardInstanceEditModal
        isOpen={activeModalKey === "EDITING"}
        onClose={() => setActiveModalKey("")}
        cardInstance={selectedCardInstance}
        onDelete={(cardInstanceId) =>
          removeListItems?.("cardInstances", [cardInstanceId])
        }
        onSave={(update) =>
          selectedCardInstance
            ? updateListItems?.("cardInstances", [update])
            : createCardInstance?.(update)
        }
      />
    </Stack>
  )
}

export default CardInstanceSection
