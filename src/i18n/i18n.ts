import i18n from "i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import { initReactI18next } from "react-i18next"
import enUS from "./locales/en-US.json"
import jaJP from "./locales/ja-JP.json"
import koKR from "./locales/ko-KR.json"
import zhCN from "./locales/zh-CN.json"
import zhTW from "./locales/zh-TW.json"

export const resources = {
  "zh-TW": { translation: zhTW },
  "zh-CN": { translation: zhCN },
  "ja-JP": { translation: jaJP },
  "ko-KR": { translation: koKR },
  "en-US": { translation: enUS },
} satisfies Record<string, { translation: typeof enUS }>

export type Locale = keyof typeof resources
export type MessageKey = keyof typeof enUS

export const locales: { code: Locale; label: string }[] = [
  { code: "zh-TW", label: "繁體中文" },
  { code: "zh-CN", label: "简体中文" },
  { code: "ja-JP", label: "日本語" },
  { code: "ko-KR", label: "한국어" },
  { code: "en-US", label: "English" },
]

const LOCALE_KEY = "paste-up-locale"

const toLocale = (tag: string): string => {
  const lowerTag = tag.toLowerCase()
  if (
    ["zh-tw", "zh-hk", "zh-mo"].includes(lowerTag) ||
    lowerTag.startsWith("zh-hant")
  ) {
    return "zh-TW"
  }
  if (lowerTag.startsWith("zh")) {
    return "zh-CN"
  }
  if (lowerTag.startsWith("ja")) {
    return "ja-JP"
  }
  if (lowerTag.startsWith("ko")) {
    return "ko-KR"
  }
  if (lowerTag.startsWith("en")) {
    return "en-US"
  }
  return tag
}

i18n.on("languageChanged", (language) => {
  document.documentElement.lang = language
})

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    supportedLngs: Object.keys(resources),
    fallbackLng: "en-US",
    load: "currentOnly",
    keySeparator: false,
    interpolation: { escapeValue: false },
    initAsync: false,
    detection: {
      order: ["localStorage", "navigator"],
      lookupLocalStorage: LOCALE_KEY,
      // The language menu saves explicit picks; detected languages stay unsaved.
      caches: [],
      convertDetectedLanguage: toLocale,
    },
  })

export const changeLocale = async (locale: Locale) => {
  await i18n.changeLanguage(locale)
  localStorage.setItem(LOCALE_KEY, locale)
}

export default i18n
