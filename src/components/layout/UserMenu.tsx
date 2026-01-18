import { ProfileContext } from "@/providers/ProfileProvider"
import { Box, Button, IconButton, Popover, Portal, VStack, HStack, Text, Icon } from "@chakra-ui/react"
import { useContext, useState } from "react"
import { FaUser, FaSignOutAlt } from "react-icons/fa"

export const UserMenu = () => {
  const [open, setOpen] = useState(false)
  const context = useContext(ProfileContext)
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider")
  }
  const { email } = context

  const signOutRedirect = () => {
    const clientId = "22omuoadoaf3b2t1in154vjn9e"
    const logoutUri = "http://localhost:5173/logout"
    const cognitoDomain = "https://us-east-1huyvdb3aw.auth.us-east-1.amazoncognito.com"
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(
      logoutUri
    )}`
  }

  return (
    <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
      <Popover.Trigger asChild>
        <IconButton
          aria-label="ユーザーメニュー"
          bg="whiteAlpha.200"
          color="white"
          _hover={{ bg: "whiteAlpha.300" }}
          borderRadius="full"
          size="md"
        >
          <FaUser />
        </IconButton>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content bg="white" borderRadius="lg" shadow="xl" minW="280px">
            <Popover.Arrow />
            <Popover.Body p={4}>
              <VStack align="stretch" gap={3}>
                {/* ユーザー情報 */}
                <Box
                  p={3}
                  bg="purple.50"
                  borderRadius="md"
                  borderWidth="1px"
                  borderColor="purple.200"
                >
                  <HStack gap={2}>
                    <Icon fontSize="lg" color="purple.600">
                      <FaUser />
                    </Icon>
                    <VStack align="start" gap={0}>
                      <Text fontSize="xs" color="gray.600">
                        ログイン中
                      </Text>
                      <Text fontSize="sm" fontWeight="semibold" color="gray.800">
                        {email}
                      </Text>
                    </VStack>
                  </HStack>
                </Box>

                {/* サインアウトボタン */}
                <Button
                  onClick={signOutRedirect}
                  colorScheme="red"
                  variant="outline"
                  size="sm"
                  w="full"
                  _hover={{ bg: "red.50" }}
                >
                  <HStack gap={2}>
                    <Icon>
                      <FaSignOutAlt />
                    </Icon>
                    <Text>サインアウト</Text>
                  </HStack>
                </Button>
              </VStack>
            </Popover.Body>
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  )
}