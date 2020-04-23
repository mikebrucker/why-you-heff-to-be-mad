import React, { Component } from "react";
import Board from "./components/Board";
import PlayerSelection from "./components/PlayerSelection";

interface IPlayer {
  name: string;
  color: "black" | "yellow" | "green" | "red";
}
interface State {
  gameOver: boolean;
  black: string;
  yellow: string;
  green: string;
  red: string;
}

class Game extends Component<{}, State> {
  state: State = {
    gameOver: true,
    black: "",
    yellow: "",
    green: "",
    red: "",
  };

  private handleChange = (color: keyof State, name: string) => {
    this.setState({ [color]: name } as {});
  };

  private handleStartGame = () => {
    const { black, yellow, green, red } = this.state;
    const totalPlayers = [black, yellow, green, red].filter((color) => color).length;
    if (totalPlayers > 1) this.setState({ gameOver: false });
  };

  // Player selection logic

  render() {
    const { gameOver, black, yellow, green, red } = this.state;

    const players: Array<IPlayer> = [
      { name: black, color: "black" },
      { name: yellow, color: "yellow" },
      { name: green, color: "green" },
      { name: red, color: "red" },
    ];

    const game = gameOver ? (
      <PlayerSelection handleChange={this.handleChange} handleStartGame={this.handleStartGame} />
    ) : (
      <Board players={players} />
    );

    return game;
  }
}

export default Game;
