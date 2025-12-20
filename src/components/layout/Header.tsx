import { Box, Flex } from "@chakra-ui/react"
import { HeaderMenu } from "./HeaderMenu"

export const Header = () => {
    return (
        <Box bg="green.300" position="fixed" top={0} left={0} right={0} height="70px">
            <Flex align="center" h="100%">
                <HeaderMenu />
            </Flex>

        </Box>
    )
}