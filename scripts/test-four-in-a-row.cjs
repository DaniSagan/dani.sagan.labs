const fs=require('fs'),vm=require('vm'),ts=require('typescript'),assert=require('node:assert/strict');
const jobs=new Map();let id=0;const exportsGame={};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('src/app/games/four-in-arow/four-in-a-row.component.ts','utf8'),{compilerOptions:{target:ts.ScriptTarget.ES2020,module:ts.ModuleKind.CommonJS,experimentalDecorators:true}}).outputText,{exports:exportsGame,require:()=>({Component:()=>c=>c}),setTimeout:fn=>{jobs.set(++id,fn);return id;},clearTimeout:i=>jobs.delete(i)});
const Game=exportsGame.FourInARowComponent,g=new Game();g.ngOnInit();assert.equal(g.board.length,6);assert(g.board.every(row=>row.length===7));
g.placePiece(3);assert.equal(g.board[5][3],'R');assert(g.thinking);g.placePiece(2);assert.equal(g.moves,1);g.resetGame();assert.equal(jobs.size,0);assert.equal(g.moves,0);assert(!g.thinking);
for(const col of [-1,7,1.5,NaN])g.placePiece(col);assert.equal(g.moves,0);
for(let row=0;row<6;row++)g.board[row][0]=row%2?'R':'Y';const before=JSON.stringify(g.board);g.placePiece(0);assert.equal(JSON.stringify(g.board),before);
let windows=0;for(const [dr,dc]of [[0,1],[1,0],[1,1],[1,-1]])for(let r=0;r<6;r++)for(let c=0;c<7;c++){if(r+3*dr<0||r+3*dr>=6||c+3*dc<0||c+3*dc>=7)continue;windows++;for(const player of ['R','Y']){g.resetGame();for(let i=0;i<4;i++)g.board[r+i*dr][c+i*dc]=player;assert(g.checkWin(player));assert.equal(g.findWinningCells(player).length,4);}}
assert.equal(windows,69);
g.resetGame();g.board[5]=['R','R','R','','Y','Y',''];g.placePiece(3);assert(g.gameOver);assert.equal(g.winningCells.length,4);assert(!g.thinking);assert.equal(jobs.size,0);
g.resetGame();g.board=Array.from({length:6},(_,r)=>Array.from({length:7},(_,c)=>(Math.floor(c/2)+r)%2?'Y':'R'));assert(!g.checkWin('R')&&!g.checkWin('Y'));g.board[0][0]='';g.placePiece(0);assert(g.gameOver);assert.equal(g.winningCells.length,0);assert(g.message.includes('Empate'));
for(const [player,col]of [['Y',3],['R',3]]){g.resetGame();g.board[5]=[player,player,player,'','','',''];g.currentPlayer='Y';const snapshot=JSON.stringify(g.board);g.computerMove();assert.equal(g.board[5][col],'Y',player==='Y'?'machine takes win':'machine blocks immediate threat');assert.equal(g.moves,4);assert.notEqual(JSON.stringify(g.board),snapshot);}
g.resetGame();g.placePiece(0);g.ngOnDestroy();assert.equal(jobs.size,0);
console.log('PASS gravity, invalid/full columns, human turn lock, reset/destroy cancellation, all 69 winning windows for both players, full-board draw, machine win and immediate block.');