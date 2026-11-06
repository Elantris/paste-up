import {
  Badge,
  Button,
  ButtonGroup,
  Heading,
  HStack,
  IconButton,
  Separator,
  Stack,
} from "@chakra-ui/react"
import { useContext, useState, type FC } from "react"
import {
  FaAngleDown,
  FaAngleUp,
  FaCopy,
  FaPencil,
  FaRegEye,
  FaRegEyeSlash,
} from "react-icons/fa6"
import { LuPlus } from "react-icons/lu"
import CardInstanceEditModal from "./CardInstanceEditModal"
import { Tooltip } from "./components/ui/tooltip"
import FolderEditModal from "./FolderEditModal"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import type { CardInstanceProps, FolderProps } from "./types"

const CardInstanceItem: FC<{
  cardInstance: CardInstanceProps
  onEdit?: (cardInstance: CardInstanceProps) => void
}> = ({ cardInstance, onEdit }) => {
  const { project, renderedCards, createCardInstance, updateListItems } =
    useContext(ProjectContext)

  return (
    <HStack
      className="group"
      position="relative"
      opacity={cardInstance.isHidden ? "0.5" : undefined}
    >
      <IconButton
        aria-label="visibility"
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
      >
        {cardInstance.isHidden ? <FaRegEyeSlash /> : <FaRegEye />}
      </IconButton>

      <Heading
        as="h3"
        size="md"
        lineClamp={1}
        flexGrow={1}
        color={
          renderedCards?.find(
            (v) => v.cardInstanceId === cardInstance.id && v.isError,
          )
            ? "red.fg"
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
        bg="bg.panel"
      >
        <Tooltip
          content="Copy"
          positioning={{
            placement: "top",
          }}
        >
          <IconButton
            aria-label="copy"
            variant="subtle"
            onClick={() => createCardInstance?.(cardInstance)}
          >
            <FaCopy />
          </IconButton>
        </Tooltip>
        <Tooltip
          content="Edit"
          positioning={{
            placement: "top",
          }}
        >
          <IconButton
            aria-label="edit"
            colorPalette="brand"
            onClick={() => onEdit?.(cardInstance)}
          >
            <FaPencil />
          </IconButton>
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
    <Stack>
      <HStack
        className="group"
        position="relative"
        opacity={isFolderHidden ? "0.5" : undefined}
      >
        <ButtonGroup size="sm" variant="ghost" gap="0">
          <IconButton
            aria-label="toggle"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <FaAngleUp /> : <FaAngleDown />}
          </IconButton>
          <IconButton
            aria-label="visibility"
            onClick={() => {
              updateListItems?.(
                "cardInstances",
                folder.items.map((cardInstance) => ({
                  id: cardInstance.id,
                  isHidden: !isFolderHidden,
                })),
              )
            }}
          >
            {isFolderHidden ? <FaRegEyeSlash /> : <FaRegEye />}
          </IconButton>
        </ButtonGroup>
        <Heading as="h3" size="md" lineClamp={1} flexGrow={1} color="brand.fg">
          {folder.name}
        </Heading>
        <ButtonGroup
          size="sm"
          display="none"
          _groupHover={{ display: "flex" }}
          position="absolute"
          right="0"
          bg="bg.panel"
        >
          <Tooltip
            content="Edit"
            positioning={{
              placement: "top",
            }}
          >
            <IconButton
              aria-label="edit"
              colorPalette="brand"
              onClick={onFolderEdit}
            >
              <FaPencil />
            </IconButton>
          </Tooltip>
        </ButtonGroup>
      </HStack>

      {isExpanded && (
        <Stack ml="1rem" pl="calc(1rem - 1px)" borderStartWidth="1px">
          {folder.items.map((cardInstance) => (
            <CardInstanceItem
              key={cardInstance.id}
              cardInstance={cardInstance}
              onEdit={onItemEdit}
            />
          ))}
        </Stack>
      )}
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
    <Stack bg="bg.panel" borderWidth="1px" p="1rem">
      <Heading size="xl" color="brand.fg" userSelect="none">
        Card Instances
      </Heading>

      <Separator />

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

      <Separator />

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
        size="sm"
        variant="subtle"
        onClick={() => {
          setSelectedCardInstance(null)
          setActiveModalKey("EDITING")
        }}
      >
        <LuPlus />
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
