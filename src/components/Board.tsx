import React, { Component } from "react";
import "../scss/Board.scss";
import BoardSpace from "./BoardSpace";
import Player, { ICoordinates } from "./Player";

export interface IBoardSpaceProps {
  occupied: string;
  pieceNumber: string;
}
export interface IBoardState {
  readonly boardMapCoordinates: Array<ICoordinates>;
  readonly boardHomeCoordinates: Array<ICoordinates>;
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
    ],
    boardMapCoordinates: [
      // black start
      { x: 5, y: 11 },
      { x: 5, y: 10 },
      { x: 5, y: 9 },
      { x: 5, y: 8 },
      { x: 5, y: 7 },
      { x: 4, y: 7 },
      { x: 3, y: 7 },
      { x: 2, y: 7 },
      { x: 1, y: 7 },
      { x: 1, y: 6 },
      // yellow start
      { x: 1, y: 5 },
      { x: 2, y: 5 },
      { x: 3, y: 5 },
      { x: 4, y: 5 },
      { x: 5, y: 5 },
      { x: 5, y: 4 },
      { x: 5, y: 3 },
      { x: 5, y: 2 },
      { x: 5, y: 1 },
      { x: 6, y: 1 },
      // green start
      { x: 7, y: 1 },
      { x: 7, y: 2 },
      { x: 7, y: 3 },
      { x: 7, y: 4 },
      { x: 7, y: 5 },
      { x: 8, y: 5 },
      { x: 9, y: 5 },
      { x: 10, y: 5 },
      { x: 11, y: 5 },
      { x: 11, y: 6 },
      // red start
      { x: 11, y: 7 },
      { x: 10, y: 7 },
      { x: 9, y: 7 },
      { x: 8, y: 7 },
      { x: 7, y: 7 },
      { x: 7, y: 8 },
      { x: 7, y: 9 },
      { x: 7, y: 10 },
      { x: 7, y: 11 },
      { x: 6, y: 11 }
    ],
    boardHomeCoordinates: [
      // black
      { x: 6, y: 10 },
      { x: 6, y: 9 },
      { x: 6, y: 8 },
      { x: 6, y: 7 },
      // yellow
      { x: 2, y: 6 },
      { x: 3, y: 6 },
      { x: 4, y: 6 },
      { x: 5, y: 6 },
      // green
      { x: 6, y: 2 },
      { x: 6, y: 3 },
      { x: 6, y: 4 },
      { x: 6, y: 5 },
      // red
      { x: 10, y: 6 },
      { x: 9, y: 6 },
      { x: 8, y: 6 },
      { x: 7, y: 6 }
    ]
  };

  public occupySpace = (space: number, color: string, pieceNumber: string) => {
    const { board } = this.state;
    board[space] = { occupied: color, pieceNumber };
    this.setState({ board });
  };

  public emptySpace = (space: number) => {
    const { board } = this.state;
    board[space] = { occupied: "", pieceNumber: "" };
    this.setState({ board });
  };

  public isSpaceOccupied = (space: number) => {
    const { board } = this.state;
    return board[space];
  };

  public removePiece = (pieceForRemoval: IBoardSpaceProps) => {
    this.setState({ pieceForRemoval });
  };

  public render() {
    const {
      boardMapCoordinates,
      boardHomeCoordinates,
      pieceForRemoval
    } = this.state;
    const boardSpaces: Array<JSX.Element> = [];

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

    return (
      <div className="Board">
        <Player
          removePiece={this.removePiece}
          occupySpace={this.occupySpace}
          emptySpace={this.emptySpace}
          isSpaceOccupied={this.isSpaceOccupied}
          boardSpaces={boardSpaces}
          color="black"
          pieceForRemoval={pieceForRemoval}
        />
        <Player
          removePiece={this.removePiece}
          occupySpace={this.occupySpace}
          emptySpace={this.emptySpace}
          isSpaceOccupied={this.isSpaceOccupied}
          boardSpaces={boardSpaces}
          color="yellow"
          pieceForRemoval={pieceForRemoval}
        />
        <Player
          removePiece={this.removePiece}
          occupySpace={this.occupySpace}
          emptySpace={this.emptySpace}
          isSpaceOccupied={this.isSpaceOccupied}
          boardSpaces={boardSpaces}
          color="green"
          pieceForRemoval={pieceForRemoval}
        />
        <Player
          removePiece={this.removePiece}
          occupySpace={this.occupySpace}
          emptySpace={this.emptySpace}
          isSpaceOccupied={this.isSpaceOccupied}
          boardSpaces={boardSpaces}
          color="red"
          pieceForRemoval={pieceForRemoval}
        />
        {boardSpaces}
      </div>
    );
  }
}
