import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import App from "./App.tsx"
import { Provider } from "./components/ui/provider"
import { ProjectProvider } from "./ProjectContext.tsx"
import "./index.css"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider forcedTheme="dark">
      <ProjectProvider>
        <App />
      </ProjectProvider>
    </Provider>
  </StrictMode>,
)
