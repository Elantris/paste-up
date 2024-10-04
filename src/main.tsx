import { ChakraProvider, extendTheme, ThemeConfig } from "@chakra-ui/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
}
const theme = extendTheme({ config })

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </StrictMode>,
)
