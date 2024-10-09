import { Box, Flex, Heading, HStack, Image } from "@chakra-ui/react"
import ProjectEditor from "./ProjectEditor"
import ProjectPreview from "./ProjectPreview"

function App() {
  return (
    <Flex id="app" direction="column" h="100vh" w="100vw" margin="0 auto">
      <HStack as="header" height="4rem" bg="gray.700">
        <Flex
          align="center"
          justify="center"
          w="4rem"
          h="4rem"
          bg="gray.900"
          cursor="pointer"
        >
          <Image src="label.png" alt="logo" width="2rem" />
        </Flex>

        <Heading as="h1">Paste Up!</Heading>
      </HStack>

      <Flex grow={1} overflow="hidden">
        <Flex
          as="aside"
          shrink={0}
          direction="column"
          w="360px"
          overflow="hidden"
          bg="gray.800"
        >
          <ProjectEditor />
        </Flex>

        <Box as="main" flexGrow={1} p="1rem" overflow="auto" bg="gray.900">
          <ProjectPreview />
        </Box>
      </Flex>
    </Flex>
  )
}

export default App
