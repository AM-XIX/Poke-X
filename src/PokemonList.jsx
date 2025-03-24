import PokemonCard from './PokemonCard';

export default function PokemonList({ pokemons }) {
  return (
    <div className="pokemon-list">
      {pokemons.map((pokemon, index) => (
        <PokemonCard key={index} name={pokemon.name} url={pokemon.url} />
      ))}
    </div>
  );
}