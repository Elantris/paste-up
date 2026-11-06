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
import { useContext, useState } from "react"
import { useTranslation } from "react-i18next"
import { FaCopy, FaPencil } from "react-icons/fa6"
import { LuPlus } from "react-icons/lu"
import CardTemplateEditModal from "./CardTemplateEditModal"
import { Tooltip } from "./components/ui/tooltip"
import Loading from "./Loading"
import ProjectContext from "./ProjectContext"
import SortingModal from "./SortingModal"
import type { CardTemplateProps } from "./types"

const CardTemplateSection = () => {
  const {
    project,
    createCardTemplate,
    editListSorting,
    updateListItems,
    removeListItems,
  } = useContext(ProjectContext)
  const { t } = useTranslation()

  const [selectedSorting, setSelectedSorting] = useState<number>(-1)
  const [selectedCardTemplate, setSelectedCardTemplate] =
    useState<CardTemplateProps | null>(null)
  const [activeModalKey, setActiveModalKey] = useState("")

  if (!project) {
    return <Loading />
  }

  return (
    <Stack bg="bg.panel" borderWidth="1px" p="1rem">
      <Heading size="xl" color="brand.fg" userSelect="none">
        {t("cardTemplates.title")}
      </Heading>

      <Separator />

      {project.cardTemplates.map((cardTemplate, index) => (
        <HStack key={cardTemplate.id} className="group" position="relative">
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

          <Heading as="h3" size="md" lineClamp={1} flexGrow={1}>
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
            bg="bg.panel"
          >
            <Tooltip
              content={t("action.copy")}
              positioning={{
                placement: "top",
              }}
            >
              <IconButton
                aria-label={t("action.copy")}
                variant="subtle"
                onClick={() => createCardTemplate?.(cardTemplate.id)}
              >
                <FaCopy />
              </IconButton>
            </Tooltip>
            <Tooltip
              content={t("action.edit")}
              positioning={{
                placement: "top",
              }}
            >
              <IconButton
                aria-label={t("action.edit")}
                colorPalette="brand"
                onClick={() => {
                  setSelectedCardTemplate(cardTemplate)
                  setActiveModalKey("EDITING")
                }}
              >
                <FaPencil />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
        </HStack>
      ))}

      <Button size="sm" variant="subtle" onClick={() => createCardTemplate?.()}>
        <LuPlus />
        {t("action.add")}
      </Button>

      <SortingModal
        isOpen={activeModalKey === "SORTING"}
        onClose={() => setActiveModalKey("")}
        value={selectedSorting}
        onChange={(newValue) =>
          editListSorting?.("cardTemplates", selectedSorting, newValue)
        }
      />

      <CardTemplateEditModal
        isOpen={activeModalKey === "EDITING"}
        onClose={() => setActiveModalKey("")}
        cardTemplate={selectedCardTemplate}
        onDelete={(cardTemplateId) =>
          removeListItems?.("cardTemplates", [cardTemplateId])
        }
        onSave={(update) => updateListItems?.("cardTemplates", [update])}
      />
    </Stack>
  )
}

export default CardTemplateSection
