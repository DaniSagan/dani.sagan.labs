import { EXTRA_FUNCTIONS } from '../implicit-curve-graph-tool/math-catalog';
import { normalCdf } from '../../shared/math/galton';

// Reuse the graficador's Lanczos implementation rather than a second Gamma approximation.
export const logGamma=EXTRA_FUNCTIONS.find(f=>f.name==='logGamma')!.fn;
const clamp=(p:number)=>Math.max(0,Math.min(1,p));
const logChoose=(n:number,k:number)=>k<0||k>n?-Infinity:logGamma(n+1)-logGamma(k+1)-logGamma(n-k+1);
export function gammaP(a:number,x:number):number {
  if(x<=0)return 0;if(x===Infinity)return 1;
  const factor=Math.exp(a*Math.log(x)-x-logGamma(a));
  if(x<a+1){let term=1/a,sum=term;for(let k=1;k<2000;k++){term*=x/(a+k);sum+=term;if(Math.abs(term)<Math.abs(sum)*1e-13)break;}return clamp(sum*factor);}
  let b=x+1-a,c=1e300,d=1/b,h=d;
  for(let i=1;i<2000;i++){const an=-i*(i-a);b+=2;d=an*d+b;if(Math.abs(d)<1e-300)d=1e-300;c=b+an/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const delta=d*c;h*=delta;if(Math.abs(delta-1)<1e-13)break;}
  return clamp(1-factor*h);
}
function betaFraction(a:number,b:number,x:number):number {
  let c=1,d=1-(a+b)*x/(a+1);if(Math.abs(d)<1e-300)d=1e-300;d=1/d;let h=d;
  for(let m=1;m<1000;m++){
    for(const aa of [m*(b-m)*x/((a+2*m-1)*(a+2*m)),-(a+m)*(a+b+m)*x/((a+2*m)*(a+2*m+1))]){
      d=1+aa*d;if(Math.abs(d)<1e-300)d=1e-300;c=1+aa/c;if(Math.abs(c)<1e-300)c=1e-300;d=1/d;const delta=d*c;h*=delta;
      if(aa<0&&Math.abs(delta-1)<1e-13)return h;
    }
  }
  return h;
}
export function betaI(a:number,b:number,x:number):number {
  if(x<=0)return 0;if(x>=1)return 1;
  const f=Math.exp(logGamma(a+b)-logGamma(a)-logGamma(b)+a*Math.log(x)+b*Math.log1p(-x));
  return clamp(x<(a+1)/(a+b+2)?f*betaFraction(a,b,x)/a:1-f*betaFraction(b,a,1-x)/b);
}
export interface Parameter {key:string;label:string;value:number;min:number;max:number;step:number;}
export interface DistributionSpec {id:string;name:string;discrete:boolean;parameters:Parameter[];formula:string;note:string;}
const param=(key:string,label:string,value:number,min:number,max:number,step=0.1):Parameter=>({key,label,value,min,max,step});
const location=()=>param('mu','Localización μ',0,-20,20);
const scale=()=>param('s','Escala / desviación σ',1,0.1,10);
const shape=()=>param('a','Forma α',2,0.2,30);
const prob=()=>param('p','Probabilidad p',0.5,0.01,0.99,0.01);
export const DISTRIBUTIONS:DistributionSpec[]=[
  {id:'bernoulli',name:'Bernoulli',discrete:true,parameters:[prob()],formula:'P(X = k) = pᵏ(1 − p)¹⁻ᵏ, k ∈ {0,1}',note:'Un ensayo con dos resultados.'},
  {id:'binomial',name:'Binomial',discrete:true,parameters:[param('n','Ensayos n',20,1,200,1),prob()],formula:'P(X = k) = C(n,k)pᵏ(1 − p)ⁿ⁻ᵏ',note:'Número de éxitos en n ensayos independientes.'},
  {id:'poisson',name:'Poisson',discrete:true,parameters:[param('lambda','Intensidad λ',5,0.1,80)],formula:'P(X = k) = e⁻λ λᵏ / k!',note:'Conteo de sucesos con intensidad constante.'},
  {id:'geometric',name:'Geométrica',discrete:true,parameters:[prob()],formula:'P(X = k) = p(1 − p)ᵏ, k ≥ 0',note:'Convención: número de fracasos antes del primer éxito.'},
  {id:'negative-binomial',name:'Binomial negativa',discrete:true,parameters:[param('r','Éxitos r',5,1,30,1),param('p','Probabilidad p',0.5,0.05,0.99,0.01)],formula:'P(X = k) = C(k+r−1,k)pʳ(1 − p)ᵏ',note:'Número de fracasos antes del éxito r.'},
  {id:'hypergeometric',name:'Hipergeométrica',discrete:true,parameters:[param('N','Población N',40,2,200,1),param('K','Éxitos en población K',12,0,200,1),param('n','Extracciones n',10,1,200,1)],formula:'P(X = k) = C(K,k) C(N−K,n−k) / C(N,n)',note:'Muestreo sin reemplazo; K y n no pueden superar N.'},
  {id:'discrete-uniform',name:'Uniforme discreta',discrete:true,parameters:[param('n','Caras n',6,2,100,1)],formula:'P(X = k) = 1/n, k = 1,…,n',note:'Un dado equilibrado de n caras.'},
  {id:'normal',name:'Normal',discrete:false,parameters:[location(),scale()],formula:'f(x) = exp(−(x−μ)² / (2σ²)) / (σ√(2π))',note:'La campana gaussiana; μ es la media y σ la desviación.'},
  {id:'uniform',name:'Uniforme continua',discrete:false,parameters:[param('a','Límite inferior a',0,-20,20),param('b','Límite superior b',1,-19,30)],formula:'f(x) = 1/(b−a), a ≤ x ≤ b',note:'Todos los intervalos de igual longitud tienen igual probabilidad.'},
  {id:'exponential',name:'Exponencial',discrete:false,parameters:[param('lambda','Tasa λ',1,0.1,10)],formula:'f(x) = λ exp(−λx), x ≥ 0',note:'Tiempo de espera sin memoria; la media es 1/λ.'},
  {id:'gamma',name:'Gamma',discrete:false,parameters:[shape(),scale()],formula:'f(x) = xᵅ⁻¹ exp(−x/θ) / (Γ(α)θᵅ)',note:'σ se utiliza aquí como escala θ; tiempos acumulados.'},
  {id:'beta',name:'Beta',discrete:false,parameters:[param('a','Forma α',2,0.2,2030),param('b','Forma β',2,0.2,2030)],formula:'f(x) = xᵅ⁻¹(1−x)ᵝ⁻¹ / B(α,β), 0 < x < 1',note:'Modela proporciones; puede ser unimodal, uniforme o tener forma de U.'},
  {id:'student',name:'t de Student',discrete:false,parameters:[param('nu','Grados de libertad ν',5,0.5,2000,0.5)],formula:'f(x) = Γ((ν+1)/2) (1+x²/ν)⁻⁽ν⁺¹⁾/² / (√(νπ)Γ(ν/2))',note:'Colas más pesadas que la normal; con ν = 1 es Cauchy.'},
  {id:'chi-square',name:'Chi-cuadrado',discrete:false,parameters:[param('nu','Grados de libertad ν',4,1,80,1)],formula:'χ²(ν) = Gamma(ν/2, escala 2)',note:'Suma de cuadrados de ν normales estándar independientes.'},
  {id:'f',name:'F de Fisher',discrete:false,parameters:[param('d1','Grados de libertad d₁',5,1,60,1),param('d2','Grados de libertad d₂',10,1,80,1)],formula:'F = (χ²(d₁)/d₁) / (χ²(d₂)/d₂)',note:'Cociente de varianzas independientes.'},
  {id:'cauchy',name:'Cauchy',discrete:false,parameters:[location(),scale()],formula:'f(x) = 1 / (πσ(1+((x−μ)/σ)²))',note:'μ es localización; la media y la varianza no existen.'},
  {id:'laplace',name:'Laplace',discrete:false,parameters:[location(),scale()],formula:'f(x) = exp(−|x−μ|/b) / (2b)',note:'σ se utiliza como escala b; campana con una punta central.'},
  {id:'logistic',name:'Logística',discrete:false,parameters:[location(),scale()],formula:'F(x) = 1/(1+exp(−(x−μ)/s))',note:'Una sigmoide acumulada y colas más pesadas que la normal.'},
  {id:'lognormal',name:'Lognormal',discrete:false,parameters:[location(),scale()],formula:'log X ~ Normal(μ,σ)',note:'μ y σ corresponden al logaritmo; tamaños y crecimiento multiplicativo.'},
  {id:'weibull',name:'Weibull',discrete:false,parameters:[shape(),scale()],formula:'F(x) = 1 − exp(−(x/s)ᵅ)',note:'La forma decide si la tasa de fallo crece o decrece.'},
  {id:'pareto',name:'Pareto',discrete:false,parameters:[shape(),param('s','Mínimo xₘ',1,0.1,10)],formula:'P(X > x) = (xₘ/x)ᵅ, x ≥ xₘ',note:'Colas de potencia; media infinita si α ≤ 1 y varianza infinita si α ≤ 2.'},
  {id:'gumbel',name:'Gumbel',discrete:false,parameters:[location(),scale()],formula:'F(x) = exp(−exp(−(x−μ)/s))',note:'Una ley de valores extremos para máximos.'},
  {id:'arcsine',name:'Arcoseno',discrete:false,parameters:[],formula:'f(x) = 1/(π√(x(1−x))), 0 < x < 1',note:'Favorece los extremos; aparece en tiempos de ocupación de paseos aleatorios.'},
  {id:'mixture',name:'Mezcla de dos normales',discrete:false,parameters:[param('a','Separación de centros',3,0,10),scale(),prob()],formula:'f(x) = p φσ(x+a) + (1−p) φσ(x−a)',note:'Dos poblaciones pueden producir dos picos; el promedio puede caer entre ambos.'}
];
export interface Law {spec:DistributionSpec;p:Record<string,number>;pdf:(x:number)=>number;cdf:(x:number)=>number;quantile:(q:number)=>number;sample:(rng:()=>number)=>number;mean:number|null;variance:number|null;bounds:[number,number];support:[number,number];}
export function gaussian(rng:()=>number):number{return Math.sqrt(-2*Math.log(rng()))*Math.cos(2*Math.PI*rng());}
export function gammaSample(a:number,rng:()=>number):number {
  if(a<1)return gammaSample(a+1,rng)*rng()**(1/a);
  const d=a-1/3,c=1/Math.sqrt(9*d);
  for(let i=0;i<10000;i++){const z=gaussian(rng),v=(1+c*z)**3;if(v<=0)continue;const u=rng();if(u<1-0.0331*z**4||Math.log(u)<z*z/2+d*(1-v+Math.log(v)))return d*v;}
  throw Error('No se pudo generar una muestra gamma.');
}
export function makeLaw(id:string,values:Record<string,number>={}):Law {
  const spec=DISTRIBUTIONS.find(s=>s.id===id);if(!spec)throw Error('Distribución desconocida.');
  const p=Object.fromEntries(spec.parameters.map(s=>[s.key,values[s.key]??s.value]));
  for(const parameter of spec.parameters){const v=p[parameter.key];if(!Number.isFinite(v)||v<parameter.min||v>parameter.max||(parameter.step===1&&!Number.isInteger(v)))throw Error(`Revisa ${parameter.label}: entre ${parameter.min} y ${parameter.max}${parameter.step===1?', entero':''}.`);}
  if(id==='uniform'&&p.a>=p.b)throw Error('Se requiere a < b.');if(id==='hypergeometric'&&(p.K>p.N||p.n>p.N))throw Error('K y n deben ser menores o iguales que N.');
  const {mu=0,s=1,a=1,b=1,n=1,K=0,N=1,r=1,lambda=1,nu=1,d1=1,d2=1}=p,prob=p.p??0.5;
  let mean:number|null=0,variance:number|null=1,support:[number,number]=[-Infinity,Infinity];
  let pdf:(x:number)=>number=()=>0,cdf:(x:number)=>number=()=>0,sample:((rng:()=>number)=>number)|undefined;
  const phi=(x:number,m=mu,sd=s)=>Math.exp(-0.5*((x-m)/sd)**2)/(sd*Math.sqrt(2*Math.PI));
  const gammaDensity=(x:number,k:number,theta:number)=>x<0?0:x===0?k===1?1/theta:k<1?Infinity:0:Math.exp((k-1)*Math.log(x)-x/theta-logGamma(k)-k*Math.log(theta));
  switch(id){
    case 'bernoulli':support=[0,1];mean=prob;variance=prob*(1-prob);pdf=x=>x===0?1-prob:x===1?prob:0;break;
    case 'binomial':support=[0,n];mean=n*prob;variance=n*prob*(1-prob);pdf=x=>x>=0&&x<=n?Math.exp(logChoose(n,x)+x*Math.log(prob)+(n-x)*Math.log1p(-prob)):0;break;
    case 'poisson':support=[0,Infinity];mean=lambda;variance=lambda;pdf=x=>x<0?0:Math.exp(-lambda+x*Math.log(lambda)-logGamma(x+1));break;
    case 'geometric':support=[0,Infinity];mean=(1-prob)/prob;variance=(1-prob)/prob**2;pdf=x=>x<0?0:prob*(1-prob)**x;break;
    case 'negative-binomial':support=[0,Infinity];mean=r*(1-prob)/prob;variance=r*(1-prob)/prob**2;pdf=x=>x<0?0:Math.exp(logChoose(x+r-1,x)+r*Math.log(prob)+x*Math.log1p(-prob));break;
    case 'hypergeometric':support=[Math.max(0,n-(N-K)),Math.min(n,K)];mean=n*K/N;variance=n*K/N*(1-K/N)*(N-n)/(N-1);pdf=x=>Math.exp(logChoose(K,x)+logChoose(N-K,n-x)-logChoose(N,n));break;
    case 'discrete-uniform':support=[1,n];mean=(n+1)/2;variance=(n*n-1)/12;pdf=x=>x>=1&&x<=n?1/n:0;break;
    case 'normal':mean=mu;variance=s*s;pdf=x=>phi(x);cdf=x=>normalCdf((x-mu)/s);sample=rng=>mu+s*gaussian(rng);break;
    case 'uniform':support=[a,b];mean=(a+b)/2;variance=(b-a)**2/12;pdf=x=>x>=a&&x<=b?1/(b-a):0;cdf=x=>clamp((x-a)/(b-a));sample=rng=>a+(b-a)*rng();break;
    case 'exponential':support=[0,Infinity];mean=1/lambda;variance=1/lambda**2;pdf=x=>x<0?0:lambda*Math.exp(-lambda*x);cdf=x=>x<=0?0:-Math.expm1(-lambda*x);sample=rng=>-Math.log(rng())/lambda;break;
    case 'gamma':support=[0,Infinity];mean=a*s;variance=a*s*s;pdf=x=>gammaDensity(x,a,s);cdf=x=>gammaP(a,x/s);sample=rng=>s*gammaSample(a,rng);break;
    case 'beta':support=[0,1];mean=a/(a+b);variance=a*b/((a+b)**2*(a+b+1));pdf=x=>x<=0||x>=1?0:Math.exp((a-1)*Math.log(x)+(b-1)*Math.log1p(-x)-logGamma(a)-logGamma(b)+logGamma(a+b));cdf=x=>betaI(a,b,x);sample=rng=>{const u=gammaSample(a,rng),v=gammaSample(b,rng);return u/(u+v);};break;
    case 'student':mean=nu>1?0:null;variance=nu>2?nu/(nu-2):null;pdf=x=>Math.exp(logGamma((nu+1)/2)-logGamma(nu/2)-0.5*Math.log(nu*Math.PI)-(nu+1)/2*Math.log1p(x*x/nu));cdf=x=>x===0?0.5:x<0?0.5*betaI(nu/2,0.5,nu/(nu+x*x)):1-0.5*betaI(nu/2,0.5,nu/(nu+x*x));sample=rng=>gaussian(rng)/Math.sqrt(2*gammaSample(nu/2,rng)/nu);break;
    case 'chi-square':support=[0,Infinity];mean=nu;variance=2*nu;pdf=x=>gammaDensity(x,nu/2,2);cdf=x=>gammaP(nu/2,x/2);sample=rng=>2*gammaSample(nu/2,rng);break;
    case 'f':support=[0,Infinity];mean=d2>2?d2/(d2-2):null;variance=d2>4?2*d2*d2*(d1+d2-2)/(d1*(d2-2)**2*(d2-4)):null;pdf=x=>x<=0?0:Math.exp(d1/2*Math.log(d1/d2)+(d1/2-1)*Math.log(x)-(d1+d2)/2*Math.log1p(d1*x/d2)-logGamma(d1/2)-logGamma(d2/2)+logGamma((d1+d2)/2));cdf=x=>x<=0?0:betaI(d1/2,d2/2,d1*x/(d1*x+d2));sample=rng=>(gammaSample(d1/2,rng)/d1)/(gammaSample(d2/2,rng)/d2);break;
    case 'cauchy':mean=null;variance=null;pdf=x=>1/(Math.PI*s*(1+((x-mu)/s)**2));cdf=x=>0.5+Math.atan((x-mu)/s)/Math.PI;sample=rng=>mu+s*Math.tan(Math.PI*(rng()-0.5));break;
    case 'laplace':mean=mu;variance=2*s*s;pdf=x=>Math.exp(-Math.abs(x-mu)/s)/(2*s);cdf=x=>x<mu?0.5*Math.exp((x-mu)/s):1-0.5*Math.exp(-(x-mu)/s);sample=rng=>{const u=rng()-0.5;return mu-s*Math.sign(u)*Math.log1p(-2*Math.abs(u));};break;
    case 'logistic':mean=mu;variance=s*s*Math.PI**2/3;cdf=x=>{const z=(x-mu)/s;return z>=0?1/(1+Math.exp(-z)):Math.exp(z)/(1+Math.exp(z));};pdf=x=>{const v=cdf(x);return v*(1-v)/s;};sample=rng=>{const u=rng();return mu+s*Math.log(u/(1-u));};break;
    case 'lognormal':support=[0,Infinity];mean=Math.exp(mu+s*s/2);variance=Math.expm1(s*s)*Math.exp(2*mu+s*s);pdf=x=>x<=0?0:phi(Math.log(x))/x;cdf=x=>x<=0?0:normalCdf((Math.log(x)-mu)/s);sample=rng=>Math.exp(mu+s*gaussian(rng));break;
    case 'weibull':support=[0,Infinity];mean=s*Math.exp(logGamma(1+1/a));variance=s*s*Math.exp(logGamma(1+2/a))-mean*mean;pdf=x=>x<=0?0:a/s*(x/s)**(a-1)*Math.exp(-((x/s)**a));cdf=x=>x<=0?0:-Math.expm1(-((x/s)**a));sample=rng=>s*(-Math.log(rng()))**(1/a);break;
    case 'pareto':support=[s,Infinity];mean=a>1?a*s/(a-1):null;variance=a>2?a*s*s/((a-1)**2*(a-2)):null;pdf=x=>x<s?0:a*s**a/x**(a+1);cdf=x=>x<s?0:1-(s/x)**a;sample=rng=>s*rng()**(-1/a);break;
    case 'gumbel':mean=mu+0.5772156649015329*s;variance=s*s*Math.PI**2/6;cdf=x=>Math.exp(-Math.exp(-(x-mu)/s));pdf=x=>{const z=(x-mu)/s;return Math.exp(-z-Math.exp(-z))/s;};sample=rng=>mu-s*Math.log(-Math.log(rng()));break;
    case 'arcsine':support=[0,1];mean=0.5;variance=1/8;pdf=x=>x<=0||x>=1?0:1/(Math.PI*Math.sqrt(x*(1-x)));cdf=x=>x<=0?0:x>=1?1:2/Math.PI*Math.asin(Math.sqrt(x));sample=rng=>Math.sin(Math.PI*rng()/2)**2;break;
    case 'mixture':mean=a*(1-2*prob);variance=s*s+4*a*a*prob*(1-prob);pdf=x=>prob*phi(x,-a)+(1-prob)*phi(x,a);cdf=x=>prob*normalCdf((x+a)/s)+(1-prob)*normalCdf((x-a)/s);sample=rng=>(rng()<prob?-a:a)+s*gaussian(rng);break;
  }
  let cumulative:number[]=[];
  if(spec.discrete){const raw=pdf;pdf=x=>Number.isInteger(x)&&x>=support[0]&&x<=support[1]?raw(x):0;let sum=0;
    for(let k=support[0];k<10000&&k<=support[1];k++){sum+=pdf(k);cumulative.push(clamp(sum));if(support[1]===Infinity&&sum>1-1e-12)break;}
    cdf=x=>x<support[0]?0:x>=support[1]?1:cumulative[Math.min(cumulative.length-1,Math.floor(x)-support[0])]||0;
  }
  const finiteCdf=cdf;
  cdf=x=>x===-Infinity?0:x===Infinity?1:finiteCdf(x);
  const quantile=(q:number):number=>{
    if(q<0||q>1||!Number.isFinite(q))throw Error('El cuantil requiere 0 ≤ q ≤ 1.');if(q===0)return support[0];if(q===1)return support[1];
    if(spec.discrete){let lo=0,hi=cumulative.length-1;while(lo<hi){const mid=Math.floor((lo+hi)/2);if(cumulative[mid]>=q)hi=mid;else lo=mid+1;}return lo+support[0];}
    let lo=Number.isFinite(support[0])?support[0]:-1,hi=Number.isFinite(support[1])?support[1]:1;
    for(let i=0;i<100&&cdf(lo)>q;i++)lo=lo<0?lo*2:-1;for(let i=0;i<100&&cdf(hi)<q;i++)hi=hi>0?hi*2:1;
    for(let i=0;i<90;i++){const mid=(lo+hi)/2;if(cdf(mid)<q)lo=mid;else hi=mid;}return (lo+hi)/2;
  };
  const bounds:[number,number]=[quantile(0.005),quantile(0.995)];if(bounds[0]===bounds[1]){bounds[0]-=1;bounds[1]+=1;}
  return {spec,p,pdf,cdf,quantile,sample:sample||((rng)=>quantile(rng())),mean,variance,bounds,support};
}
