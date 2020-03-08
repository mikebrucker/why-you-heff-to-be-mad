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
interface IPlayerPiece {
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
  roll: Array<number>;
  turn: boolean;
  allowedToRoll: boolean;
  allowedToMove: boolean;
  moveOnlyOnePiece: boolean;
  moving: boolean;
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
    roll: [],
    turn: true,
    allowedToRoll: true,
    allowedToMove: false,
    moveOnlyOnePiece: false,
    moving: false,
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

  private makePieceGoHome = (myColor: string, index: keyof IPlayerState) => {
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

  private rollDie = (numberOfRolls: number): Array<number> => {
    const rolls = [];
    for (let i = 0; i < numberOfRolls; i++) {
      rolls.push(Math.ceil(Math.random() * 6));
    }
    return rolls;
  };

  private moveToNextSpace = (piece: IPlayerPiece, roll?: number) => {
    const { color, boardSpaces } = this.state;
    const newRoll = roll ? roll - 1 : 0;
    const boardSpace = piece.boardSpace + 1;
    const nextSpace = boardSpaces.filter(space => space.props[color] === boardSpace)[0];
    const finalSpace = nextSpace.props.black ? nextSpace.props.black : boardSpace;
    const coordinates: ICoordinates = {
      x: nextSpace.props.coordinates.x,
      y: nextSpace.props.coordinates.y
    };
    const originalSpace =
      roll && piece.boardSpace
        ? boardSpaces.filter(space => space.props[color] === piece.boardSpace)[0].props.black
        : null;

    return { newRoll, boardSpace, finalSpace, coordinates, originalSpace };
  };

  private moveFromJail = (piece: IPlayerPiece, pieceNumber: string) => {
    const { color } = this.state;
    const { boardSpace, finalSpace, coordinates } = this.moveToNextSpace(piece);

    const occupied: IBoardSpaceProps = this.props.isSpaceOccupied(finalSpace) as IBoardSpaceProps;

    if (occupied.occupied) {
      this.props.removePiece(occupied);
    }
    this.props.occupySpace(finalSpace, color, pieceNumber);

    const updatePiece = { ...piece, boardSpace, coordinates };

    this.setState(({
      [pieceNumber]: updatePiece
    } as {}) as IPlayerState);
  };

  private moveMe = (pieceNumber: keyof IPlayerState) => {
    const { turn, allowedToMove } = this.state;
    const piece: IPlayerPiece = this.state[pieceNumber] as IPlayerPiece;
    if (piece.boardSpace === 44) {
      // logic to make sure it cant replace a home piece or go past last space goes here
      return this.setState({
        allowedToRoll: true,
        allowedToMove: false,
        roll: [0],
        moveOnlyOnePiece: true,
        initMove: false,
        moving: false
      });
    }

    if (turn && allowedToMove && piece.boardSpace) {
      this.setState({ moving: true });
      const { roll } = this.state;

      if (roll.length === 1 && roll[0] > 0) {
        let myRoll = roll[0];
        const { color, initMove } = this.state;
        const {
          newRoll,
          boardSpace,
          finalSpace,
          coordinates,
          originalSpace
        } = this.moveToNextSpace(piece, myRoll);

        if (originalSpace && initMove) {
          this.props.emptySpace(originalSpace);
          this.setState({ initMove: false });
        }

        if (newRoll === 0 && boardSpace > 0 && boardSpace < 41) {
          const occupied: IBoardSpaceProps = this.props.isSpaceOccupied(
            finalSpace
          ) as IBoardSpaceProps;

          if (occupied.occupied) {
            this.props.removePiece(occupied);
          }
          this.props.occupySpace(finalSpace, color, pieceNumber);
          this.setState({ moveOnlyOnePiece: true });
        }

        const home = boardSpace > 40;
        const updatePiece = { ...piece, boardSpace, coordinates, home };
        this.setState(
          ({
            roll: [newRoll],
            [pieceNumber]: updatePiece
          } as {}) as IPlayerState,
          () =>
            setTimeout(() => {
              this.moveMe(pieceNumber);
            }, 333)
        );
      } else {
        this.setState({
          allowedToRoll: true,
          allowedToMove: false,
          moving: false
        });
      }
    }
  };

  private myTurn = () => {
    const { turn, allowedToRoll, p1, p2, p3, p4 } = this.state;

    if (turn && allowedToRoll) {
      const roll =
        (p1.boardSpace === 0 || p1.home) &&
        (p2.boardSpace === 0 || p2.home) &&
        (p3.boardSpace === 0 || p3.home) &&
        (p4.boardSpace === 0 || p4.home)
          ? this.rollDie(3)
          : this.rollDie(1);

      // all pieces can't move so roll 3 times
      if (
        !roll.includes(6) &&
        p1.boardSpace === 0 &&
        p2.boardSpace === 0 &&
        p3.boardSpace === 0 &&
        p4.boardSpace === 0
      ) {
        this.setState({
          roll,
          allowedToRoll: true
        });
        // roll a six to get a piece out or go again
      } else if (roll.includes(6)) {
        const piece = [p1, p2, p3, p4]
          .map((p, i) => {
            return { p, num: `p${i + 1}` };
          })
          .filter(p => p.p.boardSpace === 0)[0];
        // if you have jail pieces auto moves out one
        if (piece) {
          this.setState({
            roll
          });
          return this.moveFromJail(piece.p, piece.num);
          // if no pieces in jail move like normal
        } else {
          this.setState({
            roll,
            allowedToRoll: false,
            allowedToMove: true,
            initMove: true,
            moveOnlyOnePiece: true
          });
        }
        // no 6 and pieces on board normal move
      } else {
        this.setState({
          roll,
          allowedToRoll: false,
          allowedToMove: true,
          initMove: true,
          moveOnlyOnePiece: true
        });
      }
    }
  };

  private moveThisPiece = (pieceNumber: keyof IPlayerState) => {
    const { turn } = this.state;
    if (turn) {
      const { moveOnlyOnePiece, moving, p1, p2, p3, p4 } = this.state;
      const piece: IPlayerPiece = this.state[pieceNumber] as IPlayerPiece;

      if (
        (p1.boardSpace !== 1 &&
          p2.boardSpace !== 1 &&
          p3.boardSpace !== 1 &&
          p4.boardSpace !== 1) ||
        piece.boardSpace === 1
      ) {
        if (piece.boardSpace && moveOnlyOnePiece && !moving) {
          this.setState({ moveOnlyOnePiece: false }, () => this.moveMe(pieceNumber));
        }
      }
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

    if (["black", "yellow", "green", "red"].includes(occupied) && occupied === color) {
      this.makePieceGoHome(color, pieceNumber as keyof IPlayerState);
      this.props.removePiece({ occupied: "", pieceNumber: "" });
    }
  }

  public render() {
    const { color, coordinates, p1, p2, p3, p4, roll, turn } = this.state;
    const x = coordinates.x;
    const y = coordinates.y;

    const displayRoll = turn
      ? roll.length > 1
        ? `${roll[0]}, ${roll[1]}, ${roll[2]}`
        : roll.length === 1 && roll[0] > 0
        ? `${roll[0]}`
        : "Click to Roll"
      : "Wait Your Turn";

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
            onClick={this.moveThisPiece.bind(this, "p1")}
            color={color}
            coordinates={{ x: p1.coordinates.x, y: p1.coordinates.y }}
          />
          <Piece
            onClick={this.moveThisPiece.bind(this, "p2")}
            color={color}
            coordinates={{ x: p2.coordinates.x, y: p2.coordinates.y }}
          />
          <Piece
            onClick={this.moveThisPiece.bind(this, "p3")}
            color={color}
            coordinates={{ x: p3.coordinates.x, y: p3.coordinates.y }}
          />
          <Piece
            onClick={this.moveThisPiece.bind(this, "p4")}
            color={color}
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
