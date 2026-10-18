const fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript'),assert=require('node:assert/strict');
const pending=new Map();let next=0;
const exportsGame={};vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/games/tic-tac-toe/tic-tac-toe.component.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true}}).outputText,{exports:exportsGame,require:()=>({Component:()=>c=>c}),setTimeout:fn=>{pending.set(++next,fn);return next;},clearTimeout:id=>pending.delete(id)});
const Game=exportsGame.TicTacToeComponent,g=new Game();
const flush=()=>{for(const [id,fn]of [...pending]){pending.delete(id);fn();}};
g.play(0,0);assert(g.thinking);g.play(0,1);assert.equal(g.moves,1);g.play(0,0);assert.equal(g.moves,1);flush();assert.equal(g.moves,2);assert.equal(g.board[1][1],'O');assert(!g.thinking);
g.resetGame();g.play(0,0);g.resetGame();flush();assert.equal(g.moves,0);assert(!g.thinking);
g.play(0,0);g.ngOnDestroy();assert.equal(pending.size,0);
g.resetGame();for(const [r,c]of [[0,0],[0,1],[1,0]]){g.play(r,c);flush();}assert.equal(g.winner,'O');assert.equal(g.winningCells.length,3);const finished=JSON.stringify(g.board);g.play(2,2);assert.equal(JSON.stringify(g.board),finished);
const empty=()=>[['','',''],['','',''],['','','']];
const wins=(board,mark)=>g.lines.some(line=>line.every(([r,c])=>board[r][c]===mark));let endings=0;
function visit(board){assert(!wins(board,'X'),'optimal machine never loses');if(wins(board,'O')||board.flat().every(Boolean)){endings++;return;}for(let r=0;r<3;r++)for(let c=0;c<3;c++)if(!board[r][c]){board[r][c]='X';assert(!wins(board,'X'));if(board.flat().every(Boolean)){endings++;}else{const before=JSON.stringify(board),best=g.minimax(board,'O').move;assert.equal(JSON.stringify(board),before,'search does not mutate board');assert(best);board[best.row][best.col]='O';visit(board);board[best.row][best.col]='';}board[r][c]='';}}
visit(empty());assert(endings>100);
let board=empty(),player='X';for(let i=0;i<9;i++){const move=g.minimax(board,player).move;assert(move);board[move.row][move.col]=player;assert(!wins(board,player),'optimal vs optimal draws');player=player==='X'?'O':'X';}
g.resetGame();g.board=[['X','X',''],['O','O',''],['','','']];g.play(0,2);assert.equal(g.winner,'X');assert.equal(g.winningCells.length,3);assert(!g.thinking);
console.log('PASS all '+endings+' human continuations against optimal AI, optimal draw, search purity, both winning states, blocked extra moves, reset and destruction during pending AI.');