import { Grid, GridItem, Circle, Text, Box, Button } from "@chakra-ui/react";
import { useState } from "react";

const INITIAL_BOARD = [
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, "white", "green", null, null, null],
  [null, null, null, "green", "white", null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

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

const hasValidMoves = (board, player) => {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (isValidMove(board, player, row, col)) {
        return true;
      }
    }
  }
  return false;
};

const getPlayerScore = (board, player) => {
  let score = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell === player) {
        score++;
      }
    }
  }
  return score;
};

const OthelloBoard = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState("white");
  const [invalidMove, setInvalidMove] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);

  const placePiece = (row, col) => {
    if (gameOver || !isValidMove(board, currentPlayer, row, col)) {
      setInvalidMove(true);
      return;
    }

    const newBoard = board.map((row) => [...row]);
    newBoard[row][col] = currentPlayer;

    for (const [dRow, dCol] of DIRECTIONS) {
      const pieces = getFlankingPieces(board, currentPlayer, row, col, dRow, dCol);
      flipPieces(newBoard, pieces, currentPlayer);
    }

    setBoard(newBoard);
    setInvalidMove(false);

    const nextPlayer = currentPlayer === "white" ? "green" : "white";
    if (!hasValidMoves(newBoard, nextPlayer)) {
      if (!hasValidMoves(newBoard, currentPlayer)) {
        const whiteScore = getPlayerScore(newBoard, "white");
        const greenScore = getPlayerScore(newBoard, "green");

        if (whiteScore > greenScore) {
          setWinner("White");
        } else if (greenScore > whiteScore) {
          setWinner("Green");
        } else {
          setWinner("tie");
        }

        setGameOver(true);
      } else {
        return;
      }
    }

    setCurrentPlayer(nextPlayer);
  };

  const resetGame = () => {
    setBoard(INITIAL_BOARD);
    setCurrentPlayer("white");
    setInvalidMove(false);
    setGameOver(false);
    setWinner(null);
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

      {gameOver && (
        <Box mt={4}>
          <Text fontSize="xl">{winner === "tie" ? "It's a tie!" : `${winner} wins!`}</Text>
          <Button mt={4} onClick={resetGame}>
            Play Again
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default OthelloBoard;
