(this["webpackJsonpseng513-assignment-02"]=this["webpackJsonpseng513-assignment-02"]||[]).push([[0],[,function(e,t,a){e.exports={Square:"Square_Square__-atLt",Flag:"Square_Flag__3L1jX",Number:"Square_Number__2fL49",Bomb:"Square_Bomb__dW5SF",Empty:"Square_Empty__2HdZY"}},,,,,function(e,t,a){e.exports={Modal:"Modal_Modal__1TS5G",Success:"Modal_Success__2IBP5",Fail:"Modal_Fail__2fLs3"}},,,,,function(e,t,a){e.exports={Canvas:"Canvas_Canvas__1Dk0B"}},function(e,t,a){e.exports={Button:"Button_Button__3tcKB"}},function(e,t,a){e.exports={Board:"Board_Board__wXQhC"}},function(e,t,a){e.exports={StatusBar:"StatusBar_StatusBar__2iz1F"}},function(e,t,a){e.exports={StatusCell:"StatusCell_StatusCell__ikAFU"}},function(e,t,a){e.exports={Backdrop:"Backdrop_Backdrop__1mxdC"}},function(e,t,a){e.exports=a(25)},,,,,function(e,t,a){},,,function(e,t,a){"use strict";a.r(t);var n=a(0),r=a.n(n),s=a(10),o=a.n(s),u=(a(22),a(2)),l=a(3),c=a(5),i=a(4),d=a(8),m=a(7),f=a.n(m),b=a(11),v=a.n(b),h=a(6),p=a.n(h),O=function(e){var t=[p.a.Modal];return e.normal||(e.success?t.push(p.a.Success):t.push(p.a.Fail)),r.a.createElement("div",{className:t.join(" "),style:{position:e.fixedPosition?"fixed":"absolute"}},e.children)},B=a(12),S=a.n(B),g=function(e){return r.a.createElement("div",{className:S.a.Button,style:e.style},r.a.createElement("button",{type:"button",onClick:e.clicked},e.children))},k=a(13),E=a.n(k),_=a(1),q=a.n(_),x=r.a.memo((function(e){var t=[q.a.Square];!e.revealed&&e.flagged&&t.push(q.a.Flag),e.revealed&&e.numeric&&t.push(q.a.Number),e.revealed&&e.bombed&&t.push(q.a.Bomb),!e.revealed||e.numeric||e.bombed||t.push(q.a.Empty);var a=null,n=null;return e.revealed&&e.numeric&&e.number?(a=e.number,n=function(e){switch(e){case 1:return{color:"#b0e0e6"};case 2:return{color:"#376c9e"};case 3:return{color:"#252577"};case 4:case 5:case 6:case 7:case 8:return{color:"#800000"};default:return{color:"#b0e0e6"}}}(e.number)):e.revealed&&e.bombed?a=r.a.createElement("i",{className:"fas fa-bomb"}):!e.revealed&&e.flagged&&(a=r.a.createElement("i",{className:"fas fa-flag"})),r.a.createElement("div",{className:t.join(" "),style:n,onClick:e.clicked,onContextMenu:e.clicked,onMouseDown:e.mouseDown,onMouseUp:e.mouseUp,onTouchStart:e.mouseDown,onTouchEnd:e.mouseUp},a)})),C=function(e){return r.a.createElement("div",{className:E.a.Board},e.board.map((function(t,a){return r.a.createElement("div",{key:a},t.map((function(t,n){return r.a.createElement(x,{key:a*e.rows+n,revealed:t.revealed,numeric:void 0!==t.number,bombed:t.bombed,flagged:t.flagged,number:t.number,clicked:function(t){return e.clickedHandler(t,a,n)},mouseDown:function(){return e.mouseDownHandler(a,n)},mouseUp:e.mouseUpHandler})})))})))},w=a(14),y=a.n(w),F=a(15),H=a.n(F),I=function(e){return r.a.createElement("div",{className:H.a.StatusCell,style:e.style},e.children)},M=function(e){return r.a.createElement("div",{className:y.a.StatusBar},r.a.createElement(I,null,e.time,"s"),r.a.createElement(I,null,e.moves,"\xa0\xa0",r.a.createElement("i",{className:"fas fa-shoe-prints"})),r.a.createElement(I,null,e.bombs-e.bombsFound,"\xa0\xa0",r.a.createElement("i",{className:"fas fa-bomb"})))},j=a(16),D=a.n(j),N=function(){return r.a.createElement("div",{className:D.a.Backdrop})},R=function(e){Object(c.a)(a,e);var t=Object(i.a)(a);function a(e){var n;Object(u.a)(this,a),(n=t.call(this)).state={rows:0,columns:0,board:[],squares:0,squaresRevealed:0,bombsPoints:[],bombs:0,bombsFound:0,moves:0,time:0,timer:null,firstClick:!0,success:!1,failed:!1},n.calculateRowsAndColumns=function(e,t){return e/10>=27?[t/10,10]:[t/5,5]},n.populateBoard=function(){for(var e=[],t=0;t<n.state.rows;t++){e.push([]);for(var a=0;a<n.state.columns;a++)e[t].push({revealed:!1,flagged:!1})}return e},n.isGameSucceeded=function(){if(!n.state.success&&!n.state.failed&&n.state.squares-n.state.squaresRevealed===n.state.bombs){var e=n.revealAllBombs(n.state.board);clearInterval(n.state.timer),n.setState({board:e,success:!0})}},n.revealAllBombs=function(e){for(var t=0;t<n.state.bombsPoints.length;t++){var a=n.state.bombsPoints[t];e[a[0]][a[1]].flagged=!1,e[a[0]][a[1]].revealed=!0}return e},n.revealSquare=function(e,t,a){var r=n.adjacentBombCount(e,t,a);return e[t][a].flagged?n.setState((function(e){return{squaresRevealed:e.squaresRevealed+1,bombsFound:e.bombsFound-1}})):n.setState((function(e){return{squaresRevealed:e.squaresRevealed+1}})),e[t][a].revealed=!0,e[t][a].flagged=!1,0===r?e=n.revealAdjacentSquares(e,t,a):e[t][a].number=r,e},n.revealAdjacentSquares=function(e,t,a){return n.isIndexOutOfBounds(e,t-1,a-1)||e[t-1][a-1].revealed||(e=n.revealSquare(e,t-1,a-1)),n.isIndexOutOfBounds(e,t-1,a)||e[t-1][a].revealed||(e=n.revealSquare(e,t-1,a)),n.isIndexOutOfBounds(e,t-1,a+1)||e[t-1][a+1].revealed||(e=n.revealSquare(e,t-1,a+1)),n.isIndexOutOfBounds(e,t,a-1)||e[t][a-1].revealed||(e=n.revealSquare(e,t,a-1)),n.isIndexOutOfBounds(e,t,a+1)||e[t][a+1].revealed||(e=n.revealSquare(e,t,a+1)),n.isIndexOutOfBounds(e,t+1,a-1)||e[t+1][a-1].revealed||(e=n.revealSquare(e,t+1,a-1)),n.isIndexOutOfBounds(e,t+1,a)||e[t+1][a].revealed||(e=n.revealSquare(e,t+1,a)),n.isIndexOutOfBounds(e,t+1,a+1)||e[t+1][a+1].revealed||(e=n.revealSquare(e,t+1,a+1)),e},n.adjacentBombCount=function(e,t,a){var r=0;return!n.isIndexOutOfBounds(e,t-1,a-1)&&e[t-1][a-1].bombed&&r++,!n.isIndexOutOfBounds(e,t-1,a)&&e[t-1][a].bombed&&r++,!n.isIndexOutOfBounds(e,t-1,a+1)&&e[t-1][a+1].bombed&&r++,!n.isIndexOutOfBounds(e,t,a-1)&&e[t][a-1].bombed&&r++,!n.isIndexOutOfBounds(e,t,a+1)&&e[t][a+1].bombed&&r++,!n.isIndexOutOfBounds(e,t+1,a-1)&&e[t+1][a-1].bombed&&r++,!n.isIndexOutOfBounds(e,t+1,a)&&e[t+1][a].bombed&&r++,!n.isIndexOutOfBounds(e,t+1,a+1)&&e[t+1][a+1].bombed&&r++,r},n.isIndexOutOfBounds=function(e,t,a){return!(t>=0&&t<e.length&&a>=0&&a<e[t].length)},n.handleFirstClick=function(e,t,a){for(var r=n.generateBombs(e,t),s=0;s<a.length;s++)for(var o=0;o<a[s].length;o++)a[s][o].bombed=n.indexOfCoordinate(r,s,o)>=0;return[a,r]},n.generateBombs=function(e,t){for(var a=[],r=0;r<n.state.bombs;r++)for(;;){var s=Math.floor(Math.random()*n.state.rows),o=Math.floor(Math.random()*n.state.columns);if(s!==e&&o!==t&&-1===n.indexOfCoordinate(a,s,o)){a.push([s,o]);break}}return a},n.indexOfCoordinate=function(e,t,a){for(var n=0;n<e.length&&(e[n][0]!==t||e[n][1]!==a);n++);return n!==e.length?n:-1},n.randomlyBecomeBomb=function(e,t,a,n){if(n<t)return!(e-a>t-n)||1===Math.floor(Math.random()*Math.floor(e/t))+1},n.handleLeftClick=function(e,t){if(!n.state.board[e][t].revealed&&!n.state.board[e][t].flagged){var a=f.a.cloneDeep(n.state.board),r=n.state.bombsPoints;if(n.state.firstClick){var s=n.handleFirstClick(e,t,a),o=Object(d.a)(s,2);a=o[0],r=o[1],n.setState({bombsPoints:r,firstClick:!1})}a[e][t].bombed?(a=n.revealAllBombs(a),clearInterval(n.state.timer)):a=n.revealSquare(a,e,t),n.setState((function(n){return{board:a,failed:a[e][t].bombed,moves:n.moves+1}}))}},n.handleRightClick=function(e,t){if(!n.state.board[e][t].revealed){var a=f.a.cloneDeep(n.state.board),r=a[e][t],s=r.flagged?n.state.bombsFound-1:n.state.bombsFound+1;r.flagged=!r.flagged,a[e][t]=r,n.setState({board:a,bombsFound:s})}},n.squareClickedHandler=function(e,t,a){n.state.success||n.state.failed||("click"===e.type?n.handleLeftClick(t,a):"contextmenu"===e.type&&(e.preventDefault(),n.handleRightClick(t,a)))},n.mouseDownHandler=function(e,t){n.setState({mouseDown:setTimeout((function(){n.state.success||n.state.failed||n.handleRightClick(e,t)}),1e3)})},n.mouseUpHandler=function(){clearTimeout(n.state.mouseDown)};var r=n.calculateRowsAndColumns(window.innerWidth,e.numOfSquares),s=Object(d.a)(r,2);return n.state.rows=s[0],n.state.columns=s[1],n.state.squares=e.numOfSquares,n.state.bombs=e.numOfBombs,n.state.board=n.populateBoard(),n}return Object(l.a)(a,[{key:"componentDidMount",value:function(){var e=this;this.setState({timer:setInterval((function(){return e.setState((function(e){return{time:e.time+1}}))}),1e3)})}},{key:"componentDidUpdate",value:function(){this.isGameSucceeded()}},{key:"render",value:function(){var e=null;return this.state.success?e=r.a.createElement(n.Fragment,null,r.a.createElement(N,null),r.a.createElement(O,{fixedPosition:!0,success:!0},"You swept all the mines in ",this.state.time,"s with ",this.state.moves," moves!",r.a.createElement(g,{clicked:this.props.restartHandler},"Restart"))):this.state.failed&&(e=r.a.createElement(n.Fragment,null,r.a.createElement(N,null),r.a.createElement(O,{fixedPosition:!0},"Mine exploded!",r.a.createElement(g,{clicked:this.props.restartHandler},"Restart")))),r.a.createElement(n.Fragment,null,r.a.createElement("div",{className:v.a.Canvas},r.a.createElement(M,{time:this.state.time,moves:this.state.moves,bombs:this.state.bombs,bombsFound:this.state.bombsFound}),r.a.createElement(C,{board:this.state.board,rows:this.state.rows,clickedHandler:this.squareClickedHandler,mouseDownHandler:this.mouseDownHandler,mouseUpHandler:this.mouseUpHandler})),e)}}]),a}(n.Component),P=function(e){Object(c.a)(a,e);var t=Object(i.a)(a);function a(){var e;Object(u.a)(this,a);for(var n=arguments.length,r=new Array(n),s=0;s<n;s++)r[s]=arguments[s];return(e=t.call.apply(t,[this].concat(r))).state={numOfSquares:null,numOfBombs:null},e.buttonClickedHandler=function(t,a){e.setState({numOfSquares:t,numOfBombs:a})},e.gameRestartHandler=function(){e.setState({numOfSquares:null,numOfBombs:null})},e}return Object(l.a)(a,[{key:"render",value:function(){var e=this;return this.state.numOfSquares?r.a.createElement(R,{numOfSquares:this.state.numOfSquares,numOfBombs:this.state.numOfBombs,restartHandler:this.gameRestartHandler}):r.a.createElement(O,{normal:!0},"Please choose the difficulty",r.a.createElement(g,{clicked:function(){return e.buttonClickedHandler(100,5)}},"Easy"),r.a.createElement(g,{clicked:function(){return e.buttonClickedHandler(200,25)}},"Hard"))}}]),a}(n.Component);var U=function(){return r.a.createElement("div",null,r.a.createElement(P,null))};Boolean("localhost"===window.location.hostname||"[::1]"===window.location.hostname||window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/));o.a.render(r.a.createElement(r.a.StrictMode,null,r.a.createElement(U,null)),document.getElementById("root")),"serviceWorker"in navigator&&navigator.serviceWorker.ready.then((function(e){e.unregister()})).catch((function(e){console.error(e.message)}))}],[[17,1,2]]]);
//# sourceMappingURL=main.c99c348a.chunk.js.map