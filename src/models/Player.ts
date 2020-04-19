import { ICoordinates, IPlayerPiece } from "../components/Player";

interface IPlayerColor {
  coordinates: ICoordinates;
  p1: IPlayerPiece;
  p2: IPlayerPiece;
  p3: IPlayerPiece;
  p4: IPlayerPiece;
}

// Starting coordinates for each color's pieces and jail
export const black: IPlayerColor = {
  coordinates: { x: 1, y: 9 },
  p1: {
    coordinates: { x: 2, y: 10 },
    default: { x: 2, y: 10 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p2: {
    coordinates: { x: 2, y: 11 },
    default: { x: 2, y: 11 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p3: {
    coordinates: { x: 3, y: 10 },
    default: { x: 3, y: 10 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p4: {
    coordinates: { x: 3, y: 11 },
    default: { x: 3, y: 11 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
};
export const yellow: IPlayerColor = {
  coordinates: { x: 1, y: 1 },
  p1: {
    coordinates: { x: 1, y: 2 },
    default: { x: 1, y: 2 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p2: {
    coordinates: { x: 1, y: 3 },
    default: { x: 1, y: 3 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p3: {
    coordinates: { x: 2, y: 2 },
    default: { x: 2, y: 2 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p4: {
    coordinates: { x: 2, y: 3 },
    default: { x: 2, y: 3 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
};
export const green: IPlayerColor = {
  coordinates: { x: 9, y: 1 },
  p1: {
    coordinates: { x: 9, y: 1 },
    default: { x: 9, y: 1 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p2: {
    coordinates: { x: 9, y: 2 },
    default: { x: 9, y: 2 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p3: {
    coordinates: { x: 10, y: 1 },
    default: { x: 10, y: 1 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p4: {
    coordinates: { x: 10, y: 2 },
    default: { x: 10, y: 2 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
};
export const red: IPlayerColor = {
  coordinates: { x: 9, y: 9 },
  p1: {
    coordinates: { x: 10, y: 9 },
    default: { x: 10, y: 9 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p2: {
    coordinates: { x: 10, y: 10 },
    default: { x: 10, y: 10 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p3: {
    coordinates: { x: 11, y: 9 },
    default: { x: 11, y: 9 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
  p4: {
    coordinates: { x: 11, y: 10 },
    default: { x: 11, y: 10 },
    boardSpace: 0,
    home: false,
    cantMove: false,
  },
};
