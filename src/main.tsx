import { ChakraProvider, createSystem, defaultConfig } from "@chakra-ui/react"
import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { ProjectProvider } from "./ProjectContext.tsx"
import "./index.css"

const system = createSystem(defaultConfig, {
  theme: {

  }
})

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ChakraProvider value={system}>
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </ChakraProvider>
  </StrictMode>,
)
