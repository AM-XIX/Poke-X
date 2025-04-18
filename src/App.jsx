// ==============================
// == Imports & Dependencies ===
// ==============================

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';

import PokemonList from './components/PokemonList';
import Header from './components/Header';
import Footer from './components/Footer';

import Game from './pages/Game';
import Stats from './pages/Stats';
import './App.css';


// ==============================
// ======= Main Component ======
// ==============================

export default function App() {
  // ========= Global State =========
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState("");
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // Load favorites from localStorage at start
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const limit = 20;

  // ==============================
  // ===== Initial Data Load =====
  // ==============================

  useEffect(() => {
    fetchPokemons(offset);
    fetchTypes();
  }, [offset]);

  // Persist favorites in localStorage
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // ==============================
  // ===== API Fetch Methods =====
  // ==============================

  const fetchPokemons = (currentOffset) => {
    fetch(`https://pokeapi.co/api/v2/pokemon?offset=${currentOffset}&limit=${limit}`)
      .then(response => response.json())
      .then(data => {
        const newPokemons = [...pokemons, ...data.results];
        setPokemons(newPokemons);
        setFilteredPokemons(applySearchFilter(newPokemons, search, selectedType, sortOrder));
      })
      .catch(error => console.error("Error loading Pokémon:", error));
  };

  const fetchTypes = () => {
    fetch('https://pokeapi.co/api/v2/type')
      .then(response => response.json())
      .then(data => {
        const officialTypes = data.results.filter(type =>
          !["shadow", "unknown"].includes(type.name)
        );
        setTypes(officialTypes);
      })
      .catch(err => console.error("Error loading types:", err));
  };

  // ==============================
  // ===== Search & Sort Logic ===
  // ==============================

  const applySearchFilter = (list, term, _type, order) => {
    let filtered = list.filter(pokemon =>
      pokemon.name.toLowerCase().includes(term.toLowerCase())
    );

    filtered.sort((a, b) =>
      order === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

    return filtered;
  };

  // ==============================
  // ========= Handlers ==========
  // ==============================

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    setFilteredPokemons(applySearchFilter(pokemons, value, selectedType, sortOrder));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setSelectedType(value);
    setFilteredPokemons(applySearchFilter(pokemons, search, value, sortOrder));
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    setFilteredPokemons(applySearchFilter(pokemons, search, selectedType, value));
  };

  const handleLoadMore = () => {
    setOffset(prev => prev + limit);
  };

  const toggleFavorite = (name) => {
    setFavorites(prev =>
      prev.includes(name)
        ? prev.filter(fav => fav !== name)
        : [...prev, name]
    );
  };

  // ==============================
  // ========== Render ===========
  // ==============================

  return (
    <Router>
      <Header />
      <main>
        <Routes>

          {/* ===== Home / Collection Page ===== */}
          <Route
            path="/"
            element={
              <>
                <h1>Collection</h1>

                {/* === Search, Type Filter, Sort === */}
                <div className="search-bar-wrapper">
                  <input
                    type="text"
                    placeholder="Search Pokémon by name"
                    value={search}
                    onChange={handleSearch}
                    className="search-bar"
                    aria-label="Search Pokémon by name"
                  />
                  <select
                    value={selectedType}
                    onChange={handleTypeChange}
                    className="type-filter"
                    aria-label="Filter by type"
                  >
                    <option value="all">All Types</option>
                    {types.map((type) => (
                      <option key={type.name} value={type.name}>
                        {type.name.charAt(0).toUpperCase() + type.name.slice(1)}
                      </option>
                    ))}
                  </select>
                  <select
                    value={sortOrder}
                    onChange={handleSortChange}
                    className="type-filter"
                    aria-label="Sort by name"
                  >
                    <option value="asc">A → Z</option>
                    <option value="desc">Z → A</option>
                  </select>
                </div>

                {/* === Pokémon Cards List === */}
                {filteredPokemons.length > 0 ? (
                  <PokemonList
                    pokemons={filteredPokemons}
                    selectedType={selectedType}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                  />
                ) : (
                  <p style={{ textAlign: "center" }}>No Pokémon found.</p>
                )}

                {/* === Load More Button === */}
                <div style={{ textAlign: 'center', margin: '30px' }}>
                  <button onClick={handleLoadMore} className="load-more">
                    Load More
                  </button>
                </div>
              </>
            }
          />

          {/* ===== Game Page ===== */}
          <Route path="/game" element={<Game />} />

          {/* ===== Stats Page ===== */}
          <Route path="/stats" element={<Stats />} />

        </Routes>
      </main>
      <Footer />
    </Router>
  );
}
