import{i as ee}from"./chunk-26ZO2L7O.js";import{$ as H,A as I,B as A,C as z,E as m,F as N,I as S,J as P,K as T,L as g,N as V,O as D,P as E,Q as j,U as X,V as Y,W as J,X as Q,Y as y,_ as q,a as R,aa as K,ba as U,c as M,ca as Z,d as p,da as $,e as F,g as w,h as _,k as h,n as C,o as u,p as W,s as a,t as c,u as L,v as b,w as d,x as k}from"./chunk-5AWC2PCQ.js";var ce=()=>["/games/tic-tac-toe"],B=()=>["active"],G=()=>({exact:!0}),le=()=>["/games/four-in-a-row"],me=()=>["/games/game-of-life"],te=(()=>{let r=class r{};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=p({type:r,selectors:[["app-games-navbar"]],decls:17,vars:18,consts:[[1,"nav-items"],[1,"subsection"],[3,"routerLink","routerLinkActive","routerLinkActiveOptions"]],template:function(e,i){e&1&&(a(0,"h2"),m(1,"Juegos"),c(),a(2,"div",0)(3,"ul")(4,"li")(5,"div",1),m(6,"Otros"),c(),a(7,"ul")(8,"li")(9,"a",2),m(10,"Tres en Raya"),c()(),a(11,"li")(12,"a",2),m(13,"Cuatro en Raya"),c()(),a(14,"li")(15,"a",2),m(16,"Juego de la Vida de Conway"),c()()()()()()),e&2&&(h(9),u("routerLink",g(9,ce))("routerLinkActive",g(10,B))("routerLinkActiveOptions",g(11,G)),h(3),u("routerLink",g(12,le))("routerLinkActive",g(13,B))("routerLinkActiveOptions",g(14,G)),h(3),u("routerLink",g(15,me))("routerLinkActive",g(16,B))("routerLinkActiveOptions",g(17,G)))},dependencies:[J,Q],styles:[".nav-items[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]{list-style-type:none;margin:0 auto;padding:0}.nav-items[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]{min-height:30px}.nav-items[_ngcontent-%COMP%]   .subsection[_ngcontent-%COMP%]{padding:5px 0;margin:5px 0;color:#000;font-weight:700}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{padding:5px;margin:5px;text-decoration:none;min-width:100px;color:#000;font-weight:400}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#333;color:#fff}.nav-items[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background-color:#04aa6d;color:#fff}"]});let s=r;return s})();var de=["canvas"],ie=(()=>{let r=class r{constructor(){this.board=[["","",""],["","",""],["","",""]],this.currentPlayer="X",this.gameOver=!1,this.cellSize=200}ngOnInit(){this.ctx=this.canvas.nativeElement.getContext("2d"),this.drawBoard()}drawBoard(){let t=this.canvas.nativeElement.width,e=this.canvas.nativeElement.height;this.ctx.clearRect(0,0,t,e),this.ctx.strokeStyle="#00FFFF",this.ctx.shadowColor="#00FFFF",this.ctx.shadowBlur=10,this.ctx.lineWidth=5;for(let i=1;i<=2;i++)this.ctx.beginPath(),this.ctx.moveTo(i*this.cellSize,0),this.ctx.lineTo(i*this.cellSize,e),this.ctx.stroke(),this.ctx.beginPath(),this.ctx.moveTo(0,i*this.cellSize),this.ctx.lineTo(t,i*this.cellSize),this.ctx.stroke();for(let i=0;i<3;i++)for(let n=0;n<3;n++){let o=this.board[i][n];o&&this.drawMark(o,i,n)}}drawMark(t,e,i){let n=i*this.cellSize,o=e*this.cellSize;this.ctx.font="100px Arial",this.ctx.fillStyle="#00FFFF",this.ctx.textAlign="center",this.ctx.textBaseline="middle",t==="X"?this.ctx.fillText("X",n+this.cellSize/2,o+this.cellSize/2):t==="O"&&this.ctx.fillText("O",n+this.cellSize/2,o+this.cellSize/2)}handleClick(t){return R(this,null,function*(){if(this.gameOver)return;let e=this.canvas.nativeElement.getBoundingClientRect(),i=t.clientX-e.left,n=t.clientY-e.top,o=Math.floor(i/this.cellSize),l=Math.floor(n/this.cellSize);this.board[l][o]===""&&(this.board[l][o]=this.currentPlayer,this.drawBoard(),this.checkWin(this.currentPlayer)?(alert(this.currentPlayer+" gana!"),this.gameOver=!0):this.checkTie()?(alert("Es un empate!"),this.gameOver=!0):(this.currentPlayer=this.currentPlayer==="X"?"O":"X",this.currentPlayer==="O"&&(yield this.aiMove())))})}aiMove(){return R(this,null,function*(){yield this.sleep(500);let t=this.minimax(this.board,"O").move;t&&(this.board[t.row][t.col]="O",this.drawBoard(),this.checkWin("O")?(alert("O gana!"),this.gameOver=!0):this.checkTie()?(alert("Es un empate!"),this.gameOver=!0):this.currentPlayer="X")})}minimax(t,e){if(this.checkWin("X"))return{score:-10,move:null};if(this.checkWin("O"))return{score:10,move:null};if(this.checkTie())return{score:0,move:null};let i={score:e==="O"?-1/0:1/0,move:null};for(let n=0;n<3;n++)for(let o=0;o<3;o++)if(t[n][o]===""){t[n][o]=e;let l=this.minimax(t,e==="O"?"X":"O").score;t[n][o]="",(e==="O"&&l>i.score||e==="X"&&l<i.score)&&(i={score:l,move:{row:n,col:o}})}return i}checkWin(t){return[[[0,0],[0,1],[0,2]],[[1,0],[1,1],[1,2]],[[2,0],[2,1],[2,2]],[[0,0],[1,0],[2,0]],[[0,1],[1,1],[2,1]],[[0,2],[1,2],[2,2]],[[0,0],[1,1],[2,2]],[[0,2],[1,1],[2,0]]].some(i=>i.every(([n,o])=>this.board[n][o]===t))}checkTie(){return this.board.flat().every(t=>t!=="")}sleep(t){return new Promise(e=>setTimeout(e,t))}resetGame(){this.board=[["","",""],["","",""],["","",""]],this.currentPlayer="X",this.gameOver=!1,this.drawBoard()}};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=p({type:r,selectors:[["app-tic-tac-toe"]],viewQuery:function(e,i){if(e&1&&I(de,7),e&2){let n;A(n=z())&&(i.canvas=n.first)}},decls:7,vars:0,consts:[["canvas",""],[3,"click"],["width","600","height","600",3,"click"]],template:function(e,i){if(e&1){let n=b();a(0,"h2"),m(1,"Tres en Raya"),c(),a(2,"div")(3,"button",1),d("click",function(){return w(n),_(i.resetGame())}),m(4,"Reiniciar Juego"),c()(),a(5,"canvas",2,0),d("click",function(l){return w(n),_(i.handleClick(l))}),c()}},styles:["canvas[_ngcontent-%COMP%]{border:1px solid black;background-color:#000;display:block;margin-top:20px}button[_ngcontent-%COMP%]{margin:5px;padding:10px;background-color:#444;color:#fff;border:none;cursor:pointer}button[_ngcontent-%COMP%]:hover{background-color:#666}"]});let s=r;return s})();var fe=(s,r)=>({red:s,yellow:r});function pe(s,r){if(s&1){let f=b();a(0,"div",5),d("click",function(){let e=w(f).index,i=k(2);return _(i.placePiece(e))}),c()}if(s&2){let f=r.$implicit;u("ngClass",V(1,fe,f==="R",f==="Y"))}}function ge(s,r){if(s&1&&(a(0,"div",3),C(1,pe,1,4,"div",4),c()),s&2){let f=r.$implicit;h(),u("ngForOf",f)}}var ne=(()=>{let r=class r{constructor(){this.rows=6,this.cols=7,this.board=[],this.currentPlayer="R",this.gameOver=!1,this.message=""}ngOnInit(){this.initializeBoard()}initializeBoard(){this.board=[];for(let t=0;t<this.rows;t++){this.board[t]=[];for(let e=0;e<this.cols;e++)this.board[t][e]=""}this.gameOver=!1,this.currentPlayer="R",this.message="Tu turno"}placePiece(t){if(!(this.gameOver||this.board[0][t]!=="")){for(let e=this.rows-1;e>=0;e--)if(this.board[e][t]===""){this.board[e][t]=this.currentPlayer;break}if(this.checkWin(this.currentPlayer)){this.message=this.currentPlayer==="R"?"\xA1Ganaste!":"El ordenador gan\xF3",this.gameOver=!0;return}this.currentPlayer=this.currentPlayer==="R"?"Y":"R",this.currentPlayer==="Y"?(this.message="Turno del ordenador...",setTimeout(()=>this.computerMove(),500)):this.message="Tu turno"}}computerMove(){if(this.gameOver)return;let t=-1/0,e=0;for(let i=0;i<this.cols;i++)if(this.board[0][i]===""){let n=this.getNextOpenRow(i);if(n!==-1){this.board[n][i]="Y";let o=this.minimax(this.board,5,!1);this.board[n][i]="",o>t&&(t=o,e=i)}}this.placePiece(e)}getNextOpenRow(t){for(let e=this.rows-1;e>=0;e--)if(this.board[e][t]==="")return e;return-1}minimax(t,e,i){if(this.checkWin("Y"))return 1e3;if(this.checkWin("R"))return-1e3;if(this.isBoardFull())return 0;if(e===0)return this.evaluateBoard(t);if(i){let n=-1/0;for(let o=0;o<this.cols;o++){let l=this.getNextOpenRow(o);if(l!==-1){t[l][o]="Y";let v=this.minimax(t,e-1,!1);t[l][o]="",n=Math.max(n,v)}}return n}else{let n=1/0;for(let o=0;o<this.cols;o++){let l=this.getNextOpenRow(o);if(l!==-1){t[l][o]="R";let v=this.minimax(t,e-1,!0);t[l][o]="",n=Math.min(n,v)}}return n}}evaluateBoard(t){let e=0;return e+=this.evaluateLine(t,"Y"),e-=this.evaluateLine(t,"R"),e}evaluateLine(t,e){let i=0;return i+=this.checkRowsForScore(t,e),i+=this.checkColsForScore(t,e),i+=this.checkDiagonalsForScore(t,e),i}checkRowsForScore(t,e){let i=0;for(let n=0;n<this.rows;n++)for(let o=0;o<this.cols-3;o++){let l=t[n].slice(o,o+4);i+=this.evaluateWindow(l,e)}return i}checkColsForScore(t,e){let i=0;for(let n=0;n<this.cols;n++)for(let o=0;o<this.rows-3;o++){let l=[t[o][n],t[o+1][n],t[o+2][n],t[o+3][n]];i+=this.evaluateWindow(l,e)}return i}checkDiagonalsForScore(t,e){let i=0;for(let n=0;n<this.rows-3;n++)for(let o=0;o<this.cols-3;o++){let l=[t[n][o],t[n+1][o+1],t[n+2][o+2],t[n+3][o+3]];i+=this.evaluateWindow(l,e)}for(let n=0;n<this.rows-3;n++)for(let o=3;o<this.cols;o++){let l=[t[n][o],t[n+1][o-1],t[n+2][o-2],t[n+3][o-3]];i+=this.evaluateWindow(l,e)}return i}evaluateWindow(t,e){let i=0,n=e==="Y"?"R":"Y",o=t.filter(O=>O===e).length,l=t.filter(O=>O==="").length,v=t.filter(O=>O===n).length;return o===4?i+=100:o===3&&l===1?i+=5:o===2&&l===2&&(i+=2),v===3&&l===1&&(i-=4),i}isBoardFull(){for(let t=0;t<this.cols;t++)if(this.board[0][t]==="")return!1;return!0}checkWin(t){return this.checkRows(t)||this.checkCols(t)||this.checkDiagonals(t)}checkRows(t){for(let e=0;e<this.rows;e++)for(let i=0;i<this.cols-3;i++)if(this.board[e][i]===t&&this.board[e][i+1]===t&&this.board[e][i+2]===t&&this.board[e][i+3]===t)return!0;return!1}checkCols(t){for(let e=0;e<this.cols;e++)for(let i=0;i<this.rows-3;i++)if(this.board[i][e]===t&&this.board[i+1][e]===t&&this.board[i+2][e]===t&&this.board[i+3][e]===t)return!0;return!1}checkDiagonals(t){for(let e=0;e<this.rows-3;e++)for(let i=0;i<this.cols-3;i++)if(this.board[e][i]===t&&this.board[e+1][i+1]===t&&this.board[e+2][i+2]===t&&this.board[e+3][i+3]===t)return!0;for(let e=0;e<this.rows-3;e++)for(let i=3;i<this.cols;i++)if(this.board[e][i]===t&&this.board[e+1][i-1]===t&&this.board[e+2][i-2]===t&&this.board[e+3][i-3]===t)return!0;return!1}resetGame(){this.initializeBoard()}};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=p({type:r,selectors:[["app-four-in-a-row"]],decls:8,vars:2,consts:[[1,"game-board"],["class","row",4,"ngFor","ngForOf"],[3,"click"],[1,"row"],["class","cell",3,"ngClass","click",4,"ngFor","ngForOf"],[1,"cell",3,"click","ngClass"]],template:function(e,i){e&1&&(a(0,"h2"),m(1,"Cuatro en Raya"),c(),a(2,"div",0),C(3,ge,2,1,"div",1),c(),a(4,"p"),m(5),c(),a(6,"button",2),d("click",function(){return i.resetGame()}),m(7,"Reiniciar juego"),c()),e&2&&(h(3),u("ngForOf",i.board),h(2),N(i.message))},dependencies:[D,E],styles:[".game-board[_ngcontent-%COMP%]{display:grid;grid-template-rows:repeat(6,50px);gap:5px;justify-content:center}.row[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(7,50px);gap:5px}.cell[_ngcontent-%COMP%]{width:50px;height:50px;background-color:#00f;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer}.red[_ngcontent-%COMP%]{background-color:red}.yellow[_ngcontent-%COMP%]{background-color:#ff0}button[_ngcontent-%COMP%]{margin-top:20px}"]});let s=r;return s})();function ve(s,r){if(s&1){let f=b();a(0,"td",8),d("click",function(){let e=w(f).index,i=k().index,n=k();return _(n.toggleCell(i,e))}),c()}if(s&2){let f=r.$implicit;W("alive",f)}}function we(s,r){if(s&1&&(a(0,"tr"),C(1,ve,1,2,"td",11),c()),s&2){let f=r.$implicit;h(),u("ngForOf",f)}}var oe=(()=>{let r=class r{constructor(){this.rows=20,this.cols=20,this.board=[],this.running=!1,this.speed=500}ngOnInit(){this.createBoard()}createBoard(){this.board=[];for(let t=0;t<this.rows;t++){this.board[t]=[];for(let e=0;e<this.cols;e++)this.board[t][e]=!1}}toggleCell(t,e){this.board[t][e]=!this.board[t][e]}nextGeneration(){let t=this.createEmptyBoard();for(let e=0;e<this.rows;e++)for(let i=0;i<this.cols;i++){let n=this.countAliveNeighbors(e,i),o=this.board[e][i];o&&(n===2||n===3)||!o&&n===3?t[e][i]=!0:t[e][i]=!1}this.board=t}createEmptyBoard(){let t=[];for(let e=0;e<this.rows;e++){t[e]=[];for(let i=0;i<this.cols;i++)t[e][i]=!1}return t}countAliveNeighbors(t,e){let i=0;for(let n=-1;n<=1;n++)for(let o=-1;o<=1;o++){if(n===0&&o===0)continue;let l=t+n,v=e+o;this.isValidCell(l,v)&&this.board[l][v]&&i++}return i}isValidCell(t,e){return t>=0&&t<this.rows&&e>=0&&e<this.cols}startGame(){this.running||(this.running=!0,this.interval=setInterval(()=>this.nextGeneration(),this.speed))}pauseGame(){this.running&&(this.running=!1,clearInterval(this.interval))}resetBoard(){this.pauseGame(),this.createBoard()}resizeBoard(){this.pauseGame(),this.createBoard()}changeSpeed(t){this.speed=t,this.running&&(this.pauseGame(),this.startGame())}};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=p({type:r,selectors:[["app-game-of-life"]],decls:21,vars:6,consts:[[1,"controls"],["for","rows"],["id","rows","type","number",3,"ngModelChange","change","ngModel"],["for","cols"],["id","cols","type","number",3,"ngModelChange","change","ngModel"],["for","speed"],["id","speed","type","number",3,"ngModelChange","change","ngModel"],[3,"click","disabled"],[3,"click"],[1,"board"],[4,"ngFor","ngForOf"],[3,"alive","click",4,"ngFor","ngForOf"]],template:function(e,i){e&1&&(a(0,"h2"),m(1,"Juego de la Vida de Conway"),c(),a(2,"div",0)(3,"label",1),m(4,"Filas:"),c(),a(5,"input",2),T("ngModelChange",function(o){return P(i.rows,o)||(i.rows=o),o}),d("change",function(){return i.resizeBoard()}),c(),a(6,"label",3),m(7,"Columnas:"),c(),a(8,"input",4),T("ngModelChange",function(o){return P(i.cols,o)||(i.cols=o),o}),d("change",function(){return i.resizeBoard()}),c(),a(9,"label",5),m(10,"Velocidad (ms):"),c(),a(11,"input",6),T("ngModelChange",function(o){return P(i.speed,o)||(i.speed=o),o}),d("change",function(){return i.changeSpeed(i.speed)}),c(),a(12,"button",7),d("click",function(){return i.startGame()}),m(13,"Iniciar"),c(),a(14,"button",7),d("click",function(){return i.pauseGame()}),m(15,"Pausar"),c(),a(16,"button",8),d("click",function(){return i.resetBoard()}),m(17,"Reiniciar"),c()(),a(18,"div",9)(19,"table"),C(20,we,2,1,"tr",10),c()()),e&2&&(h(5),S("ngModel",i.rows),h(3),S("ngModel",i.cols),h(3),S("ngModel",i.speed),h(),u("disabled",i.running),h(2),u("disabled",!i.running),h(6),u("ngForOf",i.board))},dependencies:[E,q,U,H,K],styles:[".controls[_ngcontent-%COMP%]{margin-bottom:10px}.board[_ngcontent-%COMP%]{display:flex;justify-content:center}table[_ngcontent-%COMP%]{border-collapse:collapse}td[_ngcontent-%COMP%]{width:20px;height:20px;border:1px solid #ccc;background-color:#fff}td.alive[_ngcontent-%COMP%]{background-color:#000}button[_ngcontent-%COMP%]{margin-left:10px}"]});let s=r;return s})();var re=(()=>{let r=class r{};r.\u0275fac=function(e){return new(e||r)},r.\u0275cmp=p({type:r,selectors:[["app-games-content"]],decls:5,vars:0,consts:[[1,"article-with-sidebar"],[1,"sidebar"],[1,"body-text"]],template:function(e,i){e&1&&(a(0,"div",0)(1,"div",1),L(2,"app-games-navbar"),c(),a(3,"div",2),L(4,"router-outlet"),c()())},dependencies:[Y,te]});let s=r;return s})();var _e=[{path:"",component:re,children:[{path:"tic-tac-toe",component:ie},{path:"four-in-a-row",component:ne},{path:"game-of-life",component:oe}]}],se=(()=>{let r=class r{};r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=F({type:r}),r.\u0275inj=M({imports:[y.forChild(_e),y]});let s=r;return s})();var He=(()=>{let r=class r{};r.\u0275fac=function(e){return new(e||r)},r.\u0275mod=F({type:r}),r.\u0275inj=M({imports:[j,X.forChild(),$,ee,Z,y,se]});let s=r;return s})();export{He as GamesModule};
