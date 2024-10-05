import { Flex, Heading, HStack, Image } from "@chakra-ui/react"
import ProjectEditor from "./ProjectEditor"
import ProjectPreview from "./ProjectPreview"

function App() {
  return (
    <Flex direction="column" h="100vh" w="100vw" minW="800px" margin="0 auto">
      <HStack as="header" height="4rem" bg="gray.700">
        <Flex
          align="center"
          justify="center"
          w="4rem"
          h="4rem"
          bg="gray.900"
          cursor="pointer"
        >
          <Image src="/label.png" alt="logo" width="2rem" />
        </Flex>

        <Heading as="h1">Paste Up!</Heading>
      </HStack>

      <Flex grow={1} overflow="hidden">
        <Flex shrink={0} direction="column" w="360px" overflow="hidden">
          <ProjectEditor />
        </Flex>

        <Flex grow={1} justify="center" p="1rem" overflowY="auto">
          <ProjectPreview />
        </Flex>
      </Flex>
    </Flex>
  )
}

export default App
