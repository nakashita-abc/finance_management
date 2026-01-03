import { ProfileContext } from "@/providers/ProfileProvider";
import { Box, Flex, IconButton, Popover, Portal } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

export const UserMenu = () => {
    const [open, setOpen] = useState(false)
    const context = useContext(ProfileContext);
    if (!context) {
        throw new Error("useProfile must be used within a ProfileProvider");
    }
    const { email } = context

    const signOutRedirect = () => {
        const clientId = "22omuoadoaf3b2t1in154vjn9e";
        const logoutUri = "http://localhost:5173/logout";
        const cognitoDomain = "https://us-east-1huyvdb3aw.auth.us-east-1.amazoncognito.com";
        window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
    };
    return (
        <Popover.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Popover.Trigger asChild>
                <IconButton bg={"transparent"}
                    variant="plain"
                    _active={{ bg: "transparent" }}
                    _focus={{ boxShadow: "none" }}
                    _focusVisible={{ boxShadow: "none", outline: "none" }}>
                    <FaUser />
                </IconButton>
            </Popover.Trigger>
            <Portal>
                <Popover.Positioner>
                    <Popover.Content>
                        <Popover.Arrow />
                        <Popover.Body>
                            <Box lineHeight={10} fontWeight={500} textStyle={"md"}>
                                <Flex align={"center"} gap={2}>
                                    <FaUser />
                                    {email}
                                </Flex>
                            </Box>
                            <Box lineHeight={10} fontWeight={500} textStyle={"md"}>
                                <Flex align={"center"} gap={2}>
                                    <IconButton bg={"transparent"}
                                        variant={"plain"}
                                        onClick={signOutRedirect}
                                    ><FaSignOutAlt />サインアウト</IconButton>


                                </Flex>
                            </Box>
                        </Popover.Body>
                    </Popover.Content>
                </Popover.Positioner>
            </Portal>
        </Popover.Root>

    )
}