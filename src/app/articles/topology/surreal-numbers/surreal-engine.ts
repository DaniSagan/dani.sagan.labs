/** Exact finite surreal arithmetic. BigInt rational values; no floating-point decisions. */
export interface Rational { n: bigint; d: bigint; }
export interface SurrealNode { signs: string; value: Rational; day: number; }
function gcd(a: bigint,b: bigint): bigint { a=a<0n?-a:a; b=b<0n?-b:b; while(b){[a,b]=[b,a%b];} return a; }
export function rational(n: bigint,d=1n): Rational { if(!d)throw Error('Denominador cero'); if(d<0n){n=-n;d=-d;} const g=gcd(n,d);return {n:n/g,d:d/g}; }
export const ZERO=rational(0n);
export function compare(a:Rational,b:Rational):number { const v=a.n*b.d-b.n*a.d;return v<0n?-1:v>0n?1:0; }
export function add(a:Rational,b:Rational):Rational {return rational(a.n*b.d+b.n*a.d,a.d*b.d);}
export function negate(a:Rational):Rational {return rational(-a.n,a.d);}
export function multiply(a:Rational,b:Rational):Rational {return rational(a.n*b.n,a.d*b.d);}
export function text(a:Rational):string {return a.d===1n?String(a.n):a.n+'/'+a.d;}
export function numeric(a:Rational):number {return Number(a.n)/Number(a.d);}
export function parse(value:string):Rational {
 const v=value.trim(); if(v.length>48||!/^[-+]?\d+(?:\/[1-9]\d*)?$/.test(v))throw Error('Usa enteros o fracciones como -3/4; denominador positivo.');
 const [n,d='1']=v.split('/');return rational(BigInt(n),BigInt(d));
}
function floor(a:Rational):bigint {let q=a.n/a.d;if(a.n<0n&&a.n%a.d)q--;return q;}
function ceil(a:Rational):bigint {return -floor(negate(a));}
/** Simplest dyadic in an open rational interval; an absent bound means no constraint. */
export function simplest(left:Rational|null,right:Rational|null):Rational {
 if(left&&right&&compare(left,right)>=0)throw Error('Cada opción izquierda debe ser menor que cada opción derecha.');
 const fits=(x:Rational)=>(!left||compare(left,x)<0)&&(!right||compare(x,right)<0);
 if(fits(ZERO))return ZERO;
 const integer=left&&compare(left,ZERO)>=0?rational(floor(left)+1n):rational(ceil(right!)-1n);
 if(fits(integer))return integer;
 for(let k=1;k<=192;k++) {const d=1n<<BigInt(k);const x=rational(floor(multiply(left!,rational(d)))+1n,d);if(fits(x))return x;}
 throw Error('Intervalo fuera del alcance de este taller.');
}
export function finiteCut(left:Rational[],right:Rational[]):Rational {
 const lo=left.length?left.reduce((a,b)=>compare(a,b)>0?a:b):null;
 const hi=right.length?right.reduce((a,b)=>compare(a,b)<0?a:b):null;
 return simplest(lo,hi);
}
export function parseList(value:string):Rational[] {if(!value.trim())return [];const parts=value.split(',');if(parts.length>8)throw Error('Máximo ocho opciones por lado.');return parts.map(parse);}
export function fromSigns(signs:string):Rational {
 if(!/^[+-]{0,16}$/.test(signs))throw Error('Máximo dieciséis signos + o −.');
 let left:Rational|null=null,right:Rational|null=null,value=ZERO;
 for(const sign of signs){if(sign==='+')left=value;else right=value;value=simplest(left,right);}
 return value;
}
export function generations(day:number):SurrealNode[] {
 if(!Number.isInteger(day)||day<0||day>6)throw Error('Día finito entre 0 y 6.');
 const nodes:SurrealNode[]=[{signs:'',value:ZERO,day:0}];
 let layer=[''];for(let d=1;d<=day;d++){layer=layer.flatMap(s=>[s+'-',s+'+']);for(const signs of layer)nodes.push({signs,value:fromSigns(signs),day:d});}
 return nodes;
}
export function canonical(value:Rational):{left:Rational[];right:Rational[]} {
 if(value.n===0n)return {left:[],right:[]};
 if((value.d&(value.d-1n))!==0n)throw Error('La forma canónica finita exige un diádico.');
 if(value.d===1n)return value.n>0n?{left:[rational(value.n-1n)],right:[]}:{left:[],right:[rational(value.n+1n)]};
 return {left:[rational(value.n-1n,value.d)],right:[rational(value.n+1n,value.d)]};
}
export interface OperationTrace { result:Rational; left:Rational[]; right:Rational[]; }
/** Recursive Conway definitions evaluated on canonical finite options. */
export function operation(a:Rational,b:Rational,op:'+'|'*',memo=new Map<string,OperationTrace>()):OperationTrace {
 const key=text(a)+op+text(b);const cached=memo.get(key);if(cached)return cached;
 const x=canonical(a),y=canonical(b);let left:Rational[],right:Rational[];
 if(op==='+'){
  left=[...x.left.map(v=>operation(v,b,'+',memo).result),...y.left.map(v=>operation(a,v,'+',memo).result)];
  right=[...x.right.map(v=>operation(v,b,'+',memo).result),...y.right.map(v=>operation(a,v,'+',memo).result)];
 }else{
  const term=(u:Rational,v:Rational)=>add(add(operation(u,b,'*',memo).result,operation(a,v,'*',memo).result),negate(operation(u,v,'*',memo).result));
  left=[...x.left.flatMap(u=>y.left.map(v=>term(u,v))),...x.right.flatMap(u=>y.right.map(v=>term(u,v)))];
  right=[...x.left.flatMap(u=>y.right.map(v=>term(u,v))),...x.right.flatMap(u=>y.left.map(v=>term(u,v)))];
 }
 const trace={result:finiteCut(left,right),left,right};memo.set(key,trace);return trace;
}
export function cutText(left:Rational[],right:Rational[]):string {return '{ '+left.map(text).join(', ')+' | '+right.map(text).join(', ')+' }';}
/** An independent evaluator: options are the prefixes left by cutting a coloured edge. */
export function stalkValue(signs:string):Rational {
 const values:Rational[]=[ZERO];for(let end=1;end<=signs.length;end++){
  const l:Rational[]=[],r:Rational[]=[];for(let i=0;i<end;i++)(signs[i]==='+'?l:r).push(values[i]);values.push(finiteCut(l,r));
 }return values[signs.length];
}
export type Player='+'|'-';
export function winningPlayer(signs:string,turn:Player,memo=new Map<string,Player>()):Player {
 const key=signs+turn,known=memo.get(key);if(known)return known;
 const other:Player=turn==='+'?'-':'+';const moves=[...signs].flatMap((s,i)=>s===turn?[i]:[]);
 const winner=moves.some(i=>winningPlayer(signs.slice(0,i),other,memo)===turn)?turn:other;memo.set(key,winner);return winner;
}
/** Lexicographic order on finite Laurent polynomials in omega: exact for this subring of No. */
export function compareLaurent(a:ReadonlyMap<number,bigint>,b:ReadonlyMap<number,bigint>):number {
 const powers=[...new Set([...a.keys(),...b.keys()])].sort((x,y)=>y-x);
 for(const p of powers){const c=(a.get(p)||0n)-(b.get(p)||0n);if(c)return c<0n?-1:1;}return 0;
}
