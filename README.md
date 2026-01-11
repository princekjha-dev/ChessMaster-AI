# ♟️ ChessMaster AI - Professional Chess Game

A beautiful, fully-featured chess game with AI opponent, built with vanilla JavaScript. Features a clean, modern interface with light/dark themes, move analysis, and computer# Professional Chess Game

A beautiful, fully-featured chess game with AI opponent, built with vanilla JavaScript. Features a clean, modern interface with light/dark themes, move analysis, and computer vs computer mode.

## 🎮 Live Demo

Play the game here: [https://uzumakichess.netlify.app/](https://uzumakichess.netlify.app/)

---

## ✨ Features

### Core Gameplay
- **Drag and Drop Interface** - Smooth piece movement with visual feedback
- **AI Opponent** - Play against a minimax-based chess engine with adjustable difficulty (1-5 search depth)
- **Legal Move Highlighting** - See all valid moves when selecting a piece
- **Move Validation** - All chess rules enforced including castling, en passant, and pawn promotion
- **Game Status Detection** - Automatic detection of check, checkmate, stalemate, and draw conditions

### UI Features
- **Light/Dark Theme** - Toggle between beautiful light and dark color schemes
- **Responsive Design** - Optimized for desktop, tablet, and mobile devices
- **Move History** - Complete algebraic notation move list with scrollable interface
- **Captured Pieces Display** - Visual tracker for all captured pieces (both sides)
- **Position Evaluation Bar** - Real-time visual representation of board advantage
- **Engine Statistics** - Display of search depth, positions evaluated, calculation time, and nodes per second

### Advanced Features
- **Undo/Redo** - Navigate through move history with full redo support
- **Keyboard Shortcuts** - Quick access to common actions (Ctrl+Z, Ctrl+Y, F, N, H)
- **Show Hints** - Get AI suggestions for your next move
- **Computer vs Computer** - Watch the AI play against itself
- **Adjustable Difficulty** - Configure search depth from 1-5 ply
- **Auto-Queen Promotion** - Optional automatic pawn promotion to queen
- **Board Flip** - View the board from either perspective
- **Move Highlighting** - Visual indicators for last move and legal moves

---

## 🚀 Getting Started

### Prerequisites
No build tools or dependencies required! This is a pure HTML/CSS/JavaScript application.

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/princekjha-dev/ChessMaster-AI
cd chessmaster-ai
```

2. **Open in browser:**
Simply open `index.html` in your web browser, or use a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Node.js
npx http-server

# Using PHP
php -S localhost:8000
```

3. **Navigate to:** `http://localhost:8000` in your browser

### Project Structure
```
chessmaster-ai/
├── index.html          # Main HTML file
├── css/
│   └── main.css       # All styles and theme definitions
├── js/
│   ├── main.js        # Game logic and UI interactions
│   └── chess.js       # Chess engine (chess.js library)
└── README.md
```

---

## 🎯 How to Play

### Basic Controls
- **Move Pieces:** Click and drag pieces to make moves
- **New Game:** Click "New Game" button to start fresh
- **Undo:** Press `Ctrl+Z` or click the undo button (undoes last 2 moves)
- **Redo:** Press `Ctrl+Y` or click the redo button
- **Flip Board:** Press `F` or click the flip button
- **Hints:** Press `H` to toggle move hints

### Game Options
- **Search Depth:** Adjust AI difficulty (1-5) - higher is stronger but slower
- **Show Hints:** Enable to see suggested moves highlighted
- **Highlight Moves:** Toggle legal move highlighting when selecting pieces
- **Auto-Queen:** Automatically promote pawns to queens
- **Computer vs Computer:** Watch AI play against itself

### Keyboard Shortcuts
| Shortcut | Action |
|----------|--------|
| `Ctrl+Z` / `Cmd+Z` | Undo move |
| `Ctrl+Y` / `Cmd+Y` | Redo move |
| `F` | Flip board |
| `N` | New game |
| `H` | Toggle hints |

---

## 🎨 Themes

The game includes two beautiful themes:
- **Light Theme** - Classic light board with warm tones
- **Dark Theme** - Modern dark interface with cool colors

Theme preference is automatically saved to localStorage.

---

## 🧠 Chess Engine

The game uses a minimax algorithm with alpha-beta pruning for AI moves:

- **Search Depth:** Configurable from 1-5 ply
- **Evaluation:** Material count with position bonuses
- **Performance:** Optimized move generation with statistics tracking
- **Move Ordering:** Random move ordering for variety

### Piece Values
- Pawn: 100
- Knight: 280
- Bishop: 320
- Rook: 479
- Queen: 929
- King: 60000 (effectively infinite)

---

## 📱 Mobile Support

The game is fully responsive and works great on mobile devices:
- Touch-friendly piece dragging
- Optimized button sizes for touch
- Simplified interface on small screens
- Gesture support

---

## 🛠️ Technologies Used

- **HTML5** - Semantic markup
- **CSS3** - Modern styling with CSS variables for theming
- **JavaScript (ES6+)** - Core game logic
- **jQuery 3.5.1** - DOM manipulation
- **Chessboard.js** - Board visualization
- **Chess.js** - Move generation and validation
- **Google Fonts (Inter)** - Clean, modern typography

---

## 🌟 Features in Detail

### Position Evaluation
The evaluation bar shows position advantage:
- White advantage: Bar fills from bottom (white wins = 100%)
- Equal position: Bar at 50%
- Black advantage: Bar empties from top (black wins = 0%)
- Score displayed in centipawns (+2.5 = White ahead by 2.5 pawns)

### Move History
- Displays all moves in standard algebraic notation
- Organized in numbered move pairs (White/Black)
- Auto-scrolls to latest move
- Hover effects for better readability

### Captured Pieces
- Visual Unicode piece symbols
- Separated by color
- Real-time updates as pieces are captured

---

## 🔧 Customization

### Changing Piece Images
Edit the `pieceTheme` in `main.js`:
```javascript
pieceTheme: 'https://your-cdn.com/pieces/{piece}.png'
```

### Adjusting Board Colors
Modify CSS variables in `main.css`:
```css
--board-light: #F0D9B5;
--board-dark: #B58863;
```

### Engine Strength
Increase max search depth in the HTML select element or modify the algorithm in `main.js`.

---

## 📝 Known Limitations

- Search depth limited to 5 ply for performance
- No opening book or endgame tablebase
- Basic position evaluation (material only, no positional understanding)
- No network multiplayer support

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project uses the following libraries:
- **Chess.js** - BSD 2-Clause License (Copyright © 2020 Jeff Hlywa)
- **Chessboard.js** - MIT License

---

## 🙏 Acknowledgments

- Chess piece images from [Wikipedia Commons](https://commons.wikimedia.org/wiki/Category:SVG_chess_pieces)
- Chess.js library by [Jeff Hlywa](https://github.com/jhlywa/chess.js)
- Chessboard.js by [Chris Oakman](https://chessboardjs.com/)
- Inter font by [Rasmus Andersson](https://rsms.me/inter/)

---

## 📧 Contact

For questions or suggestions, please open an issue on GitHub.

---

## 🎮 Enjoy Playing!

Whether you're a beginner learning the game or an experienced player looking for a quick match, this chess game offers a clean, distraction-free experience. Have fun! ♟️
