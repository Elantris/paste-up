import { Box, Flex, Heading, HStack, Image } from "@chakra-ui/react"
import ProjectEditor from "./ProjectEditor"
import ProjectPreview from "./ProjectPreview"

function App() {
  return (
    <>
      <Flex id="app" direction="column" h="100vh" w="100vw" margin="0 auto">
        <HStack as="header" height="3rem" bg="bg.panel" borderBottomWidth="1px">
          <Flex
            align="center"
            justify="center"
            w="3rem"
            h="3rem"
            bg="bg.muted"
            cursor="pointer"
          >
            <Image src="label.png" alt="logo" width="1.5rem" />
          </Flex>

          <Heading as="h1" size="2xl">
            Paste Up!
          </Heading>
        </HStack>

        <Flex grow={1} overflow="hidden">
          <Flex
            as="aside"
            shrink={0}
            direction="column"
            w="360px"
            overflow="hidden"
            bg="bg.subtle"
            borderEndWidth="1px"
          >
            <ProjectEditor />
          </Flex>

          <Box as="main" flexGrow={1} p="1rem" overflow="auto" bg="bg.muted">
            <ProjectPreview type="screen" />
          </Box>
        </Flex>
      </Flex>

      <ProjectPreview type="print" />
    </>
  )
}

export default App
