# Zombie Mall Escape 🧟

An AI-powered survival game built with React where different zombies use different search algorithms to hunt the player.

## Gameplay

You are trapped inside a zombie-infested mall.

Your objective:
- Reach the exit
- Avoid intelligent zombies
- Survive different AI behaviors

---

# AI Algorithms Used

## 🔴 BFS Zombie (Breadth First Search)

Behavior:
- Finds the shortest path to the player
- Navigates around walls intelligently
- Aggressive hunter AI

Concept:
BFS explores nearby cells level-by-level until it finds the target.

---

## 🟣 A* Boss Zombie

Behavior:
- Uses heuristic-based pathfinding
- Predicts efficient routes
- Faster and smarter than BFS

Concept:

f(n) = g(n) + h(n)

Where:
- g(n) = distance traveled
- h(n) = estimated distance to player

---

## 🟡 DFS Patrol Zombie (Depth First Search)

Behavior:
- Random exploration
- Deep corridor searching
- Unpredictable movement

Concept:
DFS explores one direction deeply before backtracking.

---

# Features

- Real-time AI movement
- Grid-based gameplay
- Multiple enemy AI systems
- Wall collision
- Win / lose conditions
- Interactive controls
- Modern UI with Tailwind CSS

---

# Tech Stack

- React
- Vite
- Tailwind CSS

---

# Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/zombie-mall-escape.git
```

Go into project folder:

```bash
cd zombie-mall-escape
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Open:

```bash
http://localhost:5173
```

---

# Controls

| Key | Action |
|---|---|
| ↑ | Move Up |
| ↓ | Move Down |
| ← | Move Left |
| → | Move Right |

---

# 🏆 Win Condition

Reach:
- Blue Exit Tile (E)

Avoid:
- BFS Zombies (Z)
- A* Boss (A)
- DFS Zombie (D)

---

# 📚 Educational Value

This project demonstrates:
- Graph traversal
- Pathfinding
- Heuristic search
- Game AI behavior
- Emergent systems

Algorithms are visualized through enemy movement patterns.

---

# Future Improvements

- Fog of war
- Procedural map generation
- Minimax enemy AI
- Health system
- Multiplayer mode
- Sound effects
- Dynamic difficulty
- Animation effects

---

# Screenshots

Initial game:

<img width="799" height="1023" alt="image" src="https://github.com/user-attachments/assets/dd647817-8595-4de4-9d80-0a7248975bca" />


Player wins:

<img width="898" height="1030" alt="WhatsApp Image 2026-05-09 at 8 35 45 PM" src="https://github.com/user-attachments/assets/1fdda041-1ba0-431a-9421-a7b674905d5a" />

Zombie wins:

<img width="898" height="1030" alt="WhatsApp Image 2026-05-09 at 8 35 45 PM" src="https://github.com/user-attachments/assets/ecb34db2-1014-452c-af13-ec67459d9146" />

---

# Deployment

Can be deployed using:

- Vercel
- Netlify
- GitHub Pages

---
