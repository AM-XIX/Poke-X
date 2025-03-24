import { useEffect, useState } from 'react';
import PokemonList from './PokemonList';
import './App.css';

export default function App() {
  const [pokemons, setPokemons] = useState([]);

  useEffect(() => {
    fetch('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(response => response.json())
      .then(data => {
        setPokemons(data.results);
      });
  }, []);

  return (
    <main>
      <h1>Pokémon List</h1>
      <PokemonList pokemons={pokemons} />
    </main>
  );
}