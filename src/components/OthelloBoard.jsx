import { Grid, GridItem, Circle, Text, Box } from "@chakra-ui/react";
import { useState } from "react";

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
];

const isValidMove = (board, player, row, col) => {
  if (board[row][col] !== null) return false;

  for (const [dRow, dCol] of DIRECTIONS) {
    const flankingPieces = getFlankingPieces(board, player, row, col, dRow, dCol);
    if (flankingPieces.length > 0) return true;
  }

  return false;
};

const getFlankingPieces = (board, player, row, col, dRow, dCol) => {
  const opponent = player === "white" ? "green" : "white";
  const flankingPieces = [];

  let newRow = row + dRow;
  let newCol = col + dCol;

  while (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
    if (board[newRow][newCol] === opponent) {
      flankingPieces.push([newRow, newCol]);
    } else if (board[newRow][newCol] === player) {
      return flankingPieces;
    } else {
      return [];
    }
    newRow += dRow;
    newCol += dCol;
  }

  return [];
};

const flipPieces = (board, pieces, player) => {
  for (const [row, col] of pieces) {
    board[row][col] = player;
  }
};

const OthelloBoard = () => {
  const [board, setBoard] = useState([
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, "white", "green", null, null, null],
    [null, null, null, "green", "white", null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ]);
  const [currentPlayer, setCurrentPlayer] = useState("white");

  const [invalidMove, setInvalidMove] = useState(false);

  const placePiece = (row, col) => {
    if (isValidMove(board, currentPlayer, row, col)) {
      const newBoard = board.map((row) => [...row]);
      newBoard[row][col] = currentPlayer;

      for (const [dRow, dCol] of DIRECTIONS) {
        const pieces = getFlankingPieces(board, currentPlayer, row, col, dRow, dCol);
        flipPieces(newBoard, pieces, currentPlayer);
      }

      setBoard(newBoard);
      setCurrentPlayer(currentPlayer === "white" ? "green" : "white");
      setInvalidMove(false);
    } else {
      setInvalidMove(true);
    }
  };

  return (
    <Box>
      <Grid templateColumns="repeat(8, 1fr)" gap={2} width="400px">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <GridItem key={`${rowIndex}-${colIndex}`} bg="gray.100" height="50px" display="flex" justifyContent="center" alignItems="center" onClick={() => placePiece(rowIndex, colIndex)}>
              {cell && <Circle size="35px" bg={cell} />}
            </GridItem>
          )),
        )}
      </Grid>
      {invalidMove && <Text color="red">Invalid move. Try again.</Text>}
    </Box>
  );
};

export default OthelloBoard;
