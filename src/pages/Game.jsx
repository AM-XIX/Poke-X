import React, { useState, useEffect } from "react";

export default function Game() {
  const [question, setQuestion] = useState("");
  const [choices, setChoices] = useState([]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [pokemonImage, setPokemonImage] = useState("");
  const [imageFlipped, setImageFlipped] = useState(false);
  const [hintVisible, setHintVisible] = useState(true);
  const [questionAnswered, setQuestionAnswered] = useState(false);

  const startGame = async () => {
    setGameStarted(true);
    setFeedback("");
    await loadNewQuestion();
  };

  const getPokemonData = async (id) => {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    if (!response.ok) {
      throw new Error("Pokemon not found");
    }
    return response.json();
  };

  const generateAnswerChoices = (correctType) => {
    setCorrectAnswer(correctType);

    const types = [
      "normal", "fighting", "flying", "poison", "ground", "rock",
      "bug", "ghost", "steel", "fire", "water", "grass", "electric",
      "psychic", "ice", "dragon", "dark", "fairy",
    ];

    const choicesSet = new Set();
    choicesSet.add(correctType);

    while (choicesSet.size < 4) {
      const randomType = types[Math.floor(Math.random() * types.length)];
      choicesSet.add(randomType);
    }

    setChoices(Array.from(choicesSet).sort(() => Math.random() - 0.5));
  };

  const loadNewQuestion = async () => {
    setQuestionAnswered(false);
    setFeedback("");
    const pokemonId = Math.floor(Math.random() * 898) + 1;
    const pokemonData = await getPokemonData(pokemonId);

    const pokemonType = pokemonData.types[0].type.name;
    const pokemonImageUrl = pokemonData.sprites.front_default;

    setQuestion(
      `What is the type of ${pokemonData.name.charAt(0).toUpperCase() + pokemonData.name.slice(1)}?`
    );
    setPokemonImage(pokemonImageUrl);
    generateAnswerChoices(pokemonType);
    setHintVisible(true);
    setImageFlipped(false);
  };

  const selectAnswer = (selected) => {
    if (selected === correctAnswer) {
      setFeedback("✅ Correct!");
      setScore(score + 1);
    } else {
      setFeedback(`❌ Wrong! It was ${correctAnswer.toUpperCase()}.`);
    }
    setQuestionAnswered(true);
  };

  const resetGame = () => {
    setGameStarted(false);
    setQuestion("");
    setChoices([]);
    setFeedback("");
    setScore(0);
    setPokemonImage("");
    setImageFlipped(false);
    setHintVisible(true);
    setQuestionAnswered(false);
  };

  const toggleImage = () => {
    setImageFlipped(true);
    setHintVisible(false);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Quiz</h2>
      {gameStarted ? (
        <div>
          <img
            src={pokemonImage}
            alt="Pokemon"
            style={{
              width: "200px",
              height: "200px",
              filter: imageFlipped ? "none" : "blur(10px)",
              cursor: "pointer",
            }}
            onClick={toggleImage}
          />

          {hintVisible && <p>Click on the image to reveal the Pokémon!</p>}

          <h3>{question}</h3>
          <div>
            {choices.map((choice, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(choice)}
                className="quiz-button"
              >
                {choice.charAt(0).toUpperCase() + choice.slice(1)}
              </button>
            ))}
          </div>

          <p style={{ fontSize: "1.2rem", fontWeight: "bold", marginTop: "10px" }}>
            {feedback}
          </p>

          <h3>Score: {score}</h3>
          <button
            onClick={loadNewQuestion}
            disabled={!questionAnswered}
            className="quiz-button"
          >
            Next Question
          </button>
          <button onClick={resetGame} className="quiz-button">
            Reset Game
          </button>
        </div>
      ) : (
        <div>
          <p>Welcome to the Pokémon Quiz!</p>
          <p>Test your knowledge of Pokémon types.</p>
          <button onClick={startGame} className="quiz-button">
            Start Game
          </button>
        </div>
      )}
    </div>
  );
}
