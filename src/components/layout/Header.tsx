import { Box, Flex } from "@chakra-ui/react"
import { HeaderMenu } from "./HeaderMenu"
import { UserMenu } from "./UserMenu"

export const Header = () => {
    return (
        <Box bg="green.300" position="fixed" top={0} left={0} right={0} height="70px" zIndex={1000}>
            <Flex align="center" h="100%">
                <HeaderMenu />
                <Box margin={5} marginLeft="auto">
                    <UserMenu/>
                </Box>
                
            </Flex>

        </Box>
    )
}