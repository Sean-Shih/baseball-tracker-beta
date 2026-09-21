import { useState } from 'react'
import { players } from '../data/players';
import SearchBar from '../components/SearchBar';
import PlayerGrid from '../components/PlayerGrid';


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    
    const filteredPlayers = players.filter((player) => 
    player.name.toLowerCase().includes(searchTerm.toLowerCase()) || player.team.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
    <>
    <SearchBar onSearch={setSearchTerm} />
    <div className='text-center p-10 pt-6'>
        <h1 className='font-bold text-4xl mb-4'>MLB Player Tracker</h1>
        <h1 className='text-2xl'>Track your favourite players</h1>
    </div>
    {/* <SearchBar /> */}
    <PlayerGrid players={filteredPlayers}/>
    </>
    )
}



export default Home