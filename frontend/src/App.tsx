
import './App.css'
import {BrowserRouter,Routes,Route} from "react-router-dom"

import LandingPage from './pages/signin'
import Tasks from './pages/dashboard'

function App() {

  return(
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<LandingPage/>}></Route>
      <Route path='/dashboard' element={<Tasks/>}></Route>
      
      <Route path='*' element={<div>page not found</div>}></Route>
    </Routes>
    </BrowserRouter>
  )


}

export default App
