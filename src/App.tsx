import { useState } from 'react'
import SearchBar from './components/SearchBar';
import { players } from './data/players';
import './App.css'
import PlayerGrid from './components/PlayerGrid';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import Home from "./pages/Home";
import PlayerDetails from "./pages/PlayerDetails";
import Home from './pages/Home';


function App() {
  // const [count, setCount] = useState(0)
  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredPlayers = players.filter((player) => 
  //   player.name.toLowerCase().includes(searchTerm.toLowerCase()) || player.team.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // return (
  //   <>
  //     <SearchBar onSearch={setSearchTerm} />
  //     <div className='text-center p-10'>
  //       <h1 className='font-bold text-4xl mb-4'>MLB Player Tracker</h1>
  //       <h1 className='text-2xl'>Track your favourite players</h1>
  //     </div>
  //     {/* <SearchBar /> */}
  //     <PlayerGrid players={filteredPlayers}/>
  //   </>
  // )

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
