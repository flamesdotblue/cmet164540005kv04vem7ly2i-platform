import { useState, useMemo } from 'react';

export default function App() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const game = useMemo(() => calculateWinner(squares), [squares]);
  const movesPlayed = squares.filter(Boolean).length;
  const isDraw = !game.winner && movesPlayed === 9;

  const status = game.winner
    ? `Winner: ${game.winner}`
    : isDraw
    ? "It's a draw"
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  function handleClick(i) {
    if (squares[i] || game.winner) return;
    const next = squares.slice();
    next[i] = xIsNext ? 'X' : 'O';
    setSquares(next);
    setXIsNext(!xIsNext);
  }

  function reset() {
    setSquares(Array(9).fill(null));
    setXIsNext(true);
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold tracking-tight">Tic Tac Toe</h1>
          <p className="mt-2 text-slate-400">Two players. First to align three wins.</p>
        </header>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-4 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div className={`text-lg font-semibold ${game.winner ? 'text-emerald-400' : isDraw ? 'text-amber-400' : 'text-slate-200'}`}>{status}</div>
            <button
              onClick={reset}
              className="rounded-lg bg-slate-800 hover:bg-slate-700 active:bg-slate-600 text-slate-100 text-sm px-3 py-2 border border-slate-700"
              aria-label="Reset game"
            >
              Reset
            </button>
          </div>

          <Board squares={squares} onClick={handleClick} winningLine={game.line} disabled={Boolean(game.winner) || isDraw} />

          <Footer xIsNext={xIsNext} squares={squares} />
        </div>
      </div>
    </div>
  );
}

function Board({ squares, onClick, winningLine, disabled }) {
  function renderSquare(i) {
    const value = squares[i];
    const isWinning = winningLine?.includes(i);
    return (
      <Square
        key={i}
        value={value}
        onClick={() => onClick(i)}
        highlight={isWinning}
        disabled={disabled || Boolean(value)}
        index={i}
      />
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 9 }, (_, i) => renderSquare(i))}
    </div>
  );
}

function Square({ value, onClick, highlight, disabled, index }) {
  const base = 'aspect-square w-full rounded-xl border transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400';
  const color = highlight
    ? 'bg-emerald-900/30 border-emerald-500 text-emerald-300'
    : value === 'X'
    ? 'bg-slate-900 border-sky-600 text-sky-400'
    : value === 'O'
    ? 'bg-slate-900 border-rose-600 text-rose-400'
    : 'bg-slate-900 border-slate-700 text-slate-400 hover:bg-slate-800';
  return (
    <button
      aria-label={`Square ${index + 1}${value ? ', ' + value : ''}`}
      className={`${base} ${color} flex items-center justify-center text-4xl font-bold select-none`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className="drop-shadow-sm">{value}</span>
    </button>
  );
}

function Footer({ xIsNext, squares }) {
  const xCount = squares.filter((s) => s === 'X').length;
  const oCount = squares.filter((s) => s === 'O').length;
  return (
    <div className="mt-4 grid grid-cols-3 gap-2 text-center text-sm">
      <div className="rounded-lg bg-slate-800/60 py-2 border border-slate-700">
        <div className="text-xs text-slate-400">X moves</div>
        <div className="font-semibold text-sky-400">{xCount}</div>
      </div>
      <div className="rounded-lg bg-slate-800/60 py-2 border border-slate-700">
        <div className="text-xs text-slate-400">Turn</div>
        <div className={`font-semibold ${xIsNext ? 'text-sky-400' : 'text-rose-400'}`}>{xIsNext ? 'X' : 'O'}</div>
      </div>
      <div className="rounded-lg bg-slate-800/60 py-2 border border-slate-700">
        <div className="text-xs text-slate-400">O moves</div>
        <div className="font-semibold text-rose-400">{oCount}</div>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line };
    }
  }
  return { winner: null, line: null };
}
