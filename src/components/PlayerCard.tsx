import { useEffect, useRef, useState } from "react";
import type { Player } from "../types/player";
import { Link } from "react-router-dom";

interface PlayerCardProps {
    player: Player;
    onEdit: (player: Player) => void;
    onDelete: (player: Player) => void;
}

 export default function PlayerCard({ player, onEdit, onDelete }: PlayerCardProps) {

    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!menuOpen) return;

        const handleClickOutside = (e: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
                setMenuOpen(false);
            }
        };
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key == "Escape") setMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [menuOpen]);

    return (
        <div className="relative w-full max-w-72">
            <Link to={`player/${player.id}`}>
                <div className='w-full max-w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl'>
                    <img src='src/assets/player_placeholder.jpg' alt='Player Name (placeholder)' className='h-80 w-72 object-cover rounded-t-xl'></img>
                    <div className='px-4 py-3 w-72'>
                        <span className='text-gray-500 mr-3 uppercase text-xs'>{player.team}</span>
                        <p className='text-lg font-bold text-black truncate block capitalize'>{player.name}</p>
                        <div className='flex items-center'>
                            {/* <p className='text-base text-gray-400 justify-end-safe'>{player.era}</p> */}
                            <p className='text-base text-gray-400 justify-end-safe'>{player.position === "P" ? player.era ?? "N/A" : player.battingAvg ?? "N/A"}</p>
                        </div>
                    </div>
                </div>
            </Link>

            <div ref={menuRef} className="absolute top-3 right-3 z-10">
                <button
                    type="button"
                    aria-label="Player options"
                    aria-haspopup="menu"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((open) => !open)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100/90 text-gray-500 shadow hover:bg-gray-200"
                >
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                        <circle cx="5" cy="12" r="2"/>
                        <circle cx="12" cy="12" r="2"/>
                        <circle cx="19" cy="12" r="2"/>
                    </svg>
                </button>

                {menuOpen && (
                    <div
                        role="menu"
                        className="absolute right-0 mt-2 w-40 rounded-xl border border-gray-200 bg-white py-2 shadow-lg"
                    >
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setMenuOpen(false);
                                onEdit(player);
                            }}
                            className="block w-full px-4 py-2 text-left text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            role="menuitem"
                            onClick={() => {
                                setMenuOpen(false);
                                onDelete(player);
                            }}
                            className="block w-full px-4 py-2 text-left text-base font-medium text-red-500 hover:bg-red-50"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </div>

        
        
    );    
}