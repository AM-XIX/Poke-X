import { useEffect, useState } from "react";

export default function PokemonCard({ name, url }) {
  const [pokemon, setPokemon] = useState(null);
  const [species, setSpecies] = useState(null);
  const [evolutionStage, setEvolutionStage] = useState("Base");

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
          setEvolutionStage("Évolution");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
      }
    }

    fetchPokemon();
  }, [url]);

  if (!pokemon || !species) return <p>Chargement...</p>;

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

  return (
    <div
      className="pokemon-card"
      style={{
        backgroundColor: cardColor,
      }}
    >
      <div className="card-content">
        <h2>{name.toUpperCase()}</h2>
        <p style={{ fontWeight: "bold" }}>{evolutionStage} Pokémon</p>
        <div className="card-img-frame">
          <img src={pokemon.sprites.front_default} alt={name} />
        </div>
        <p><strong>Type :</strong> {mainType.toUpperCase()}</p>
        <p><strong>Description :</strong> {species.flavor_text_entries.find(entry => entry.language.name === "fr")?.flavor_text || "Description non disponible."}</p>
      </div>
      <div className="card-texture">
      </div>
    </div>
  );
}
