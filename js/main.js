/*
 * Professional Chess UI - Main JavaScript
 * Clean, minimal, performance-focused
 */

// ============================================
// STATE & CONFIGURATION
// ============================================

let board = null;
let game = null;
let globalSum = 0;
let undoStack = [];
const STACK_SIZE = 100;

// Piece values and position tables
const weights = { p: 100, n: 280, b: 320, r: 479, q: 929, k: 60000 };

// ============================================
// INITIALIZATION
// ============================================

$(document).ready(function() {
  initializeGame();
  initializeUI();
  initializeKeyboardShortcuts();
});

function initializeGame() {
  game = new Chess();
  
  const config = {
    draggable: true,
    position: 'start',
    onDragStart: handleDragStart,
    onDrop: handleDrop,
    onSnapEnd: handleSnapEnd,
    pieceTheme: 'https://chessboardjs.com/img/chesspieces/wikipedia/{piece}.png'
  };
  
  board = Chessboard('chessboard', config);
  
  // Ensure board is responsive
  $(window).resize(() => board.resize());
}

// ============================================
// UI INITIALIZATION
// ============================================

function initializeUI() {
  // Theme toggle
  $('#themeToggle').on('click', toggleTheme);
  
  // Game controls
  $('#undoBtn').on('click', handleUndo);
  $('#redoBtn').on('click', handleRedo);
  $('#flipBtn').on('click', () => board.flip());
  $('#newGameBtn').on('click', handleNewGame);
  $('#clearMovesBtn').on('click', handleNewGame);
  
  // Computer vs Computer
  $('#compVsCompBtn').on('click', handleComputerVsComputer);
  
  // Options
  $('#showHint').on('change', handleHintToggle);
  $('#highlightMoves').on('change', updateBoard);
  
  // Search depth
  $('#searchDepth').on('change', updateEngineInfo);
  
  // Initialize UI state
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
}

// ============================================
// THEME MANAGEMENT
// ============================================

function toggleTheme() {
  const body = $('body');
  const isLight = body.hasClass('theme-light');
  
  body.removeClass('theme-light theme-dark');
  body.addClass(isLight ? 'theme-dark' : 'theme-light');
  
  // Save preference
  localStorage.setItem('chess-theme', isLight ? 'dark' : 'light');
}

// Load saved theme
const savedTheme = localStorage.getItem('chess-theme');
if (savedTheme) {
  $('body').removeClass('theme-light theme-dark').addClass(`theme-${savedTheme}`);
}

// ============================================
// DRAG & DROP HANDLERS
// ============================================

function handleDragStart(source, piece) {
  // Prevent dragging if game is over
  if (game.game_over()) return false;
  
  // Only allow dragging your own pieces
  if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
      (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
    return false;
  }
  
  // Highlight legal moves
  if ($('#highlightMoves').is(':checked')) {
    highlightLegalMoves(source);
  }
}

function handleDrop(source, target) {
  undoStack = []; // Clear redo stack
  clearHighlights();
  
  // Attempt the move
  const move = game.move({
    from: source,
    to: target,
    promotion: $('#autoQueen').is(':checked') ? 'q' : undefined
  });
  
  // Illegal move
  if (move === null) return 'snapback';
  
  // Update game state
  globalSum = evaluatePosition(game, move, globalSum, 'b');
  
  // Update UI
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  highlightLastMove(move);
  
  // Check game status
  if (checkGameStatus()) return;
  
  // Computer response
  setTimeout(() => makeComputerMove(), 250);
}

function handleSnapEnd() {
  board.position(game.fen());
}

// ============================================
// MOVE HIGHLIGHTING
// ============================================

function highlightLegalMoves(square) {
  const moves = game.moves({
    square: square,
    verbose: true
  });
  
  moves.forEach(move => {
    const $square = $('#chessboard .square-' + move.to);
    $square.addClass('highlight-legal');
    
    // Different highlight for captures
    if (move.flags.includes('c') || move.flags.includes('e')) {
      $square.addClass('has-piece');
    }
  });
}

function highlightLastMove(move) {
  clearHighlights();
  $('#chessboard .square-' + move.from).addClass('highlight-move');
  $('#chessboard .square-' + move.to).addClass('highlight-move');
}

function clearHighlights() {
  $('#chessboard .square-55d63').removeClass('highlight-move highlight-legal has-piece highlight-check');
}

// ============================================
// COMPUTER MOVE
// ============================================

function makeComputerMove() {
  if (game.game_over()) return;
  
  const depth = parseInt($('#searchDepth').val());
  const startTime = Date.now();
  let positionCount = 0;
  
  const [bestMove] = minimax(game, depth, -Infinity, Infinity, true, -globalSum, 'b', () => positionCount++);
  
  if (!bestMove) return;
  
  const elapsedTime = (Date.now() - startTime) / 1000;
  
  // Make the move
  game.move(bestMove);
  board.position(game.fen());
  
  // Update evaluation
  globalSum = evaluatePosition(game, bestMove, globalSum, 'b');
  
  // Update UI
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  highlightLastMove(bestMove);
  updateEngineStats(positionCount, elapsedTime);
  
  // Check game status
  checkGameStatus();
  
  // Show hint for next move
  if ($('#showHint').is(':checked')) {
    setTimeout(showHint, 250);
  }
}

// ============================================
// MINIMAX ALGORITHM
// ============================================

function minimax(game, depth, alpha, beta, isMaximizing, sum, color, countCallback) {
  countCallback();
  
  const moves = game.ugly_moves({ verbose: true });
  moves.sort(() => Math.random() - 0.5);
  
  if (depth === 0 || moves.length === 0) {
    return [null, sum];
  }
  
  let bestMove = null;
  let bestValue = isMaximizing ? -Infinity : Infinity;
  
  for (let move of moves) {
    const prettyMove = game.ugly_move(move);
    const newSum = evaluatePosition(game, prettyMove, sum, color);
    const [, value] = minimax(game, depth - 1, alpha, beta, !isMaximizing, newSum, color, countCallback);
    
    game.undo();
    
    if (isMaximizing) {
      if (value > bestValue) {
        bestValue = value;
        bestMove = prettyMove;
      }
      alpha = Math.max(alpha, value);
    } else {
      if (value < bestValue) {
        bestValue = value;
        bestMove = prettyMove;
      }
      beta = Math.min(beta, value);
    }
    
    if (beta <= alpha) break;
  }
  
  return [bestMove, bestValue];
}

// ============================================
// POSITION EVALUATION
// ============================================

function evaluatePosition(game, move, prevSum, color) {
  // Checkmate
  if (game.in_checkmate()) {
    return move.color === color ? 1e10 : -1e10;
  }
  
  // Draw
  if (game.in_draw() || game.in_stalemate()) {
    return 0;
  }
  
  // Check bonus
  if (game.in_check()) {
    prevSum += move.color === color ? 50 : -50;
  }
  
  // Material and position evaluation
  let sum = prevSum;
  
  if (move.captured) {
    sum += move.color === color ? weights[move.captured] : -weights[move.captured];
  }
  
  if (move.promotion) {
    const promotionValue = weights[move.promotion] - weights.p;
    sum += move.color === color ? promotionValue : -promotionValue;
  }
  
  return sum;
}

// ============================================
// UI UPDATES
// ============================================

function updateMoveList() {
  const moves = game.history({ verbose: true });
  const $list = $('#moveList');
  
  if (moves.length === 0) {
    $list.html('<div class="move-list-empty">No moves yet</div>');
    return;
  }
  
  let html = '';
  for (let i = 0; i < moves.length; i += 2) {
    const moveNum = Math.floor(i / 2) + 1;
    const white = moves[i].san;
    const black = moves[i + 1] ? moves[i + 1].san : '';
    
    html += `
      <div class="move-row">
        <span class="move-number">${moveNum}.</span>
        <span class="move-notation">${white}</span>
        <span class="move-notation">${black}</span>
      </div>
    `;
  }
  
  $list.html(html);
  $list.scrollTop($list[0].scrollHeight);
}

function updateCapturedPieces() {
  const pieces = { w: [], b: [] };
  const history = game.history({ verbose: true });
  
  history.forEach(move => {
    if (move.captured) {
      pieces[move.color === 'w' ? 'b' : 'w'].push(move.captured);
    }
  });
  
  const pieceSymbols = {
    p: '♟', n: '♞', b: '♝', r: '♜', q: '♛', k: '♚'
  };
  
  $('#capturedWhite').html(
    pieces.w.map(p => `<span class="captured-piece">${pieceSymbols[p]}</span>`).join('') || 
    '<span style="color: var(--text-tertiary); font-size: 12px;">None</span>'
  );
  
  $('#capturedBlack').html(
    pieces.b.map(p => `<span class="captured-piece">${pieceSymbols[p]}</span>`).join('') || 
    '<span style="color: var(--text-tertiary); font-size: 12px;">None</span>'
  );
}

function updateEvaluation() {
  const score = globalSum / 100;
  const displayScore = score > 0 ? `+${score.toFixed(1)}` : score.toFixed(1);
  
  $('#evalScore').text(displayScore);
  
  // Update evaluation bar (50% = equal, 0% = black winning, 100% = white winning)
  const percentage = Math.max(0, Math.min(100, 50 + (score * 5)));
  $('#evalFill').css('height', percentage + '%');
}

function updateEngineStats(positions, time) {
  const nps = Math.round(positions / time);
  
  $('#positionCount').text(positions.toLocaleString());
  $('#calcTime').text(time.toFixed(2) + 's');
  $('#nodesPerSec').text(nps.toLocaleString());
}

function updateEngineInfo() {
  // Just update display, depth is read when needed
}

// ============================================
// GAME STATUS
// ============================================

function checkGameStatus() {
  let status = '';
  let isGameOver = false;
  
  if (game.in_checkmate()) {
    const winner = game.turn() === 'w' ? 'Black' : 'White';
    status = `Checkmate! ${winner} wins.`;
    isGameOver = true;
  } else if (game.in_draw()) {
    status = 'Draw - 50 move rule';
    isGameOver = true;
  } else if (game.in_stalemate()) {
    status = 'Draw - Stalemate';
    isGameOver = true;
  } else if (game.in_threefold_repetition()) {
    status = 'Draw - Threefold repetition';
    isGameOver = true;
  } else if (game.insufficient_material()) {
    status = 'Draw - Insufficient material';
    isGameOver = true;
  } else if (game.in_check()) {
    const side = game.turn() === 'w' ? 'White' : 'Black';
    status = `${side} is in check`;
  }
  
  if (status) {
    showToast(status);
  }
  
  return isGameOver;
}

function showToast(message) {
  const $toast = $('#statusToast');
  $toast.find('.status-text').text(message);
  $toast.addClass('show');
  
  setTimeout(() => {
    $toast.removeClass('show');
  }, 3000);
}

// ============================================
// GAME CONTROLS
// ============================================

function handleNewGame() {
  game.reset();
  board.position('start');
  globalSum = 0;
  undoStack = [];
  
  clearHighlights();
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  updateEngineStats(0, 0);
  
  showToast('New game started');
}

function handleUndo() {
  if (game.history().length < 2) {
    showToast('Nothing to undo');
    return;
  }
  
  clearHighlights();
  
  // Undo twice (opponent + player)
  const move1 = game.undo();
  if (move1) undoStack.push(move1);
  
  const move2 = game.undo();
  if (move2) undoStack.push(move2);
  
  // Keep stack size manageable
  if (undoStack.length > STACK_SIZE) {
    undoStack = undoStack.slice(-STACK_SIZE);
  }
  
  board.position(game.fen());
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  
  if ($('#showHint').is(':checked')) {
    setTimeout(showHint, 250);
  }
}

function handleRedo() {
  if (undoStack.length < 2) {
    showToast('Nothing to redo');
    return;
  }
  
  clearHighlights();
  
  // Redo twice
  const move1 = undoStack.pop();
  game.move(move1);
  
  const move2 = undoStack.pop();
  game.move(move2);
  
  board.position(game.fen());
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  
  if ($('#showHint').is(':checked')) {
    setTimeout(showHint, 250);
  }
}

function handleHintToggle() {
  clearHighlights();
  if ($('#showHint').is(':checked')) {
    showHint();
  }
}

function showHint() {
  if (!$('#showHint').is(':checked')) return;
  if (game.turn() !== 'w') return;
  
  clearHighlights();
  
  const depth = parseInt($('#searchDepth').val());
  let posCount = 0;
  const [bestMove] = minimax(game, depth, -Infinity, Infinity, true, -globalSum, 'w', () => posCount++);
  
  if (bestMove) {
    $('#chessboard .square-' + bestMove.from).addClass('highlight-legal');
    $('#chessboard .square-' + bestMove.to).addClass('highlight-legal');
  }
}

// ============================================
// COMPUTER VS COMPUTER
// ============================================

let compVsCompTimer = null;

function handleComputerVsComputer() {
  if (compVsCompTimer) {
    clearTimeout(compVsCompTimer);
    compVsCompTimer = null;
    showToast('Stopped');
    return;
  }
  
  handleNewGame();
  playComputerVsComputer('w');
  showToast('Computer vs Computer started');
}

function playComputerVsComputer(color) {
  if (game.game_over()) {
    compVsCompTimer = null;
    return;
  }
  
  const depth = parseInt($('#searchDepth').val());
  const startTime = Date.now();
  let posCount = 0;
  
  const [bestMove] = minimax(game, depth, -Infinity, Infinity, true, 
    color === 'b' ? globalSum : -globalSum, color, () => posCount++);
  
  if (!bestMove) {
    compVsCompTimer = null;
    return;
  }
  
  game.move(bestMove);
  board.position(game.fen());
  
  globalSum = evaluatePosition(game, bestMove, globalSum, 'b');
  
  const elapsedTime = (Date.now() - startTime) / 1000;
  
  updateMoveList();
  updateCapturedPieces();
  updateEvaluation();
  highlightLastMove(bestMove);
  updateEngineStats(posCount, elapsedTime);
  
  if (checkGameStatus()) {
    compVsCompTimer = null;
    return;
  }
  
  compVsCompTimer = setTimeout(() => {
    playComputerVsComputer(color === 'w' ? 'b' : 'w');
  }, 500);
}

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

function initializeKeyboardShortcuts() {
  $(document).on('keydown', function(e) {
    // Ctrl/Cmd + Z = Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
      e.preventDefault();
      handleUndo();
    }
    
    // Ctrl/Cmd + Y = Redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
      e.preventDefault();
      handleRedo();
    }
    
    // F = Flip board
    if (e.key === 'f' && !e.ctrlKey && !e.metaKey) {
      board.flip();
    }
    
    // N = New game
    if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
      handleNewGame();
    }
    
    // H = Toggle hint
    if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
      $('#showHint').prop('checked', !$('#showHint').is(':checked')).trigger('change');
    }
  });
}

// ============================================
// BOARD UPDATE
// ============================================

function updateBoard() {
  board.position(game.fen());
}