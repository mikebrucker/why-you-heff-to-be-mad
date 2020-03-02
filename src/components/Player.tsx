import React, { Component } from "react";
import CSS from "csstype";
import "../scss/Player.scss";

import Piece from "./Piece";
import { black, yellow, green, red } from "../models/Player";
import { IBoardSpaceProps } from "./Board";

export interface ICoordinates {
  x: number;
  y: number;
}
export interface IPlayerPiece {
  coordinates: ICoordinates;
  default: ICoordinates;
  boardSpace: number;
  home: boolean;
}
interface IPlayerProps {
  color: string;
  boardSpaces: Array<JSX.Element>;
  pieceForRemoval: IBoardSpaceProps;
  occupySpace: (space: number, color: string, pieceNumber: string) => void;
  emptySpace: (space: number) => void;
  isSpaceOccupied: (space: number) => IBoardSpaceProps;
  removePiece: (pieceForRemoval: IBoardSpaceProps) => void;
}
interface IPlayerState {
  readonly coordinates: ICoordinates;
  readonly boardSpaces: Array<JSX.Element>;
  readonly color: string;
  roll: number;
  turn: boolean;
  allowedToRoll: boolean;
  allowedToMove: boolean;
  initMove: boolean;
  p1: IPlayerPiece;
  p2: IPlayerPiece;
  p3: IPlayerPiece;
  p4: IPlayerPiece;
}

export default class Player extends Component<IPlayerProps, IPlayerState> {
  public state = {
    boardSpaces: this.props.boardSpaces,
    coordinates: { x: 0, y: 0 },
    color: this.props.color,
    roll: 0,
    turn: true,
    allowedToRoll: true,
    allowedToMove: false,
    initMove: false,
    p1: {
      coordinates: { x: 0, y: 0 },
      default: { x: 0, y: 0 },
      boardSpace: 0,
      home: false
    },
    p2: {
      coordinates: { x: 0, y: 0 },
      default: { x: 0, y: 0 },
      boardSpace: 0,
      home: false
    },
    p3: {
      coordinates: { x: 0, y: 0 },
      default: { x: 0, y: 0 },
      boardSpace: 0,
      home: false
    },
    p4: {
      coordinates: { x: 0, y: 0 },
      default: { x: 0, y: 0 },
      boardSpace: 0,
      home: false
    }
  };

  public componentDidMount() {
    switch (this.props.color) {
      case "black":
        this.setState({ ...black });
        break;
      case "yellow":
        this.setState({ ...yellow });
        break;
      case "green":
        this.setState({ ...green });
        break;
      case "red":
        this.setState({ ...red });
    }
  }

  public componentDidUpdate() {
    const { pieceForRemoval } = this.props;
    const { color } = this.state;
    const { occupied, pieceNumber } = pieceForRemoval;

    if (
      ["black", "yellow", "green", "red"].includes(occupied) &&
      occupied === color
    ) {
      this.makePieceGoHome(color, pieceNumber as keyof IPlayerState);
      this.props.removePiece({ occupied: "", pieceNumber: "" });
    }
  }

  public makePieceGoHome = (myColor: string, index: keyof IPlayerState) => {
    const piece: IPlayerPiece = this.state[index] as IPlayerPiece;
    if (piece.coordinates !== piece.default) {
      const updatePiece: IPlayerPiece = {
        ...piece,
        coordinates: piece.default,
        boardSpace: 0
      };
      this.setState(({ [index]: updatePiece } as {}) as IPlayerState);
    }
  };

  public rollDie = (): number => {
    return Math.ceil(Math.random() * 6);
  };

  public myTurn = () => {
    const { allowedToRoll, turn } = this.state;

    if (turn && allowedToRoll) {
      const roll = this.rollDie();
      this.setState({
        roll,
        allowedToRoll: false,
        allowedToMove: true,
        initMove: true
      });
    }
  };

  public moveMe = (pieceNumber: keyof IPlayerState) => {
    const { turn, allowedToMove, initMove, roll } = this.state;

    if (turn && allowedToMove && roll > 0) {
      const { color, boardSpaces } = this.state;
      const piece: IPlayerPiece = this.state[pieceNumber] as IPlayerPiece;

      const newRoll = piece.boardSpace > 0 ? roll - 1 : roll;

      let boardSpace = piece.boardSpace + 1;

      const nextSpace = boardSpaces.filter(
        space => space.props[color] === boardSpace
      )[0];

      const nextSpaceCoordinates = nextSpace.props.coordinates;

      let coordinates: ICoordinates = {
        x: nextSpaceCoordinates.x,
        y: nextSpaceCoordinates.y
      };

      const originalSpace = piece.boardSpace
        ? boardSpaces.filter(
            space => space.props[color] === piece.boardSpace
          )[0].props.black
        : null;

      if (originalSpace && initMove) {
        this.props.emptySpace(originalSpace);
        this.setState({ initMove: false });
      }

      if (newRoll === 0 && boardSpace > 0 && boardSpace < 41) {
        const finalSpace = nextSpace.props.black;
        const occupied: IBoardSpaceProps = this.props.isSpaceOccupied(
          finalSpace
        ) as IBoardSpaceProps;

        if (occupied.occupied) {
          this.props.removePiece(occupied);
        }
        this.props.occupySpace(finalSpace, color, pieceNumber);
      }

      const updatePiece = { ...piece, boardSpace, coordinates };

      this.setState(
        ({ roll: newRoll, [pieceNumber]: updatePiece } as {}) as IPlayerState,
        () =>
          setTimeout(() => {
            this.moveMe(pieceNumber);
          }, 333)
      );
    } else {
      this.setState({ allowedToRoll: true, allowedToMove: false });
    }
  };

  public render() {
    const { color, coordinates, p1, p2, p3, p4, roll, turn } = this.state;
    const x = coordinates.x;
    const y = coordinates.y;
    const displayRoll = turn ? (roll > 0 ? roll : "Click to Roll") : "";

    const style: CSS.Properties =
      coordinates && x && y
        ? {
            position: "absolute",
            top: `${y * 50}px`,
            left: `${x * 50}px`
          }
        : { position: "absolute", top: "-9999px", left: "-9999px" };
    const textStyle: CSS.Properties =
      color === "red" || color === "green"
        ? {
            width: "100%",
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)"
          }
        : {};

    const pieces =
      x > 0 && y > 0 ? (
        <>
          <Piece
            onClick={this.moveMe.bind(this, "p1")}
            color={color}
            boardSpace={0}
            coordinates={{ x: p1.coordinates.x, y: p1.coordinates.y }}
          />
          <Piece
            onClick={this.moveMe.bind(this, "p2")}
            color={color}
            boardSpace={0}
            coordinates={{ x: p2.coordinates.x, y: p2.coordinates.y }}
          />
          <Piece
            onClick={this.moveMe.bind(this, "p3")}
            color={color}
            boardSpace={0}
            coordinates={{ x: p3.coordinates.x, y: p3.coordinates.y }}
          />
          <Piece
            onClick={this.moveMe.bind(this, "p4")}
            color={color}
            boardSpace={0}
            coordinates={{ x: p4.coordinates.x, y: p4.coordinates.y }}
          />
        </>
      ) : null;

    return (
      <div>
        <div onClick={this.myTurn} className={`Player ${color}`} style={style}>
          <div style={textStyle}>
            <div>{color.charAt(0).toUpperCase() + color.slice(1)}</div>
            <div>{displayRoll}</div>
          </div>
        </div>
        {pieces}
      </div>
    );
  }
}
