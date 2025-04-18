import { useEffect, useState } from 'react';
import TypeChart from '../components/TypeChart';

export default function Stats() {
  const [detailedPokemons, setDetailedPokemons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAllPokemonDetails() {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=50');
      const data = await response.json();
      const details = await Promise.all(
        data.results.map(p => fetch(p.url).then(res => res.json()))
      );
      setDetailedPokemons(details);
      setLoading(false);
    }

    fetchAllPokemonDetails();
  }, []);

  if (loading) return <p style={{ textAlign: 'center' }}>Loading chart...</p>;

  return (
    <div>
      <TypeChart pokemonsData={detailedPokemons} />
    </div>
  );
}
