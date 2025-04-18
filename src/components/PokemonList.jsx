import { AnimatePresence } from "framer-motion";
import PokemonCard from './PokemonCard';

export default function PokemonList({ pokemons, selectedType, favorites, toggleFavorite }) {
  return (
    <div className="pokemon-list" style={{ width: "100%" }}>
      <AnimatePresence mode="popLayout">
        {pokemons.map((pokemon) => {
          const id = pokemon.url.split('/').filter(Boolean).pop();
          return (
            <PokemonCard
              key={pokemon.name}
              name={pokemon.name}
              url={pokemon.url}
              selectedType={selectedType}
              isFavorite={favorites.includes(pokemon.name)}
              toggleFavorite={toggleFavorite}
            />
          );
        })}
      </AnimatePresence>
    </div>
  );
}
