import{D as y,E as c,K as n,Q as O,R as k,T as P,U as F,V as _,W as w,X as x,ba as L,c as v,ca as D,d as p,e as h,j as C,k as l,o as m,s as i,t as a,u as d,w as M,y as b}from"./chunk-JJSU4K7J.js";var j=[{path:"home",loadChildren:()=>import("./chunk-ZRRRI5SA.js").then(e=>e.HomeModule)},{path:"articles",loadChildren:()=>import("./chunk-T64ASMEW.js").then(e=>e.ArticlesModule)},{path:"games",loadChildren:()=>import("./chunk-UYEXO2AD.js").then(e=>e.GamesModule)},{path:"tools",loadChildren:()=>import("./chunk-XMVLVZKX.js").then(e=>e.ToolsModule)},{path:"",redirectTo:"/home",pathMatch:"full"}],R={useHash:!1,anchorScrolling:"enabled"},A=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=h({type:t}),t.\u0275inj=v({imports:[x.forRoot(j,R),x]});let e=t;return e})();var E=(()=>{let t=class t{constructor(){this.bgPosition=0}ngOnInit(){}onWindowScroll(){let r=window.pageYOffset||document.documentElement.scrollTop||document.body.scrollTop||0;this.bgPosition=-r/2}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=p({type:t,selectors:[["app-header"]],hostBindings:function(o,s){o&1&&M("scroll",function(){return s.onWindowScroll()},!1,C)},inputs:{title:"title"},decls:8,vars:3,consts:[[1,"header"]],template:function(o,s){o&1&&(i(0,"header")(1,"div",0)(2,"h1"),c(3,"Dani.Sagan.Labs"),a(),i(4,"p"),c(5,"Daniel Fern\xE1ndez Villanueva"),a(),i(6,"p"),c(7,"\u{1F9EA}"),a()()()),o&2&&(l(),y("background-position-y","",s.bgPosition,"px"))},styles:['header[_ngcontent-%COMP%]{border-bottom-width:1px;border-bottom-color:#000}.header[_ngcontent-%COMP%]{padding:100px;text-align:center;background:#333;color:#fff;font-size:30px;text-shadow:4px 4px black;background-image:url("./media/westerlund_2-V7VK6R2M.jpg");background-size:cover;background-attachment:fixed}.header[_ngcontent-%COMP%]:before{filter:blur(10px)}.header[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-weight:lighter}']});let e=t;return e})();var W=()=>["/home"],f=()=>["active"],g=()=>({exact:!0}),G=()=>["/articles/test-article"],J=()=>["/tools/prime-decomposition"],K=()=>["/games/tic-tac-toe"],Y=()=>["/articles/contact"],S=(()=>{let t=class t{constructor(){}ngOnInit(){}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=p({type:t,selectors:[["app-navbar"]],decls:18,vars:30,consts:[[1,"topnav"],[1,"nav-items"],[3,"routerLink","routerLinkActive","routerLinkActiveOptions"]],template:function(o,s){o&1&&(i(0,"div",0)(1,"div",1)(2,"ul")(3,"li")(4,"a",2),c(5,"Inicio"),a()(),i(6,"li")(7,"a",2),c(8,"Art\xEDculos"),a()(),i(9,"li")(10,"a",2),c(11,"Herramientas"),a()(),i(12,"li")(13,"a",2),c(14,"Juegos"),a()(),i(15,"li")(16,"a",2),c(17,"Contacto"),a()()()()()),o&2&&(l(4),m("routerLink",n(15,W))("routerLinkActive",n(16,f))("routerLinkActiveOptions",n(17,g)),l(3),m("routerLink",n(18,G))("routerLinkActive",n(19,f))("routerLinkActiveOptions",n(20,g)),l(3),m("routerLink",n(21,J))("routerLinkActive",n(22,f))("routerLinkActiveOptions",n(23,g)),l(3),m("routerLink",n(24,K))("routerLinkActive",n(25,f))("routerLinkActiveOptions",n(26,g)),l(3),m("routerLink",n(27,Y))("routerLinkActive",n(28,f))("routerLinkActiveOptions",n(29,g)))},dependencies:[_,w],styles:[".topnav[_ngcontent-%COMP%]{overflow:hidden;background-color:#333}.nav-items[_ngcontent-%COMP%] > ul[_ngcontent-%COMP%]{list-style-type:none;display:table;margin:0 auto;padding:0}.nav-items[_ngcontent-%COMP%] > ul[_ngcontent-%COMP%] > li[_ngcontent-%COMP%]{float:left}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{float:left;color:#f2f2f2;text-align:center;padding:14px 16px;text-decoration:none;font-size:17px;display:block;min-width:100px}.nav-items[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover{background-color:#ddd;color:#000}.nav-items[_ngcontent-%COMP%]   a.active[_ngcontent-%COMP%]{background-color:#04aa6d;color:#fff}.nav-items[_ngcontent-%COMP%]{margin-right:auto;margin-left:auto}"]});let e=t;return e})();var H=(()=>{let t=class t{constructor(){}ngOnInit(){}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=p({type:t,selectors:[["app-footer"]],decls:6,vars:0,consts:[["href","mailto:daniel.fernandez.villanueva@gmail.com"]],template:function(o,s){o&1&&(i(0,"footer")(1,"p"),c(2,"Autor: Daniel Fern\xE1ndez Villanueva"),d(3,"br"),i(4,"a",0),c(5,"daniel.fernandez.villanueva@gmail.com"),a()()())},styles:["footer[_ngcontent-%COMP%]{left:0;bottom:0;width:100%;background-color:#333;color:#fff;text-align:center;padding-top:20px;padding-bottom:20px}"]});let e=t;return e})();var I=(()=>{let t=class t{constructor(){}ngOnInit(){}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=p({type:t,selectors:[["app-content"]],decls:2,vars:0,consts:[[1,"content"]],template:function(o,s){o&1&&(i(0,"div",0),d(1,"router-outlet"),a())},dependencies:[F],styles:[".content[_ngcontent-%COMP%]{min-height:500px;max-width:1080px;margin-right:auto;margin-left:auto;padding:50px;background-color:#fafafa;color:#222}"]});let e=t;return e})();var T=(()=>{let t=class t{constructor(){this.title="dani.sagan.labs"}};t.\u0275fac=function(o){return new(o||t)},t.\u0275cmp=p({type:t,selectors:[["app-root"]],decls:4,vars:1,consts:[[3,"title"]],template:function(o,s){o&1&&d(0,"app-header",0)(1,"app-navbar")(2,"app-content")(3,"app-footer"),o&2&&b("title",s.title)},dependencies:[E,S,H,I],styles:[".content[_ngcontent-%COMP%]{margin:40px}.sidebar[_ngcontent-%COMP%]{position:fixed;width:150px;left:0;top:0;padding-top:40px;background-color:#add8e6}.body-text[_ngcontent-%COMP%]{margin-left:150px;font-size:18px}"]});let e=t;return e})();var z=(()=>{let t=class t{};t.\u0275fac=function(o){return new(o||t)},t.\u0275mod=h({type:t,bootstrap:[T]}),t.\u0275inj=v({imports:[k,A,P.forRoot(),D,L]});let e=t;return e})();var N={production:!0};N.production&&void 0;O().bootstrapModule(z).catch(e=>console.error(e));
