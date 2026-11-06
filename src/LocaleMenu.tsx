import { Button, Menu, Portal } from "@chakra-ui/react"
import { useTranslation } from "react-i18next"
import { LuLanguages } from "react-icons/lu"
import { changeLocale, locales, type Locale } from "./i18n/i18n"

const LocaleMenu = () => {
  const { t, i18n } = useTranslation()
  const locale = i18n.resolvedLanguage
  const current = locales.find((item) => item.code === locale)

  return (
    <Menu.Root positioning={{ placement: "bottom-end" }}>
      <Menu.Trigger asChild>
        <Button
          size="sm"
          variant="ghost"
          aria-label={`${t("header.language")} (${current?.label})`}
          color="colorPalette.contrast"
          _hover={{ bg: "brand.700" }}
          _expanded={{ bg: "brand.700" }}
        >
          <LuLanguages />
          {current?.label}
        </Button>
      </Menu.Trigger>

      <Portal>
        <Menu.Positioner>
          <Menu.Content minW="10rem">
            <Menu.RadioItemGroup
              value={locale}
              onValueChange={(e) => void changeLocale(e.value as Locale)}
            >
              <Menu.ItemGroupLabel>{t("header.language")}</Menu.ItemGroupLabel>
              {locales.map((item) => (
                <Menu.RadioItem
                  key={item.code}
                  value={item.code}
                  lang={item.code}
                >
                  <Menu.ItemText>{item.label}</Menu.ItemText>
                  <Menu.ItemIndicator />
                </Menu.RadioItem>
              ))}
            </Menu.RadioItemGroup>
          </Menu.Content>
        </Menu.Positioner>
      </Portal>
    </Menu.Root>
  )
}

export default LocaleMenu
