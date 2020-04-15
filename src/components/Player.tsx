import React, { Component } from "react";
import CSS from "csstype";
import "../scss/Player.scss";

import Piece from "./Piece";
import { IBoardSpaceProps } from "./Board";
import { black, yellow, green, red } from "../models/Player";

export interface ICoordinates {
  x: number;
  y: number;
}
export interface IPlayerPiece {
  coordinates: ICoordinates;
  default: ICoordinates;
  boardSpace: number;
  home: boolean;
  cantMove: boolean;
}
interface IMoveToNextSpace {
  newRoll: number;
  boardSpace: number;
  finalSpace: number;
  coordinates: ICoordinates;
  originalSpace: number;
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

const EMPTY_PLAYER = {
  coordinates: { x: 0, y: 0 },
  default: { x: 0, y: 0 },
  boardSpace: 0,
  home: false,
  cantMove: false
};

export default class Player extends Component<IPlayerProps, IPlayerState> {
  public state = {
    boardSpaces: this.props.boardSpaces,
    coordinates: { x: 0, y: 0 },
    color: this.props.color,
    roll: [0],
    turn: true,
    allowedToRoll: true,
    allowedToMove: false,
    moveOnlyOnePiece: false,
    moving: false,
    initMove: false,
    p1: EMPTY_PLAYER,
    p2: EMPTY_PLAYER,
    p3: EMPTY_PLAYER,
    p4: EMPTY_PLAYER
  };

  private canOtherPiecesMove = (pieceNumber: keyof IPlayerState, boardSpace: number) => {
    const piecesToReturn = [];
    const otherPieces = this.otherPieces(pieceNumber);
    const otherPieceKeys = [
      "p1" as keyof IPlayerState,
      "p2" as keyof IPlayerState,
      "p3" as keyof IPlayerState,
      "p4" as keyof IPlayerState
    ].filter(p => p !== pieceNumber);
    const otherPiecesSpaces = otherPieces.map(p => p.boardSpace);
    if (boardSpace === 44) {
      if (otherPiecesSpaces.includes(43)) {
        const piece = otherPieces
          .map((p, i) => {
            return { [otherPieceKeys[i]]: { ...p, cantMove: true } };
          })
          .filter((p, i) => p[otherPieceKeys[i]].boardSpace === 43)[0];
        piecesToReturn.push(piece);
        if (otherPiecesSpaces.includes(42)) {
          const piece = otherPieces
            .map((p, i) => {
              return { [otherPieceKeys[i]]: { ...p, cantMove: true } };
            })
            .filter((p, i) => p[otherPieceKeys[i]].boardSpace === 42)[0];
          piecesToReturn.push(piece);
        }
      }
    } else {
      // if boardSpace === 43
      if (otherPiecesSpaces.includes(42)) {
        const piece = otherPieces
          .map((p, i) => {
            return { [otherPieceKeys[i]]: { ...p, cantMove: true } };
          })
          .filter((p, i) => p[otherPieceKeys[i]].boardSpace === 42)[0];
        piecesToReturn.push(piece);
      }
    }
    let returnValue = {};
    if (piecesToReturn.length > 0) {
      returnValue = piecesToReturn.reduce((obj, item) => {
        return {
          ...obj,
          ...item
        };
      }, {});
    }
    return returnValue;
  };

  private otherPieces = (pieceNumber: keyof IPlayerState): Array<IPlayerPiece> => {
    return ["p1", "p2", "p3", "p4"]
      .filter(p => p !== pieceNumber)
      .map(p => {
        const x: keyof IPlayerState = p as keyof IPlayerState;
        const piece: IPlayerPiece = this.state[x] as IPlayerPiece;
        return piece;
      });
  };

  private makePieceGoHome = (index: keyof IPlayerState) => {
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

  private moveToNextSpace = (piece: IPlayerPiece, roll?: number): IMoveToNextSpace => {
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
    const { turn } = this.state;
    if (turn) {
      const { allowedToMove, roll } = this.state;
      const piece: IPlayerPiece = this.state[pieceNumber] as IPlayerPiece;

      if (allowedToMove && piece.boardSpace) {
        if (roll.length === 1 && roll[0] > 0) {
          this.setState({ moving: true }, () => {
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

            let cantMove = false;
            if (finalSpace > 40 && newRoll === 0) {
              const otherPieces = this.otherPieces(pieceNumber).map(p => p.boardSpace);
              switch (finalSpace) {
                case 44:
                  cantMove = true;
                  break;
                case 43:
                  cantMove = otherPieces.includes(44);
                  break;
                case 42:
                  cantMove = otherPieces.includes(44) && otherPieces.includes(43);
                  break;
              }
            }

            const otherPieces =
              finalSpace > 42 && newRoll === 0
                ? this.canOtherPiecesMove(pieceNumber, finalSpace)
                : {};
            const home = finalSpace > 40;

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

            const updatePiece = { ...piece, boardSpace, coordinates, home, cantMove };
            this.setState(
              ({
                roll: [newRoll],
                [pieceNumber]: updatePiece,
                ...otherPieces
              } as {}) as IPlayerState,
              () =>
                setTimeout(() => {
                  this.moveMe(pieceNumber);
                }, 250)
            );
          });
        } else {
          this.setState({
            allowedToRoll: true,
            allowedToMove: false,
            moving: false
          });
        }
      }
    }
  };

  private moveThisPiece = (pieceNumber: keyof IPlayerState) => {
    const { turn, roll } = this.state;
    if (turn) {
      const { moveOnlyOnePiece, moving, p1, p2, p3, p4 } = this.state;
      const piece: IPlayerPiece = this.state[pieceNumber] as IPlayerPiece;
      const finalSpace = piece.boardSpace + roll[0];
      const otherPieceOnThatSpace =
        finalSpace > 40
          ? this.otherPieces(pieceNumber)
              .map(p => p.boardSpace)
              .includes(finalSpace)
          : false;

      if (finalSpace > 44 || otherPieceOnThatSpace || piece.cantMove) {
        return;
      } else if (
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

  private canPieceNotMove = (
    piece: IPlayerPiece,
    roll: number,
    o1: IPlayerPiece,
    o2: IPlayerPiece,
    o3: IPlayerPiece
  ): boolean => {
    let cantMove = false;
    const finalSpace = piece.boardSpace + roll;
    if (piece.boardSpace === 0 || piece.cantMove || finalSpace > 44) {
      cantMove = true;
    } else if (finalSpace > 40) {
      if (
        finalSpace === o1.boardSpace ||
        finalSpace === o2.boardSpace ||
        finalSpace === o3.boardSpace
      ) {
        cantMove = true;
      }
    }
    return cantMove;
  };

  private myTurn = () => {
    const { turn, allowedToRoll, p1, p2, p3, p4 } = this.state;

    if (turn && allowedToRoll) {
      const roll =
        (p1.boardSpace === 0 || p1.cantMove) &&
        (p2.boardSpace === 0 || p2.cantMove) &&
        (p3.boardSpace === 0 || p3.cantMove) &&
        (p4.boardSpace === 0 || p4.cantMove)
          ? // all pieces can't move so roll 3 times
            this.rollDie(3)
          : this.rollDie(1);

      // can anything move function
      const p1move = this.canPieceNotMove(p1, roll[0], p2, p3, p4);
      const p2move = this.canPieceNotMove(p2, roll[0], p1, p3, p4);
      const p3move = this.canPieceNotMove(p3, roll[0], p1, p2, p4);
      const p4move = this.canPieceNotMove(p4, roll[0], p1, p2, p3);

      //if nothing can move re-roll
      if (!roll.includes(6) && p1move && p2move && p3move && p4move) {
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
        } else if (p1move && p2move && p3move && p4move) {
          //if nothing can move re-roll
          this.setState({
            roll,
            allowedToRoll: true
          });
        } else {
          // if no pieces in jail move like normal
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
      this.makePieceGoHome(pieceNumber as keyof IPlayerState);
      this.props.removePiece({ occupied: "", pieceNumber: "" });
    }
  }

  public render() {
    const { color, coordinates, roll, turn } = this.state;
    const x = coordinates.x;
    const y = coordinates.y;
    const turnGlow = turn ? "glow" : "";

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
          {["p1", "p2", "p3", "p4"].map(p => {
            const x: keyof IPlayerState = p as keyof IPlayerState;
            const piece: IPlayerPiece = this.state[x] as IPlayerPiece;
            return (
              <Piece
                key={p}
                onClick={this.moveThisPiece.bind(this, x)}
                color={color}
                coordinates={{ x: piece.coordinates.x, y: piece.coordinates.y }}
              />
            );
          })}
        </>
      ) : null;

    return (
      <div>
        <div onClick={this.myTurn} className={`Player ${color} ${turnGlow}`} style={style}>
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
