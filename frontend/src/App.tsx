import { Route, Routes } from "react-router-dom"
import LandingPage from "./pages/Landing"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import HomePageGuard from "./pages/HomePageGuard"
import Home from './pages/Home';

function App() {

  return (
    <Routes>
      <Route path='/' element={<LandingPage />} />
      <Route path='/signup' element={<Signup />} />
      <Route path='/login' element={<Login />} />
      <Route path='/home' element={<HomePageGuard>{<Home />} </HomePageGuard>} />
    </Routes>
  )
}

export default App
