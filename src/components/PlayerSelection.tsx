import React, { Component, ChangeEvent } from "react";
import "../scss/PlayerSelection.scss";

interface Props {
  handleChange: (color: keyof State, name: string) => void;
  handleStartGame: () => void;
}
interface State {
  black: string;
  yellow: string;
  green: string;
  red: string;
}

class PlayerSelection extends Component<Props, State> {
  state = {
    black: "",
    yellow: "",
    green: "",
    red: "",
  };

  private handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const player: keyof State = e.target.name as keyof State;
    const name = e.target.value;
    this.setState({ [player]: e.target.value } as {}, () => this.props.handleChange(player, name));
  };

  private handleStartGame = () => {
    this.props.handleStartGame();
  };

  render() {
    const sections = ["yellow", "green", "black", "red"].map((section) => {
      return (
        <div className={`${section}`}>
          <input
            className={`${section}-input`}
            placeholder="Enter Name"
            onChange={this.handleChange}
            name={`${section}`}
          />
        </div>
      );
    });

    return (
      <div className="PlayerSelection">
        {sections}
        <div className="start">
          <button onClick={this.handleStartGame}>START</button>
        </div>
      </div>
    );
  }
}

export default PlayerSelection;
