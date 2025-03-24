import { useEffect, useState } from 'react';

export default function PokemonCard({ name, url }) {
  const [image, setImage] = useState('');

  useEffect(() => {
    fetch(url)
      .then(response => response.json())
      .then(data => {
        setImage(data.sprites.front_default);
      });
  }, [url]);

  return (
    <div className="pokemon-card">
      <h2>{name}</h2>
      {image && <img src={image} alt={name} />}
    </div>
  );
}