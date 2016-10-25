"use strict";
var Game = {
  availableMoves : [0,1,2,3,4,5,6,7,8],
  p1Moves : [],
  p2Moves : [],
  player1Mark : "O",
  player2Mark : "X",
  isOnePlayer : "true",
  isPlayer1Turn : "true",
  isPlayer1First : "true",
  isRunning : "true",
  winComb : [],
  player1Score : 0,
  player2Score : 0,
  draw: 0
};

var State = function(gameState) {
  this.availableMoves = gameState.availableMoves.slice(0);
  this.p1Moves = gameState.p1Moves.slice(0);
  this.p2Moves = gameState.p2Moves.slice(0);
  this.enterP1Move = gameState.enterP1Move;
  this.enterP2Move = gameState.enterP2Move;
}

var winningComb = [
  [0,1,2],
  [3,4,5],
  [6,7,8],
  [0,3,6],
  [1,4,7],
  [2,5,8],
  [0,4,8],
  [2,4,6]
];
var Ai = {};

Game.reset = function() {
  this.availableMoves = [0,1,2,3,4,5,6,7,8],
  this.p1Moves = [],
  this.p2Moves = [],
  this.player1Mark = "O",
  this.player2Mark = "X",
  this.isOnePlayer = "true",
  this.isPlayer1Turn = "true",
  this.isPlayer1First = "true",
  this.isRunning = "true",
  this.winComb = [],
  this.player1Score = 0,
  this.player2Score = 0,
  this.draw = 0
}

/*Game.replay = function() {
  this.availableMoves = [0,1,2,3,4,5,6,7,8];
  this.p1Moves = [];
  this.p2Moves = [];
  this.isRunning = true;
  if(this.isPlayer1First) {
    this.isPlayer1First = false;
    this.isPlayer1Turn = false;
  } else {
    this.isPlayer1First = true;
    this.isPlayer1Turn = true;
  }
}*/

var replay = function(){
  this.availableMoves = [0,1,2,3,4,5,6,7,8];
  this.p1Moves = [];
  this.p2Moves = [];
  this.isRunning = true;
  if(this.isPlayer1First) {
    this.isPlayer1First = false;
    this.isPlayer1Turn = false;
  } else {
    this.isPlayer1First = true;
    this.isPlayer1Turn = true;
  }
  this.replay = function() {};
}


Game.setPlayerMark = function(mark1, mark2) {
  this.player1Mark = mark1;
  this.player2Mark = mark2;
}

Game.enterP1Move = function(move) {
  move = parseInt(move);
  this.p1Moves.push(move);
  var index = this.availableMoves.indexOf(move);
  this.availableMoves.splice(index,1);
  if (this.hasOwnProperty("isPlayer1Turn")) {
    this.isPlayer1Turn = false;
    if ( checkWin(this.p1Moves) ) {
      this.isRunning = false;
      this.player1Score += 1;
      return 1;
    } else if (this.availableMoves.length < 1) {
      this.isRunning = false;
      this.draw += 1;
      return 2; //game is a draw
    }
  }
}

Game.enterP2Move = function(move) {
  move = parseInt(move);
  this.p2Moves.push(move);
  var index = this.availableMoves.indexOf(move);
  this.availableMoves.splice(index,1);
  if (this.hasOwnProperty("isPlayer1Turn")) {
    this.isPlayer1Turn = true;
    if ( checkWin(this.p2Moves ) ) {
      this.isRunning = false;
      this.player2Score += 1;
      return 1; //player 2 wins
    } else if (this.availableMoves.length < 1) {
      this.isRunning = false;
      this.draw += 1;
      return 2; //game is a draw
    }
  }
}

function checkWin(moves) {
  for(var y=0;y<8;y++) {
    for(var x=0;x<3;x++) {
      if( moves.indexOf(winningComb[y][x]) == -1 ) break;
      if( x == 2 ) {
        return true;
      }
    }
  }
}

Ai.move = function() {
  if(Game.isRunning ) {
    var l = Game.availableMoves.length;
    if(l>7) {
      var firstMoves = [0,2,4,6,8];
      var index = firstMoves.indexOf(Game.p1Moves[0]);
      if( index !== -1) {
        firstMoves.splice(index,1);
      }
      console.log(firstMoves)
      var move = firstMoves[Math.floor(Math.random() * firstMoves.length)];
      console.log(move);
      document.getElementsByTagName("TD")[move].innerHTML = Game.player2Mark;
      return Game.enterP2Move(move);
    } else {
      var move = Ai.findMove(Game);
      document.getElementsByTagName("TD")[move].innerHTML = Game.player2Mark;
      return Game.enterP2Move(move);
    }
  }
}

Ai.findMove = function(game) {
    var bestScore = -100000;
    var move = null;
    var l = game.availableMoves.length;

    for(var i=0;i<l;i++) {
      var state = new State(game);
      var depth = [0];
      state.enterP2Move(state.availableMoves[i]);
      var score = getAiStateScore(state, depth);
      if(score >= 10 && depth[0] === 1) {
        return game.availableMoves[i];
      }
      if(score > bestScore) {
        bestScore = score;
        move = game.availableMoves[i];
      }


    }
    return move;
}

//get the score of AI move state to predict if it is losing or winning
function getAiStateScore(state, depth) {
  depth[0] =  depth[0] + 1;
  if(checkWin(state.p2Moves) )
    return 10;
  else if (checkWin(state.p1Moves))
    return -10;
  else if (state.availableMoves.length < 1)
    return 0;
  else {
    var minScore = 100;
    var l = state.availableMoves.length;
    var p = 0;
    for(var i=0;i<l;i++) {
      var newState = new State(state);
      newState.enterP1Move(newState.availableMoves[i]);
      var score = getOppStateScore(newState, depth);
      if (score > 0) p++;
      if(score < minScore) {
        minScore = score;
      }
    }
    return (minScore  + p);

  }
}

//get the score of opponent move state to predict if it is losing or winning
function getOppStateScore(state, depth) {
  depth[0] = depth[0] + 1;
  if(checkWin(state.p2Moves) )
    return 10;
  else if (checkWin(state.p1Moves))
    return -10;
  else if (state.availableMoves.length < 1)
    return 0;
  else {
    var maxScore = -100;
    var l = state.availableMoves.length;
    var p = 0;
    for(var i=0;i<l;i++) {
      var newState = new State(state);
      newState.enterP2Move(newState.availableMoves[i]);
      //score += getAiStateScore(newState);
      var score = getAiStateScore(newState, depth);
      if(score > 0 ) p++;
      if(score > maxScore) {
        maxScore = score;
      }
    }
    return (maxScore + p);

  }
}

function animateWin(moves) {
  var stat = document.getElementById("stat-wrap");
  for(var y=0;y<8;y++) {
    for(var x=0;x<3;x++) {
      if( moves.indexOf(winningComb[y][x]) == -1 ) break;
      if( x == 2 ) {
        winningComb[y].forEach(function(v, i) {
          var el = document.getElementsByTagName("TD")[v];
          el.style.fontSize = "4.5em";
        });
      }
    }
  }
  stat.style.background = "#0a5427";
  stat.style.color = "white";
}

function animateDraw() {
  var stat = document.getElementById("stat-wrap");
  var el = document.getElementsByTagName("TD");
  var l = el.length;
  for(var i=0;i<l;i++) {
    el[i].style.fontSize = "4.5em";
  }
  stat.style.background = "#0a5427";
  stat.style.color = "white";
}

function mark(event) {
  if(Game.isRunning) {
    var status = document.getElementById("status");
    var board = document.getElementById("board");
    var el = event.target;
    if(el.nodeName === "TD" && el.innerHTML === "" ) {
      if(Game.isPlayer1Turn) {
        el.innerHTML = Game.player1Mark;
        var result = Game.enterP1Move(el.getAttribute("data-move"));
        if ( result == 1 ) {
          status.innerHTML = "PLAYER 1 WINS!";
          animateWin(Game.p1Moves);
          setTimeout( restart, 2000);
        }
        else if ( result == 2 ) {
          status.innerHTML = "IT'S A DRAW!";
          animateDraw();
          setTimeout( restart, 2000);
        }
        else if (Game.isOnePlayer) {
            status.innerHTML = "COMPUTER's TURN";
            Game.isPlayer1Turn = false;
            setTimeout( function() {
              var result = Ai.move();
              if(result == 1) {
                status.innerHTML = "COMPUTER WINS!";
                animateWin(Game.p2Moves);
                setTimeout( restart, 2000);
              }
              else if (result == 2) {
                status.innerHTML = "IT'S A DRAW!";
                animateDraw();
                setTimeout( restart, 2000);
              } else {
                status.innerHTML = "PLAYER 1's TURN";
                Game.isPlayer1Turn = true;
              }
            }, 400);
        } else {
          status.innerHTML = "PLAYER 2's TURN";
          Game.isPlayer1Turn = false;
        }

      } else {
          el.innerHTML = Game.player2Mark;
          var result = Game.enterP2Move(el.getAttribute("data-move"));
          if ( result == 1 ) {
            status.innerHTML = "PLAYER 2 WINS!";
            animateWin(Game.p2Moves);
            setTimeout( restart, 2000);
          }
          else if (result == 2) {
            status.innerHTML = "IT'S A DRAW!";
            animateDraw();
            setTimeout( restart, 2000);
          }
          else {
            status.innerHTML = "PLAYER 1's TURN";
            Game.isPlayer1Turn = true;
          }
      }

    }
  }

}

function restart() {
  var score = document.getElementsByClassName("score");
  score[0].innerHTML = Game.player1Score;
  score[1].innerHTML = Game.draw;
  score[2].innerHTML = Game.player2Score;
  var td = document.getElementsByTagName("TD");
  var stat = document.getElementById("stat-wrap");
  stat.style.background = "white";
  stat.style.color = "black";
  var l = td.length;
  for(var i=0;i<l;i++) {
    td[i].style.fontSize = "0em";
  }
  Game.replay = replay;
  setTimeout( function() {
    for(var i=0;i<l;i++) {
      td[i].innerHTML = "";
      td[i].style.fontSize = "3em";
    }
    Game.replay();
    if(Game.isPlayer1Turn) {
      stat.firstElementChild.innerHTML = "PLAYER 1's TURN";
    } else if (Game.isOnePlayer) {
      var move = Math.floor(Math.random() * 5) * 2;
      Game.enterP2Move(move);
      document.getElementsByTagName("TD")[move].innerHTML = Game.player2Mark;
      stat.firstElementChild.innerHTML = "PLAYER 1's TURN";
    } else {
      stat.firstElementChild.innerHTML = "PLAYER 2's TURN";
    }
  },500)
}

function hideMenu2() {
  var menu2 = document.getElementById("menu2");
  menu2.style.visibility = "hidden";
  menu2.style.opacity = "0";
  var board = document.getElementById("board-container");
  board.style.visibility = "visible";
  board.style.opacity = "1";
}
function hideMenu1() {
  var menu1 = document.getElementById("menu1");
  menu1.style.visibility = "hidden";
  menu1.style.opacity = "0";
  var menu2 = document.getElementById("menu2");
  menu2.style.visibility = "visible";
  menu2.style.opacity = "1"
}

document.getElementById("o").addEventListener("click", function() {
  Game.setPlayerMark("O","X");
  hideMenu2();
},false);

document.getElementById("x").addEventListener("click", function() {
  Game.setPlayerMark("X","O");
  hideMenu2();
},false);

document.getElementById("p2").addEventListener("click", function() {
  Game.isOnePlayer = false;
  document.getElementById("opponent").innerHTML = "Player 2";
  hideMenu1();
},false);

document.getElementById("p1").addEventListener("click", function() {
  Game.isOnePlayer = true;
  document.getElementById("opponent").innerHTML = "Computer";
  hideMenu1();
},false);

document.getElementById("quit").addEventListener("click", function() {
  Game.reset();
  var board = document.getElementById("board-container");
  board.style.visibility = "hidden";
  board.style.opacity = "0";
  var menu1 = document.getElementById("menu1");
  menu1.style.visibility = "visible";
  menu1.style.opacity = "1";
  var td = document.getElementsByTagName("TD");
  document.getElementById("status").innerHTML = "PLAYER 1's TURN";
  var l = td.length;
  for(var i=0;i<l;i++) {
    td[i].innerHTML = "";
    td[i].style.fontSize = "3em";
  }
  var score = document.getElementsByClassName("score");
  score[0].innerHTML = Game.player1Score;
  score[1].innerHTML = Game.draw;
  score[2].innerHTML = Game.player2Score;
},false);

document.getElementById("board").addEventListener("click", mark, false);
