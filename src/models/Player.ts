import { ICoordinates, IPlayerPiece } from "../components/Player";

interface IPlayerColor {
  coordinates: ICoordinates;
  p1: IPlayerPiece;
  p2: IPlayerPiece;
  p3: IPlayerPiece;
  p4: IPlayerPiece;
}

const PIECE_ATTRIBUTES = {
  boardSpace: 0,
  home: false,
  cantMove: false,
};

// Starting coordinates for each color's pieces and jail
export const black: IPlayerColor = {
  coordinates: { x: 1, y: 9 },
  p1: {
    coordinates: { x: 2, y: 10 },
    default: { x: 2, y: 10 },
    ...PIECE_ATTRIBUTES,
  },
  p2: {
    coordinates: { x: 2, y: 11 },
    default: { x: 2, y: 11 },
    ...PIECE_ATTRIBUTES,
  },
  p3: {
    coordinates: { x: 3, y: 10 },
    default: { x: 3, y: 10 },
    ...PIECE_ATTRIBUTES,
  },
  p4: {
    coordinates: { x: 3, y: 11 },
    default: { x: 3, y: 11 },
    ...PIECE_ATTRIBUTES,
  },
};
export const yellow: IPlayerColor = {
  coordinates: { x: 1, y: 1 },
  p1: {
    coordinates: { x: 1, y: 2 },
    default: { x: 1, y: 2 },
    ...PIECE_ATTRIBUTES,
  },
  p2: {
    coordinates: { x: 1, y: 3 },
    default: { x: 1, y: 3 },
    ...PIECE_ATTRIBUTES,
  },
  p3: {
    coordinates: { x: 2, y: 2 },
    default: { x: 2, y: 2 },
    ...PIECE_ATTRIBUTES,
  },
  p4: {
    coordinates: { x: 2, y: 3 },
    default: { x: 2, y: 3 },
    ...PIECE_ATTRIBUTES,
  },
};
export const green: IPlayerColor = {
  coordinates: { x: 9, y: 1 },
  p1: {
    coordinates: { x: 9, y: 1 },
    default: { x: 9, y: 1 },
    ...PIECE_ATTRIBUTES,
  },
  p2: {
    coordinates: { x: 9, y: 2 },
    default: { x: 9, y: 2 },
    ...PIECE_ATTRIBUTES,
  },
  p3: {
    coordinates: { x: 10, y: 1 },
    default: { x: 10, y: 1 },
    ...PIECE_ATTRIBUTES,
  },
  p4: {
    coordinates: { x: 10, y: 2 },
    default: { x: 10, y: 2 },
    ...PIECE_ATTRIBUTES,
  },
};
export const red: IPlayerColor = {
  coordinates: { x: 9, y: 9 },
  p1: {
    coordinates: { x: 10, y: 9 },
    default: { x: 10, y: 9 },
    ...PIECE_ATTRIBUTES,
  },
  p2: {
    coordinates: { x: 10, y: 10 },
    default: { x: 10, y: 10 },
    ...PIECE_ATTRIBUTES,
  },
  p3: {
    coordinates: { x: 11, y: 9 },
    default: { x: 11, y: 9 },
    ...PIECE_ATTRIBUTES,
  },
  p4: {
    coordinates: { x: 11, y: 10 },
    default: { x: 11, y: 10 },
    ...PIECE_ATTRIBUTES,
  },
};
