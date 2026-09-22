import { useEffect, useState } from 'react'
// import { players } from '../data/players';
import SearchBar from '../components/SearchBar';
import PlayerGrid from '../components/PlayerGrid';
import type { Player } from '../types/player';
import { data } from 'react-router-dom';


function Home() {
    const [searchTerm, setSearchTerm] = useState("");
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        fetch("http://localhost:8080/api/players")
            .then((response) => response.json())
            .then((data) => {
                setPlayers(data);
        });
    }, []);
        
    
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