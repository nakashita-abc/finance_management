import { Box, Button, Container, Heading, Text, VStack } from "@chakra-ui/react"
import { FaCheckCircle } from "react-icons/fa"
import type { FC } from "react"

type props = {
  onClickBackToTop: () => void
}

export const LogoutPage: FC<props> = (props) => {
  console.log("LogoutPage rendered")
  return (
    <Box
      minH="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    >
      <Container maxW="container.sm">
        <VStack
          bg="white"
          borderRadius="2xl"
          shadow="2xl"
          p={{ base: 8, md: 12 }}
          gap={6}
          textAlign="center"
        >
          <Box color="green.500">
            <FaCheckCircle size={64} />
          </Box>
          <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
            ログアウトしました
          </Heading>
          <Text color="gray.600" fontSize="md" lineHeight="1.7">
            ご利用ありがとうございました。
            <br />
            またのご利用をお待ちしております。
          </Text>
          <Button
            bg="purple.600"
            color="white"
            size="lg"
            onClick={props.onClickBackToTop}
            px={8}
            py={6}
            fontSize="md"
            _hover={{
              bg: "purple.700",
              transform: "translateY(-2px)",
              shadow: "lg"
            }}
            transition="all 0.3s"
            w="full"
          >
            ホームに戻る
          </Button>
        </VStack>
      </Container>
    </Box>
  )
}