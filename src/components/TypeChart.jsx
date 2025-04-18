import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function TypeChart({ pokemonsData }) {
  const typeCount = {};

  pokemonsData.forEach(pokemon => {
    if (pokemon.types) {
      pokemon.types.forEach(t => {
        const typeName = t.type.name;
        typeCount[typeName] = (typeCount[typeName] || 0) + 1;
      });
    }
  });

  const data = {
    labels: Object.keys(typeCount).map(type =>
      type.charAt(0).toUpperCase() + type.slice(1)
    ),
    datasets: [
      {
        data: Object.values(typeCount),
        backgroundColor: [
          '#F08030', '#6890F0', '#78C850', '#F8D030', '#F85888',
          '#98D8D8', '#7038F8', '#705848', '#EE99AC', '#dfdfcc',
          '#C03028', '#A890F0', '#A040A0', '#E0C068', '#B8A038',
          '#A8B820', '#705898', '#B8B8D0'
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', maxWidth: '600px', margin: 'auto', padding: '2rem' }}>
      <h1 style={{ textAlign: 'center' }}>Pokémon Type Distribution</h1>
      <Pie data={data} />
    </div>
  );
}
