const axios = require("axios");
const express = require("express");

const app = express();
const PORT = 3000;

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/game");
});

app.get("/game", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});

// route for fetching all pokemons
// accepts an optional parameter for fetching the limit
// randomizes each time (defaults to 3) ensures we don't get the same pokemon in the different evolutions
app.get("/pokemons", async (req, res) => {
  const amount = req.query.amount * 3 || 9;
  const randomizer = Math.floor(Math.random() * 1350); // 1350 is the number of pokemons
  try {
    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon?limit=${amount}&offset=${randomizer}`,
    );

    let pokemonsList = response.data.results;
    let result = [];

    for (let i = 0; i < pokemonsList.length; i += 3) {
      result.push(pokemonsList[i]);
    }

    res.status(200).send(result);
  } catch (error) {
    res
      .status(502) // bad gateway
      .send({ message: `Error fetching pokemon data from PokeAPI: ${error}` });
  }
});

app.listen(PORT, () => {
  console.log(`Listening at PORT: ${PORT}`);
});
