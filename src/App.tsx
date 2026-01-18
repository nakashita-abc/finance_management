import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashbordPage'
import { ExpenseListPage } from './pages/ExpenseListPage'
import { ExpenseFormPage } from './pages/ExpenseFormPage'
import { HomePage } from './pages/HomePage'
import { Header } from './components/layout/Header'
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from "react-oidc-context";
import { LogoutPage } from './pages/LogoutPage'
import { Spinner, VStack, Text, Box, Button, Container, Heading, HStack, Icon } from '@chakra-ui/react'
import { FaExclamationTriangle, FaHome, FaRedo } from 'react-icons/fa'
import { useContext } from 'react'
import { ProfileContext } from './providers/ProfileProvider'

function App() {
  const auth = useAuth();
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  const { setEmail } = context;

  const backToHome = () => {
    auth.removeUser();
    window.location.href = "/";
  }

  if (auth.isLoading) {
    console.log("loading")
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
      >
        <VStack gap={4}>
          <Spinner size="xl" color="white" borderWidth="4px" />
          <Text color="white" fontSize="lg" fontWeight="medium">
            Loading...
          </Text>
        </VStack>
      </Box>
    )
  }

  if (auth.error) {
    console.log("err:", auth.error.message)
    return (
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bg="gray.50"
      >
        <Container maxW="container.sm">
          <VStack
            bg="white"
            borderRadius="2xl"
            shadow="xl"
            p={{ base: 8, md: 12 }}
            gap={6}
            textAlign="center"
          >
            <Box
              bg="red.100"
              borderRadius="full"
              p={4}
            >
              <Icon fontSize="4xl" color="red.500">
                <FaExclamationTriangle />
              </Icon>
            </Box>
            <Heading fontSize={{ base: "xl", md: "2xl" }} color="gray.800">
              エラーが発生しました
            </Heading>
            <Text color="gray.600" fontSize="md" lineHeight="1.7">
              認証処理中にエラーが発生しました。<br />
              お手数ですが、再度お試しください。
            </Text>
            <Box
              bg="red.50"
              borderRadius="md"
              p={4}
              w="full"
              borderWidth="1px"
              borderColor="red.200"
            >
              <Text fontSize="sm" color="red.600" fontFamily="mono">
                {auth.error.message}
              </Text>
            </Box>
            <HStack gap={4} w="full">
              <Button
                flex={1}
                bg="purple.600"
                color="white"
                _hover={{ bg: "purple.700" }}
                onClick={() => auth.signinRedirect()}
              >
                <HStack gap={2}>
                  <Icon>
                    <FaRedo />
                  </Icon>
                  <span>再試行</span>
                </HStack>
              </Button>
              <Button
                flex={1}
                variant="outline"
                colorScheme="gray"
                onClick={() => window.location.href = "/"}
              >
                <HStack gap={2}>
                  <Icon>
                    <FaHome />
                  </Icon>
                  <span>ホームへ</span>
                </HStack>
              </Button>
            </HStack>
          </VStack>
        </Container>
      </Box>
    )
  }

  if (auth.isAuthenticated) {
    console.log(auth.user?.profile)
    setEmail(auth.user?.profile.email || "")
    return (
      <BrowserRouter>
        <div>
          <Header />
          {/* <button onClick={() => auth.removeUser()}>Sign out</button> */}
        </div>
        <Box pt='70px'>
        <Routes>
          <Route path="/" element={<DashboardPage />}></Route>
          <Route path="/expenseList" element={<ExpenseListPage />}></Route>
          <Route path="/expenseForm" element={<ExpenseFormPage />}></Route>
          <Route path="/logout" element={<LogoutPage onClickBackToTop={backToHome} />}></Route>
        </Routes>
        </Box>
      </BrowserRouter>
    );
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage onSignIn={() => auth.signinRedirect()} />} />
        {/* <Route path="/logout" element={<LogoutPage onClickBackToTop={backToHome} />} /> */}
      </Routes>
    </BrowserRouter>
  )
}

export default App
