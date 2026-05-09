import { useEffect, useState } from "react";

const GRID_SIZE = 10;

const initialPlayer = { x: 0, y: 0 };

const initialZombies = [
  { x: 8, y: 8 },
  { x: 5, y: 7 },
];

const initialBoss = { x: 9, y: 0 };

const initialDFSZombie = { x: 0, y: 9 };

const exit = { x: 9, y: 9 };

const walls = [
  "3-3",
  "3-4",
  "3-5",
  "6-2",
  "6-3",
  "6-4",
];

const directions = [
  [0, 1],
  [1, 0],
  [0, -1],
  [-1, 0],
];

export default function ZombieMallEscape() {
  const [player, setPlayer] = useState(initialPlayer);

  // BFS zombies
  const [zombies, setZombies] = useState(initialZombies);

  // A* boss
  const [boss, setBoss] = useState(initialBoss);

  // DFS patrol zombie
  const [dfsZombie, setDfsZombie] =
    useState(initialDFSZombie);

  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  const isWall = (x, y) =>
    walls.includes(`${x}-${y}`);

  // =========================
  // PLAYER MOVEMENT
  // =========================

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || won) return;

      let newX = player.x;
      let newY = player.y;

      if (e.key === "ArrowUp") newY--;
      if (e.key === "ArrowDown") newY++;
      if (e.key === "ArrowLeft") newX--;
      if (e.key === "ArrowRight") newX++;

      if (
        newX >= 0 &&
        newX < GRID_SIZE &&
        newY >= 0 &&
        newY < GRID_SIZE &&
        !isWall(newX, newY)
      ) {
        setPlayer({
          x: newX,
          y: newY,
        });
      }
    };

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
  }, [player, gameOver, won]);

  // =========================
  // BFS PATHFINDING
  // =========================

  const bfs = (start, target) => {
    const queue = [[start]];

    const visited = new Set();

    visited.add(`${start.x}-${start.y}`);

    while (queue.length > 0) {
      const path = queue.shift();

      const current = path[path.length - 1];

      if (
        current.x === target.x &&
        current.y === target.y
      ) {
        return path;
      }

      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;

        const key = `${nx}-${ny}`;

        if (
          nx >= 0 &&
          nx < GRID_SIZE &&
          ny >= 0 &&
          ny < GRID_SIZE &&
          !isWall(nx, ny) &&
          !visited.has(key)
        ) {
          visited.add(key);

          queue.push([
            ...path,
            { x: nx, y: ny },
          ]);
        }
      }
    }

    return null;
  };

  // =========================
  // A* PATHFINDING
  // =========================

  const heuristic = (a, b) => {
    return (
      Math.abs(a.x - b.x) +
      Math.abs(a.y - b.y)
    );
  };

  const aStar = (start, target) => {
    const openSet = [
      {
        pos: start,
        path: [start],
        g: 0,
        f: heuristic(start, target),
      },
    ];

    const visited = new Set();

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);

      const currentNode = openSet.shift();

      const current = currentNode.pos;

      if (
        current.x === target.x &&
        current.y === target.y
      ) {
        return currentNode.path;
      }

      visited.add(
        `${current.x}-${current.y}`
      );

      for (const [dx, dy] of directions) {
        const nx = current.x + dx;
        const ny = current.y + dy;

        const key = `${nx}-${ny}`;

        if (
          nx >= 0 &&
          nx < GRID_SIZE &&
          ny >= 0 &&
          ny < GRID_SIZE &&
          !isWall(nx, ny) &&
          !visited.has(key)
        ) {
          const g = currentNode.g + 1;

          const h = heuristic(
            { x: nx, y: ny },
            target
          );

          openSet.push({
            pos: { x: nx, y: ny },
            path: [
              ...currentNode.path,
              { x: nx, y: ny },
            ],
            g,
            f: g + h,
          });
        }
      }
    }

    return null;
  };

  // =========================
  // DFS PATROL
  // =========================

  const dfsMove = (
    start,
    visited = new Set()
  ) => {
    visited.add(`${start.x}-${start.y}`);

    const neighbors = directions
      .map(([dx, dy]) => ({
        x: start.x + dx,
        y: start.y + dy,
      }))
      .filter(
        (n) =>
          n.x >= 0 &&
          n.x < GRID_SIZE &&
          n.y >= 0 &&
          n.y < GRID_SIZE &&
          !isWall(n.x, n.y) &&
          !visited.has(`${n.x}-${n.y}`)
      );

    if (neighbors.length === 0) {
      return start;
    }

    const randomNeighbor =
      neighbors[
        Math.floor(
          Math.random() * neighbors.length
        )
      ];

    return randomNeighbor;
  };

  // =========================
  // AI MOVEMENT LOOP
  // =========================

  useEffect(() => {
    if (gameOver || won) return;

    const interval = setInterval(() => {
      // BFS zombies
      setZombies((prev) =>
        prev.map((zombie) => {
          const path = bfs(zombie, player);

          if (path && path.length > 1) {
            return path[1];
          }

          return zombie;
        })
      );

      // A* boss
      setBoss((prevBoss) => {
        const path = aStar(
          prevBoss,
          player
        );

        if (path && path.length > 1) {
          return path[1];
        }

        return prevBoss;
      });

      // DFS patrol zombie
      setDfsZombie((prev) =>
        dfsMove(prev)
      );
    }, 500);

    return () => clearInterval(interval);
  }, [player, gameOver, won]);

  // =========================
  // GAME OVER CHECK
  // =========================

  useEffect(() => {
    const hitByZombie = zombies.some(
      (z) =>
        z.x === player.x &&
        z.y === player.y
    );

    const hitByBoss =
      boss.x === player.x &&
      boss.y === player.y;

    const hitByDFS =
      dfsZombie.x === player.x &&
      dfsZombie.y === player.y;

    if (
      hitByZombie ||
      hitByBoss ||
      hitByDFS
    ) {
      setGameOver(true);
    }
  }, [zombies, boss, dfsZombie, player]);

  // =========================
  // WIN CONDITION
  // =========================

  useEffect(() => {
    if (
      player.x === exit.x &&
      player.y === exit.y
    ) {
      setWon(true);
    }
  }, [player]);

  // =========================
  // RESTART GAME
  // =========================

  const restartGame = () => {
    setPlayer(initialPlayer);

    setZombies(initialZombies);

    setBoss(initialBoss);

    setDfsZombie(initialDFSZombie);

    setGameOver(false);

    setWon(false);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-5xl font-black mb-3 text-red-500">
        Zombie Mall Escape
      </h1>

      <p className="text-zinc-400 mb-5">
        Escape the mall before the AI
        zombies catch you.
      </p>

      <div className="flex flex-wrap gap-3 mb-6 text-sm">
        <div className="bg-green-500 text-black px-3 py-1 rounded-lg font-bold">
          P = Player
        </div>

        <div className="bg-red-500 px-3 py-1 rounded-lg font-bold">
          Z = BFS Zombie
        </div>

        <div className="bg-purple-600 px-3 py-1 rounded-lg font-bold">
          A = A* Boss
        </div>

        <div className="bg-yellow-500 text-black px-3 py-1 rounded-lg font-bold">
          D = DFS Zombie
        </div>

        <div className="bg-blue-500 px-3 py-1 rounded-lg font-bold">
          E = Exit
        </div>
      </div>

      {gameOver && (
        <div className="mb-4 text-red-500 text-4xl font-black animate-pulse">
          GAME OVER
        </div>
      )}

      {won && (
        <div className="mb-4 text-blue-400 text-4xl font-black animate-pulse">
          YOU ESCAPED!
        </div>
      )}

      <div className="grid grid-cols-10 gap-1 bg-zinc-900 p-4 rounded-3xl shadow-2xl">
        {Array.from({
          length: GRID_SIZE * GRID_SIZE,
        }).map((_, i) => {
          const x = i % GRID_SIZE;

          const y = Math.floor(
            i / GRID_SIZE
          );

          const playerHere =
            player.x === x &&
            player.y === y;

          const zombieHere =
            zombies.some(
              (z) =>
                z.x === x &&
                z.y === y
            );

          const bossHere =
            boss.x === x &&
            boss.y === y;

          const dfsHere =
            dfsZombie.x === x &&
            dfsZombie.y === y;

          const wallHere = isWall(x, y);

          const exitHere =
            exit.x === x &&
            exit.y === y;

          return (
            <div
              key={i}
              className={`w-14 h-14 rounded-xl flex items-center justify-center font-black text-lg transition-all duration-200

              ${
                playerHere
                  ? "bg-green-500 text-black scale-110"

                  : bossHere
                  ? "bg-purple-600 animate-bounce"

                  : dfsHere
                  ? "bg-yellow-500 text-black animate-pulse"

                  : zombieHere
                  ? "bg-red-500 animate-pulse"

                  : exitHere
                  ? "bg-blue-500"

                  : wallHere
                  ? "bg-zinc-700"

                  : "bg-zinc-800 hover:bg-zinc-700"
              }
              `}
            >
              {playerHere
                ? "P"
                : bossHere
                ? "A"
                : dfsHere
                ? "D"
                : zombieHere
                ? "Z"
                : exitHere
                ? "E"
                : ""}
            </div>
          );
        })}
      </div>

      <button
        onClick={restartGame}
        className="mt-6 bg-red-500 hover:bg-red-400 transition-all px-8 py-3 rounded-2xl font-black text-lg shadow-xl"
      >
        Restart Game
      </button>

      <div className="mt-6 text-center max-w-2xl text-zinc-500 text-sm leading-relaxed">
        <p>
          BFS Zombies intelligently find
          shortest paths.
        </p>

        <p>
          A* Boss predicts optimal pursuit
          routes.
        </p>

        <p>
          DFS Zombie randomly explores the
          mall like a patrol unit.
        </p>
      </div>
    </div>
  );
}