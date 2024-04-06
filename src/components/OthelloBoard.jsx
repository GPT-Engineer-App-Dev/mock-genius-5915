import { Grid, GridItem, Circle } from "@chakra-ui/react";
import { useState } from "react";

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

  return (
    <Grid templateColumns="repeat(8, 1fr)" gap={2} width="400px">
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <GridItem key={`${rowIndex}-${colIndex}`} bg="gray.100" height="50px" display="flex" justifyContent="center" alignItems="center">
            {cell && <Circle size="35px" bg={cell} />}
          </GridItem>
        )),
      )}
    </Grid>
  );
};

export default OthelloBoard;
