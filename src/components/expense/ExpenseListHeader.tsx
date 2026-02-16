import { Button, Heading, HStack, Icon } from "@chakra-ui/react"
import { FaPlusCircle } from "react-icons/fa"
import { useNavigate } from "react-router-dom";

export const ExpenseListHeader = () => {
    const navigate = useNavigate();

    return(
        <HStack mb={6} justify="space-between" align="center">
        <Heading fontSize={{ base: "2xl", md: "3xl" }} color="gray.800">
          支出一覧
        </Heading>
        <Button
          bg="purple.600"
          color="white"
          _hover={{ bg: "purple.700" }}
          onClick={() => navigate("/expenseForm")}
        >
          <HStack gap={2}>
            <Icon>
              <FaPlusCircle />
            </Icon>
            <span>新規登録</span>
          </HStack>
        </Button>
      </HStack>
    )
}