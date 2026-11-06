import "i18next"
import type enUS from "./locales/en-US.json"

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation"
    keySeparator: false
    resources: { translation: typeof enUS }
  }
}
