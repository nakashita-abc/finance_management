import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { DashboardPage } from './pages/DashbordPage'
import { ExpenseListPage } from './pages/ExpenseListPage'
import { ExpenseFormPage } from './pages/ExpenseFormPage'
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

  const signOutRedirect = () => {
    const clientId = "22omuoadoaf3b2t1in154vjn9e";
    const logoutUri = "http://localhost:5173/logout";
    const cognitoDomain = "https://us-east-1huyvdb3aw.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    console.log("loading")
    return (
      <VStack colorPalette="teal">
        <Spinner size="xl" color="colorPalette.600" />
        <Text color="colorPalette.600">Loading...</Text>
      </VStack>
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
          <Route path="/expenseList/expenseFrom/:id" element={<ExpenseFormPage />}></Route>
          <Route path="/logout" element={<LogoutPage onClickBackToTop={() => auth.removeUser()}/>}></Route>
        </Routes>
        </Box>
      </BrowserRouter>
    );
  }
  return (
    <div>
      <button onClick={() => auth.signinRedirect()}>Sign in</button>
      <button onClick={() => signOutRedirect()}>Sign out</button>
    </div>

  )
}

export default App
