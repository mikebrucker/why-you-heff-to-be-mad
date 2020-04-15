import React, { Component } from "react";
import "../scss/Board.scss";
import BoardSpace from "./BoardSpace";
import Player from "./Player";
import { boardMapCoordinates, boardHomeCoordinates } from "../models/Board";

export interface IBoardSpaceProps {
  occupied: string;
  pieceNumber: string;
}
export interface IBoardState {
  board: Array<IBoardSpaceProps>;
  pieceForRemoval: IBoardSpaceProps;
}

export default class Board extends Component<{}, IBoardState> {
  public state = {
    pieceForRemoval: { occupied: "", pieceNumber: "" },
    board: [
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" },
      { occupied: "", pieceNumber: "" }
    ]
  };

  public occupySpace = (space: number, color: string, pieceNumber: string) => {
    const { board } = this.state;
    board[space - 1] = { occupied: color, pieceNumber };
    this.setState({ board });
  };

  public emptySpace = (space: number) => {
    const { board } = this.state;
    board[space - 1] = { occupied: "", pieceNumber: "" };
    this.setState({ board });
  };

  public isSpaceOccupied = (space: number) => {
    const { board } = this.state;
    return board[space - 1];
  };

  public removePiece = (pieceForRemoval: IBoardSpaceProps) => {
    this.setState({ pieceForRemoval });
  };

  public render() {
    const { pieceForRemoval } = this.state;
    const boardSpaces: Array<JSX.Element> = [];

    // Create boardspaces 1-40
    for (let i: number = 0; i < boardMapCoordinates.length; i++) {
      const currentSpace = this.state.board[i];
      const o = currentSpace.occupied;
      const p = currentSpace.pieceNumber;
      const b = i + 1;
      const y = b > 10 ? b - 10 : b + 30;
      const g = b > 20 ? b - 20 : b + 20;
      const r = b > 30 ? b - 30 : b + 10;
      const letter = b === 1 || y === 1 || g === 1 || r === 1 ? "A" : "";

      boardSpaces.push(
        <BoardSpace
          occupied={o}
          pieceNumber={p}
          key={i}
          letter={letter}
          black={b}
          yellow={y}
          green={g}
          red={r}
          coordinates={{
            x: boardMapCoordinates[i].x,
            y: boardMapCoordinates[i].y
          }}
        />
      );
    }

    // Create home board spaces
    for (var j = 0; j < boardHomeCoordinates.length; j++) {
      const k = j % 4;
      const b = j < 4 ? k + 41 : 0;
      const y = j > 3 && j < 8 ? k + 41 : 0;
      const g = j > 7 && j < 12 ? k + 41 : 0;
      const r = j > 11 && j ? k + 41 : 0;
      const letter = ["a", "b", "c", "d"];

      boardSpaces.push(
        <BoardSpace
          occupied={""}
          pieceNumber={""}
          key={j + 40}
          letter={letter[k]}
          black={b}
          yellow={y}
          green={g}
          red={r}
          coordinates={{
            x: boardHomeCoordinates[j].x,
            y: boardHomeCoordinates[j].y
          }}
        />
      );
    }

    const players = ["black", "yellow", "green", "red"].map(color => {
      return (
        <Player
          key={color}
          color={color}
          boardSpaces={boardSpaces}
          pieceForRemoval={pieceForRemoval}
          removePiece={this.removePiece}
          occupySpace={this.occupySpace}
          emptySpace={this.emptySpace}
          isSpaceOccupied={this.isSpaceOccupied}
        />
      );
    });

    return (
      <div className="Board">
        {players}
        {boardSpaces}
      </div>
    );
  }
}
