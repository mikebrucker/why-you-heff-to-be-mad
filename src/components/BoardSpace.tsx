import React, { Component } from "react";
import CSS from "csstype";
import "../scss/BoardSpace.scss";
import { ICoordinates } from "./Player";

interface IBoardSpace {
  coordinates: ICoordinates;
  red: number;
  black: number;
  yellow: number;
  green: number;
  letter: string;
  occupied: string;
  pieceNumber: string;
}

export default class BoardSpace extends Component<IBoardSpace, {}> {
  public render() {
    const { coordinates, red, black, yellow, green, letter } = this.props;
    const { x, y } = coordinates;

    const style: CSS.Properties =
      x && y
        ? {
            position: "absolute",
            top: `${y * 50}px`,
            left: `${x * 50}px`
          }
        : { position: "absolute", top: `-9999px`, left: `-9999px` };

    const startSpotColor =
      red === 1
        ? "red"
        : black === 1
        ? "black"
        : yellow === 1
        ? "yellow"
        : green === 1
        ? "green"
        : "papayawhip";

    return (
      <div className={`BoardSpace ${startSpotColor}`} style={style}>
        <div className="letter">{letter}</div>
      </div>
    );
  }
}
