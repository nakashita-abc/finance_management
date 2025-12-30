import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashbordPage'
import { ExpenseListPage } from './pages/ExpenseListPage'
import { ExpenseFormPage } from './pages/ExpenseFormPage'
import { Header } from './components/layout/Header'
import '@aws-amplify/ui-react/styles.css';
import { useAuth } from "react-oidc-context";

function App() {
  const auth = useAuth();

  const signOutRedirect = () => {
    const clientId = "22omuoadoaf3b2t1in154vjn9e";
    const logoutUri = "<logout uri>";
    const cognitoDomain = "https://us-east-1huyvdb3aw.auth.us-east-1.amazoncognito.com";
    window.location.href = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
  };

  if (auth.isLoading) {
    return <div>Loading...</div>;
  }

  if (auth.error) {
    return <div>Encountering error... {auth.error.message}</div>;
  }

  if (auth.isAuthenticated) {
    return (
      <div>
        <pre> Hello: {auth.user?.profile.email} </pre>
        <pre> ID Token: {auth.user?.id_token} </pre>
        <pre> Access Token: {auth.user?.access_token} </pre>
        <pre> Refresh Token: {auth.user?.refresh_token} </pre>

        <button onClick={() => auth.removeUser()}>Sign out</button>
      </div>
    );
  }
  return (

    <BrowserRouter>
      <Header />
      <div>
        <button onClick={() => auth.signinRedirect()}>Sign in</button>
        <button onClick={() => signOutRedirect()}>Sign out</button>
      </div>
      <Routes>
        <Route path="/" element={<LoginPage />}></Route>
        <Route path="/dashbord" element={<DashboardPage />}></Route>
        <Route path="/expenseList" element={<ExpenseListPage />}></Route>
        <Route path="/expenseList/expenseFrom/:id" element={<ExpenseFormPage />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
