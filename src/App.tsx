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
import { Spinner, VStack, Text, Box } from '@chakra-ui/react'
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
      >
        <VStack colorPalette="teal">
          <Spinner size="xl" color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      </Box>
    )
  }

  if (auth.error) {
    console.log("err:", auth.error.message)
    console.log("err:", auth.error.name)
    console.log("err:", auth.error.stack)
    return <div>Encountering error... {auth.error.message}</div>;
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
