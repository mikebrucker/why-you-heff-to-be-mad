import React from "react";
import CSS from "csstype";
import "../scss/BoardSpace.scss";
import { ICoordinates } from "./Player";

interface IBoardSpaceProps {
  coordinates: ICoordinates;
  red: number;
  black: number;
  yellow: number;
  green: number;
  letter: string;
  occupied: string;
  pieceNumber: string;
}

const BoardSpace: React.SFC<IBoardSpaceProps> = (props) => {
  const { coordinates, red, black, yellow, green, letter } = props;
  const { x, y } = coordinates;

  const style: CSS.Properties =
    x && y
      ? {
          position: "absolute",
          top: `${y * 50}px`,
          left: `${x * 50}px`,
        }
      : { position: "absolute", top: "-9999px", left: "-9999px" };

  const spaceColor =
    red === 1 || red > 40
      ? "red"
      : black === 1 || black > 40
      ? "black"
      : yellow === 1 || yellow > 40
      ? "yellow"
      : green === 1 || green > 40
      ? "green"
      : "neutral";

  return (
    <div className={`BoardSpace ${spaceColor}`} style={style}>
      <div className="letter">{letter}</div>
    </div>
  );
};

export default BoardSpace;
