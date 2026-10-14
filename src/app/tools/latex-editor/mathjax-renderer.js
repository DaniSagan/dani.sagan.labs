// Isolate MathJax 3's legacy declaration files from strict application types.
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { SVG } from 'mathjax-full/js/output/svg.js';
import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
// Register packages directly: AllPackages calls the host page's global MathJax loader.
import 'mathjax-full/js/input/tex/ams/AmsConfiguration.js';
import 'mathjax-full/js/input/tex/amscd/AmsCdConfiguration.js';
import 'mathjax-full/js/input/tex/bbox/BboxConfiguration.js';
import 'mathjax-full/js/input/tex/boldsymbol/BoldsymbolConfiguration.js';
import 'mathjax-full/js/input/tex/braket/BraketConfiguration.js';
import 'mathjax-full/js/input/tex/cancel/CancelConfiguration.js';
import 'mathjax-full/js/input/tex/cases/CasesConfiguration.js';
import 'mathjax-full/js/input/tex/centernot/CenternotConfiguration.js';
import 'mathjax-full/js/input/tex/color/ColorConfiguration.js';
import 'mathjax-full/js/input/tex/colortbl/ColortblConfiguration.js';
import 'mathjax-full/js/input/tex/empheq/EmpheqConfiguration.js';
import 'mathjax-full/js/input/tex/enclose/EncloseConfiguration.js';
import 'mathjax-full/js/input/tex/extpfeil/ExtpfeilConfiguration.js';
import 'mathjax-full/js/input/tex/gensymb/GensymbConfiguration.js';
import 'mathjax-full/js/input/tex/mathtools/MathtoolsConfiguration.js';
import 'mathjax-full/js/input/tex/mhchem/MhchemConfiguration.js';
import 'mathjax-full/js/input/tex/newcommand/NewcommandConfiguration.js';
import 'mathjax-full/js/input/tex/physics/PhysicsConfiguration.js';
import 'mathjax-full/js/input/tex/upgreek/UpgreekConfiguration.js';
import 'mathjax-full/js/input/tex/unicode/UnicodeConfiguration.js';
import 'mathjax-full/js/input/tex/verb/VerbConfiguration.js';
import 'mathjax-full/js/input/tex/configmacros/ConfigMacrosConfiguration.js';
import 'mathjax-full/js/input/tex/tagformat/TagFormatConfiguration.js';
import 'mathjax-full/js/input/tex/textcomp/TextcompConfiguration.js';
import 'mathjax-full/js/input/tex/textmacros/TextMacrosConfiguration.js';
const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);
const packages = ['base', 'ams', 'amscd', 'bbox', 'boldsymbol', 'braket', 'cancel', 'cases', 'centernot', 'color', 'colortbl', 'empheq', 'enclose', 'extpfeil', 'gensymb', 'mathtools', 'mhchem', 'newcommand', 'physics', 'upgreek', 'unicode', 'verb', 'configmacros', 'tagformat', 'textcomp', 'textmacros'];
const renderer = mathjax.document('', { InputJax: new TeX({ packages }), OutputJax: new SVG({ fontCache: 'none' }) });
export function renderLatexSvg(latex) { return adaptor.outerHTML(renderer.convert(latex, { display: true })); }
