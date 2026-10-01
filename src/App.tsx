import './App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PlayerDetails from "./pages/PlayerDetails";
import Home from './pages/Home';


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/player/:id' element={<PlayerDetails />}/>
      </Routes>
    </BrowserRouter>
  );
  
}

export default App
