import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function PokemonCard({ name, url, selectedType, isFavorite, toggleFavorite }) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionStage, setEvolutionStage] = useState("Base");
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const response = await fetch(url);
        const data = await response.json();
        setPokemon(data);

        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        setSpecies(speciesData);

        if (speciesData.evolves_from_species) {
          setEvolutionStage("Evolution");
        }

        if (selectedType === "all") {
          setVisible(true);
        } else {
          const matches = data.types.some(t => t.type.name === selectedType);
          setVisible(matches);
        }
      } catch (error) {
        console.error("Error fetching Pokémon data:", error);
      }
    }

    fetchPokemon();
  }, [url, selectedType]);

  if (!pokemon || !species || !visible) return null;

  const typeColor = {
    fire: "#F08030",
    water: "#6890F0",
    grass: "#78C850",
    electric: "#F8D030",
    psychic: "#F85888",
    ice: "#98D8D8",
    dragon: "#7038F8",
    dark: "#705848",
    fairy: "#EE99AC",
    normal: "#dfdfcc",
    fighting: "#C03028",
    flying: "#A890F0",
    poison: "#A040A0",
    ground: "#E0C068",
    rock: "#B8A038",
    bug: "#A8B820",
    ghost: "#705898",
    steel: "#B8B8D0",
  };

  const mainType = pokemon.types[0].type.name;
  const cardColor = typeColor[mainType] || "#dfdfcc";

  const englishEntry = species.flavor_text_entries.find(
    (entry) => entry.language.name === "en"
  );
  const description =
    englishEntry?.flavor_text.replace(/\f/g, " ") || "Description not available.";

  return (
    <motion.div
      layout
      className="pokemon-card"
      style={{ backgroundColor: cardColor }}
      initial={{ opacity: 0, scale: 0.5, rotate: -10, y: 30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      exit={{ opacity: 0, scale: 0.5, rotate: 10, y: -30 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <div className="card-content">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{name.toUpperCase()}</h2>
          <button
            onClick={() => toggleFavorite(name)}
            aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: 'white',
            }}
          >
            {isFavorite ? '★' : '☆'}
          </button>

        </div>
        <p style={{ fontWeight: "bold" }}>{evolutionStage} Pokémon</p>
        <div className="card-img-frame">
          <img src={pokemon.sprites.front_default} alt={name} />
        </div>
        <p><strong>Type:</strong> {mainType.toUpperCase()}</p>
        <p><strong>Description:</strong> {description}</p>
      </div>
      <div className="card-texture"></div>
    </motion.div>
  );
}
