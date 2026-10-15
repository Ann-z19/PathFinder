import {Routes, Route} from 'react-router'
import Home from './pages/Home'
import Assessment from './pages/Assessment'
import NotFound from './pages/NotFound'
import Results from './pages/Results'
import Compare from './pages/Compare'
import Shortlist from './pages/Shortlist'
import SignIn from './pages/SignIn'
import CareerDetails from './pages/CareerDetails'
import Layout from './components/Layout'

function App(){
  return(
    <Routes>
      <Route element={<Layout />}>
        <Route path='/' element={<Home />} />
        <Route path='/assessment' element={<Assessment />} />
        <Route path='/results' element={<Results/>}/>
        <Route path='/compare' element={<Compare/>}/>
        <Route path='/shortlist' element={<Shortlist/>}/>
        <Route path='/signin' element={<SignIn/>}/>
        <Route path='/careers/:code' element={<CareerDetails/>}/>
        <Route path='*' element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
