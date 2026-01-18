import { Box, Flex, Heading, HStack } from "@chakra-ui/react"
import { HeaderMenu } from "./HeaderMenu"
import { UserMenu } from "./UserMenu"
import { FaWallet } from "react-icons/fa"

export const Header = () => {
  return (
    <Box
      bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      position="fixed"
      top={0}
      left={0}
      right={0}
      height="70px"
      zIndex={1000}
      boxShadow="md"
    >
      <Flex align="center" h="100%" px={4} maxW="container.2xl" mx="auto">
        {/* 左側: メニューボタン */}
        <HeaderMenu />

        {/* 中央: ロゴとタイトル */}
        <HStack gap={3} ml={4}>
          <Box
            bg="white"
            borderRadius="full"
            p={2}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <FaWallet size={24} color="#8B5CF6" />
          </Box>
          <Heading fontSize={{ base: "lg", md: "xl" }} color="white" fontWeight="bold">
            Finance Management
          </Heading>
        </HStack>

        {/* 右側: ユーザーメニュー */}
        <Box ml="auto">
          <UserMenu />
        </Box>
      </Flex>
    </Box>
  )
}