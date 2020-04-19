import React, { Component } from "react";
import CSS from "csstype";
import "../scss/Piece.scss";
import { ICoordinates } from "./Player";

interface IPieceProps {
  color: string;
  coordinates: ICoordinates;
  onClick: (e: any) => void;
}

export default class Piece extends Component<IPieceProps> {
  public render() {
    const { color, coordinates } = this.props;
    const x = coordinates.x;
    const y = coordinates.y;

    const style: CSS.Properties =
      coordinates && x && y
        ? {
            position: "absolute",
            top: `${y * 50}px`,
            left: `${x * 50}px`,
          }
        : { position: "absolute", top: "0", left: "0" };

    return <div onClick={this.props.onClick} className={`Piece ${color}-piece`} style={style} />;
  }
}
