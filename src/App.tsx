import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { DashboardPage } from './pages/DashbordPage'
import { ExpenseListPage } from './pages/ExpenseListPage'
import { ExpenseFormPage } from './pages/ExpenseFormPage'
import { Header } from './components/layout/Header'

function App() {
  return (
    <BrowserRouter>
      <Header/>
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
