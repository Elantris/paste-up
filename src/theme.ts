import { createSystem, defaultConfig } from "@chakra-ui/react"

export const system = createSystem(defaultConfig, {
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: "#fbf3f0" },
          100: { value: "#f6e2db" },
          200: { value: "#ecc3b6" },
          300: { value: "#e0a08c" },
          400: { value: "#d27f66" },
          500: { value: "#c1694f" },
          600: { value: "#a8553d" },
          700: { value: "#8a4433" },
          800: { value: "#6f382c" },
          900: { value: "#5a3027" },
          950: { value: "#321713" },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          solid: { value: "{colors.brand.600}" },
          contrast: { value: "white" },
          fg: { value: "{colors.brand.700}" },
          muted: { value: "{colors.brand.200}" },
          subtle: { value: "{colors.brand.100}" },
          emphasized: { value: "{colors.brand.300}" },
          focusRing: { value: "{colors.brand.600}" },
        },
      },
    },
  },
})
