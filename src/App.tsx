import React, { useEffect, useState } from "react";
import "./App.css";

type Piece = string | number;
type Row = Piece[];
type Board = Row[];

function App() {
	const [gameboard, setBoard] = useState<Board>([]);
	const [player, setPlayer] = useState(true);
	const [victory, setVictory] = useState<undefined | string>();

	useEffect(() => initGame(), []);
	useEffect(() => checkVictoryCondition(), [gameboard]);
	useEffect(() => {
		if (victory) {
			alert(victory);
			initGame();
		}
	}, [victory]);

	const initGame = () => {
		const newBoard: Board = [];
		const row: Row = [0, 0, 0, 0, 0, 0, 0];

		for (let i = 1; i <= 6; i++) {
			const newRow = structuredClone(row);
			newBoard.push(newRow);
		}
		setPlayer(true);
		setBoard(newBoard);
		setVictory(undefined);
	};

	const handleClick = (id: number) => {
		const newGameBoard = structuredClone(gameboard);
		if (newGameBoard[0][id] !== 0) {
			alert("impossible de jouer ici !");
		} else {
			for (let i = 5; i >= 0; i--) {
				const currRow = newGameBoard[i];
				if (currRow[id] === 0) {
					currRow[id] = player ? "rouge" : "jaune";
					break;
				}
			}
		}
		setBoard(newGameBoard);
		setPlayer(!player);
	};

	const checkVictoryCondition = () => {
		for (let i = 0; i < gameboard.length; i++) {
			const row = gameboard[i];
			row.forEach((p: Piece, num: number) => {
				const conditionH =
					row[num + 1] === row[num] &&
					row[num + 2] === row[num] &&
					row[num + 3] === row[num];
				const conditionV =
					i < gameboard.length - 3 &&
					gameboard[i + 1][num] === row[num] &&
					gameboard[i + 2][num] === row[num] &&
					gameboard[i + 3][num] === row[num];
				const conditionDiagR =
					i > 2 &&
					num < row.length - 2 &&
					gameboard[i - 1][num + 1] === row[num] &&
					gameboard[i - 2][num + 2] === row[num] &&
					gameboard[i - 3][num + 3] === row[num];
				const conditionDiagL =
					i > 2 &&
					num > 2 &&
					gameboard[i - 1][num - 1] === row[num] &&
					gameboard[i - 2][num - 2] === row[num] &&
					gameboard[i - 3][num - 3] === row[num];

				const conditions =
					conditionH || conditionV || conditionDiagR || conditionDiagL;
				if (p !== 0 && conditions) {
					setVictory(`Le joueur ${p} gagne la partie !`);
				}
			});
		}
	};

	// RENDER ---------------------------------------

	const Board = () => {
		return (
			<table className="board">
				<tbody className="board-body">
					<tr className="border left" />
					{gameboard.map((b, i) => (
						<TableRow key={"row" + i} row={b} index={i} />
					))}
					<tr className="border right" />
				</tbody>
			</table>
		);
	};

	const TableRow = ({ row, index }: { row: Row; index: number }) => {
		return (
			<tr className="board-row">
				{row.map((e, i) => {
					const position = `row${index} col${i}`;
					const bc = `piece ${position} ${e}`;
					return (
						<td key={position}>
							<button value={e} className={bc} onClick={() => handleClick(i)} />
						</td>
					);
				})}
			</tr>
		);
	};

	return (
		<div className="App">
			<h1 className="title">Puissance 4</h1>
			<Board />
		</div>
	);
}

export default App;
