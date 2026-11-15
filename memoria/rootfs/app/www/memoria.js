/* MemorIA · Lit (BSD-3), Lucide icons (ISC), Barlow, Barlow Condensed & Caveat (OFL) */
window.litDisableBundleWarning=true;
(()=>{(()=>{if(typeof window>"u"||window.__selectSheet)return;let s=window.__selectSheet={theme:null,icon:null,isOpen:()=>!!t},t=null,e=0,a=null,i=`
select:not([multiple]){pointer-events:none}
.ss-wrap{position:fixed;inset:0;z-index:2147483000;display:flex;align-items:flex-end;justify-content:center;font-family:var(--ss-font);-webkit-tap-highlight-color:transparent}
dialog.ss-wrap{width:auto;height:auto;max-width:none;max-height:none;margin:0;padding:0;border:0;background:transparent;color:inherit;overflow:visible}
dialog.ss-wrap::backdrop{background:transparent}
.ss-back{position:absolute;inset:0;background:var(--ss-scrim);opacity:0;transition:opacity .18s}
.ss-sheet{position:relative;width:100%;max-width:560px;max-height:min(72vh,640px);display:flex;flex-direction:column;background:var(--ss-bg);color:var(--ss-fg);border-radius:28px 28px 0 0;box-shadow:0 -8px 32px rgba(0,0,0,.25);transform:translateY(100%);transition:transform .2s cubic-bezier(.2,.8,.2,1);padding-bottom:env(safe-area-inset-bottom)}
.ss-wrap.out{pointer-events:none}
.ss-wrap.in .ss-back{opacity:1}
.ss-wrap.in .ss-sheet{transform:none}
.ss-grab{width:40px;height:4px;border-radius:2px;background:var(--ss-line2);margin:10px auto 2px;flex:none}
.ss-head{display:flex;align-items:center;gap:10px;padding:6px 10px 8px 16px;flex:none}
.ss-ic{display:grid;place-items:center;flex:none;width:32px;height:32px;border-radius:9px;background:var(--ss-soft);color:var(--ss-a)}
.ss-ic svg{width:18px;height:18px;fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}
.ss-head b{flex:1;font-size:17px;font-weight:600;line-height:1.25;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ss-x{width:40px;height:40px;border-radius:50%;border:0;background:transparent;color:var(--ss-mut);display:grid;place-items:center;cursor:pointer;flex:none}
.ss-x:hover{background:var(--ss-soft2)}
.ss-x svg,.ss-opt svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.ss-list{overflow-y:auto;overscroll-behavior:contain;padding:0 10px 12px}
.ss-group{font-size:12px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;color:var(--ss-mut);padding:12px 12px 4px}
.ss-opt{display:flex;align-items:center;gap:12px;width:100%;min-height:50px;padding:10px 12px;border:0;border-radius:14px;background:transparent;color:inherit;font:inherit;font-size:16px;line-height:1.3;text-align:left;cursor:pointer}
.ss-opt span{flex:1;min-width:0;overflow-wrap:anywhere}
.ss-opt:hover,.ss-opt:focus-visible{background:var(--ss-soft2);outline:none}
.ss-opt.on{background:var(--ss-soft);font-weight:600}
.ss-opt.on svg{color:var(--ss-a)}
.ss-opt:not(.on) svg{visibility:hidden}
.ss-opt:disabled{opacity:.45;cursor:default}
@media (min-width:700px){.ss-wrap{align-items:center}.ss-sheet{max-width:440px;border-radius:28px;transform:translateY(16px) scale(.98);opacity:0;transition:transform .16s,opacity .16s}.ss-wrap.in .ss-sheet{opacity:1}.ss-grab{display:none}.ss-head{padding-top:14px}}
@media (prefers-reduced-motion:reduce){.ss-back,.ss-sheet{transition:none}}
`,r='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>',o='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',n='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>',l=()=>{if(document.getElementById("ss-css"))return;let v=document.createElement("style");v.id="ss-css",v.textContent=i,(document.head||document.documentElement).appendChild(v)};document.readyState==="loading"?document.addEventListener("DOMContentLoaded",l):l();let h=v=>v.parentNode&&v.parentNode.host&&v.parentNode.nodeType===11?v.parentNode.host:v.parentNode||(v.host?v.host:null),u=v=>{let b=/rgba?\(([^)]+)\)/.exec(v||"");if(!b)return null;let y=b[1].split(/[ ,/]+/).filter(Boolean).map(Number);return{r:y[0],g:y[1],b:y[2],a:y.length>3?y[3]:1}},d=({r:v,g:b,b:y})=>(.2126*v+.7152*b+.0722*y)/255,f=(v,b)=>{let y=u(v)||(/^#([0-9a-f]{6})$/i.test(v)?{r:parseInt(v.slice(1,3),16),g:parseInt(v.slice(3,5),16),b:parseInt(v.slice(5,7),16)}:{r:100,g:160,b:240});return`rgba(${y.r},${y.g},${y.b},${b})`};function g(v){let b=getComputedStyle(v),y=S=>{for(let R of S){let k=b.getPropertyValue(R).trim();if(k)return k}return""},$=null;for(let S=v;S&&S.nodeType===1;S=h(S)){let R=u(getComputedStyle(S).backgroundColor);if(R&&R.a>.5){$=d(R)<.45;break}}$===null&&($=!!(window.matchMedia&&matchMedia("(prefers-color-scheme: dark)").matches));let T=s.theme&&s.theme()||{};$=T.dark??$;let A=T.accent||y(["--rv-accent","--a","--accent","--cor"])||"#64b5f6",D=T.bg||y(["--rv-surface","--surface","--card"]),ct=T.fg||y(["--rv-text","--text","--fg","--ink"]),Y=T.muted||y(["--rv-muted","--muted","--mut"]);return{"--ss-bg":D||($?"#1b2229":"#ffffff"),"--ss-fg":ct||($?"#e8edf3":"#141a22"),"--ss-mut":Y||($?"#9aa6b4":"#5b6573"),"--ss-line2":$?"rgba(255,255,255,.18)":"rgba(0,0,0,.14)","--ss-a":A,"--ss-soft":f(A,$?.22:.16),"--ss-soft2":$?"rgba(255,255,255,.06)":"rgba(0,0,0,.05)","--ss-scrim":y(["--rv-scrim","--scrim"])||"rgba(0,0,0,.45)","--ss-font":b.fontFamily||"system-ui, sans-serif"}}function x(v){let b=v.getAttribute("aria-label");if(b)return b;let y=v.getRootNode(),$=v.getAttribute("aria-labelledby");if($&&y.getElementById){let A=$.split(/\s+/).map(D=>(y.getElementById(D)||{}).textContent||"").join(" ").trim();if(A)return A}if(v.id&&y.querySelector){let A=y.querySelector(`label[for="${CSS.escape(v.id)}"]`);if(A)return A.textContent.trim()}let T=v.closest("label, .field");if(T){let A=T.querySelector(".flabel, .label, legend, b, span");if(A&&!A.contains(v))return A.textContent.trim()}return""}function w(v){try{let A=s.icon&&s.icon(v);if(A)return A}catch{}let b=v.getRootNode(),y=[],$=v.getAttribute("aria-labelledby");$&&b.getElementById&&$.split(/\s+/).forEach(A=>y.push(b.getElementById(A))),v.id&&b.querySelector&&y.push(b.querySelector(`label[for="${CSS.escape(v.id)}"]`));let T=v.closest("label, .field, .campo");T&&y.push(T.querySelector("label, .lbl, .flabel, .label, legend, b, span"));for(let A of y){let D=A&&!A.contains(v)&&A.querySelector("svg");if(D)return D.outerHTML}return n}function M(v){let b=v.closest?v.closest("dialog"):null;if(!b||!b.open)return!1;try{return b.matches(":modal")}catch{return!0}}function P(v){if(t||!v||v.disabled||v.multiple)return;let b=M(v),y=document.createElement(b?"dialog":"div");y.className="ss-wrap";for(let[S,R]of Object.entries(g(v)))y.style.setProperty(S,R);let $=x(v),T=document.createElement("div");T.className="ss-sheet",T.setAttribute("role","dialog"),T.setAttribute("aria-modal","true"),$&&T.setAttribute("aria-label",$),T.innerHTML=`<div class="ss-grab"></div><div class="ss-head"><span class="ss-ic" aria-hidden="true">${w(v)}</span><b></b><button type="button" class="ss-x" aria-label="Fechar">${r}</button></div><div class="ss-list" role="listbox"></div>`,T.querySelector(".ss-head b").textContent=$;let A=T.querySelector(".ss-list"),D=null,ct=S=>{let R=document.createElement("button");R.type="button",R.className=`ss-opt${S.selected?" on":""}`,R.setAttribute("role","option"),R.setAttribute("aria-selected",S.selected?"true":"false"),R.disabled=S.disabled,R.innerHTML=`<span></span>${o}`,R.firstChild.textContent=S.label||S.textContent,R.addEventListener("click",()=>I(S.value)),S.selected&&(D=R),A.appendChild(R)};for(let S of v.children)if(S.tagName==="OPTGROUP"){let R=document.createElement("div");R.className="ss-group",R.textContent=S.label,A.appendChild(R);for(let k of S.children)k.tagName==="OPTION"&&!k.hidden&&ct(k)}else S.tagName==="OPTION"&&!S.hidden&&ct(S);let Y=document.createElement("div");if(Y.className="ss-back",y.append(Y,T),document.body.appendChild(y),t={sel:v,wrap:y,pending:null,closing:!1},b){try{y.showModal()}catch{}y.addEventListener("cancel",S=>{S.preventDefault(),_()})}Y.addEventListener("click",()=>_()),T.querySelector(".ss-x").addEventListener("click",()=>_()),y.addEventListener("keydown",S=>{if(S.key==="Escape")S.preventDefault(),S.stopPropagation(),_();else if(S.key==="ArrowDown"||S.key==="ArrowUp"){let R=[...A.querySelectorAll(".ss-opt:not(:disabled)")],k=R.indexOf(document.activeElement),V=R[Math.max(0,Math.min(R.length-1,k+(S.key==="ArrowDown"?1:-1)))];V&&(S.preventDefault(),V.focus())}});try{history.pushState(history.state,"")}catch{}requestAnimationFrame(()=>{y.classList.add("in"),D?(D.scrollIntoView({block:"center"}),D.focus({preventScroll:!0})):T.querySelector(".ss-x").focus({preventScroll:!0})})}function _(v=null){if(!t||t.closing)return;t.closing=!0,t.pending=v;let b=t,y=()=>{if(t!==b)return;t=null,b.wrap.open&&b.wrap.close(),b.wrap.classList.remove("in"),b.wrap.classList.add("out"),setTimeout(()=>b.wrap.remove(),220);let $=b.sel;b.pending!==null&&$.value!==b.pending&&($.value=b.pending,$.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),$.dispatchEvent(new Event("change",{bubbles:!0,composed:!0})));try{$.focus({preventScroll:!0})}catch{}};if(b.finish=y,b.byBack)return y();history.back(),setTimeout(y,400)}let I=v=>_(v);window.addEventListener("popstate",v=>{if(t){if(v.stopImmediatePropagation(),t.closing)return t.finish&&t.finish();t.byBack=!0,_()}});function C(v){let b=v.composedPath?v.composedPath():[v.target],y=b[0];if(y&&y.tagName==="SELECT")return y;if(typeof v.clientX!="number")return null;for(let $ of b.slice(0,6)){if(!$||$.nodeType!==1||$===document.body||$===document.documentElement)break;for(let T of $.querySelectorAll("select")){if(T.disabled||T.multiple)continue;let A=T.getBoundingClientRect();if(A.width&&v.clientX>=A.left&&v.clientX<=A.right&&v.clientY>=A.top&&v.clientY<=A.bottom&&F(T,v.clientX,v.clientY))return T}}return null}function F(v,b,y){let $=v.style.getPropertyValue("pointer-events");v.style.setProperty("pointer-events","auto","important");let T=null;try{let A=v.getRootNode();T=(A.elementFromPoint?A:document).elementFromPoint(b,y)}catch{}return $?v.style.setProperty("pointer-events",$):v.style.removeProperty("pointer-events"),T===v}let at=v=>{let b=v.composedPath?v.composedPath()[0]:v.target;return b&&b.tagName==="SELECT"&&!b.disabled&&!b.multiple?b:null};window.addEventListener("touchstart",v=>{let b=v.touches[0];a=b?{x:b.clientX,y:b.clientY}:null},{capture:!0,passive:!0}),window.addEventListener("touchend",v=>{let b=at(v);if(!b||t)return;let y=v.changedTouches[0];a&&y&&Math.hypot(y.clientX-a.x,y.clientY-a.y)>10||(v.preventDefault(),e=Date.now(),P(b))},{capture:!0,passive:!1}),window.addEventListener("mousedown",v=>{at(v)&&v.preventDefault()},!0),window.addEventListener("click",v=>{if(t)return;let b=C(v);b&&(v.preventDefault(),v.stopPropagation(),Date.now()-e>600&&P(b))},!0),window.addEventListener("keydown",v=>{let b=at(v);!b||t||(v.key==="Enter"||v.key===" "||v.key==="F4"||v.altKey&&(v.key==="ArrowDown"||v.key==="ArrowUp"))&&(v.preventDefault(),P(b))},!0),s.open=P,s.close=()=>_()})();(()=>{if(window.__textareas)return;let s=()=>`textareas:${(document.title||"app").split(/[·|-]/)[0].trim()}:`,t=d=>d.dataset.size||d.id||d.name||d.getAttribute("aria-label")||d.placeholder||"",e=d=>{try{return Number(localStorage.getItem(s()+d))||0}catch{return 0}},a=(d,f)=>{try{localStorage.setItem(s()+d,String(Math.round(f)))}catch{}},i=new WeakMap,r=typeof ResizeObserver=="function"?new ResizeObserver(d=>d.forEach(({target:f})=>{let g=parseFloat(f.style.height);!g||g===f.__tsSet||(clearTimeout(i.get(f)),i.set(f,setTimeout(()=>{let x=t(f),w=parseFloat(f.style.height);x&&w&&a(x,w),f.__tsSet=w},400)))})):null,o=d=>{if(!(d instanceof HTMLTextAreaElement)||d.dataset.size==="off"||d.__tsDone)return;d.__tsDone=!0,d.style.resize="vertical";let f=t(d),g=f&&e(f);g&&(d.style.height=`${g}px`,d.__tsSet=g),r&&r.observe(d)},n=new WeakSet,l=d=>{!d||d.nodeType!==1||(d.tagName==="TEXTAREA"&&o(d),d.shadowRoot&&h(d.shadowRoot),d.querySelectorAll&&(d.querySelectorAll("textarea").forEach(o),d.querySelectorAll("*").forEach(f=>f.shadowRoot&&h(f.shadowRoot))))};function h(d){n.has(d)||(n.add(d),new MutationObserver(f=>f.forEach(g=>g.addedNodes.forEach(l))).observe(d,{childList:!0,subtree:!0}),d.querySelectorAll("textarea").forEach(o),d.querySelectorAll("*").forEach(f=>f.shadowRoot&&h(f.shadowRoot)))}window.__textareas={fit:o,keyOf:t};let u=()=>h(document.body||document.documentElement);document.body?u():document.addEventListener("DOMContentLoaded",u)})();var Jt=globalThis,Oe=Jt.ShadowRoot&&(Jt.ShadyCSS===void 0||Jt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,Re=Symbol(),da=new WeakMap,Zt=class{constructor(t,e,a){if(this._$cssResult$=!0,a!==Re)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.i,e=this.t;if(Oe&&t===void 0){let a=e!==void 0&&e.length===1;a&&(t=da.get(e)),t===void 0&&((this.i=t=new CSSStyleSheet).replaceSync(this.cssText),a&&da.set(e,t))}return t}toString(){return this.cssText}},X=s=>new Zt(typeof s=="string"?s:s+"",void 0,Re),It=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((a,i,r)=>a+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+s[r+1],s[0]);return new Zt(e,s,Re)},os=(s,t)=>{if(Oe)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let a=document.createElement("style"),i=Jt.litNonce;i!==void 0&&a.setAttribute("nonce",i),a.textContent=e.cssText,s.appendChild(a)}},ua=Oe?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let a of t.cssRules)e+=a.cssText;return X(e)})(s):s,{is:ns,defineProperty:ls,getOwnPropertyDescriptor:cs,getOwnPropertyNames:hs,getOwnPropertySymbols:ps,getPrototypeOf:ds}=Object,oe=globalThis,ma=oe.trustedTypes,us=ma?ma.emptyScript:"",ms=oe.reactiveElementPolyfillSupport,zt=(s,t)=>s,Ee={toAttribute(s,t){switch(t){case Boolean:s=s?us:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},za=(s,t)=>!ns(s,t),fa={attribute:!0,type:String,converter:Ee,reflect:!1,useDefault:!1,hasChanged:za};Symbol.metadata??=Symbol("metadata"),oe.litPropertyMetadata??=new WeakMap;var st=class extends HTMLElement{static addInitializer(t){this.o(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.u&&[...this.u.keys()]}static createProperty(t,e=fa){if(e.state&&(e.attribute=!1),this.o(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let a=Symbol(),i=this.getPropertyDescriptor(t,a,e);i!==void 0&&ls(this.prototype,t,i)}}static getPropertyDescriptor(t,e,a){let{get:i,set:r}=cs(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:i,set(o){let n=i?.call(this);r?.call(this,o),this.requestUpdate(t,n,a)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??fa}static o(){if(this.hasOwnProperty(zt("elementProperties")))return;let t=ds(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(zt("finalized")))return;if(this.finalized=!0,this.o(),this.hasOwnProperty(zt("properties"))){let e=this.properties,a=[...hs(e),...ps(e)];for(let i of a)this.createProperty(i,e[i])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[a,i]of e)this.elementProperties.set(a,i)}this.u=new Map;for(let[e,a]of this.elementProperties){let i=this.p(e,a);i!==void 0&&this.u.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let a=new Set(t.flat(1/0).reverse());for(let i of a)e.unshift(ua(i))}else t!==void 0&&e.push(ua(t));return e}static p(t,e){let a=e.attribute;return a===!1?void 0:typeof a=="string"?a:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this.v=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.m=null,this._()}_(){this.S=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this.$(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.P??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this.P?.delete(t)}$(){let t=new Map,e=this.constructor.elementProperties;for(let a of e.keys())this.hasOwnProperty(a)&&(t.set(a,this[a]),delete this[a]);t.size>0&&(this.v=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return os(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.P?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.P?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,a){this._$AK(t,a)}C(t,e){let a=this.constructor.elementProperties.get(t),i=this.constructor.p(t,a);if(i!==void 0&&a.reflect===!0){let r=(a.converter?.toAttribute!==void 0?a.converter:Ee).toAttribute(e,a.type);this.m=t,r==null?this.removeAttribute(i):this.setAttribute(i,r),this.m=null}}_$AK(t,e){let a=this.constructor,i=a.u.get(t);if(i!==void 0&&this.m!==i){let r=a.getPropertyOptions(i),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:Ee;this.m=i;let n=o.fromAttribute(e,r.type);this[i]=n??this.T?.get(i)??n,this.m=null}}requestUpdate(t,e,a,i=!1,r){if(t!==void 0){let o=this.constructor;if(i===!1&&(r=this[t]),a??=o.getPropertyOptions(t),!((a.hasChanged??za)(r,e)||a.useDefault&&a.reflect&&r===this.T?.get(t)&&!this.hasAttribute(o.p(t,a))))return;this.M(t,e,a)}this.isUpdatePending===!1&&(this.S=this.k())}M(t,e,{useDefault:a,reflect:i,wrapped:r},o){a&&!(this.T??=new Map).has(t)&&(this.T.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||a||(e=void 0),this._$AL.set(t,e)),i===!0&&this.m!==t&&(this.A??=new Set).add(t))}async k(){this.isUpdatePending=!0;try{await this.S}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.v){for(let[i,r]of this.v)this[i]=r;this.v=void 0}let a=this.constructor.elementProperties;if(a.size>0)for(let[i,r]of a){let{wrapped:o}=r,n=this[i];o!==!0||this._$AL.has(i)||n===void 0||this.M(i,void 0,r,n)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this.P?.forEach(a=>a.hostUpdate?.()),this.update(e)):this.U()}catch(a){throw t=!1,this.U(),a}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this.P?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.S}shouldUpdate(t){return!0}update(t){this.A&&=this.A.forEach(e=>this.C(e,this[e])),this.U()}updated(t){}firstUpdated(t){}};st.elementStyles=[],st.shadowRootOptions={mode:"open"},st[zt("elementProperties")]=new Map,st[zt("finalized")]=new Map,ms?.({ReactiveElement:st}),(oe.reactiveElementVersions??=[]).push("2.1.2");var Fe=globalThis,ga=s=>s,Xt=Fe.trustedTypes,va=Xt?Xt.createPolicy("lit-html",{createHTML:s=>s}):void 0,qe="$lit$",Z=`lit$${Math.random().toFixed(9).slice(2)}$`,De="?"+Z,fs=`<${De}>`,dt=document,Ot=()=>dt.createComment(""),Rt=s=>s===null||typeof s!="object"&&typeof s!="function",Ne=Array.isArray,Pa=s=>Ne(s)||typeof s?.[Symbol.iterator]=="function",Me=`[ 	
\f\r]`,Et=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,xa=/-->/g,ba=/>/g,ht=RegExp(`>|${Me}(?:([^\\s"'>=/]+)(${Me}*=${Me}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),_a=/'/g,wa=/"/g,Oa=/^(?:script|style|textarea|title)$/i,Ie=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),c=Ie(1),gs=Ie(2),mr=Ie(3),q=Symbol.for("lit-noChange"),m=Symbol.for("lit-nothing"),ya=new WeakMap,pt=dt.createTreeWalker(dt,129);function Ra(s,t){if(!Ne(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return va!==void 0?va.createHTML(t):t}var Fa=(s,t)=>{let e=s.length-1,a=[],i,r=t===2?"<svg>":t===3?"<math>":"",o=Et;for(let n=0;n<e;n++){let l=s[n],h,u,d=-1,f=0;for(;f<l.length&&(o.lastIndex=f,u=o.exec(l),u!==null);)f=o.lastIndex,o===Et?u[1]==="!--"?o=xa:u[1]!==void 0?o=ba:u[2]!==void 0?(Oa.test(u[2])&&(i=RegExp("</"+u[2],"g")),o=ht):u[3]!==void 0&&(o=ht):o===ht?u[0]===">"?(o=i??Et,d=-1):u[1]===void 0?d=-2:(d=o.lastIndex-u[2].length,h=u[1],o=u[3]===void 0?ht:u[3]==='"'?wa:_a):o===wa||o===_a?o=ht:o===xa||o===ba?o=Et:(o=ht,i=void 0);let g=o===ht&&s[n+1].startsWith("/>")?" ":"";r+=o===Et?l+fs:d>=0?(a.push(h),l.slice(0,d)+qe+l.slice(d)+Z+g):l+Z+(d===-2?n:g)}return[Ra(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),a]},Ft=class s{constructor({strings:t,_$litType$:e},a){let i;this.parts=[];let r=0,o=0,n=t.length-1,l=this.parts,[h,u]=Fa(t,e);if(this.el=s.createElement(h,a),pt.currentNode=this.el.content,e===2||e===3){let d=this.el.content.firstChild;d.replaceWith(...d.childNodes)}for(;(i=pt.nextNode())!==null&&l.length<n;){if(i.nodeType===1){if(i.hasAttributes())for(let d of i.getAttributeNames())if(d.endsWith(qe)){let f=u[o++],g=i.getAttribute(d).split(Z),x=/([.?@])?(.*)/.exec(f);l.push({type:1,index:r,name:x[2],strings:g,ctor:x[1]==="."?Qt:x[1]==="?"?Gt:x[1]==="@"?te:mt}),i.removeAttribute(d)}else d.startsWith(Z)&&(l.push({type:6,index:r}),i.removeAttribute(d));if(Oa.test(i.tagName)){let d=i.textContent.split(Z),f=d.length-1;if(f>0){i.textContent=Xt?Xt.emptyScript:"";for(let g=0;g<f;g++)i.append(d[g],Ot()),pt.nextNode(),l.push({type:2,index:++r});i.append(d[f],Ot())}}}else if(i.nodeType===8)if(i.data===De)l.push({type:2,index:r});else{let d=-1;for(;(d=i.data.indexOf(Z,d+1))!==-1;)l.push({type:7,index:r}),d+=Z.length-1}r++}}static createElement(t,e){let a=dt.createElement("template");return a.innerHTML=t,a}};function ut(s,t,e=s,a){if(t===q)return t;let i=a!==void 0?e.N?.[a]:e.O,r=Rt(t)?void 0:t._$litDirective$;return i?.constructor!==r&&(i?._$AO?.(!1),r===void 0?i=void 0:(i=new r(s),i._$AT(s,e,a)),a!==void 0?(e.N??=[])[a]=i:e.O=i),i!==void 0&&(t=ut(s,i._$AS(s,t.values),i,a)),t}var Kt=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}R(t){let{el:{content:e},parts:a}=this._$AD,i=(t?.creationScope??dt).importNode(e,!0);pt.currentNode=i;let r=pt.nextNode(),o=0,n=0,l=a[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new ne(r,r.nextSibling,this,t):l.type===1?h=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(h=new ee(r,this,t)),this._$AV.push(h),l=a[++n]}o!==l?.index&&(r=pt.nextNode(),o++)}return pt.currentNode=dt,i}V(t){let e=0;for(let a of this._$AV)a!==void 0&&(a.strings!==void 0?(a._$AI(t,a,e),e+=a.strings.length-2):a._$AI(t[e])),e++}},ne=class qa{get _$AU(){return this._$AM?._$AU??this.D}constructor(t,e,a,i){this.type=2,this._$AH=m,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=a,this.options=i,this.D=i?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=ut(this,t,e),Rt(t)?t===m||t==null||t===""?(this._$AH!==m&&this._$AR(),this._$AH=m):t!==this._$AH&&t!==q&&this.L(t):t._$litType$!==void 0?this.j(t):t.nodeType!==void 0?this.I(t):Pa(t)?this.H(t):this.L(t)}B(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}I(t){this._$AH!==t&&(this._$AR(),this._$AH=this.B(t))}L(t){this._$AH!==m&&Rt(this._$AH)?this._$AA.nextSibling.data=t:this.I(dt.createTextNode(t)),this._$AH=t}j(t){let{values:e,_$litType$:a}=t,i=typeof a=="number"?this._$AC(t):(a.el===void 0&&(a.el=Ft.createElement(Ra(a.h,a.h[0]),this.options)),a);if(this._$AH?._$AD===i)this._$AH.V(e);else{let r=new Kt(i,this),o=r.R(this.options);r.V(e),this.I(o),this._$AH=r}}_$AC(t){let e=ya.get(t.strings);return e===void 0&&ya.set(t.strings,e=new Ft(t)),e}H(t){Ne(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,a,i=0;for(let r of t)i===e.length?e.push(a=new qa(this.B(Ot()),this.B(Ot()),this,this.options)):a=e[i],a._$AI(r),i++;i<e.length&&(this._$AR(a&&a._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let a=ga(t).nextSibling;ga(t).remove(),t=a}}setConnected(t){this._$AM===void 0&&(this.D=t,this._$AP?.(t))}},mt=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,a,i,r){this.type=1,this._$AH=m,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=r,a.length>2||a[0]!==""||a[1]!==""?(this._$AH=Array(a.length-1).fill(new String),this.strings=a):this._$AH=m}_$AI(t,e=this,a,i){let r=this.strings,o=!1;if(r===void 0)t=ut(this,t,e,0),o=!Rt(t)||t!==this._$AH&&t!==q,o&&(this._$AH=t);else{let n=t,l,h;for(t=r[0],l=0;l<r.length-1;l++)h=ut(this,n[a+l],e,l),h===q&&(h=this._$AH[l]),o||=!Rt(h)||h!==this._$AH[l],h===m?t=m:t!==m&&(t+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!i&&this.W(t)}W(t){t===m?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},Qt=class extends mt{constructor(){super(...arguments),this.type=3}W(t){this.element[this.name]=t===m?void 0:t}},Gt=class extends mt{constructor(){super(...arguments),this.type=4}W(t){this.element.toggleAttribute(this.name,!!t&&t!==m)}},te=class extends mt{constructor(t,e,a,i,r){super(t,e,a,i,r),this.type=5}_$AI(t,e=this){if((t=ut(this,t,e,0)??m)===q)return;let a=this._$AH,i=t===m&&a!==m||t.capture!==a.capture||t.once!==a.once||t.passive!==a.passive,r=t!==m&&(a===m||i);i&&this.element.removeEventListener(this.name,this,a),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},ee=class{constructor(t,e,a){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=a}get _$AU(){return this._$AM._$AU}_$AI(t){ut(this,t)}},vs={q:qe,J:Z,Z:De,F:1,G:Fa,K:Kt,X:Pa,Y:ut,tt:ne,st:mt,it:Gt,et:te,ht:Qt,ot:ee},xs=Fe.litHtmlPolyfillSupport;xs?.(Ft,ne),(Fe.litHtmlVersions??=[]).push("3.3.3");var Da=(s,t,e)=>{let a=e?.renderBefore??t,i=a._$litPart$;if(i===void 0){let r=e?.renderBefore??null;a._$litPart$=i=new ne(t.insertBefore(Ot(),r),r,void 0,e??{})}return i._$AI(s),i},Ve=globalThis;var ot=class extends st{constructor(){super(...arguments),this.renderOptions={host:this},this.rt=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.rt=Da(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.rt?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.rt?.setConnected(!1)}render(){return q}};ot._$litElement$=!0,ot.finalized=!0,Ve.litElementHydrateSupport?.({LitElement:ot});var bs=Ve.litElementPolyfillSupport;bs?.({LitElement:ot});(Ve.litElementVersions??=[]).push("4.2.2");var{tt:_s}=vs,ka=s=>s,ws=s=>s===null||typeof s!="object"&&typeof s!="function";var $a=(s,t)=>t===void 0?s?._$litType$!==void 0:s?._$litType$===t,ys=s=>s?._$litType$?.h!=null;var Na=s=>s.strings===void 0,Sa=()=>document.createComment(""),rt=(s,t,e)=>{let a=s._$AA.parentNode,i=t===void 0?s._$AB:t._$AA;if(e===void 0){let r=a.insertBefore(Sa(),i),o=a.insertBefore(Sa(),i);e=new _s(r,o,s,s.options)}else{let r=e._$AB.nextSibling,o=e._$AM,n=o!==s;if(n){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==o._$AU&&e._$AP(l)}if(r!==i||n){let l=e._$AA;for(;l!==r;){let h=ka(l).nextSibling;ka(a).insertBefore(l,i),l=h}}}return e},it=(s,t,e=s)=>(s._$AI(t,e),s),ks={},qt=(s,t=ks)=>s._$AH=t,ze=s=>s._$AH,Ce=s=>{s._$AR(),s._$AA.remove()},Ia=s=>{s._$AR()};var H=s=>(...t)=>({_$litDirective$:s,values:t}),B=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,a){this.nt=t,this._$AM=e,this.ct=a}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var Pt=(s,t)=>{let e=s._$AN;if(e===void 0)return!1;for(let a of e)a._$AO?.(t,!1),Pt(a,t);return!0},ae=s=>{let t,e;do{if((t=s._$AM)===void 0)break;e=t._$AN,e.delete(s),s=t}while(e?.size===0)},Va=s=>{for(let t;t=s._$AM;s=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(s))break;e.add(s),As(t)}};function $s(s){this._$AN!==void 0?(ae(this),this._$AM=s,Va(this)):this._$AM=s}function Ss(s,t=!1,e=0){let a=this._$AH,i=this._$AN;if(i!==void 0&&i.size!==0)if(t)if(Array.isArray(a))for(let r=e;r<a.length;r++)Pt(a[r],!1),ae(a[r]);else a!=null&&(Pt(a,!1),ae(a));else Pt(this,s)}var As=s=>{s.type==2&&(s._$AP??=Ss,s._$AQ??=$s)},Dt=class extends B{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,a){super._$AT(t,e,a),Va(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(Pt(this,t),ae(this))}setValue(t){if(Na(this.nt))this.nt._$AI(t,this);else{let e=[...this.nt._$AH];e[this.ct]=t,this.nt._$AI(e,this,0)}}disconnected(){}reconnected(){}};var ie=class{constructor(t){this.lt=t}disconnect(){this.lt=void 0}reconnect(t){this.lt=t}deref(){return this.lt}},se=class{constructor(){this.ut=void 0,this.dt=void 0}get(){return this.ut}pause(){this.ut??=new Promise(t=>this.dt=t)}resume(){this.dt?.(),this.ut=this.dt=void 0}};var re=class extends Dt{constructor(){super(...arguments),this.ft=new ie(this),this.vt=new se}render(t,e){return q}update(t,[e,a]){if(this.isConnected||this.disconnected(),e===this.yt)return q;this.yt=e;let i=0,{ft:r,vt:o}=this;return(async(n,l)=>{for await(let h of n)if(await l(h)===!1)return})(e,async n=>{for(;o.get();)await o.get();let l=r.deref();if(l!==void 0){if(l.yt!==e)return!1;a!==void 0&&(n=a(n,i)),l.commitValue(n,i),i++}return!0}),q}commitValue(t,e){this.setValue(t)}disconnected(){this.ft.disconnect(),this.vt.pause()}reconnected(){this.ft.reconnect(this),this.vt.resume()}},fr=H(re),gr=H(class extends re{constructor(s){if(super(s),s.type!==2)throw Error("asyncAppend can only be used in child expressions")}update(s,t){return this.rt=s,super.update(s,t)}commitValue(s,t){t===0&&Ia(this.rt);let e=rt(this.rt);it(e,s)}}),Aa=s=>ys(s)?s._$litType$.h:s.strings,vr=H(class extends B{constructor(s){super(s),this.bt=new WeakMap}render(s){return[s]}update(s,[t]){let e=$a(this.gt)?Aa(this.gt):null,a=$a(t)?Aa(t):null;if(e!==null&&(a===null||e!==a)){let i=ze(s).pop(),r=this.bt.get(e);if(r===void 0){let o=document.createDocumentFragment();r=Da(m,o),r.setConnected(!1),this.bt.set(e,r)}qt(r,[i]),rt(r,void 0,i)}if(a!==null){if(e===null||e!==a){let i=this.bt.get(a);if(i!==void 0){let r=ze(i).pop();Ia(s),rt(s,void 0,r),qt(s,[r])}}this.gt=t}else this.gt=void 0;return this.render(t)}});var xr=H(class extends B{constructor(s){if(super(s),s.type!==1||s.name!=="class"||s.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(t=>s[t]).join(" ")+" "}update(s,[t]){if(this.wt===void 0){this.wt=new Set,s.strings!==void 0&&(this._t=new Set(s.strings.join(" ").split(/\s/).filter(a=>a!=="")));for(let a in t)t[a]&&!this._t?.has(a)&&this.wt.add(a);return this.render(t)}let e=s.element.classList;for(let a of this.wt)a in t||(e.remove(a),this.wt.delete(a));for(let a in t){let i=!!t[a];i===this.wt.has(a)||this._t?.has(a)||(i?(e.add(a),this.wt.add(a)):(e.remove(a),this.wt.delete(a)))}return q}}),Ms={},br=H(class extends B{constructor(){super(...arguments),this.St=Ms}render(s,t){return t()}update(s,[t,e]){if(Array.isArray(t)){if(Array.isArray(this.St)&&this.St.length===t.length&&t.every((a,i)=>a===this.St[i]))return q}else if(this.St===t)return q;return this.St=Array.isArray(t)?Array.from(t):t,this.render(t,e)}});var _r=H(class extends B{constructor(){super(...arguments),this.key=m}render(s,t){return this.key=s,t}update(s,[t,e]){return t!==this.key&&(qt(s),this.key=t),e}}),Ha=H(class extends B{constructor(s){if(super(s),s.type!==3&&s.type!==1&&s.type!==4)throw Error("The `live` directive is not allowed on child or event bindings");if(!Na(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[t]){if(t===q||t===m)return t;let e=s.element,a=s.name;if(s.type===3){if(t===e[a])return q}else if(s.type===4){if(!!t===e.hasAttribute(a))return q}else if(s.type===1&&e.getAttribute(a)===t+"")return q;return qt(s),t}});var Te=new WeakMap,wr=H(class extends Dt{render(s){return m}update(s,[t]){let e=t!==this.lt;return e&&this.$t(void 0),(e||this.Tt!==this.xt)&&(this.lt=t,this.Et=s.options?.host,this.$t(this.xt=s.element)),m}$t(s){if(this.lt!==void 0)if(this.isConnected||(s=void 0),typeof this.lt=="function"){let t=this.Et??globalThis,e=Te.get(t);e===void 0&&(e=new WeakMap,Te.set(t,e)),e.get(this.lt)!==void 0&&this.lt.call(this.Et,void 0),e.set(this.lt,s),s!==void 0&&this.lt.call(this.Et,s)}else this.lt.value=s}get Tt(){return typeof this.lt=="function"?Te.get(this.Et??globalThis)?.get(this.lt):this.lt?.value}disconnected(){this.Tt===this.xt&&this.$t(void 0)}reconnected(){this.$t(this.xt)}}),Ma=(s,t,e)=>{let a=new Map;for(let i=t;i<=e;i++)a.set(s[i],i);return a},bt=H(class extends B{constructor(s){if(super(s),s.type!==2)throw Error("repeat() can only be used in text expressions")}Ct(s,t,e){let a;e===void 0?e=t:t!==void 0&&(a=t);let i=[],r=[],o=0;for(let n of s)i[o]=a?a(n,o):o,r[o]=e(n,o),o++;return{values:r,keys:i}}render(s,t,e){return this.Ct(s,t,e).values}update(s,[t,e,a]){let i=ze(s),{values:r,keys:o}=this.Ct(t,e,a);if(!Array.isArray(i))return this.Pt=o,r;let n=this.Pt??=[],l=[],h,u,d=0,f=i.length-1,g=0,x=r.length-1;for(;d<=f&&g<=x;)if(i[d]===null)d++;else if(i[f]===null)f--;else if(n[d]===o[g])l[g]=it(i[d],r[g]),d++,g++;else if(n[f]===o[x])l[x]=it(i[f],r[x]),f--,x--;else if(n[d]===o[x])l[x]=it(i[d],r[x]),rt(s,l[x+1],i[d]),d++,x--;else if(n[f]===o[g])l[g]=it(i[f],r[g]),rt(s,i[d],i[f]),f--,g++;else if(h===void 0&&(h=Ma(o,g,x),u=Ma(n,d,f)),h.has(n[d]))if(h.has(n[f])){let w=u.get(o[g]),M=w!==void 0?i[w]:null;if(M===null){let P=rt(s,i[d]);it(P,r[g]),l[g]=P}else l[g]=it(M,r[g]),rt(s,i[d],M),i[w]=null;g++}else Ce(i[f]),f--;else Ce(i[d]),d++;for(;g<=x;){let w=rt(s,l[x+1]);it(w,r[g]),l[g++]=w}for(;d<=f;){let w=i[d++];w!==null&&Ce(w)}return this.Pt=o,qt(s,l),q}}),La="important",Cs=" !"+La,yr=H(class extends B{constructor(s){if(super(s),s.type!==1||s.name!=="style"||s.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((t,e)=>{let a=s[e];return a==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${a};`},"")}update(s,[t]){let{style:e}=s.element;if(this.Mt===void 0)return this.Mt=new Set(Object.keys(t)),this.render(t);for(let a of this.Mt)t[a]==null&&(this.Mt.delete(a),a.includes("-")?e.removeProperty(a):e[a]=null);for(let a in t){let i=t[a];if(i!=null){this.Mt.add(a);let r=typeof i=="string"&&i.endsWith(Cs);a.includes("-")||r?e.setProperty(a,r?i.slice(0,-11):i,r?La:""):e[a]=i}}return q}}),kr=H(class extends B{constructor(s){if(super(s),s.type!==2)throw Error("templateContent can only be used in child bindings")}render(s){return this.At===s?q:(this.At=s,document.importNode(s.content,!0))}}),xt=class extends B{constructor(t){if(super(t),this.gt=m,t.type!==2)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===m||t==null)return this.kt=void 0,this.gt=t;if(t===q)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.gt)return this.kt;this.gt=t;let e=[t];return e.raw=e,this.kt={_$litType$:this.constructor.resultType,strings:e,values:[]}}};xt.directiveName="unsafeHTML",xt.resultType=1;var $r=H(xt);var Nt=class extends xt{};Nt.directiveName="unsafeSVG",Nt.resultType=2;var _t=H(Nt),Ca=s=>!ws(s)&&typeof s.then=="function",Ta=1073741823;var Pe=class extends Dt{constructor(){super(...arguments),this.Ot=Ta,this.Ut=[],this.ft=new ie(this),this.vt=new se}render(...t){return t.find(e=>!Ca(e))??q}update(t,e){let a=this.Ut,i=a.length;this.Ut=e;let r=this.ft,o=this.vt;this.isConnected||this.disconnected();for(let n=0;n<e.length&&!(n>this.Ot);n++){let l=e[n];if(!Ca(l))return this.Ot=n,l;n<i&&l===a[n]||(this.Ot=Ta,i=0,Promise.resolve(l).then(async h=>{for(;o.get();)await o.get();let u=r.deref();if(u!==void 0){let d=u.Ut.indexOf(l);d>-1&&d<u.Ot&&(u.Ot=d,u.setValue(h))}}))}return q}disconnected(){this.ft.disconnect(),this.vt.pause()}reconnected(){this.ft.reconnect(this),this.vt.resume()}},Sr=H(Pe);var Ts=Symbol.for(""),Es=s=>{if(s?.r===Ts)return s?._$litStatic$};var Ea=new Map,Ba=s=>(t,...e)=>{let a=e.length,i,r,o=[],n=[],l,h=0,u=!1;for(;h<a;){for(l=t[h];h<a&&(r=e[h],(i=Es(r))!==void 0);)l+=i+t[++h],u=!0;h!==a&&n.push(r),o.push(l),h++}if(h===a&&o.push(t[a]),u){let d=o.join("$$lit$$");(t=Ea.get(d))===void 0&&(o.raw=o,Ea.set(d,t=o)),e=n}return s(t,...e)},Ar=Ba(c),Mr=Ba(gs);window.litDisableBundleWarning||console.warn("Lit has been loaded from a bundle that combines all core features into a single file. To reduce transfer size and parsing cost, consider using the `lit` npm package directly in your project.");var K={"layout-grid":'<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>',"message-circle":'<path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719"/>',send:'<path d="M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z"/><path d="m21.854 2.147-10.94 10.939"/>',mic:'<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>',link:'<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',"clipboard-list":'<rect width="8" height="4" x="8" y="2" rx="1" ry="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><path d="M12 11h4"/><path d="M12 16h4"/><path d="M8 11h.01"/><path d="M8 16h.01"/>',tag:'<path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/>',activity:'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',"toggle-right":'<circle cx="15" cy="12" r="3"/><rect width="20" height="14" x="2" y="5" rx="7"/>',smartphone:'<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',contrast:'<circle cx="12" cy="12" r="10"/><path d="M12 18a6 6 0 0 0 0-12v12z"/>',blocks:'<path d="M10 22V7a1 1 0 0 0-1-1H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 0 0-1-1H2" /><rect x="14" y="2" width="8" height="8" rx="1" />',download:'<path d="M12 15V3"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/>',database:'<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',archive:'<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/>',users:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><path d="M16 3.128a4 4 0 0 1 0 7.744"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><circle cx="9" cy="7" r="4"/>',"user-round":'<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',"archive-restore":'<rect width="20" height="5" x="2" y="3" rx="1"/><path d="M4 8v11a2 2 0 0 0 2 2h2"/><path d="M20 8v11a2 2 0 0 1-2 2h-2"/><path d="m9 15 3-3 3 3"/><path d="M12 12v9"/>',sheet:'<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><line x1="3" x2="21" y1="9" y2="9"/><line x1="3" x2="21" y1="15" y2="15"/><line x1="9" x2="9" y1="9" y2="21"/><line x1="15" x2="15" y1="9" y2="21"/>',braces:'<path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"/><path d="M16 21h1a2 2 0 0 0 2-2v-5c0-1.1.9-2 2-2a2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"/>',upload:'<path d="M12 3v12"/><path d="m17 8-5-5-5 5"/><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>',menu:'<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',paperclip:'<path d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"/>',"file-text":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M10 9H8"/><path d="M16 13H8"/><path d="M16 17H8"/>',"a-arrow-up":'<path d="M3.5 13h6"/><path d="m2 16 4.5-9 4.5 9"/><path d="M18 16V7"/><path d="m14 11 4-4 4 4"/>',maximize:'<path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/>',minimize:'<path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/>',bold:'<path d="M6 12h9a4 4 0 0 1 0 8H7a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1h7a4 4 0 0 1 0 8"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',check:'<path d="M20 6 9 17l-5-5"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',sunrise:'<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',sunset:'<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',notebook:'<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/>',"notebook-pen":'<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',"notebook-text":'<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>',"book-open":'<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>',library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',"pin-off":'<path d="M12 17v5"/><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/><path d="m2 2 20 20"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/>',"pen-line":'<path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',trash:'<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',"chart-column":'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',ellipsis:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',"sliders-horizontal":'<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',"sun-moon":'<path d="M12 2v2"/><path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"/><path d="M16 12a4 4 0 0 0-4-4"/><path d="m19 5-1.256 1.256"/><path d="M20 12h2"/>',type:'<path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',"share-2":'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',eraser:'<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/>',"circle-alert":'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',sparkles:'<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',"clipboard-paste":'<path d="M11 14h10"/><path d="M16 4h2a2 2 0 0 1 2 2v1.344"/><path d="m17 18 4-4-4-4"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113"/><rect x="8" y="2" width="8" height="4" rx="1"/>',images:'<path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/>',camera:'<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>',"scan-text":'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/>',"message-square-text":'<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7 11h10"/><path d="M7 15h6"/><path d="M7 7h8"/>',"loader-circle":'<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',zap:'<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',"calendar-clock":'<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>',"clock-3":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6h4"/>',"arrow-right-left":'<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',"rotate-ccw":'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',"list-plus":'<path d="M16 5H3"/><path d="M11 12H3"/><path d="M16 19H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>',"external-link":'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',house:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',heart:'<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',briefcase:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',dumbbell:'<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>',lightbulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',"graduation-cap":'<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',"book-open-text":'<path d="M12 5v16"/><path d="M16 13h2"/><path d="M16 9h2"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/><path d="M6 13h2"/><path d="M6 9h2"/>',coffee:'<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',bed:'<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',utensils:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',headphones:'<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',"flower-2":'<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',baby:'<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/>',dog:'<path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>',hourglass:'<path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22"/><path d="M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2"/>',"calendar-days":'<path d="M8 2v3"/><path d="M16 2v3"/><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M8 13h.01"/><path d="M12 13h.01"/><path d="M16 13h.01"/><path d="M8 17h.01"/><path d="M12 17h.01"/><path d="M16 17h.01"/>',"square-check":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="m9 12 2 2 4-4"/>',smile:'<circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" x2="9.01" y1="9" y2="9"/><line x1="15" x2="15.01" y1="9" y2="9"/>',"list-checks":'<path d="M13 5h8"/><path d="M13 12h8"/><path d="M13 19h8"/><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/>',package:'<path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z"/><path d="M12 22V12"/><polyline points="3.29 7 12 12 20.71 7"/><path d="m7.5 4.27 9 5.15"/>',receipt:'<path d="M12 17V7"/><path d="M16 8h-6a2 2 0 0 0 0 4h4a2 2 0 0 1 0 4H8"/><path d="M4 3a1 1 0 0 1 1-1 1.3 1.3 0 0 1 .7.2l.933.6a1.3 1.3 0 0 0 1.4 0l.934-.6a1.3 1.3 0 0 1 1.4 0l.933.6a1.3 1.3 0 0 0 1.4 0l.933-.6a1.3 1.3 0 0 1 1.4 0l.934.6a1.3 1.3 0 0 0 1.4 0l.933-.6A1.3 1.3 0 0 1 19 2a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1 1.3 1.3 0 0 1-.7-.2l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.934.6a1.3 1.3 0 0 1-1.4 0l-.933-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-1.4 0l-.934-.6a1.3 1.3 0 0 0-1.4 0l-.933.6a1.3 1.3 0 0 1-.7.2 1 1 0 0 1-1-1z"/>'};var Ua="./fonts/barlow-400.woff2";var ja="./fonts/barlow-500.woff2";var Wa="./fonts/barlow-600.woff2";var Ya="./fonts/barlow-condensed-500.woff2";var Ja="./fonts/barlow-condensed-600.woff2";var Za="./fonts/barlow-condensed-700.woff2";var Xa="./fonts/caveat-var.woff2";var Ka='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',Qa=`"MM Barlow", ${Ka}`,Ga=`"MM Barlow Condensed", ${Ka}`,ti='"MM Caveat", "Segoe Print", "Bradley Hand", cursive';function ei(){if(document.getElementById("memoria-fonts"))return;let s=(e,a,i)=>`@font-face{font-family:"${e}";src:url(${JSON.stringify(a)}) format("woff2");font-weight:${i};font-style:normal;font-display:swap}`,t=document.createElement("style");t.id="memoria-fonts",t.textContent=[s("MM Barlow",Ua,400),s("MM Barlow",ja,500),s("MM Barlow",Wa,"600 900"),s("MM Barlow Condensed",Ya,500),s("MM Barlow Condensed",Ja,600),s("MM Barlow Condensed",Za,"700 900"),s("MM Caveat",Xa,"400 700")].join(`
`),document.head.appendChild(t)}var ai=It`
  :host {
    --rv-body: ${X(Qa)};
    --rv-display: ${X(Ga)};
    --mm-hand: ${X(ti)};
    /* paper (light) */
    --paper: #fffcf3;
    --paper-back: #f4eddb;
    --paper-edge: #e3d9bf;
    --ink: #253354;
    --ink-soft: #7a7f90;
    --rule: rgba(72, 125, 200, 0.3);
    --rule-dot: rgba(72, 105, 160, 0.38);
    --margin: rgba(226, 88, 88, 0.55);
    --wire: #9ba1aa;
    --rv-bg: #f8f6fb;
    --rv-surface: #ffffff;
    --rv-surface-2: #f1edf6;
    --rv-line: #e9e3f0;
    --rv-line-strong: #d5cce1;
    --rv-text: #1f1a26;
    --rv-text-2: #453d4f;
    --rv-muted: #736b7f;
    --rv-faint: #a69eb2;
    --rv-nav: #ffffff;
    --rv-scrim: rgba(24, 18, 34, 0.42);
    --rv-shadow: 0 18px 50px rgba(45, 30, 80, 0.18);
    --rv-on-accent: #17111f;
    --rv-late: #d92d20;
    --rv-late-soft: rgba(217, 45, 32, 0.1);
    --rv-today: #b45309;
    --rv-today-soft: rgba(245, 158, 11, 0.14);
    --rv-skeleton: #ece6f2;
    --rv-header-bg: var(--app-header-background-color, #f8f6fb);
    --rv-header-fg: var(--app-header-text-color, #1f1a26);
    --rv-nav-h: 68px;
    color-scheme: light;
    display: block;
    height: 100%;
    position: relative;
    font-family: var(--rv-body);
    color: var(--rv-text);
    -webkit-tap-highlight-color: transparent;
    font-size: 16px;
    line-height: 1.5;
  }
  :host([dark]) {
    --rv-bg: #141217;
    --rv-surface: #1c1921;
    --rv-surface-2: #26222c;
    --rv-line: #302b37;
    --rv-line-strong: #433c4d;
    --rv-text: #f3f0f7;
    --rv-text-2: #d8d2e0;
    --rv-muted: #a097ab;
    --rv-faint: #6d6577;
    --rv-nav: #1a171e;
    --rv-scrim: rgba(0, 0, 0, 0.6);
    --rv-shadow: 0 18px 50px rgba(0, 0, 0, 0.55);
    --rv-late: #ff6b5e;
    --rv-late-soft: rgba(255, 107, 94, 0.14);
    --rv-today: #ffb547;
    --rv-today-soft: rgba(255, 181, 71, 0.14);
    --rv-skeleton: #27222d;
    --rv-header-bg: var(--app-header-background-color, #121015);
    --rv-header-fg: var(--app-header-text-color, #f3f0f7);
    /* paper (dark): easy on the eyes at night */
    --paper: #2a2622;
    --paper-back: #221f1c;
    --paper-edge: #3b3631;
    --ink: #f1e8d6;
    --ink-soft: #a99f8e;
    --rule: rgba(150, 180, 235, 0.15);
    --rule-dot: rgba(170, 190, 235, 0.24);
    --margin: rgba(240, 110, 110, 0.36);
    --wire: #8d9198;
    color-scheme: dark;
  }
  :host([vh]) {
    height: 100vh;
    height: 100dvh;
  }
  * {
    box-sizing: border-box;
  }
  button {
    font: inherit;
    color: inherit;
    background: none;
    border: 0;
    padding: 0;
    cursor: pointer;
  }
  button:disabled {
    cursor: default;
  }
  input,
  textarea {
    font: inherit;
    color: inherit;
  }
  :focus-visible {
    outline: 2px solid var(--rv-accent-ink);
    outline-offset: 2px;
  }
  .i {
    width: 22px;
    height: 22px;
    flex: none;
    display: block;
  }
  .sr {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    clip: rect(0 0 0 0);
    white-space: nowrap;
  }

  /* ---------- shell ---------- */
  .root {
    display: contents;
  }
  .app {
    height: 100%;
    display: flex;
    flex-direction: column;
    background: var(--rv-bg);
    overflow: hidden;
  }
  .topbar {
    flex: none;
    height: var(--header-height, 56px);
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0 8px 0 4px;
    background: var(--rv-header-bg);
    color: var(--rv-header-fg);
  }
  .topbar .title {
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 0;
    margin-left: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--rv-display);
  }
  .topbar .title b {
    font-weight: 700;
  }
  .icon-btn {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    flex: none;
  }
  .icon-btn:active {
    background: rgba(127, 127, 127, 0.16);
  }
  main {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    overscroll-behavior: contain;
    scroll-behavior: smooth;
  }
  .page {
    max-width: 720px;
    margin: 0 auto;
    padding: 18px 18px 36px;
    animation: rv-in 0.28s ease both;
  }
  @keyframes rv-in {
    from {
      opacity: 0;
      transform: translateY(6px);
    }
  }

  .display {
    font-family: var(--rv-display);
    font-weight: 700;
    letter-spacing: 0;
    line-height: 1.05;
    margin: 0;
  }
  .page-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 2px 2px 12px;
  }
  .page-head h1 {
    font-size: 21px;
    font-weight: 600;
    line-height: 1.2;
  }
  .page-sub {
    color: var(--rv-muted);
    font-size: 16px;
    line-height: 1.5;
    margin: -8px 2px 20px;
  }
  .overline {
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rv-muted);
  }

  /* ---------- hero (spiral notebook page) ---------- */
  .hero {
    position: relative;
    margin: 28px 4px 30px;
    transform: rotate(-1.4deg);
  }
  .hero-card {
    position: relative;
    background-color: var(--rv-accent);
    background-image: repeating-linear-gradient(
      to bottom,
      transparent 0 33px,
      rgba(0, 0, 0, 0.075) 33px 34.5px
    );
    background-position: 0 30px;
    color: var(--rv-on-accent);
    border-radius: 8px 8px 8px 8px;
    padding: 36px 22px 20px 28px;
    clip-path: polygon(0 0, 100% 0, 100% calc(100% - 30px), calc(100% - 30px) 100%, 0 100%);
    min-height: 160px;
  }
  .hero-card::before {
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 18px;
    width: 2px;
    background: rgba(0, 0, 0, 0.12);
  }
  .hero-fold {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.28) 0 50%, transparent 50%);
    border-radius: 0 0 0 6px;
    filter: drop-shadow(-2px -2px 3px rgba(0, 0, 0, 0.12));
  }
  .rings {
    position: absolute;
    left: 26px;
    right: 26px;
    top: -14px;
    display: flex;
    justify-content: space-between;
    z-index: 2;
    pointer-events: none;
  }
  .ring {
    position: relative;
    width: 12px;
    height: 34px;
  }
  .ring::before {
    /* the hole punched in the page */
    content: "";
    position: absolute;
    left: 1px;
    top: 21px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--rv-bg);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.35);
  }
  .ring::after {
    /* the wire loop */
    content: "";
    position: absolute;
    left: 2px;
    top: 0;
    width: 8px;
    height: 27px;
    border-radius: 6px;
    border: 2.5px solid var(--rv-text-2);
    border-bottom-color: transparent;
    opacity: 0.85;
  }
  .hero-kicker {
    font-weight: 500;
    font-size: 15px;
    opacity: 0.75;
    margin-bottom: 8px;
  }
  .hero-big {
    font-family: var(--rv-display);
    font-weight: 700;
    font-size: clamp(48px, 14vw, 76px);
    line-height: 0.95;
    letter-spacing: 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
    flex-wrap: wrap;
    font-variant-numeric: tabular-nums;
  }
  .hero-big small {
    font-size: 25px;
    letter-spacing: 0;
    font-weight: 600;
  }
  .hero-sub {
    margin-top: 12px;
    font-size: 14px;
    font-weight: 500;
    opacity: 0.78;
  }
  .stamp {
    position: absolute;
    right: 20px;
    top: 40px;
    transform: rotate(9deg);
    border: 3.5px solid currentColor;
    border-radius: 10px;
    padding: 4px 10px 3px;
    font-family: var(--rv-display);
    font-weight: 700;
    font-size: 22px;
    letter-spacing: 1.5px;
    opacity: 0.32;
    color: var(--rv-on-accent);
    animation: rv-stamp 0.45s cubic-bezier(0.2, 1.6, 0.4, 1) both;
  }
  @keyframes rv-stamp {
    from {
      transform: rotate(9deg) scale(1.6);
      opacity: 0;
    }
  }

  /* ---------- cards / panels ---------- */
  .sec-head {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin: 0 2px 12px;
  }
  .sec-head h2 {
    font-size: 25px;
    font-weight: 600;
    line-height: 1.1;
  }
  .text-btn {
    color: var(--rv-accent-ink);
    font-weight: 600;
    font-size: 14px;
    padding: 8px 4px;
  }
  .panel {
    background: var(--rv-surface);
    border: 1px solid var(--rv-line);
    border-radius: 22px;
    padding: 6px 18px;
    margin-bottom: 18px;
  }
  .panel > .overline {
    padding: 16px 0 6px;
  }
  .panel-title {
    font-size: 25px;
    padding: 18px 0 2px;
    font-weight: 600;
    line-height: 1.1;
  }

  .list-card {
    width: 100%;
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 14px 0;
    text-align: left;
    border-top: 1px solid var(--rv-line);
  }
  .panel > .overline + .list-card,
  .panel > .list-card:first-child {
    border-top: 0;
  }
  .list-card.off {
    opacity: 0.5;
  }
  .tile {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    display: grid;
    place-items: center;
    background: var(--cs);
    color: var(--ci);
    flex: none;
  }
  .tile .i {
    width: 21px;
    height: 21px;
  }
  .lc-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .lc-title {
    font-size: 16px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lc-meta {
    font-size: 14px;
    color: var(--rv-muted);
    display: flex;
    align-items: center;
    gap: 8px;
    flex-wrap: wrap;
  }
  .bar {
    height: 5px;
    border-radius: 3px;
    background: var(--rv-surface-2);
    overflow: hidden;
    margin-top: 4px;
  }
  .bar > i {
    display: block;
    height: 100%;
    border-radius: inherit;
    background: var(--c, var(--rv-accent));
    transition: width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  .lc-num {
    font-family: var(--rv-display);
    font-weight: 600;
    font-size: 19px;
    line-height: 1;
    min-width: 26px;
    text-align: right;
    font-variant-numeric: tabular-nums;
  }
  .lc-num.zero {
    color: var(--ci);
  }
  .lc-num .i {
    width: 20px;
    height: 20px;
    margin-left: auto;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    border: 1px solid var(--rv-line-strong);
    border-radius: 8px;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 600;
    color: var(--rv-text-2);
    white-space: nowrap;
  }
  .tag .i {
    width: 13px;
    height: 13px;
  }
  .tag.late {
    border-color: transparent;
    background: var(--rv-late-soft);
    color: var(--rv-late);
  }
  .tag.today {
    border-color: transparent;
    background: var(--rv-today-soft);
    color: var(--rv-today);
  }
  .tag.rep {
    border-color: transparent;
    background: var(--rv-surface-2);
    color: var(--rv-text-2);
  }
  .item.done .tag.rep {
    background: var(--cs, var(--rv-accent-soft));
    color: var(--ci, var(--rv-accent-ink));
  }
  .field-hint {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 13px;
    line-height: 1.45;
    color: var(--rv-muted);
    margin-top: 2px;
  }
  .field-hint .i {
    width: 17px;
    height: 17px;
    margin-top: 1px;
    color: var(--rv-accent-ink);
  }
  .field input.num {
    width: 84px;
    border: 1.5px solid var(--rv-line-strong);
    background: var(--rv-bg);
    border-radius: 12px;
    padding: 9px 12px;
    font-size: 16px;
    outline: 0;
    text-align: center;
  }
  .field input.num:focus {
    border-color: var(--rv-accent);
  }
  .offline {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 9px 16px;
    font-size: 15px;
    font-weight: 500;
    background: var(--rv-late-soft);
    color: var(--rv-late);
  }
  .offline .i {
    width: 17px;
    height: 17px;
  }
  .tag.list {
    border-color: transparent;
    background: var(--cs);
    color: var(--ci);
  }

  /* ---------- list detail ---------- */
  /* a block's screen: Voltar and the buttons on the first row; the line about it and the name below, with all the
     width (a name never breaks inside a word: it shrinks to fit, see _fitTitles) */
  .detail-head {
    margin: -6px -8px 6px -12px;
  }
  .detail-head .dh-row {
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .detail-head .dh-row .grow {
    flex: 1;
  }
  .detail-head .dh-text {
    min-width: 0;
    padding: 2px 8px 0 14px;
  }
  .detail-head h1 {
    font-size: clamp(34px, 9vw, 46px);
    overflow-wrap: normal;
    word-break: normal;
    font-weight: 700;
    line-height: 1.02;
    text-wrap: balance;
  }
  .fit-title {
    min-width: 0;
    overflow-wrap: normal;
    word-break: normal;
    hyphens: manual;
  }
  .detail-head .overline {
    margin-bottom: 6px;
  }
  .progress {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 8px 2px 16px;
    font-size: 14px;
    color: var(--rv-muted);
    font-weight: 500;
    font-variant-numeric: tabular-nums;
  }
  .progress .bar {
    flex: 1;
    margin: 0;
    height: 6px;
  }

  .quick {
    position: sticky;
    top: 0;
    z-index: 3;
    margin: 0 -18px 14px;
    padding: 6px 18px 10px;
    background: linear-gradient(var(--rv-bg) 78%, transparent);
  }
  .quick form {
    display: flex;
    align-items: center;
    gap: 8px;
    background: var(--rv-surface);
    border: 1.5px solid var(--rv-line-strong);
    border-radius: 18px;
    padding: 6px 6px 6px 16px;
    transition: border-color 0.15s;
  }
  .quick form:focus-within {
    border-color: var(--rv-accent);
  }
  .quick input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: none;
    font-size: 16px;
    padding: 10px 0;
  }
  .quick input::placeholder {
    color: var(--rv-faint);
  }
  .add-btn {
    width: 42px;
    height: 42px;
    border-radius: 14px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    display: grid;
    place-items: center;
    flex: none;
    transition: transform 0.12s;
  }
  .add-btn:active {
    transform: scale(0.92);
  }

  .panel.items {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .item {
    position: relative;
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 13px 0;
    border-top: 1px solid var(--rv-line);
  }
  .items > .item:first-child,
  .panel > .overline + .item {
    border-top: 0;
  }
  .item.dragging {
    z-index: 2;
    background: var(--rv-surface);
    border-radius: 14px;
    box-shadow: var(--rv-shadow), 0 0 0 10px var(--rv-surface);
    border-top-color: transparent;
    transition: none !important;
  }
  .item.shifting {
    transition: transform 0.18s ease;
  }
  .check {
    width: 24px;
    height: 24px;
    margin-top: -1px;
    border-radius: 9px;
    border: 2.2px solid var(--rv-line-strong);
    display: grid;
    place-items: center;
    flex: none;
    color: transparent;
    position: relative;
    transition: background 0.18s, border-color 0.18s, transform 0.12s;
  }
  .check::after {
    /* bigger touch target */
    content: "";
    position: absolute;
    inset: -10px;
  }
  .check .i {
    width: 16px;
    height: 16px;
    stroke-width: 3.2;
  }
  .check:active {
    transform: scale(0.88);
  }
  .check.on {
    background: var(--c, var(--rv-accent));
    border-color: var(--c, var(--rv-accent));
    color: var(--rv-on-accent);
    animation: rv-pop 0.32s cubic-bezier(0.2, 1.8, 0.4, 1);
  }
  @keyframes rv-pop {
    40% {
      transform: scale(1.18);
    }
  }
  .it-body {
    flex: 1;
    min-width: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .it-text {
    font-size: 16px;
    font-weight: 500;
    line-height: 1.4;
    overflow-wrap: anywhere;
    transition: color 0.2s;
  }
  .item.done .it-text {
    color: var(--rv-faint);
    text-decoration: line-through;
    text-decoration-thickness: 1.5px;
  }
  .it-desc {
    font-size: 14px;
    color: var(--rv-muted);
    line-height: 1.45;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    overflow-wrap: anywhere;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
  }
  .lnk {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    max-width: 100%;
    vertical-align: bottom;
    color: var(--ci, var(--rv-accent-ink));
    font-weight: 600;
    text-decoration: none;
    background: var(--cs, var(--rv-accent-soft));
    border-radius: 8px;
    padding: 1px 8px 1px 6px;
    margin: 1px 0;
  }
  .lnk span {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lnk .i {
    width: 14px;
    height: 14px;
  }
  .item.done .lnk {
    opacity: 0.6;
  }
  mark {
    background: var(--rv-accent-soft);
    color: inherit;
    border-radius: 4px;
    padding: 0 1px;
  }
  .grip {
    width: 36px;
    height: 36px;
    margin: -5px -8px -5px 0;
    display: grid;
    place-items: center;
    color: var(--rv-faint);
    touch-action: none;
    cursor: grab;
    flex: none;
  }
  .grip:active {
    cursor: grabbing;
  }

  .done-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 24px 2px 10px;
  }
  .done-toggle {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: var(--rv-display);
    font-weight: 600;
    font-size: 25px;
    line-height: 1.1;
  }
  .done-toggle .count {
    color: var(--rv-muted);
  }
  .done-toggle .i {
    transition: transform 0.2s;
    color: var(--rv-muted);
  }
  .done-toggle.open .i {
    transform: rotate(180deg);
  }

  .empty {
    text-align: center;
    padding: 34px 20px 30px;
    color: var(--rv-muted);
  }
  .empty .big-stamp {
    display: inline-block;
    transform: rotate(-6deg);
    border: 4px solid var(--rv-accent-ink);
    color: var(--rv-accent-ink);
    border-radius: 12px;
    padding: 6px 16px 4px;
    font-family: var(--rv-display);
    font-weight: 700;
    font-size: 28px;
    letter-spacing: 2px;
    margin-bottom: 16px;
    animation: rv-stamp2 0.5s cubic-bezier(0.2, 1.6, 0.4, 1) both;
  }
  @keyframes rv-stamp2 {
    from {
      transform: rotate(-6deg) scale(1.7);
      opacity: 0;
    }
  }
  .empty .em-icon {
    width: 50px;
    height: 50px;
    border-radius: 18px;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
    display: grid;
    place-items: center;
    margin: 0 auto 14px;
  }
  .empty h3 {
    color: var(--rv-text);
    font-family: var(--rv-display);
    font-size: 22px;
    font-weight: 600;
    margin: 0 0 6px;
    line-height: 1.1;
  }
  .empty p {
    margin: 0 auto;
    max-width: 340px;
    line-height: 1.5;
    font-size: 16px;
  }

  .skeleton {
    height: 18px;
    border-radius: 6px;
    margin: 20px 0;
    background: linear-gradient(90deg, var(--rv-skeleton), var(--rv-surface-2), var(--rv-skeleton));
    background-size: 200% 100%;
    animation: rv-shimmer 1.2s linear infinite;
  }
  @keyframes rv-shimmer {
    to {
      background-position: -200% 0;
    }
  }

  /* ---------- search ---------- */
  .search-box {
    display: flex;
    align-items: center;
    gap: 10px;
    background: var(--rv-surface);
    border: 1.5px solid var(--rv-line-strong);
    border-radius: 18px;
    padding: 4px 6px 4px 16px;
    margin-bottom: 14px;
    color: var(--rv-muted);
  }
  .search-box:focus-within {
    border-color: var(--rv-accent);
  }
  .search-box input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: none;
    font-size: 16px;
    padding: 12px 0;
    color: var(--rv-text);
  }
  .search-box input::-webkit-search-cancel-button {
    display: none;
  }
  .filters {
    display: flex;
    gap: 8px;
    margin: 0 0 18px;
    flex-wrap: wrap;
  }

  /* ---------- chips / pickers ---------- */
  .pick {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 1.5px solid var(--rv-line-strong);
    border-radius: 12px;
    padding: 8px 13px;
    font-size: 14px;
    font-weight: 500;
    color: var(--rv-text-2);
    white-space: nowrap;
    max-width: 100%;
    position: relative;
  }
  .pick > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .pick .i {
    width: 16px;
    height: 16px;
  }
  .pick.on {
    background: var(--rv-accent);
    border-color: var(--rv-accent);
    color: var(--rv-on-accent);
    font-weight: 600;
  }
  .pick.list .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--c);
    flex: none;
  }
  .pick.list.on {
    background: var(--cs);
    border-color: var(--c);
    color: var(--rv-text);
  }
  .pick.ghost {
    border-style: dashed;
  }
  .chip-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ---------- settings ---------- */
  .row {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 13px 0;
    border-top: 1px solid var(--rv-line);
    width: 100%;
    text-align: left;
    min-height: 54px;
  }
  .panel > .overline + .row,
  .panel > .row:first-child {
    border-top: 0;
  }
  .row.col {
    flex-direction: column;
    align-items: stretch;
  }
  .row .grow {
    flex: 1;
    min-width: 0;
  }
  .row .label {
    font-size: 16px;
    font-weight: 500;
  }
  .row .hint {
    font-size: 14px;
    color: var(--rv-muted);
    margin-top: 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .row .tile {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
  .row .tile .i {
    width: 20px;
    height: 20px;
  }
  .seg {
    display: flex;
    background: var(--rv-surface-2);
    border-radius: 14px;
    padding: 4px;
    gap: 4px;
  }
  .seg button {
    flex: 1;
    padding: 9px 6px;
    border-radius: 10px;
    font-weight: 500;
    font-size: 14px;
    color: var(--rv-muted);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
  }
  .seg button .i {
    width: 17px;
    height: 17px;
  }
  .seg button.on {
    background: var(--rv-surface);
    color: var(--rv-text);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    font-weight: 600;
  }
  :host([dark]) .seg button.on {
    background: var(--rv-line-strong);
  }
  .switch {
    position: relative;
    width: 50px;
    height: 30px;
    flex: none;
  }
  .switch input {
    position: absolute;
    inset: 0;
    opacity: 0;
    margin: 0;
    cursor: pointer;
    z-index: 1;
  }
  .switch .track {
    position: absolute;
    inset: 0;
    border-radius: 15px;
    background: var(--rv-line-strong);
    transition: background 0.18s;
  }
  .switch .track::after {
    content: "";
    position: absolute;
    top: 3px;
    left: 3px;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: #fff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    transition: transform 0.2s cubic-bezier(0.3, 1.4, 0.5, 1);
  }
  .switch input:checked + .track {
    background: var(--rv-accent);
  }
  .switch input:checked + .track::after {
    transform: translateX(20px);
  }
  .switch input:focus-visible + .track {
    outline: 2px solid var(--rv-accent-ink);
    outline-offset: 2px;
  }
  .swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  .sw {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: var(--c);
    display: grid;
    place-items: center;
    color: var(--rv-on-accent);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.08);
    transition: transform 0.12s;
  }
  .sw.on {
    box-shadow: 0 0 0 3px var(--rv-surface), 0 0 0 5px var(--c);
  }
  .sw .i {
    width: 19px;
    height: 19px;
    stroke-width: 3;
  }
  .icon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(46px, 1fr));
    gap: 8px;
  }
  .ig {
    aspect-ratio: 1;
    border-radius: 13px;
    display: grid;
    place-items: center;
    color: var(--rv-muted);
    background: var(--rv-surface-2);
  }
  .ig.on {
    background: var(--cs);
    color: var(--ci);
    box-shadow: inset 0 0 0 2px var(--c);
  }
  .foot {
    text-align: center;
    color: var(--rv-faint);
    font-size: 13px;
    margin: 26px 0 8px;
    line-height: 1.6;
  }
  .foot b {
    font-family: var(--rv-display);
    font-size: 19px;
    color: var(--rv-muted);
    letter-spacing: 0.3px;
    font-weight: 600;
  }

  /* ---------- bottom nav ---------- */
  nav {
    position: relative;
    flex: none;
    background: var(--rv-nav);
    border-top: 1px solid var(--rv-line);
    padding-bottom: env(safe-area-inset-bottom, 0px);
  }
  nav .tabs {
    max-width: 600px;
    margin: 0 auto;
    height: var(--rv-nav-h);
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    align-items: center;
  }
  .tab {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    font-weight: 500;
    color: var(--rv-muted);
    padding: 8px 0;
    position: relative;
  }
  .tab .i {
    width: 23px;
    height: 23px;
  }
  .tab.on {
    color: var(--rv-text);
    font-weight: 600;
  }
  .tab.on .i {
    color: var(--rv-accent-ink);
  }
  .tab .badge {
    position: absolute;
    top: 0;
    left: calc(50% + 5px);
    min-width: 22px;
    height: 20px;
    padding: 0 6px;
    border-radius: 11px;
    background: var(--rv-late);
    color: #fff;
    font-family: var(--rv-display);
    font-size: 13px;
    font-weight: 600;
    line-height: 1;
    font-variant-numeric: tabular-nums;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 0 0 2px var(--rv-nav);
    box-sizing: border-box;
  }
  /* Adicionar: only the + (1.21.0, every app of the family): the button stands out already, no text under it */
  .tab.fab {
    color: var(--rv-text);
    font-weight: 600;
    justify-content: center;
  }
  .tab.fab .pill {
    width: 62px;
    height: 44px;
    border-radius: 15px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    display: grid;
    place-items: center;
    transition: transform 0.12s;
  }
  .tab.fab:active .pill {
    transform: scale(0.92);
  }
  .tab.fab .pill .i {
    width: 24px;
    height: 24px;
    stroke-width: 2.4;
  }

  /* ---------- sheet ---------- */
  .scrim {
    position: fixed;
    inset: 0;
    background: var(--rv-scrim);
    z-index: 20;
    animation: rv-fade 0.2s ease both;
  }
  @keyframes rv-fade {
    from {
      opacity: 0;
    }
  }
  .sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 21;
    max-width: 640px;
    margin: 0 auto;
    max-height: 90%;
    overflow-y: auto;
    overscroll-behavior: contain;
    background: var(--rv-surface);
    border-radius: 28px 28px 0 0;
    padding: 10px 20px calc(22px + env(safe-area-inset-bottom, 0px));
    box-shadow: var(--rv-shadow);
    animation: rv-up 0.3s cubic-bezier(0.2, 0.9, 0.25, 1) both;
  }
  @keyframes rv-up {
    from {
      transform: translateY(100%);
    }
  }
  .grab {
    width: 42px;
    height: 5px;
    border-radius: 3px;
    background: var(--rv-line-strong);
    margin: 0 auto 12px;
  }
  .sheet-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    margin-bottom: 14px;
  }
  .sheet-head h3 {
    font-size: 22px;
    font-weight: 600;
    line-height: 1.15;
  }
  .sheet-head .icon-btn {
    width: 42px;
    height: 42px;
    margin-right: -8px;
    color: var(--rv-muted);
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 18px;
  }
  .field > .flabel {
    font-size: 14px;
    font-weight: 500;
    letter-spacing: 0;
    text-transform: none;
    color: var(--rv-text-2);
  }
  .field textarea,
  .field input[type="text"],
  .field input[type="url"],
  .field input[type="time"] {
    width: 100%;
    border: 1.5px solid var(--rv-line-strong);
    background: var(--rv-bg);
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 16px;
    outline: 0;
    resize: none;
    line-height: 1.4;
  }
  /* 1.22.0: a text of one line that can be long (a link, its name) shows all of it, growing with the text */
  .field textarea.grow {
    field-sizing: content;
    min-height: 50px;
    max-height: 40vh;
  }
  .field textarea:focus,
  .field input:focus {
    border-color: var(--rv-accent);
  }
  .field .time-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 4px;
  }
  .field .time-row input {
    width: auto;
    padding: 9px 12px;
    font-size: 16px;
  }
  .field .time-row .tl {
    color: var(--rv-muted);
    font-weight: 500;
    font-size: 14px;
  }
  .sheet-actions {
    display: flex;
    gap: 10px;
    margin-top: 8px;
  }
  .btn {
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 48px;
    /* the same border on every button, so two side by side come out the same width */
    border: 1.5px solid transparent;
    border-radius: 15px;
    font-weight: 500;
    font-size: 15px;
    padding: 0 18px;
    transition: transform 0.12s;
  }
  .btn:active {
    transform: scale(0.97);
  }
  .btn.primary {
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    font-weight: 600;
  }
  .btn.outline {
    border: 1.5px solid var(--rv-line-strong);
  }
  .btn.danger {
    flex: none;
    color: var(--rv-late);
    border: 1.5px solid var(--rv-line-strong);
  }
  .menu-row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    padding: 13px 4px;
    font-size: 16px;
    font-weight: 500;
    text-align: left;
    border-top: 1px solid var(--rv-line);
  }
  .menu-row:first-of-type {
    border-top: 0;
  }
  .menu-row .i {
    color: var(--rv-muted);
  }
  .menu-row.danger,
  .menu-row.danger .i {
    color: var(--rv-late);
  }
  .menu-row .sub {
    margin-left: auto;
    color: var(--rv-muted);
    font-weight: 400;
    font-size: 14px;
  }
  .preview-tile {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 14px;
    border-radius: 18px;
    background: var(--rv-bg);
    margin-bottom: 18px;
  }
  .preview-tile .lc-title {
    font-size: 17px;
  }
  .confirm-text {
    color: var(--rv-text-2);
    font-size: 16px;
    line-height: 1.5;
    margin: -4px 0 20px;
  }

  /* ---------- import ---------- */
  .imp-btn {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    flex: none;
    color: var(--rv-accent-ink);
    background: var(--rv-accent-soft);
  }
  .imp-btn .i {
    width: 20px;
    height: 20px;
  }
  .imp-strip {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    margin: -4px 0 18px;
  }
  .imp-strip button {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    padding: 11px 6px;
    border-radius: 14px;
    background: var(--rv-surface-2);
    font-size: 13px;
    font-weight: 500;
    color: var(--rv-text-2);
  }
  .imp-strip span {
    text-wrap: balance;
    text-align: center;
    line-height: 1.3;
  }
  .imp-strip .i {
    width: 21px;
    height: 21px;
    color: var(--rv-accent-ink);
  }
  .imp-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 14px;
  }
  .imp-opt {
    display: flex;
    align-items: center;
    gap: 13px;
    padding: 13px 14px;
    border-radius: 16px;
    border: 1.5px solid var(--rv-line-strong);
    text-align: left;
  }
  .imp-opt:disabled {
    opacity: 0.45;
  }
  .imp-opt > .i {
    color: var(--rv-faint);
    width: 18px;
    height: 18px;
  }
  .imp-ic {
    width: 42px;
    height: 42px;
    border-radius: 13px;
    display: grid;
    place-items: center;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
    flex: none;
  }
  .imp-ic .i {
    width: 21px;
    height: 21px;
  }
  .imp-tx {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .imp-tx b {
    font-size: 16px;
    font-weight: 600;
  }
  .imp-tx small {
    font-size: 13px;
    color: var(--rv-muted);
  }
  .imp-error {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    padding: 11px 13px;
    border-radius: 13px;
    background: var(--rv-late-soft);
    color: var(--rv-late);
    font-size: 13px;
    line-height: 1.45;
    margin-bottom: 14px;
  }
  .imp-error.soft {
    background: var(--rv-surface-2);
    color: var(--rv-text-2);
  }
  .imp-error .i {
    width: 17px;
    height: 17px;
    margin-top: 1px;
    flex: none;
  }
  .imp-error.soft .i {
    color: var(--rv-accent-ink);
  }
  .thumbs {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin: -2px 0 14px;
    padding-bottom: 2px;
  }
  .thumbs img {
    width: 64px;
    height: 64px;
    object-fit: cover;
    border-radius: 12px;
    flex: none;
    border: 1px solid var(--rv-line);
  }
  /* 1.26.0: o PDF lido (Escolher fotos ou PDF) */
  .thumbs .thumb-pdf {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    flex: none;
    display: grid;
    place-items: center;
    border: 1px solid var(--rv-line);
    color: var(--rv-accent-ink, var(--rv-accent));
  }
  .imp-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    padding: 26px 0 30px;
    color: var(--rv-muted);
    font-weight: 500;
    font-size: 15px;
  }
  .spin {
    color: var(--rv-accent-ink);
    animation: rv-spin 0.9s linear infinite;
  }
  .spin .i {
    width: 34px;
    height: 34px;
  }
  @keyframes rv-spin {
    to {
      transform: rotate(360deg);
    }
  }
  .imp-list {
    border: 1px solid var(--rv-line);
    border-radius: 16px;
    padding: 4px 6px 10px 12px;
    margin-bottom: 18px;
  }
  .imp-row {
    display: flex;
    align-items: center;
    gap: 10px;
    border-bottom: 1px solid var(--rv-line);
    padding: 4px 0;
  }
  .imp-row .check {
    width: 22px;
    height: 22px;
    border-radius: 7px;
    margin: 0;
  }
  .imp-row .check .i {
    width: 14px;
    height: 14px;
  }
  .imp-row input {
    flex: 1;
    min-width: 0;
    border: 0;
    outline: 0;
    background: none;
    font-size: 16px;
    padding: 10px 0;
  }
  .imp-row.off input {
    color: var(--rv-faint);
    text-decoration: line-through;
  }
  .icon-btn.mini {
    width: 36px;
    height: 36px;
    color: var(--rv-faint);
  }
  .icon-btn.mini .i {
    width: 18px;
    height: 18px;
  }
  .imp-list .add-row {
    margin-top: 10px;
  }
  .sheet-note {
    color: var(--rv-muted);
    font-size: 13px;
    line-height: 1.5;
    margin: 12px 2px 0;
  }
  .sheet-note.top {
    margin: -6px 2px 14px;
  }
  .sheet-head .back {
    width: 40px;
    height: 40px;
    margin-left: -10px;
    margin-right: -6px;
    color: var(--rv-text);
  }
  .sheet-head h3 {
    flex: 1;
  }
  .btn:disabled {
    opacity: 0.5;
  }

  /* ---------- page header (same values as EconomIA / InventarIA) ---------- */
  .brand-head {
    margin: 2px 2px 18px;
  }
  .eyebrow {
    margin: 0;
    font-size: 12px;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--rv-muted);
    font-weight: 600;
  }
  .brand {
    font-family: var(--rv-display);
    font-size: 21px;
    font-weight: 600;
    letter-spacing: 0;
    text-transform: none;
    color: var(--rv-text);
  }
  .brand span {
    color: var(--rv-accent-ink);
  }
  .page-title {
    font-family: var(--rv-display);
    font-size: clamp(34px, 8vw, 46px);
    font-weight: 700;
    line-height: 1.02;
    margin: 4px 0 0;
    text-wrap: balance;
  }
  .status {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px 10px;
    margin: 12px 0 0;
    color: var(--rv-muted);
    font-size: 14px;
  }
  .status .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    flex: none;
    background: var(--rv-accent);
    box-shadow: 0 0 0 3px var(--rv-accent-soft);
  }
  .status .dot.late {
    background: var(--rv-late);
    box-shadow: 0 0 0 3px var(--rv-late-soft);
  }
  .status .dot.off {
    background: var(--rv-faint);
    box-shadow: 0 0 0 3px rgba(127, 127, 127, 0.18);
  }
  /* a screen of Mais (Sobre): "‹ Mais" above the title, back to Mais */
  .uplink {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    min-height: 36px;
    margin: 12px 0 0 -6px;
    padding: 6px 10px 6px 4px;
    border-radius: 10px;
    color: var(--rv-text-2);
    font-weight: 500;
  }
  .uplink .i {
    width: 18px;
    height: 18px;
  }
  .uplink:active {
    background: var(--rv-surface-2);
  }
  @media (hover: hover) {
    .uplink:hover {
      background: var(--rv-surface-2);
      color: var(--rv-text);
    }
  }
  /* the last row of Mais (Sobre): opens its screen */
  .go-row .chev {
    width: 20px;
    height: 20px;
    color: var(--rv-muted);
  }
  .go-row:active {
    opacity: 0.7;
  }
  /* section headings of Sobre (the same as the other apps): icon in a soft square + big title */
  .mais-head {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 0 10px;
  }
  .mais-head h2 {
    margin: 0;
    font-family: var(--rv-display);
    font-size: 23px;
    font-weight: 700;
    line-height: 1.1;
    letter-spacing: 0.005em;
    color: var(--rv-text);
  }
  .mais-ic {
    display: grid;
    place-items: center;
    flex: none;
    width: 38px;
    height: 38px;
    border-radius: 11px;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
  }
  .mais-ic .i {
    width: 21px;
    height: 21px;
    stroke-width: 1.9;
  }

  .mais-head + .panel-lead {
    margin-top: 0;
  }
  .panel > .panel-lead:last-child {
    margin-bottom: 18px;
  }
  .sec-actions {
    padding-bottom: 16px;
  }
  /* Mais: the menu (Configurações, Sobre), like the other apps */
  .more-menu ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .more-row {
    display: flex;
    align-items: center;
    gap: 14px;
    width: 100%;
    min-height: 76px;
    padding: 12px 0;
    border-top: 1px solid var(--rv-line);
    text-align: left;
  }
  .more-menu li:first-child .more-row {
    border-top: 0;
  }
  .more-row .mb {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .more-row b {
    font-size: 17px;
    font-weight: 600;
    line-height: 1.25;
  }
  .more-row .mb span {
    color: var(--rv-muted);
    font-size: 14px;
    line-height: 1.35;
  }
  .more-row .chev {
    width: 20px;
    height: 20px;
    color: var(--rv-muted);
  }
  .more-row:active {
    opacity: 0.7;
  }
  /* Mais › Configurações: tabs at the top (the same as the other apps) */
  .seg.compact button {
    font-size: 14px;
    gap: 5px;
  }
  .seg.compact .i {
    width: 16px;
    height: 16px;
  }
  .more-tabs {
    position: sticky;
    top: 0;
    z-index: 4;
    margin: 0 0 14px;
    box-shadow: 0 0 0 6px var(--rv-bg);
    overflow-x: auto;
    scrollbar-width: none;
    overscroll-behavior-x: contain;
  }
  .more-tabs::-webkit-scrollbar {
    display: none;
  }
  .more-tabs button {
    flex: 1 0 auto;
    padding-left: 6px;
    padding-right: 6px;
    white-space: nowrap;
  }
  /* the icons only where there is room for them */
  @media (max-width: 600px) {
    .more-tabs .i {
      display: none;
    }
  }
  /* phones: smaller so the four fit (below ~340 px the bar scrolls sideways) */
  @media (max-width: 440px) {
    .more-tabs {
      gap: 1px;
    }
    .more-tabs button {
      font-size: 13px;
      padding-left: 4px;
      padding-right: 4px;
    }
  }
  /* Dados: one line per file, what it is and its button; every button the same width */
  .opts {
    list-style: none;
    margin: 0 0 6px;
    padding: 0;
    border-top: 1px solid var(--rv-line);
  }
  .opts > li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid var(--rv-line);
  }
  .opts > li:last-child {
    border-bottom: 0;
  }
  .opts .ot {
    flex: 1;
    min-width: min(100%, 13em);
  }
  .opts .ot b {
    display: block;
    font-weight: 600;
    font-size: 15px;
  }
  .opts .ot span {
    display: block;
    margin-top: 2px;
    font-size: 13.5px;
    line-height: 1.4;
    color: var(--rv-muted);
  }
  /* Dados: the buttons of the family (the GerencIA is the model): the width of the card on the phone (250 px from
     1000 px on), the same height, the icon beside the text; Criar backup full, the others with a border, Apagar tudo red */
  .opts .btn,
  #dados .opts .btn,
  #dados .sec-actions .btn {
    flex: 1 1 100%;
    width: 100%;
    min-height: 50px;
    font-size: 15px;
    padding: 0 18px;
    justify-content: center;
    white-space: nowrap;
  }
  @media (min-width: 1000px) {
    .opts .btn,
    #dados .opts .btn,
    #dados .sec-actions .btn {
      flex: none;
      width: 250px;
    }
  }
  #dados .sec-actions .btn.danger {
    color: var(--rv-late);
    border-color: color-mix(in srgb, var(--rv-late) 55%, transparent);
  }
  .panel code {
    font-size: 13px;
    padding: 1px 5px;
    border-radius: 6px;
    background: var(--rv-line);
  }

  /* Blocos: the categories, in a row that scrolls sideways (the chosen one is kept on this device) */
  .chip-row.cat-filter,
  .chip-row.who-filter {
    flex-wrap: nowrap;
    overflow-x: auto;
    scrollbar-width: none;
    margin: -4px -18px 16px;
    padding: 2px 18px;
  }
  /* Blocos de quem (1.10.0): above the categories */
  .chip-row.who-filter {
    margin-bottom: 10px;
  }
  .chip-row.who-filter .pick {
    flex: none;
  }
  /* De quem and the categories (1.14.0): every button of the row the same size, the one of the longest name and at least
     a third of the row, filling it when they fit (more than fits: the row scrolls to the side, still the same size) */
  .chip-row.who-filter,
  .chip-row.cat-filter {
    display: block;
    container-type: inline-size;
  }
  .chip-track {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    gap: 8px;
    width: max-content;
    min-width: 100%;
  }
  /* at least a third of the row: the two rows line up (3 to a row), a longer name widens all the buttons of its row */
  .chip-track .pick {
    justify-content: center;
    min-width: calc((100cqi - 16px) / 3);
    padding-inline: 10px;
  }
  /* Buscar: Incluir arquivados embaixo, com a largura toda (alinhado com o De quem) */
  .chip-row.search-opts .pick {
    flex: 1;
    justify-content: center;
  }
  .chip-row.who-filter .pick .i {
    width: 17px;
    height: 17px;
  }
  .chip-row.cat-filter::-webkit-scrollbar,
  .chip-row.who-filter::-webkit-scrollbar {
    display: none;
  }
  .chip-row.cat-filter .pick {
    flex: none;
  }
  /* Blocos › Arquivados (N): folded at the end of the shelf, like the inactive lists of the ResolvIA */
  /* Blocos: em blocos ou em lista (1.10.0), at the right of the count */
  .view-toggle {
    display: inline-flex;
    gap: 2px;
    margin-left: auto;
    padding: 3px;
    border-radius: 12px;
    background: var(--rv-surface-2);
  }
  .view-toggle button {
    display: grid;
    place-items: center;
    width: 38px;
    height: 34px;
    border-radius: 9px;
    color: var(--rv-muted);
  }
  .view-toggle button .i {
    width: 19px;
    height: 19px;
  }
  .view-toggle button.on {
    background: var(--rv-accent);
    color: var(--rv-on-accent, #fff);
  }
  .shelf-list {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .block-row .label,
  .block-row .hint {
    display: block;
  }
  .block-row .label {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .block-row .chev {
    width: 20px;
    height: 20px;
    flex: none;
    color: var(--rv-muted);
  }
  /* Buscar › os blocos e Selecionar (1.15.0), como no ResolvIA: X, quantos, Todos/Nenhum; embaixo, Alterar */
  .sel-head {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 44px;
    margin: 2px 0 6px;
  }
  .sel-head .sel-n {
    flex: 1;
    min-width: 0;
    color: var(--rv-muted);
    font-size: 14px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .sel-head.on .sel-n {
    color: var(--rv-text);
    font-size: 16px;
    font-weight: 600;
  }
  .sel-head .text-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    min-height: 44px;
    padding: 0 6px;
  }
  .sel-head .text-btn .i {
    width: 18px;
    height: 18px;
  }
  .sel-head .icon-btn {
    margin-left: -8px;
  }
  .search-blocks {
    margin-bottom: 16px;
  }
  .block-row.selr {
    margin: 0 -10px;
    padding-inline: 10px;
    width: calc(100% + 20px);
    border-radius: 14px;
  }
  .block-row.selr.on {
    background: var(--rv-accent-soft);
    border-top-color: transparent;
  }
  .block-row.selr.on + .block-row {
    border-top-color: transparent;
  }
  .block-row.selr.on .tile {
    background: var(--rv-accent);
    color: var(--rv-on-accent);
  }
  .sel-bar {
    position: sticky;
    bottom: 12px;
    z-index: 5;
    display: grid;
    margin-top: 12px;
  }
  .sel-bar .btn {
    width: 100%;
    box-shadow: var(--rv-shadow);
  }
  .sel-bar .btn:disabled {
    opacity: 1;
    background: var(--rv-surface-2);
    color: var(--rv-muted);
  }
  .block-row.add .tile {
    background: transparent;
    border: 1.5px dashed var(--rv-line-strong, var(--rv-line));
    color: var(--rv-muted);
  }
  .block-row.add .label {
    color: var(--rv-muted);
  }
  .block-row:active {
    opacity: 0.7;
  }
  .arch-panel {
    padding-top: 2px;
    padding-bottom: 2px;
  }
  .arch-head .tile.muted {
    background: color-mix(in srgb, var(--rv-muted) 16%, transparent);
    color: var(--rv-muted);
  }
  .arch-row .tile {
    background: var(--cs);
    color: var(--ci);
    opacity: 0.75;
  }
  .arch-head .label .count {
    display: inline-block;
    min-width: 1.6em;
    margin-left: 6px;
    padding: 0 7px;
    border-radius: 999px;
    background: color-mix(in srgb, var(--rv-muted) 16%, transparent);
    color: var(--rv-muted);
    font-size: 13px;
    font-weight: 600;
    text-align: center;
  }
  .arch-head .chev,
  .arch-row .chev {
    width: 20px;
    height: 20px;
    flex: none;
    color: var(--rv-muted);
    transition: transform 0.2s;
  }
  .arch-head.open .chev {
    transform: rotate(180deg);
  }
  .arch-row .label,
  .arch-row .hint {
    display: block;
  }
  .arch-row .label {
    color: var(--rv-text-2);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .arch-row:active,
  .arch-head:active {
    opacity: 0.7;
  }
  /* the block's screen, archived: in place of "Abre sozinho" */
  .hint-card.arch-card {
    background: var(--rv-surface-2);
  }
  .hint-card.arch-card > span {
    flex: 1;
    min-width: 0;
  }
  .hint-card.arch-card > .i {
    color: var(--rv-muted);
  }
  /* the block's sheet: Arquivar bloco, a row above the buttons */
  .sheet .menu-row.arch-toggle {
    border-top: 1px solid var(--rv-line);
    border-bottom: 1px solid var(--rv-line);
    margin: -4px 0 14px;
  }
  /* the choices of a sheet (Categoria, De quem é, the periods, the blocks): a grid of buttons of the same size, like the
     other apps; a long name goes to a second line inside its button */
  .chip-row.grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 8em), 1fr));
    gap: 8px;
  }
  .chip-row.grid .pick {
    justify-content: center;
    min-height: 44px;
    padding: 8px 10px;
    min-width: 0;
    white-space: normal;
    text-align: center;
    line-height: 1.2;
  }
  .chip-row.grid .pick > span {
    overflow: visible;
    text-overflow: clip;
    overflow-wrap: break-word;
    min-width: 0;
  }
  /* Manhã, Tarde and Noite always side by side, the hour under the name */
  .chip-row.grid.periods-pick {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .chip-row.grid.periods-pick .pick {
    flex-wrap: wrap;
    column-gap: 6px;
    row-gap: 2px;
  }
  .chip-row.grid.periods-pick .pick-sub {
    flex-basis: 100%;
  }
  .chip-row.grid.two {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  /* Blocos: whose the block is, on its sticker */
  .cover .sticker .owner {
    white-space: nowrap;
  }
  /* the buttons under an empty Agora: one line each, even at 320 px */
  .page > .sheet-actions .btn {
    padding: 0 10px;
    gap: 6px;
    white-space: nowrap;
  }
  /* Agora with nothing with a time: whose the blocks with a time are */
  .now-empty .now-whose {
    margin-top: 10px;
    font-size: 14px;
  }
  /* Buscar: Incluir arquivados */
  .search-opts {
    margin: -6px 0 16px;
  }
  /* Buscar › Filtros (1.25.0): o título fecha e abre De quem e Incluir arquivados, com a seta no canto */
  .filters-label {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    min-height: 40px;
    margin: -4px 0 8px;
    padding: 2px 0;
    background: none;
    border: 0;
    text-align: left;
    font: inherit;
    font-weight: 600;
    color: var(--rv-text);
    cursor: pointer;
  }
  .filters-label::after {
    content: "";
    flex: none;
    width: 18px;
    height: 18px;
    margin-left: auto;
    background: var(--rv-muted);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") center / 18px no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") center / 18px no-repeat;
    transition: transform 0.15s;
  }
  .filters-label[aria-expanded="false"] {
    margin-bottom: 14px;
  }
  .filters-label[aria-expanded="false"]::after {
    transform: rotate(-90deg);
  }
  /* Mais › Categorias */
  .cat-row .chev {
    width: 20px;
    height: 20px;
    color: var(--rv-muted);
  }
  .cat-row:active {
    opacity: 0.7;
  }
  .cats-panel .empty {
    padding-top: 18px;
  }
  .cats-panel .panel-lead {
    margin-top: 14px;
  }
  .cats-panel .panel-lead + .row {
    border-top: 0;
  }
  /* the block's sheet: Nova categoria written there */
  .new-cat input {
    width: 100%;
    margin-top: 2px;
    border: 1.5px solid var(--rv-line-strong);
    background: var(--rv-bg);
    border-radius: 14px;
    padding: 12px 14px;
    font-size: 16px;
    outline: 0;
  }
  .new-cat input:focus {
    border-color: var(--rv-accent);
  }

  /* Falar and Conversar: the buttons at the top right of the screens (like the other apps) */
  .head-row {
    display: flex;
    align-items: center;
    gap: 10px;
    min-height: 26px;
  }
  .head-row .eyebrow {
    flex: 1;
    min-width: 0;
  }
  .mic-top {
    flex: none;
    width: 44px;
    height: 44px;
    margin: -6px -2px -6px 0;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
  }
  .mic-top .i {
    width: 22px;
    height: 22px;
  }
  .mic-top:active {
    transform: scale(0.94);
  }
  /* in a block: on the line of Voltar and the settings, at the top */
  .detail-head .mic-top {
    margin: 0;
  }
  .panel .ai-switch {
    border-top: 0;
    padding-top: 0;
  }
  /* Integrações › CorrerIA: who used it last */
  .ai-state.correria-uso {
    margin-top: 12px;
  }
  /* Falar: the microphone, with a ring that follows the voice */
  .voice {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    padding: 18px 8px 8px;
    text-align: center;
  }
  .voice-mic {
    position: relative;
    width: 96px;
    height: 96px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    box-shadow: 0 6px 22px var(--rv-accent-soft);
  }
  .voice-mic .i {
    position: relative;
    width: 40px;
    height: 40px;
  }
  .voice-ring {
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: var(--rv-accent-soft);
    transform: scale(calc(0.85 + var(--lvl, 0) * 0.45));
    transition: transform 0.12s ease-out;
  }
  .voice.on .voice-ring {
    animation: mm-breathe 1.6s ease-in-out infinite;
  }
  @keyframes mm-breathe {
    50% {
      opacity: 0.6;
    }
  }
  .voice-state {
    font-family: var(--rv-display);
    font-size: 21px;
    font-weight: 600;
    margin-top: 6px;
  }
  .voice-time {
    color: var(--rv-muted);
    font-variant-numeric: tabular-nums;
  }
  .voice-hint {
    margin: 0;
    max-width: 34ch;
    color: var(--rv-muted);
    font-size: 14px;
    line-height: 1.45;
  }
  /* the review after Falar: what was heard */
  .heard {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 4px 0 10px;
    padding: 10px 12px;
    border-radius: 12px;
    background: var(--rv-surface-2);
    font-size: 14.5px;
    line-height: 1.4;
  }
  .heard .i {
    flex: none;
    width: 17px;
    height: 17px;
    margin-top: 2px;
    color: var(--rv-accent-ink);
  }

  /* ---------- camera ("Digitalizar com IA") ---------- */
  .cam {
    position: fixed;
    inset: 0;
    z-index: 40;
    background: #000;
    color: #fff;
    display: flex;
    flex-direction: column;
    animation: rv-fade 0.2s ease both;
  }
  .cam video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .cam-flash {
    position: absolute;
    inset: 0;
    background: #fff;
    animation: rv-flash 0.35s ease-out both;
    pointer-events: none;
  }
  @keyframes rv-flash {
    from {
      opacity: 0.85;
    }
    to {
      opacity: 0;
    }
  }
  .cam-top {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: calc(10px + env(safe-area-inset-top, 0px)) 12px 10px;
    background: linear-gradient(rgba(0, 0, 0, 0.55), transparent);
  }
  .cam-title {
    font-family: var(--rv-display);
    font-weight: 600;
    font-size: 21px;
  }
  .cam-btn {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    background: rgba(0, 0, 0, 0.35);
    color: #fff;
  }
  .cam-btn.on {
    background: #ffd54a;
    color: #1d0f10;
  }
  .cam-btn.ghost {
    background: none;
  }
  .cam-frame {
    position: relative;
    flex: 1;
    margin: 18px 26px 6px;
    pointer-events: none;
  }
  .cam-frame i {
    position: absolute;
    width: 38px;
    height: 38px;
    border: 4px solid rgba(255, 255, 255, 0.92);
    filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.5));
  }
  .cam-frame i:nth-child(1) {
    top: 0;
    left: 0;
    border-right: 0;
    border-bottom: 0;
    border-radius: 14px 0 0 0;
  }
  .cam-frame i:nth-child(2) {
    top: 0;
    right: 0;
    border-left: 0;
    border-bottom: 0;
    border-radius: 0 14px 0 0;
  }
  .cam-frame i:nth-child(3) {
    bottom: 0;
    left: 0;
    border-right: 0;
    border-top: 0;
    border-radius: 0 0 0 14px;
  }
  .cam-frame i:nth-child(4) {
    bottom: 0;
    right: 0;
    border-left: 0;
    border-top: 0;
    border-radius: 0 0 14px 0;
  }
  .cam-hint {
    position: relative;
    text-align: center;
    margin: 6px 24px 10px;
    font-size: 15px;
    font-weight: 500;
    text-shadow: 0 1px 4px rgba(0, 0, 0, 0.7);
  }
  .cam-msg {
    position: relative;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
    padding: 0 32px;
    text-align: center;
    font-size: 16px;
    line-height: 1.5;
  }
  .cam-msg > .i {
    width: 44px;
    height: 44px;
    opacity: 0.8;
  }
  .cam-msg .btn {
    flex: none;
  }
  .cam-bottom {
    position: relative;
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    align-items: center;
    gap: 12px;
    padding: 18px 20px calc(22px + env(safe-area-inset-bottom, 0px));
    background: linear-gradient(transparent, rgba(0, 0, 0, 0.6));
  }
  .cam-shots {
    display: flex;
    align-items: center;
  }
  .cam-shots img {
    width: 44px;
    height: 56px;
    object-fit: cover;
    border-radius: 8px;
    border: 2px solid #fff;
    margin-right: -18px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
  }
  .cam-shots span {
    margin-left: 24px;
    font-weight: 600;
    font-size: 14px;
  }
  .cam-shutter {
    width: 76px;
    height: 76px;
    border-radius: 50%;
    border: 4px solid #fff;
    display: grid;
    place-items: center;
  }
  .cam-shutter span {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: var(--rv-accent);
    transition: transform 0.1s;
  }
  .cam-shutter:active span {
    transform: scale(0.88);
  }
  .cam-shutter:disabled {
    opacity: 0.4;
  }
  .cam-done {
    justify-self: end;
    padding: 12px 16px;
    border-radius: 14px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    font-weight: 600;
    font-size: 15px;
  }
  .cam-done:disabled {
    background: rgba(255, 255, 255, 0.18);
    color: rgba(255, 255, 255, 0.6);
  }
  .extra-row {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: -6px 0 18px;
  }

  /* ---------- toast ---------- */
  .toast {
    position: fixed;
    left: 50%;
    bottom: calc(var(--rv-nav-h) + 16px + env(safe-area-inset-bottom, 0px));
    transform: translateX(-50%);
    z-index: 30;
    display: flex;
    align-items: center;
    gap: 14px;
    max-width: min(560px, calc(100% - 28px));
    width: max-content;
    padding: 12px 12px 12px 18px;
    border-radius: 16px;
    background: #2b2223;
    color: #f5eeee;
    font-size: 15px;
    font-weight: 500;
    box-shadow: 0 12px 34px rgba(0, 0, 0, 0.35);
    animation: rv-toast 0.28s cubic-bezier(0.2, 1.3, 0.4, 1) both;
  }
  :host([dark]) .toast {
    background: #f5eeee;
    color: #231a1b;
  }
  @keyframes rv-toast {
    from {
      opacity: 0;
      transform: translate(-50%, 14px);
    }
  }
  .toast span {
    min-width: 0;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    line-height: 1.35;
  }
  .toast button {
    flex: none;
    color: var(--rv-accent);
    font-weight: 600;
    padding: 6px 8px;
    border-radius: 8px;
  }
  :host([dark]) .toast button {
    color: var(--rv-accent-ink-light);
  }
  .toast.has-sheet {
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
  }

  @media (min-width: 700px) {
    .page {
      padding-top: 30px;
    }
    .hero {
      margin-left: 10px;
      margin-right: 10px;
    }
  }
  @media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
      animation: none !important;
      transition: none !important;
    }
  }
`,ii=It`
  /* ---------- timeline of the day ---------- */
  .tline {
    display: flex;
    gap: 8px;
    overflow-x: auto;
    margin: -4px -18px 16px;
    padding: 2px 18px 6px;
    scrollbar-width: none;
  }
  .tline::-webkit-scrollbar {
    display: none;
  }
  .tchip {
    flex: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 12px 7px 10px;
    border-radius: 12px;
    border: 1.5px solid var(--rv-line-strong);
    font-size: 14px;
    font-weight: 500;
    color: var(--rv-text-2);
    max-width: 220px;
  }
  .tchip b {
    font-family: var(--rv-display);
    font-weight: 600;
    font-size: 16px;
    font-variant-numeric: tabular-nums;
    color: var(--rv-text);
  }
  .tchip span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .tchip .dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: var(--c, var(--rv-accent));
    flex: none;
  }
  .tchip .i {
    width: 15px;
    height: 15px;
    color: var(--rv-muted);
  }
  .tchip.on {
    background: var(--rv-accent);
    border-color: var(--rv-accent);
    color: var(--rv-on-accent);
  }
  .tchip.on b,
  .tchip.on .i {
    color: var(--rv-on-accent);
  }
  .tchip.on .dot {
    box-shadow: 0 0 0 2px var(--rv-on-accent);
  }
  .tchip.peek {
    border-color: var(--rv-accent);
  }
  .switcher {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin: -6px 0 14px;
  }

  /* ---------- the notepad ---------- */
  .pad {
    position: relative;
    margin: 4px 8px 26px 14px;
    perspective: 1900px;
    --page-h: clamp(420px, calc(100vh - 330px), 980px);
  }
  .pad.tall {
    --page-h: clamp(440px, calc(100vh - 250px), 1000px);
  }
  .pad-cover {
    position: absolute;
    inset: 8px -8px -10px 6px;
    border-radius: 6px 16px 16px 6px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.14), transparent 45%), var(--c, var(--rv-accent));
    box-shadow: 0 14px 34px rgba(0, 0, 0, 0.32);
  }
  .pad-stack {
    position: absolute;
    inset: 3px -3px -4px 2px;
    border-radius: 4px 11px 11px 4px;
    background: var(--paper-back);
    box-shadow: 1px 1px 0 var(--paper-edge), 2px 2px 0 var(--paper-back), 3px 3px 0 var(--paper-edge);
  }
  .leaf {
    position: relative;
    z-index: 1;
    min-height: var(--page-h);
    height: var(--page-h);
    display: flex;
    flex-direction: column;
    border-radius: 4px 11px 11px 4px;
    background: var(--paper);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  .leaf.pautado::before {
    /* red margin line */
    content: "";
    position: absolute;
    top: 0;
    bottom: 0;
    left: 56px;
    width: 1.5px;
    background: var(--margin);
    pointer-events: none;
    z-index: 1;
  }
  .leaf-top {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 2px;
    height: 44px;
    padding: 0 6px 0 64px;
    color: var(--ink-soft);
    font-family: var(--mm-hand);
    font-size: 19px;
    position: relative;
    z-index: 5;
  }
  .leaf-top .when {
    margin-right: auto;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .leaf-top .pin {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    color: var(--rv-accent-ink);
    margin-right: 6px;
  }
  .leaf-top .pin .i {
    width: 15px;
    height: 15px;
  }
  .leaf-top .icon-btn {
    width: 40px;
    height: 40px;
    color: var(--ink-soft);
  }
  .ink {
    flex: 1;
    min-height: 0;
    width: 100%;
    display: block;
    border: 0;
    outline: 0;
    resize: none;
    margin: 0;
    background-color: transparent;
    color: var(--ink);
    caret-color: var(--rv-accent-ink);
    font-family: var(--mm-hand);
    font-size: 25px;
    font-weight: 500;
    line-height: 32px;
    padding: 4px 44px 40px 68px;
    background-attachment: local;
    background-position: 0 4px;
    white-space: pre-wrap;
    overflow-wrap: anywhere;
    overflow-y: auto;
    border-radius: 0 0 11px 4px;
  }
  /* a sheet with links, outside the editor: the same paper and letters, the links as chips */
  .ink-view {
    cursor: text;
    overflow-x: hidden;
  }
  .ink-view:focus-visible {
    outline: 2px solid var(--rv-accent-ink);
    outline-offset: -4px;
  }
  .lnk {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    max-width: min(100%, 17em);
    height: 26px;
    padding: 0 10px 0 8px;
    margin: 0 1px;
    border-radius: 9px;
    vertical-align: 2px;
    background: var(--cs);
    color: var(--ci);
    border: 1px solid color-mix(in srgb, var(--c) 45%, transparent);
    font-family: var(--rv-body);
    font-size: 15px;
    font-weight: 600;
    line-height: 1;
    text-decoration: none;
    white-space: nowrap;
    -webkit-tap-highlight-color: transparent;
  }
  :host([dark]) .lnk {
    color: var(--c);
  }
  .lnk .i {
    width: 15px;
    height: 15px;
    flex: none;
  }
  .lnk span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .lnk:active {
    filter: brightness(0.95);
  }
  /* Caixas de marcar: ☐ a fazer, ☑ feito; na vista da folha, um toque marca (e o texto fica riscado) */
  .chk {
    display: inline-grid;
    place-items: center;
    width: 22px;
    height: 22px;
    margin: 0 9px 0 0;
    padding: 0;
    vertical-align: -3px;
    border: 2px solid var(--ink-soft);
    border-radius: 6px;
    background: transparent;
    color: transparent;
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .chk .i {
    width: 15px;
    height: 15px;
    stroke-width: 3;
  }
  .chk-line.done .chk {
    background: var(--rv-accent-ink);
    border-color: var(--rv-accent-ink);
    color: var(--paper);
  }
  .chk-line.done .chk ~ * {
    text-decoration: line-through;
    text-decoration-thickness: 2px;
    opacity: 0.55;
  }
  .chk:focus-visible {
    outline: 2px solid var(--rv-accent-ink);
    outline-offset: 2px;
  }
  /* no alto da folha: Caixa de marcar (e Pronto, escrevendo) */
  .leaf-top .tool {
    width: 36px;
    height: 40px;
    border-radius: 10px;
  }
  .leaf-top .tool .i {
    width: 21px;
    height: 21px;
  }
  .leaf-top .tool.on {
    color: var(--rv-accent-ink);
  }
  /* Pronto (1.21.0): out of the editor in one tap; since 1.28.0 at the end of the bar of the writing, at the bottom */
  .ink-done {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    height: 34px;
    margin-left: 4px;
    padding: 0 12px 0 9px;
    border: 0;
    border-radius: 17px;
    background: var(--rv-accent);
    color: var(--rv-on-accent, #fff);
    font-family: var(--rv-display);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
  }
  .ink-done .i {
    width: 17px;
    height: 17px;
    stroke-width: 2.6;
  }
  .ink-done:active {
    transform: scale(0.96);
  }
  /* the editor waits behind the view (it gets the focus at the tap, so the keyboard opens) */
  textarea.ink.behind {
    position: absolute;
    left: 0;
    top: 0;
    width: 1px;
    height: 1px;
    flex: none;
    padding: 0;
    opacity: 0;
    pointer-events: none;
  }
  .field-error {
    font-size: 13.5px;
    color: var(--rv-late);
  }
  .ink::placeholder {
    color: var(--ink-soft);
    opacity: 0.7;
  }
  .ink.normal {
    font-family: var(--rv-body);
    font-size: 17px;
    font-weight: 400;
  }
  .pautado .ink {
    background-image: repeating-linear-gradient(to bottom, transparent 0 31px, var(--rule) 31px 32px);
  }
  .quadriculado .ink {
    background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px);
    background-size: 32px 32px;
    background-position: 4px 3px;
  }
  .pontilhado .ink {
    background-image: radial-gradient(circle at 1px 1px, var(--rule-dot) 1.4px, transparent 1.9px);
    background-size: 32px 32px;
    background-position: 14px 34px;
  }
  .leaf-num {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 8px;
    text-align: center;
    font-family: var(--mm-hand);
    font-size: 18px;
    color: var(--ink-soft);
    pointer-events: none;
    z-index: 2;
  }
  .spiral {
    position: absolute;
    left: -13px;
    top: 16px;
    bottom: 16px;
    width: 36px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    z-index: 9;
    pointer-events: none;
  }
  .spiral i {
    position: relative;
    height: 12px;
  }
  .spiral i::before {
    content: "";
    position: absolute;
    left: 21px;
    top: 1px;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--rv-bg);
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.4);
  }
  .spiral i::after {
    content: "";
    position: absolute;
    left: 0;
    top: 1px;
    width: 29px;
    height: 9px;
    border-radius: 6px;
    border: 2.6px solid var(--wire);
    border-right-color: transparent;
    transform: rotate(-9deg);
  }
  .edge {
    position: absolute;
    top: 44px;
    bottom: 0;
    z-index: 4;
    padding: 0;
    border: 0;
    background: none;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--ink-soft);
  }
  .edge.prev {
    left: 0;
    width: 50px;
  }
  .edge.next {
    right: 0;
    width: 40px;
  }
  .edge .hint {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    opacity: 0.45;
    transition: opacity 0.15s, background 0.15s;
  }
  .edge:active .hint,
  .edge:hover .hint {
    opacity: 1;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
  }
  .edge .hint .i {
    width: 18px;
    height: 18px;
  }
  /* 1.27.0: Negrito e cor numa parte do texto (as marcas só aparecem ao escrever) e a barra do Formatar */
  .fmt.b {
    font-weight: 700;
  }
  .ink.normal .fmt.b {
    font-weight: 700;
  }
  .fmt[class*="c-"] {
    color: var(--fc);
  }
  /* 1.29.0: Maior, para um título: na mesma linha do papel (a altura da linha não muda) */
  .fmt.big {
    font-size: 1.35em;
  }
  /* escrevendo, o tamanho só aparece no Pronto (as letras desenhadas por cima do editor têm a largura das dele): até lá,
     a parte maior fica sublinhada */
  .ink-mirror .lg {
    text-decoration: underline dotted;
    text-decoration-thickness: 1.5px;
    text-underline-offset: 5px;
  }
  .c-vermelho { --fc: #c42a1f; }
  .c-laranja { --fc: #b45309; }
  .c-verde { --fc: #3f7a17; }
  .c-azul { --fc: #0b67a8; }
  .c-lilas { --fc: #6d3fd6; }
  :host([dark]) .c-vermelho { --fc: #ff7a70; }
  :host([dark]) .c-laranja { --fc: #ffa23e; }
  :host([dark]) .c-verde { --fc: #8bd45f; }
  :host([dark]) .c-azul { --fc: #62b5ff; }
  :host([dark]) .c-lilas { --fc: #b99bff; }
  /* 1.28.0: escrevendo, a barra de baixo (no lugar das abas, acima do teclado) com a Caixa de marcar, o Negrito, a Cor, o
     Emoji e o Pronto; a Cor e o Emoji abrem logo acima dela */
  nav.write {
    position: relative;
    margin-bottom: var(--kb, 0px);
  }
  .wtools {
    max-width: 600px;
    margin: 0 auto;
    height: var(--rv-nav-h);
    display: flex;
    align-items: center;
    gap: 2px;
    padding: 0 12px;
  }
  .wbtn {
    width: 46px;
    height: 46px;
    flex: none;
    border: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: none;
    color: var(--rv-text);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .wbtn .i {
    width: 23px;
    height: 23px;
  }
  .wbtn:active,
  .wbtn.on {
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
  }
  .wtools .ink-done {
    margin-left: auto;
    height: 42px;
    padding: 0 18px 0 14px;
    border-radius: 21px;
    font-size: 16px;
  }
  @media (max-width: 380px) {
    .wtools {
      padding: 0 8px;
      gap: 0;
    }
    .wbtn {
      width: 40px;
    }
    .wtools .ink-done {
      padding: 0 12px 0 10px;
    }
  }
  .wpop {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 100%;
    max-width: 600px;
    margin: 0 auto;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 12px;
    background: var(--rv-nav);
    border-top: 1px solid var(--rv-line);
    box-shadow: 0 -8px 18px rgba(0, 0, 0, 0.1);
  }
  .wpop button {
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 12px;
    display: grid;
    place-items: center;
    background: none;
    color: var(--rv-text);
    cursor: pointer;
    -webkit-tap-highlight-color: transparent;
  }
  .wpop button:active {
    background: var(--rv-accent-soft);
  }
  .wpop .i {
    width: 22px;
    height: 22px;
  }
  .wpop .fmt-c span {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: var(--fc);
    box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.12);
  }
  .wpop.emojis {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(40px, 1fr));
    gap: 2px;
  }
  .wpop .emo {
    width: auto;
    height: 42px;
    font-size: 24px;
    line-height: 1;
    font-family: "Apple Color Emoji", "Segoe UI Emoji", "Noto Color Emoji", sans-serif;
  }
  /* 1.28.0: escrevendo, o negrito e as cores já aparecem: o texto desenhado por cima do editor (as letras dele ficam
     transparentes; o cursor e a seleção continuam), com as marcas apagadas; o negrito é um contorno, que não muda a
     largura das letras */
  .ink.live {
    color: transparent;
    -webkit-text-fill-color: transparent;
  }
  .ink.live::selection {
    color: transparent;
    -webkit-text-fill-color: transparent;
    background: color-mix(in srgb, var(--rv-accent) 32%, transparent);
  }
  .ink.live,
  .ink-mirror {
    scrollbar-gutter: stable;
  }
  .leaf .ink.ink-mirror {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    bottom: 0;
    z-index: 2;
    overflow: hidden;
    pointer-events: none;
    background: none;
    color: var(--ink);
  }
  .ink-mirror .mk {
    opacity: 0.3;
  }
  .ink-mirror .lb {
    -webkit-text-stroke: 0.04em currentColor;
  }
  .ink-mirror .lc {
    color: var(--fc);
  }
  /* escrevendo, um arrasto passa do alto do app: a página do Home Assistant em volta, que o teclado empurrou, volta */
  :host([writing]) main {
    overscroll-behavior-y: auto;
  }
  /* 1.27.0: no celular, as margens da folha menores, para caber mais texto em cada linha (a espiral e as bordas de virar
     a folha continuam onde estavam) */
  @media (max-width: 600px) {
    .pad {
      margin: 4px 2px 26px 10px;
    }
    .ink {
      padding: 4px 22px 40px 42px;
    }
    .leaf-top {
      padding-left: 40px;
    }
    .leaf.pautado::before {
      left: 34px;
    }
    .edge.prev {
      width: 32px;
    }
    .edge.next {
      width: 22px;
    }
  }
  /* 1.30.0: Tela cheia (telas largas): só o caderno. Somem a linha dos botões e a de quando abre sozinho; a barra de
     baixo fica escondida, com uma faixa fina à vista, e aparece com o mouse nela */
  :host([full]) .detail-head .dh-row,
  :host([full]) .brand-head .head-row,
  :host([full]) .when-line,
  :host([full]) .arch-card {
    display: none;
  }
  :host([full]) .page {
    padding-top: 12px;
  }
  :host([full]) .pad {
    --page-h: clamp(420px, calc(100vh - 220px), 1600px);
  }
  :host([full]) .pad.tall {
    --page-h: clamp(420px, calc(100vh - 150px), 1600px);
  }
  :host([full]) nav {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 30;
    transform: translateY(calc(100% - 8px));
    transition: transform 0.18s ease;
  }
  :host([full]) nav:hover,
  :host([full]) nav:focus-within {
    transform: none;
  }
  .full-exit {
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 40px;
    padding: 0 14px;
    border: 1px solid var(--rv-line);
    border-radius: 20px;
    background: var(--rv-surface);
    color: var(--rv-text);
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
  }
  .full-exit .i {
    width: 18px;
    height: 18px;
  }
  /* 1.29.1: numa tela larga, o caderno aberto: a página da esquerda não rola (as linhas que não cabem vão para a da
     direita, que rola); as duas com um número inteiro de linhas (a espiral no meio) */
  .page:has(.pad.spread) {
    max-width: 1320px;
  }
  .pad.spread {
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: 30px;
    margin-left: 8px;
  }
  .pad.spread .leaf {
    min-height: 0;
    height: calc(48px + round(down, var(--page-h) - 48px, 32px));
  }
  .pad.spread .leaf.left {
    border-radius: 11px 4px 4px 11px;
  }
  .pad.spread .spiral {
    left: calc(50% - 22px);
  }
  .pad.spread .ink {
    scrollbar-gutter: stable;
  }
  .pad.spread .leaf.left .ink {
    overflow: hidden;
    padding-bottom: 0;
  }
  .pad.spread .ink.blank {
    cursor: text;
  }
  /* a cópia escondida da folha toda, linha por linha, que diz quantas cabem na esquerda */
  .leaf .ink.measure {
    position: absolute;
    left: 0;
    right: 0;
    top: 44px;
    height: auto;
    overflow: hidden;
    visibility: hidden;
    pointer-events: none;
    background: none;
  }
  .edge.next::after {
    /* turned-up page corner */
    content: "";
    position: absolute;
    right: 0;
    bottom: 0;
    width: 30px;
    height: 30px;
    border-radius: 0 0 11px 0;
    background: linear-gradient(315deg, var(--rv-bg) 0 48%, var(--paper-edge) 50%, var(--paper-back) 66%, transparent 67%);
    filter: drop-shadow(-2px -2px 2px rgba(0, 0, 0, 0.12));
    transition: width 0.15s, height 0.15s;
  }
  .edge.next:active::after,
  .edge.next:hover::after {
    width: 40px;
    height: 40px;
  }
  .edge.next.new .hint {
    opacity: 0.8;
    color: var(--rv-accent-ink);
  }

  /* page turning around the spiral */
  .turn {
    position: absolute;
    inset: 0;
    z-index: 8;
    transform-origin: 0 50%;
    transform-style: preserve-3d;
    pointer-events: none;
  }
  .turn .face {
    position: absolute;
    inset: 0;
    border-radius: 4px 11px 11px 4px;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
    overflow: hidden;
    background: var(--paper);
    display: flex;
    flex-direction: column;
  }
  .turn .face.back {
    transform: rotateY(180deg);
    background: var(--paper-back);
  }
  .turn .face .ink {
    overflow: hidden;
  }
  .turn .shade {
    position: absolute;
    inset: 0;
    background: linear-gradient(90deg, rgba(0, 0, 0, 0.18), transparent 60%);
    opacity: 0;
    animation: mm-shade 0.6s ease both;
  }
  .turn.next {
    animation: mm-turn-next 0.6s cubic-bezier(0.45, 0.05, 0.3, 1) both;
  }
  .turn.prev {
    animation: mm-turn-prev 0.6s cubic-bezier(0.45, 0.05, 0.3, 1) both;
  }
  @keyframes mm-turn-next {
    from {
      transform: rotateY(0deg);
    }
    to {
      transform: rotateY(-178deg);
    }
  }
  @keyframes mm-turn-prev {
    from {
      transform: rotateY(-178deg);
    }
    to {
      transform: rotateY(0deg);
    }
  }
  @keyframes mm-shade {
    50% {
      opacity: 1;
    }
  }

  /* ---------- shelf of notebooks ---------- */
  .shelf {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 18px 16px;
    margin-bottom: 22px;
  }
  .cover {
    position: relative;
    aspect-ratio: 3 / 4;
    border-radius: 5px 14px 14px 5px;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.16), transparent 50%), linear-gradient(90deg, rgba(0, 0, 0, 0.18) 0 14px, transparent 14px), var(--c);
    box-shadow: 3px 3px 0 var(--paper-edge), 0 12px 26px rgba(0, 0, 0, 0.28);
    color: var(--rv-on-accent);
    text-align: left;
    padding: 14px 12px 12px 26px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .cover::before {
    /* spiral on the cover */
    content: "";
    position: absolute;
    left: 3px;
    top: 10px;
    bottom: 10px;
    width: 12px;
    background: repeating-linear-gradient(to bottom, transparent 0 7px, var(--wire) 7px 10px, transparent 10px 15px);
    border-radius: 6px;
    opacity: 0.85;
  }
  .cover .sticker {
    background: var(--paper);
    color: var(--ink);
    border-radius: 6px;
    padding: 8px 10px 6px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    transform: rotate(-1.5deg);
  }
  .cover .sticker b {
    display: block;
    font-family: var(--mm-hand);
    font-size: 25px;
    font-weight: 700;
    line-height: 1.05;
    overflow-wrap: anywhere;
  }
  .cover .sticker small {
    display: block;
    font-size: 12px;
    font-weight: 600;
    color: var(--ink-soft);
    margin-top: 2px;
  }
  .cover .when {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .cover .when span {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(0, 0, 0, 0.16);
    color: var(--rv-on-accent);
    border-radius: 7px;
    padding: 2px 6px;
    font-variant-numeric: tabular-nums;
  }
  .cover .when .i {
    width: 12px;
    height: 12px;
  }
  .cover.add {
    background: none;
    border: 2px dashed var(--rv-line-strong);
    box-shadow: none;
    color: var(--rv-muted);
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 12px;
    font-weight: 600;
    font-size: 15px;
  }
  .cover.add::before {
    display: none;
  }
  .cover.add .i {
    width: 28px;
    height: 28px;
  }

  /* ---------- page results ---------- */
  .result {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    width: 100%;
    padding: 13px 0;
    text-align: left;
    border-top: 1px solid var(--rv-line);
  }
  .panel > .overline + .result,
  .panel > .result:first-child {
    border-top: 0;
  }
  .result .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--c);
    margin-top: 6px;
    flex: none;
  }
  .result .r-main {
    flex: 1;
    min-width: 0;
  }
  .result .r-title {
    font-weight: 600;
    font-size: 16px;
  }
  .result .r-snip {
    font-size: 14px;
    color: var(--rv-muted);
    line-height: 1.45;
    margin-top: 2px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .result .r-meta {
    font-size: 13px;
    color: var(--rv-faint);
    margin-top: 4px;
  }

  /* paper choice previews */
  .papers {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }
  .paper-opt {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--rv-text-2);
  }
  .paper-opt .sw-paper {
    width: 100%;
    aspect-ratio: 1;
    border-radius: 10px;
    background-color: var(--paper);
    border: 2px solid var(--rv-line-strong);
  }
  .paper-opt.on .sw-paper {
    border-color: var(--rv-accent);
    box-shadow: 0 0 0 2px var(--rv-accent-soft);
  }
  .paper-opt.on {
    color: var(--rv-text);
    font-weight: 600;
  }
  .sw-paper.pautado {
    background-image: repeating-linear-gradient(to bottom, transparent 0 9px, var(--rule) 9px 10px), linear-gradient(90deg, transparent 12px, var(--margin) 12px 13px, transparent 13px);
  }
  .sw-paper.quadriculado {
    background-image: linear-gradient(var(--rule) 1px, transparent 1px), linear-gradient(90deg, var(--rule) 1px, transparent 1px);
    background-size: 10px 10px;
  }
  .sw-paper.pontilhado {
    background-image: radial-gradient(circle at 1px 1px, var(--rule-dot) 1.2px, transparent 1.6px);
    background-size: 10px 10px;
  }
  /* the times and Escolher horário: the grid of the choices, as in the other apps (1.23.0) */
  .time-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 8em), 1fr));
    gap: 8px;
    align-items: stretch;
  }
  .time-list .add-time {
    justify-content: center;
  }
  /* Quando abrir sozinho: Horário exato and the times the same size as Manhã, Tarde and Noite */
  .chip-row.grid.periods-pick .pick {
    min-height: 58px;
  }
  .periods-pick + .time-list {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
  .periods-pick + .time-list .add-time,
  .periods-pick + .time-list .time-chip {
    min-height: 58px;
  }
  .periods-pick + .time-list .add-time {
    min-width: 0;
    padding: 6px 8px;
    gap: 6px;
  }
  .periods-pick + .time-list .add-time > span {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    text-align: center;
    line-height: 1.15;
  }
  .time-list .time-chip {
    justify-content: space-between;
    min-height: 50px;
  }
  .time-chip {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 6px 6px 12px;
    border-radius: 12px;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink);
    font-family: var(--rv-display);
    font-weight: 600;
    font-size: 17px;
    font-variant-numeric: tabular-nums;
  }
  .time-chip button {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: grid;
    place-items: center;
    color: inherit;
  }
  .time-chip .i {
    width: 15px;
    height: 15px;
  }
  /* + Horário: the hour and the minutes in the sheets of selectsheet.js; their two boxes never show */
  .add-time-wrap {
    display: contents;
  }
  .tp-box {
    display: none;
  }
  .review-text {
    width: 100%;
    min-height: 220px;
    border: 1.5px solid var(--rv-line-strong);
    border-radius: 14px;
    padding: 4px 14px 14px 18px;
    background-color: var(--paper);
    color: var(--ink);
    font-family: var(--mm-hand);
    font-size: 23px;
    line-height: 30px;
    background-image: repeating-linear-gradient(to bottom, transparent 0 29px, var(--rule) 29px 30px);
    background-attachment: local;
    background-position: 0 4px;
    outline: 0;
    resize: vertical;
  }
  .review-text:focus {
    border-color: var(--rv-accent);
  }
  .new-strip {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    margin-bottom: 18px;
  }
  .new-strip button {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 13px 12px;
    border-radius: 14px;
    background: var(--rv-surface-2);
    font-size: 15px;
    font-weight: 500;
    text-align: left;
    color: var(--rv-text);
  }
  .new-strip button.main {
    grid-column: 1 / -1;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    font-weight: 600;
  }
  .new-strip .i {
    width: 21px;
    height: 21px;
    color: var(--rv-accent-ink);
    flex: none;
  }
  .new-strip button.main .i {
    color: var(--rv-on-accent);
  }
  .new-strip button:disabled {
    opacity: 0.45;
  }

  /* ---------- MemorIA bits ---------- */
  .boot-msg {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    min-height: 60vh;
    padding: 24px;
    color: var(--rv-muted);
    text-align: center;
  }
  .leaf-top .num {
    font-family: var(--rv-display);
    font-size: 14px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    color: var(--ink-soft);
    padding: 0 2px;
  }
  .icon-btn.ghost {
    pointer-events: none;
  }
  .result .r-title,
  .result .r-meta {
    display: block;
  }
  .status .now-btn {
    padding: 0 2px;
  }
  .hint-card {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 14px;
    margin: -2px 0 16px;
    border-radius: 16px;
    background: var(--rv-accent-soft);
    color: var(--rv-text-2);
    font-size: 14px;
    line-height: 1.4;
  }
  .hint-card > .i {
    color: var(--rv-accent-ink);
  }
  .hint-card .text-btn {
    flex: none;
  }
  .when-line {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0 2px 16px;
    font-size: 14px;
    color: var(--rv-muted);
    text-align: left;
  }
  .when-line .i {
    width: 17px;
    height: 17px;
    color: var(--rv-accent-ink);
  }
  .when-line b {
    color: var(--rv-text-2);
    font-weight: 600;
    font-variant-numeric: tabular-nums;
  }
  .day-row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 0;
    text-align: left;
    border-top: 1px solid var(--rv-line);
  }
  .panel > .overline + .day-row {
    border-top: 0;
  }
  .day-row > b {
    font-family: var(--rv-display);
    font-size: 19px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    width: 48px;
  }
  .day-row .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: var(--c);
    flex: none;
  }
  .day-row .grow {
    flex: 1;
    min-width: 0;
  }
  .day-row .label {
    display: block;
    font-weight: 600;
  }
  .day-row .hint {
    display: block;
    font-size: 13px;
    color: var(--rv-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .day-row > .i {
    color: var(--rv-faint);
    width: 18px;
    height: 18px;
  }
  .now-tag {
    font-size: 12px;
    font-weight: 600;
    padding: 3px 8px;
    border-radius: 8px;
    background: var(--cs);
    color: var(--ci);
  }
  .pick .pick-sub {
    font-size: 12px;
    font-weight: 500;
    opacity: 0.75;
    font-variant-numeric: tabular-nums;
  }
  .btn.danger-fill {
    background: var(--rv-late);
    color: #fff;
    font-weight: 600;
  }
  code {
    font-family: ui-monospace, "SFMono-Regular", Menlo, monospace;
    font-size: 0.92em;
    background: var(--rv-surface-2);
    padding: 1px 5px;
    border-radius: 6px;
  }

  /* ---------- Leitura por IA ---------- */
  .panel-lead {
    margin: 0 0 14px;
    font-size: 14px;
    line-height: 1.5;
    color: var(--rv-muted);
  }
  .ai-state {
    display: flex;
    gap: 12px;
    align-items: flex-start;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--rv-surface-2);
  }
  .ai-state .dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    margin-top: 6px;
    flex: none;
    background: var(--rv-faint);
  }
  .ai-state.ok .dot {
    background: #2fb67c;
    box-shadow: 0 0 0 3px rgba(47, 182, 124, 0.2);
  }
  .ai-state.warn .dot {
    background: #e8a317;
    box-shadow: 0 0 0 3px rgba(232, 163, 23, 0.2);
  }
  .ai-state.bad .dot {
    background: var(--rv-late);
    box-shadow: 0 0 0 3px var(--rv-late-soft);
  }
  .ai-state b {
    display: block;
    font-weight: 600;
  }
  .ai-state span {
    display: block;
    font-size: 14px;
    color: var(--rv-muted);
    line-height: 1.45;
  }
  /* the boxes open the sheet of selectsheet.js, never the window of the phone */
  select:not([multiple]) {
    pointer-events: none;
  }
  .select {
    width: 100%;
    font: inherit;
    font-size: 16px;
    color: var(--rv-text);
    background-color: var(--rv-surface-2);
    border: 1.5px solid var(--rv-line-strong);
    border-radius: 14px;
    padding: 12px 40px 12px 14px;
    appearance: none;
    -webkit-appearance: none;
    background-image: linear-gradient(45deg, transparent 50%, var(--rv-muted) 50%), linear-gradient(135deg, var(--rv-muted) 50%, transparent 50%);
    background-position: calc(100% - 20px) 52%, calc(100% - 14px) 52%;
    background-size: 6px 6px;
    background-repeat: no-repeat;
  }
  .select:focus {
    outline: 0;
    border-color: var(--rv-accent);
  }
  /* a time (Períodos do dia): the same box, as wide as the time */
  .select.time-select {
    width: auto;
    flex: none;
    font-variant-numeric: tabular-nums;
  }
  .ai-actions {
    display: flex;
    margin: 14px 0 6px;
  }
  /* Verificar de novo (IA, Falar): the width of the card on the phone, like the buttons of Dados (1.21.0) */
  .ai-actions .btn {
    flex: 1 1 100%;
    width: 100%;
    min-height: 50px;
  }
  @media (min-width: 1000px) {
    .ai-actions .btn {
      flex: none;
      width: 250px;
    }
  }
  .steps-box {
    margin: 10px 0 14px;
    font-size: 14px;
  }
  .steps {
    margin: 6px 0 0;
    padding-left: 20px;
    color: var(--rv-text-2);
    line-height: 1.5;
  }
  .steps li + li {
    margin-top: 4px;
  }
  .text-btn.inline {
    display: inline;
    padding: 0 0 0 4px;
    font-size: inherit;
  }

  /* ---------- Dados ---------- */
  .data-row {
    padding: 14px 0;
    border-top: 1px solid var(--rv-line);
  }
  .panel > .overline + .data-row {
    border-top: 0;
    padding-top: 4px;
  }
  .data-row > b {
    display: block;
    font-weight: 600;
  }
  .data-row > p {
    margin: 2px 0 10px;
    font-size: 14px;
    line-height: 1.45;
    color: var(--rv-muted);
  }
  .btn-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .btn.sm {
    flex: none;
    min-height: 40px;
    font-size: 14px;
    padding: 0 14px;
    border-radius: 12px;
    gap: 6px;
    text-decoration: none;
    color: var(--rv-text);
  }
  .btn.sm .i {
    width: 18px;
    height: 18px;
  }
  .btn.primary.sm {
    color: var(--rv-on-accent);
  }
  .btn.danger.sm {
    color: var(--rv-late);
  }
  .data-note {
    margin: 8px 0 0;
    font-size: 13px;
    color: var(--rv-late);
  }
  .data-list {
    margin-top: 10px;
  }
  .data-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 0;
    border-top: 1px solid var(--rv-line);
  }
  .data-item > div {
    flex: 1;
    min-width: 0;
  }
  .data-item b {
    display: block;
    font-weight: 600;
    font-size: 15px;
    font-variant-numeric: tabular-nums;
  }
  .data-item span {
    display: block;
    font-size: 13px;
    color: var(--rv-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .sheet .data-list {
    margin: 0 0 8px;
  }
  .sheet .data-item:first-child {
    border-top: 0;
  }
  /* ---------- one height, the same in every app of the family (50 px): buttons, fields, boxes of choice and the
     choices in buttons (the tabs of Configurações, Tema, the periods and the times of now). Out of it: the buttons with
     only an icon, the tiles of the AI, the rows of the lists, the switches and the colors. */
  .btn,
  .btn.sm,
  .select,
  .field input[type="text"],
  .field input.num,
  .search-box,
  .tchip,
  .new-strip button {
    min-height: 50px;
  }
  .new-strip button {
    padding-top: 0;
    padding-bottom: 0;
  }
  .seg {
    min-height: 50px;
    align-items: stretch;
  }
  .seg button {
    padding-top: 0;
    padding-bottom: 0;
  }
  .pick,
  .chip-row.grid .pick {
    min-height: 50px;
  }
  .chip-row.grid .pick {
    padding-top: 6px;
    padding-bottom: 6px;
  }
  /* Nova folha: the box of 50, with the + inside */
  .quick form {
    min-height: 50px;
    padding: 3px 4px 3px 16px;
  }
  .quick input {
    padding: 0;
    align-self: stretch;
  }
  .quick .add-btn {
    width: 40px;
    height: 40px;
    border-radius: 12px;
  }
  /* Opções › Atalho no celular: the steps, and the path on the whole width (never cut) with Copiar under it */
  .shortcut .steps {
    margin: 0 0 14px;
    padding-left: 22px;
    color: var(--rv-text-2);
    font-size: 14px;
    line-height: 1.5;
  }
  .shortcut .steps b {
    color: var(--rv-text);
    font-weight: 600;
  }
  .shortcut .field {
    margin-bottom: 0;
  }
  .copy-row {
    display: grid;
    gap: 8px;
  }
  .copy-row input[type="text"] {
    min-width: 0;
    font-family: ui-monospace, monospace;
    font-size: 14px;
  }
  /* 1.23.0 (the family): the tabs that don't fit show an arrow at the end where there are more */
  .tabs-wrap {
    position: sticky;
    top: 0;
    z-index: 4;
    margin: 0 0 14px;
  }
  .tabs-wrap > .more-tabs {
    position: relative;
    top: auto;
    z-index: 0;
    margin: 0;
  }
  .tabs-fim {
    position: absolute;
    top: 1px;
    bottom: 1px;
    z-index: 1;
    width: 48px;
    display: none;
    align-items: center;
    pointer-events: none;
    color: var(--rv-text);
  }
  .tabs-fim.dir {
    right: 1px;
    justify-content: flex-end;
    padding-right: 6px;
    border-radius: 0 12px 12px 0;
    background: linear-gradient(to right, transparent, var(--rv-surface-2) 62%);
  }
  .tabs-fim.esq {
    left: 1px;
    padding-left: 6px;
    border-radius: 12px 0 0 12px;
    background: linear-gradient(to left, transparent, var(--rv-surface-2) 62%);
  }
  .tabs-fim .i {
    width: 18px;
    height: 18px;
    display: block !important;
  }
  .tabs-wrap.tem-dir > .tabs-fim.dir,
  .tabs-wrap.tem-esq > .tabs-fim.esq {
    display: flex;
  }
  /* every row with a title has its icon before it; no line between the options of a section (the icon marks where
     each one starts); the lists of data (with the square of the icon) keep the line */
  .label:has(> .lbl-ic),
  .flabel:has(> .lbl-ic) {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .lbl-ic {
    flex: none;
    width: 18px;
    height: 18px;
    color: var(--rv-accent-ink, var(--rv-accent));
  }
  .row .grow:has(> .label > .lbl-ic) > .hint {
    padding-left: 26px;
    white-space: normal;
  }
  .panel > .row:not(:has(> .tile)):not(:has(> .em-icon)),
  #periodos > .row {
    border-top: 0;
  }
  /* the sub-options (the state and the choice of the AI under Usar IA, the last use under the CorrerIA): in a box
     under the switch, to see whose they are */
  .sub-op {
    padding: 0 0 14px 26px;
  }
  .sub-box {
    padding: 12px 14px 14px;
    border: 1px solid var(--rv-line);
    border-radius: 14px;
    background: var(--rv-surface-2);
  }
  .sub-box > .ai-state {
    padding: 0;
    margin: 0;
    background: none;
  }
  .sub-box .steps-box {
    margin-top: 14px;
  }
  .sub-box > .ai-actions {
    margin-top: 12px;
  }
  @media (max-width: 360px) {
    .sub-op {
      padding-left: 10px;
    }
    .sub-box {
      padding: 10px;
    }
  }
  /* the title of each screen and each window with its icon */
  .page-title:has(> .page-ic) {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .page-title > .page-ic {
    width: 42px;
    height: 42px;
    border-radius: 12px;
  }
  .page-title > .page-ic .i {
    width: 23px;
    height: 23px;
  }
  .sheet-head h3:has(> .sh-ic) {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .sh-ic {
    flex: none;
    width: 30px;
    height: 30px;
    padding: 6px;
    border-radius: 9px;
    background: var(--rv-accent-soft);
    color: var(--rv-accent-ink, var(--rv-accent));
  }
  .text-btn:has(> .i) {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .text-btn > .i {
    width: 16px;
    height: 16px;
    flex: none;
  }
  .text-btn.inline:has(> .i) {
    vertical-align: middle;
  }
  .pick > .i + span {
    min-width: 0;
  }
  .toast button,
  .cam-done {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .toast button .i,
  .cam-done .i {
    width: 18px;
    height: 18px;
  }
  /* every card with a heading folds: a tap on the heading, the arrow at the end (kept on the device) */
  .panel.dobra > .mais-head {
    cursor: pointer;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  .panel.dobra > .mais-head::after {
    content: "";
    flex: none;
    width: 20px;
    height: 20px;
    margin-left: auto;
    background: var(--rv-muted);
    -webkit-mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") center / 20px no-repeat;
    mask: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") center / 20px no-repeat;
    transition: transform 0.2s;
  }
  .panel.dobra > .mais-head:has(> .mh-count)::after {
    margin-left: 0;
  }
  .panel.dobra.fechada > .mais-head::after {
    transform: rotate(-90deg);
  }
  .panel.dobra.fechada > :not(.mais-head) {
    display: none !important;
  }
  .panel.dobra.fechada > .mais-head {
    padding-bottom: 16px;
  }
  .panel.dobra > .mais-head:focus-visible {
    outline: 2px solid var(--rv-accent);
    outline-offset: 2px;
    border-radius: 10px;
  }
  /* Sensores no Home Assistant: the entities, one per line, in the box under Criar sensores (like the ResolvIA) */
  .sensor-list {
    display: grid;
    gap: 2px;
  }
  .sub-box.sensor-list {
    padding: 4px 14px;
  }
  .sensor-row {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 10px;
    padding: 9px 0;
    border-top: 1px solid var(--rv-line);
    font-size: 13.5px;
    color: var(--rv-muted);
  }
  .sensor-row:first-child {
    border-top: 0;
  }
  .sensor-row code {
    font-size: 13px;
    padding: 1px 6px;
    border-radius: 6px;
    background: var(--rv-bg);
    color: var(--rv-text);
    overflow-wrap: anywhere;
  }
  /* 1.23.0: three buttons (Colar, Como está, Organizar): the two first side by side and the main one under them, all
     of the same height, as in the other apps */
  .sheet-actions.tri {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
  }
  .sheet-actions.tri > .btn {
    min-width: 0;
    white-space: nowrap;
  }
  .sheet-actions.tri > .btn.primary {
    grid-column: 1 / -1;
  }
`;var si="https://github.com/diegozapella63",Ns=[["CronologIA","cronologia-ha","calendar-days","Agenda da fam\xEDlia, rem\xE9dios, rotinas e placar."],["ResolvIA","resolvia-ha","list-checks","Listas de tarefas com prazos, pontos e repeti\xE7\xE3o."],["GerencIA","gerencia-ha","wallet","Finan\xE7as da casa: caixa, cart\xF5es e investimentos."],["InventarIA","inventario-ha","package","Invent\xE1rio da casa: c\xF4modos, itens e valores."],["EconomIA","economia-ha","receipt","Lista de compras com o melhor pre\xE7o perto de casa."],["MemorIA","memoria-ha","book-open","Cadernos de anota\xE7\xE3o que abrem na hora certa."],["CorrerIA","correria-ha","message-circle","Pergunte e pe\xE7a a qualquer app, no chat ou no WhatsApp."]],wt=s=>c`<svg class="i" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_t(K[s]||K.info)}</svg>`,Is=s=>c`<span class="ab-wm">${s.slice(0,-2)}<span>${s.slice(-2)}</span></span>`,ri=(s,t,e)=>c`<a class=${e} href=${s} target="_blank" rel="noopener">${t}</a>`;function oi({app:s,version:t}){return c`<div class="about">
    <div class="about-hero">
      <span class="ab-mark" aria-hidden="true">${wt("zap")}</span>
      <h2 class="ab-name">Correr<span>IA</span> Code</h2>
      <p class="ab-what">desenvolvimento de softwares</p>
      <p class="ab-tag">Feito na correria, rodado pela IA.</p>
    </div>

    <div class="panel about-why">
      <div class="mais-head"><span class="mais-ic" aria-hidden="true">${wt("hourglass")}</span><h2>Por que CorrerIA?</h2></div>
      <p>Porque eu sou um programador sem tempo: vivo na correria. Então eu uso a IA para rodar tudo isso aqui. Ela escreve, testa e publica; eu dou as ideias e reclamo dos botões tortos.</p>
    </div>

    <div class="panel">
      <div class="mais-head"><span class="mais-ic" aria-hidden="true">${wt("layers")}</span><h2>Os apps</h2></div>
      <ul class="about-apps" aria-label="Os apps">
        ${Ns.map(([e,a,i,r])=>c`<li>
            ${ri(`${si}/${a}`,c`<span class="mais-ic" aria-hidden="true">${wt(i)}</span>
                <span class="mb"><b class="ab-app">${Is(e)}${e===s?c`<em class="ab-here">Este app · v${t}</em>`:""}</b><span>${r}</span></span>
                ${wt("external-link")}`,`ab-row${e===s?" here":""}`)}
          </li>`)}
      </ul>
    </div>

    ${ri(si,c`${wt("external-link")}Meu GitHub`,"btn primary ab-github")}
  </div>`}var ni=It`
  .about-hero {
    position: relative;
    overflow: hidden;
    text-align: center;
    padding: 30px 20px 26px;
    margin-bottom: 18px;
    border-radius: 22px;
    border: 1px solid var(--rv-line);
    background:
      radial-gradient(120% 90% at 50% 0%, var(--rv-accent-soft), transparent 70%),
      var(--rv-surface);
  }
  .ab-mark {
    display: inline-grid;
    place-items: center;
    width: 58px;
    height: 58px;
    border-radius: 18px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    transform: rotate(-8deg);
    box-shadow: 0 10px 24px -12px var(--rv-accent);
  }
  .ab-mark .i {
    width: 30px;
    height: 30px;
    fill: currentColor;
    stroke-width: 1.4;
  }
  .ab-name {
    margin: 16px 0 4px;
    font-family: var(--rv-display);
    font-size: 34px;
    font-weight: 700;
    line-height: 1.05;
    color: var(--rv-text);
  }
  .ab-name span,
  .ab-wm span {
    color: var(--rv-accent-ink);
  }
  .ab-what {
    margin: 0;
    color: var(--rv-muted);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.14em;
    text-transform: uppercase;
  }
  @media (max-width: 360px) {
    .ab-what {
      font-size: 11px;
      letter-spacing: 0.06em;
    }
  }
  .ab-tag {
    margin: 14px 0 0;
    color: var(--rv-text);
    font-size: 16px;
    font-style: italic;
  }
  .about-why p {
    margin: 0 0 16px;
    color: var(--rv-text);
    font-size: 15.5px;
    line-height: 1.55;
  }
  .about-apps {
    list-style: none;
    margin: 0 0 6px;
    padding: 0;
  }
  .ab-row {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 68px;
    padding: 10px 0;
    color: inherit;
    text-decoration: none;
    border-top: 1px solid var(--rv-line);
  }
  .about-apps > li:first-child > .ab-row {
    border-top: 0;
  }
  .ab-row .mb {
    flex: 1;
    min-width: 0;
    display: grid;
    gap: 2px;
  }
  .ab-row b {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 8px;
    font-family: var(--rv-display);
    font-size: 18px;
    font-weight: 600;
    line-height: 1.2;
  }
  .ab-row .mb > span {
    color: var(--rv-muted);
    font-size: 14px;
    line-height: 1.35;
  }
  .ab-row > .i {
    flex: none;
    width: 18px;
    height: 18px;
    color: var(--rv-faint);
  }
  .ab-here {
    font-family: var(--rv-body, inherit);
    font-size: 12px;
    font-style: normal;
    font-weight: 600;
    color: var(--rv-accent-ink);
    background: var(--rv-accent-soft);
    border-radius: 999px;
    padding: 2px 8px;
  }
  @media (hover: hover) {
    .ab-row:hover b {
      color: var(--rv-accent-ink);
    }
  }
  .ab-github {
    display: flex;
    width: 100%;
    margin: 4px 0 8px;
    text-decoration: none;
  }
  .ab-github .i {
    width: 19px;
    height: 19px;
  }
`;var He="M8 0h20a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H8L0 13V7z",Vs="M9.7 10a2.7 2.7 0 1 0-5.4 0a2.7 2.7 0 1 0 5.4 0z";function li(s,t=new Date){let e=s.filter(i=>i.id!=="grafite"),a=Math.floor(Date.UTC(t.getFullYear(),t.getMonth(),t.getDate())/864e5);return e[(a%e.length+e.length)%e.length]}function ci({theme:s,onTheme:t,icon:e}){return c`<div class="seg themes" role="radiogroup" aria-label="Tema">
    ${[["auto","Sistema","smartphone"],["light","Claro","sun"],["dark","Escuro","moon"]].map(([a,i,r])=>c`<button type="button" class=${s===a?"on":""} role="radio" aria-checked=${s===a?"true":"false"} @click=${()=>t(a)}>${e(r)}<span>${i}</span></button>`)}
  </div>`}function hi({palette:s,value:t,onPick:e}){return c`<div class="tag-swatches" role="radiogroup" aria-label="Cor do app">
    ${s.map(a=>c`<button type="button" class="tsw ${t===a.id?"on":""}" role="radio" aria-checked=${t===a.id?"true":"false"} style="--a:${a.fill}" @click=${()=>e(a.id)}>
        <svg viewBox="-5 -5 40 30" aria-hidden="true"><path class="sw-ring" d=${He}></path><path class="sw-gap" d=${He}></path><path class="sw-fill" d=${He+Vs}></path><path class="sw-check" d="m14.6 10.3 3.2 3.2 6.5-6.9"></path></svg>
        <span>${a.label}</span>
      </button>`)}
  </div>`}var pi=`
  .seg.themes { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); width: 100%; margin: 2px 0 18px; }
  .seg.themes { min-height: 50px; }
  .seg.themes button { display: flex; flex-direction: row; align-items: center; justify-content: center; gap: 7px; height: auto; min-height: 0; padding: 0 6px; font-size: 15px; }
  .seg.themes button .i { width: 18px; height: 18px; margin: 0; flex: none; }
  @media (max-width: 380px) { .seg.themes button .i { display: none; } }
  .seg.themes button.on .i { color: var(--rv-accent-ink); }
  .tag-swatches { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 4px; margin: 0 -6px 14px; }
  .tsw { --sw-bg: var(--rv-surface); position: relative; display: grid; justify-items: center; gap: 4px; padding: 8px 2px 7px; border-radius: 10px; background: var(--sw-bg); cursor: pointer; -webkit-tap-highlight-color: transparent; min-width: 0; }
  @media (hover: hover) { .tsw:hover { --sw-bg: var(--rv-surface-2); } }
  .tsw svg { width: 48px; height: 36px; overflow: visible; }
  .tsw .sw-fill { fill: var(--a); fill-rule: evenodd; stroke: color-mix(in srgb, var(--a) 80%, #000); stroke-width: 1; }
  .tsw .sw-ring, .tsw .sw-gap, .tsw .sw-check { fill: none; stroke-linejoin: round; stroke-linecap: round; visibility: hidden; }
  .tsw .sw-ring { stroke: var(--rv-text); stroke-width: 7; }
  .tsw .sw-gap { stroke: var(--sw-bg); stroke-width: 3.6; }
  .tsw .sw-check { stroke: rgba(20, 20, 20, 0.85); stroke-width: 2.4; }
  .tsw span { font-size: 13px; line-height: 1.2; color: var(--rv-muted); white-space: nowrap; letter-spacing: -0.01em; }
  @media (max-width: 420px) { .tsw span { font-size: 12px; } .tag-swatches { margin: 0 -10px 14px; gap: 2px; } }
  .tsw.on .sw-ring, .tsw.on .sw-gap, .tsw.on .sw-check { visibility: visible; }
  .tsw.on span { color: var(--rv-text); font-weight: 600; }
  .tsw:focus-visible { outline: 2px solid var(--rv-accent); outline-offset: 0; }
`;var Hs="(min-width: 1000px)";function di(s,t=""){if(!s.touches||s.touches.length!==1||window.matchMedia&&window.matchMedia(Hs).matches)return null;let e=s.touches[0];if(e.clientX<24||e.clientX>window.innerWidth-24)return null;let a=`input, textarea, select, [contenteditable], .grip, [data-noswipe]${t?`, ${t}`:""}`;for(let i of s.composedPath()){if(i===s.currentTarget)break;if(!(i instanceof Element))continue;if(i.matches(a))return null;let r=getComputedStyle(i);if((r.overflowX==="auto"||r.overflowX==="scroll")&&i.scrollWidth>i.clientWidth+2)return null}return{x:e.clientX,y:e.clientY,at:Date.now()}}function ui(s,t){if(!t||!s.changedTouches||!s.changedTouches.length)return 0;let e=s.changedTouches[0],a=e.clientX-t.x,i=e.clientY-t.y;return Math.abs(a)<70||Math.abs(a)<Math.abs(i)*2||Date.now()-t.at>800?0:a<0?1:-1}async function Le(s,t,e){for(let i=0;i<30&&s._view().name!==t;i++)await new Promise(r=>setTimeout(r,16));await s.updateComplete;let a=s.renderRoot.querySelector("main > .page, main > section");!a||!a.animate||window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches||a.animate([{opacity:0,transform:`translateX(${e>0?40:-40}px)`},{opacity:1,transform:"none"}],{duration:280,easing:"cubic-bezier(0.2, 0.8, 0.2, 1)"})}var U={quick:!1,editing:null,menu:!1},mi=4;async function le(s,t=[]){let e=t.slice(),a=r=>new Promise((o,n)=>{let l=new FileReader;l.onload=()=>o(String(l.result).split(",")[1]||""),l.onerror=()=>n(l.error),l.readAsDataURL(r)}),i=[];for(let r of Array.from(s||[])){if(r.type==="application/pdf"||/\.pdf$/i.test(r.name||"")){if(r.size>15*1024*1024){i.push("Arquivo grande demais (at\xE9 15 MB).");continue}e=[{nome:r.name||"arquivo.pdf",pdf:!0,mime:"application/pdf",data:await a(r),url:""}];continue}if(r.type&&!/^image\//.test(r.type)){i.push("Escolha uma foto ou um PDF.");continue}if(e.length>=mi||e.some(n=>n.pdf))if(e.some(n=>n.pdf))e=[];else{i.push(`At\xE9 ${mi} arquivos por mensagem.`);break}try{let n=await createImageBitmap(r,{imageOrientation:"from-image"}),l=Math.min(1,1600/Math.max(n.width,n.height)),h=document.createElement("canvas");h.width=Math.max(1,Math.round(n.width*l)),h.height=Math.max(1,Math.round(n.height*l));let u=h.getContext("2d");u.fillStyle="#fff",u.fillRect(0,0,h.width,h.height),u.drawImage(n,0,0,h.width,h.height),n.close&&n.close();let d=await new Promise(f=>h.toBlob(f,"image/jpeg",.86));e.push({nome:r.name||`Foto ${e.length+1}.jpg`,pdf:!1,mime:"image/jpeg",data:await a(d),url:URL.createObjectURL(d)})}catch{i.push("N\xE3o deu para abrir esta foto. Use JPG ou PNG.")}}return{files:e,error:i[0]||""}}function Ls(s,t=[]){try{let e=JSON.parse(localStorage.getItem(`${s}-perguntas`)||"null");if(Array.isArray(e))return e.filter(a=>typeof a=="string"&&a.trim())}catch{}return t}function fi(s,t){try{t==null?localStorage.removeItem(`${s}-perguntas`):localStorage.setItem(`${s}-perguntas`,JSON.stringify(t))}catch{}}function gi({lit:s,icon:t,app:e="",messages:a=[],draft:i="",busy:r=!1,error:o="",voice:n=null,examples:l=[],files:h=[],onDraft:u,onSend:d,onMic:f,onAction:g,onAll:x,onClear:w,onClose:M,onAttach:P=null,onFileRemove:_=()=>{},onRedraw:I=()=>{}}){let{html:C,nothing:F}=s,at=()=>{let k=(i||"").trim();(k||h.length)&&!r&&d(k)},v=e?Ls(e,l):l,b=k=>(Object.assign(U,k),I()),y=k=>{b({quick:!1}),d(k)},$=()=>{let k=U.editing;if(k){let V=E=>{let J=(k.draft||"").trim(),W=E&&E.closest(".chat-ed-new")&&E.closest(".chat-ed-new").querySelector("input");W&&(W.value=""),J&&b({editing:{list:[...k.list,J],draft:""}})};return C`<div class="chat-ed">
        <span class="chat-ed-h">${t("pencil")}Perguntas prontas</span>
        ${k.list.map((E,J)=>C`<div class="chat-ed-row"><span>${E}</span><button type="button" class="icon-btn" aria-label=${`Tirar \u201C${E}\u201D`} @click=${()=>b({editing:{...k,list:k.list.filter((W,Ae)=>Ae!==J)}})}>${t("x")}</button></div>`)}
        <div class="chat-ed-new">
          <input type="text" maxlength="120" .value=${k.draft||""} placeholder="Nova pergunta" aria-label="Nova pergunta" enterkeyhint="done"
            @input=${E=>k.draft=E.target.value} @keydown=${E=>{E.key==="Enter"&&(E.preventDefault(),V(E.target))}} />
          <button type="button" class="btn outline sm" @click=${E=>V(E.currentTarget)}>${t("plus")}Adicionar</button>
        </div>
        <div class="chat-ed-acts">
          <button type="button" class="btn outline sm" @click=${()=>(fi(e,null),b({editing:{list:l.slice(),draft:""}}))}>${t("rotate-ccw")}Padrão</button>
          <button type="button" class="btn primary sm" @click=${()=>{let E=k.list.concat((k.draft||"").trim()?[(k.draft||"").trim()]:[]);fi(e,E.join(`
`)===l.join(`
`)?null:E),b({editing:null})}}>${t("check")}Pronto</button>
        </div>
      </div>`}return C`<div class="chat-ex">${v.map(V=>C`<button type="button" class="pick" @click=${()=>y(V)}>${t("sparkles")}<span>${V}</span></button>`)}</div>
      ${e?C`<button type="button" class="text-btn chat-ed-open" @click=${()=>b({editing:{list:v.slice(),draft:""}})}>${t("pencil")}Editar perguntas</button>`:F}`},T=(k,V,E,J)=>C`<div class="chat-act ${E.state||"todo"}">
    <span class="chat-act-ic">${t(E.state==="done"?"check":E.state==="failed"?"circle-alert":E.icon||"sparkles")}</span>
    <span class="chat-act-tx">${E.label}${E.note?C`<small>${E.note}</small>`:F}</span>
    ${E.state==="done"?C`<span class="chat-act-ok">Feito</span>`:E.state==="doing"?C`<span class="chat-act-ok">…</span>`:C`<button type="button" class="btn primary sm" @click=${()=>g(V,J)}>${t(E.state==="failed"?"rotate-ccw":"check")}${E.state==="failed"?"Tentar de novo":"Fazer"}</button>`}
  </div>`,A=(k,V)=>{let E=(k.actions||[]).filter(W=>W.state!=="done"&&W.state!=="doing").length,J=k.role==="user"&&Array.isArray(k.anexos)?k.anexos:[];return C`<div class="chat-msg ${k.role==="user"?"me":"ia"}">
      ${k.text||J.length?C`<div class="chat-bubble">${J.map(W=>C`<span class="chat-arq">${t("paperclip")}${W}</span>`)}${k.text||""}</div>`:F}
      ${(k.actions||[]).length?C`<div class="chat-acts">
            ${k.actions.map((W,Ae)=>T(k,V,W,Ae))}
            ${E>1?C`<button type="button" class="btn outline sm chat-all" @click=${()=>x(V)}>${t("check")}Fazer todas (${E})</button>`:F}
          </div>`:F}
    </div>`},D=n&&n.on,ct=!!P&&!D,Y=ct&&U.menu,S=k=>(b({menu:!1}),P(k)),R=!!(n&&n.ready)&&(D||!(i||"").trim()&&!h.length);return C`<div class="chat">
    <div class="chat-head">
      <span class="chat-title">${t("message-circle")}Conversa</span>
      ${a.length?C`<button type="button" class="text-btn chat-nova" aria-label="Nova conversa" @click=${()=>w()}>${t("plus")}<span>Nova conversa</span></button>`:F}
      <button type="button" class="icon-btn" aria-label="Fechar" @click=${()=>M()}>${t("x")}</button>
    </div>
    <div class="chat-log">
      ${a.length?a.map(A):v.length||e?C`<div class="chat-empty">${$()}</div>`:F}
      ${r?C`<div class="chat-msg ia"><div class="chat-bubble typing"><i></i><i></i><i></i></div></div>`:F}
      ${o?C`<div class="chat-error">${t("circle-alert")}<span>${o}</span></div>`:F}
    </div>
    ${a.length&&(U.quick||U.editing)?C`<div class="chat-quick">${$()}</div>`:F}
    ${Y?C`<div class="chat-menu" role="menu">
          <button type="button" class="chat-op" role="menuitem" @click=${()=>S("camera")}>${t("camera")}Tirar foto</button>
          <button type="button" class="chat-op" role="menuitem" @click=${()=>S("fotos")}>${t("images")}Escolher fotos</button>
          <button type="button" class="chat-op" role="menuitem" @click=${()=>S("arquivo")}>${t("file-text")}Escolher arquivo</button>
        </div>`:F}
    ${h.length?C`<div class="chat-files">${h.map((k,V)=>C`<div class="chat-file">${k.pdf?C`<span class="chat-pdf">${t("file-text")}</span>`:C`<img src=${k.url} alt="" />`}<span class="chat-file-n">${k.nome}</span><button type="button" class="icon-btn" aria-label=${`Tirar ${k.nome}`} @click=${()=>_(V)}>${t("x")}</button></div>`)}</div>`:F}
    <form class="chat-input" @submit=${k=>(k.preventDefault(),at())}>
      ${ct?C`<button type="button" class="icon-btn chat-clip ${Y?"on":""}" aria-label="Anexar" title="Anexar" aria-expanded=${Y?"true":"false"} ?disabled=${r} @click=${()=>b({menu:!U.menu,quick:!1,editing:null})}>${t("paperclip")}</button>`:F}
      <textarea rows="1" data-size="off" .value=${i} placeholder=${D?"Ouvindo\u2026":"Pergunte o que quiser"} aria-label="Mensagem para a IA" ?disabled=${D}
        @input=${k=>u(k.target.value)}
        @keydown=${k=>{k.key==="Enter"&&!k.shiftKey&&!k.isComposing&&(k.preventDefault(),at())}}></textarea>
      ${a.length&&(v.length||e)&&!D?C`<button type="button" class="icon-btn chat-qbtn ${U.quick||U.editing?"on":""}" aria-label="Perguntas prontas" aria-expanded=${U.quick||U.editing?"true":"false"} title="Perguntas prontas" @click=${()=>b({quick:!(U.quick||U.editing),editing:null,menu:!1})}>${t("sparkles")}</button>`:F}
      ${R?C`<button type="button" class="icon-btn chat-mic ${D?"on":""}" aria-label=${D?"Pronto: enviar o que falei":"Falar"} ?disabled=${r||n.starting} @click=${()=>f()}>${t(D?"check":"mic")}</button>`:C`<button type="submit" class="icon-btn chat-send" aria-label="Enviar" ?disabled=${r||D||!((i||"").trim()||h.length)}>${t("send")}</button>`}
    </form>
  </div>`}var vi=`
  .chat { display: flex; flex-direction: column; height: min(78vh, 680px); margin: -4px -4px 0; }
  .chat-head { display: flex; align-items: center; gap: 10px; padding: 0 0 10px; }
  .chat-title { display: inline-flex; align-items: center; gap: 8px; flex: 1; font-weight: 700; font-size: 18px; }
  .chat-title .i { width: 30px; height: 30px; padding: 6px; border-radius: 9px; background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-head .text-btn { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  @media (max-width: 340px) { .chat-nova span { display: none; } }
  .chat-head .text-btn .i { width: 16px; height: 16px; }
  .chat-log { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 10px; padding: 6px 2px 12px; overscroll-behavior: contain; }
  .chat-empty { margin: auto 0 0; color: var(--rv-muted); font-size: 15px; line-height: 1.45; }
  .chat-empty p { margin: 0 0 12px; }
  .chat-ex { display: flex; flex-wrap: wrap; gap: 8px; }
  .chat-ex .pick { font-size: 14px; padding: 8px 12px; min-height: 0; display: inline-flex; align-items: center; gap: 6px; }
  .chat-ex .pick .i { width: 16px; height: 16px; flex: none; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-msg { display: flex; flex-direction: column; gap: 6px; max-width: 88%; }
  .chat-msg.me { align-self: flex-end; align-items: flex-end; }
  .chat-msg.ia { align-self: flex-start; }
  .chat-bubble { padding: 10px 14px; border-radius: 18px; font-size: 15.5px; line-height: 1.42; white-space: pre-wrap; overflow-wrap: anywhere; }
  .chat-msg.me .chat-bubble { background: var(--rv-accent); color: var(--rv-on-accent, #fff); border-bottom-right-radius: 6px; }
  .chat-msg.ia .chat-bubble { background: color-mix(in srgb, var(--rv-muted) 14%, transparent); color: var(--rv-text); border-bottom-left-radius: 6px; }
  .chat-bubble.typing { display: inline-flex; gap: 5px; padding: 14px 16px; }
  .chat-bubble.typing i { width: 7px; height: 7px; border-radius: 50%; background: var(--rv-muted); animation: chat-dot 1.2s infinite ease-in-out; }
  .chat-bubble.typing i:nth-child(2) { animation-delay: 0.15s; }
  .chat-bubble.typing i:nth-child(3) { animation-delay: 0.3s; }
  @keyframes chat-dot { 0%, 80%, 100% { opacity: 0.25; transform: translateY(0); } 40% { opacity: 1; transform: translateY(-3px); } }
  .chat-acts { display: grid; gap: 8px; width: 100%; min-width: min(300px, 80vw); }
  .chat-act { display: flex; align-items: center; gap: 10px; padding: 8px 8px 8px 10px; border-radius: 14px; border: 1.5px solid var(--rv-line); }
  .chat-act.done { opacity: 0.7; }
  .chat-act.failed { border-color: var(--rv-late, #e5484d); }
  .chat-act-ic { width: 30px; height: 30px; border-radius: 9px; display: grid; place-items: center; flex: none; background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-act-ic .i { width: 16px; height: 16px; }
  .chat-act-tx { flex: 1; min-width: 0; display: flex; flex-direction: column; font-size: 14.5px; font-weight: 600; }
  .chat-act-tx small { font-weight: 400; font-size: 12.5px; color: var(--rv-muted); }
  .chat-act-ok { font-size: 13px; font-weight: 600; color: var(--rv-muted); padding: 0 8px; }
  .chat-act .btn.sm { min-height: 36px; padding: 0 14px; gap: 6px; }
  .chat-act .btn.sm .i, .chat-all .i { width: 16px; height: 16px; }
  .chat-all { justify-self: start; }
  .chat-error { display: flex; gap: 8px; align-items: flex-start; font-size: 14px; color: var(--rv-late, #e5484d); }
  .chat-error .i { width: 18px; height: 18px; flex: none; }
  .chat-input { display: flex; align-items: flex-end; gap: 8px; padding-top: 10px; border-top: 1px solid var(--rv-line); }
  .chat-input textarea { flex: 1; min-width: 0; resize: none; max-height: 120px; min-height: 46px; padding: 12px 14px; border-radius: 16px; border: 1.5px solid var(--rv-line-strong, var(--rv-line)); background: var(--rv-input-bg, transparent); color: var(--rv-text); font: inherit; font-size: 16px; line-height: 1.35; field-sizing: content; }
  .chat-input textarea:focus { outline: none; border-color: var(--rv-accent); }
  .chat-input .icon-btn { width: 46px; height: 46px; flex: none; border-radius: 14px; }
  .chat-send { background: var(--rv-accent); color: var(--rv-on-accent, #fff); }
  .chat-send:disabled { opacity: 0.4; }
  .chat-mic.on { background: var(--rv-late, #e5484d); color: #fff; }
  .chat-qbtn.on, .chat-clip.on { background: var(--rv-accent-soft); color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-input textarea::placeholder { white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .chat-menu { display: grid; gap: 2px; margin-top: 8px; padding: 6px; border-radius: 16px; border: 1.5px solid var(--rv-line); }
  .chat-op { display: flex; align-items: center; gap: 12px; min-height: 50px; padding: 0 12px; border-radius: 12px; font: inherit; font-size: 16px; color: var(--rv-text); text-align: left; background: none; border: 0; cursor: pointer; }
  .chat-op:active { background: var(--rv-accent-soft); }
  .chat-op .i { width: 20px; height: 20px; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-files { display: grid; gap: 6px; margin-top: 8px; }
  .chat-file { display: flex; align-items: center; gap: 10px; padding: 4px 4px 4px 6px; border-radius: 12px; border: 1.5px solid var(--rv-line); font-size: 14px; }
  .chat-file img, .chat-file .chat-pdf { width: 36px; height: 36px; border-radius: 8px; object-fit: cover; flex: none; display: grid; place-items: center; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-file-n { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .chat-file .icon-btn { width: 36px; height: 36px; flex: none; }
  .chat-arq { display: flex; align-items: center; gap: 6px; font-weight: 600; font-size: 14px; }
  .chat-arq .i { width: 15px; height: 15px; flex: none; }
  .chat-quick { max-height: 42vh; overflow-y: auto; padding: 10px 2px; border-top: 1px solid var(--rv-line); }
  .chat-ed-open { display: inline-flex; align-items: center; gap: 6px; margin-top: 10px; }
  .chat-ed-open .i { width: 16px; height: 16px; }
  .chat-ed { display: grid; gap: 8px; color: var(--rv-text); }
  .chat-ed-h { display: inline-flex; align-items: center; gap: 8px; font-weight: 700; font-size: 15px; }
  .chat-ed-h .i { width: 18px; height: 18px; color: var(--rv-accent-ink, var(--rv-accent)); }
  .chat-ed-row { display: flex; align-items: center; gap: 8px; padding: 4px 0 4px 12px; border-radius: 12px; border: 1.5px solid var(--rv-line); font-size: 14.5px; }
  .chat-ed-row span { flex: 1; min-width: 0; overflow-wrap: anywhere; }
  .chat-ed-row .icon-btn { width: 40px; height: 40px; flex: none; }
  .chat-ed-new { display: flex; gap: 8px; }
  .chat-ed-new input { flex: 1; min-width: 0; min-height: 44px; padding: 0 12px; border-radius: 12px; border: 1.5px solid var(--rv-line-strong, var(--rv-line)); background: var(--rv-input-bg, transparent); color: var(--rv-text); font: inherit; font-size: 15px; }
  .chat-ed-new input:focus { outline: none; border-color: var(--rv-accent); }
  .chat-ed-acts { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .chat-ed .btn.sm { min-height: 44px; justify-content: center; gap: 6px; }
  .chat-ed .btn.sm .i { width: 16px; height: 16px; }
`;var xi=["dom","seg","ter","qua","qui","sex","s\xE1b"],bi={mensagem:"Mensagens",fotos:"Fotos",sugestao:"Sugest\xF5es",conversa:"Conversa"},_i={erro:"erro",cota:"sem cota",formato:"resposta fora do formato"},nt=s=>String(s).padStart(2,"0"),Be=s=>`${s.getFullYear()}-${nt(s.getMonth()+1)}-${nt(s.getDate())}`,ce=s=>{let[t,e,a]=s.split("-").map(Number);return new Date(t,e-1,a)},ki=s=>String(Math.round(s*10)/10).replace(".",","),wi=s=>s>=1e3?`${ki(s/1e3)} mil`:String(Math.round(s||0)),yi=s=>`${s} ${s===1?"chamada":"chamadas"}`,Bs=(s,t={})=>t[s]||(s||"").replace(/^ai_task\./,"").replace(/_/g," ")||"padr\xE3o do Home Assistant",Us=(s,t)=>{let e=new Date(s);if(!Number.isFinite(e.getTime()))return"";let a=`${nt(e.getHours())}:${nt(e.getMinutes())}`;return Be(e)===Be(t)?`hoje ${a}`:`${nt(e.getDate())}/${nt(e.getMonth()+1)} ${a}`};function js(s){let t=s.join(" ").toLowerCase();return/google|gemini/.test(t)?c`Consumo exato e cota: <a href="https://console.cloud.google.com/apis/dashboard" target="_blank" rel="noopener">Google Cloud Console</a>.`:/openai|chatgpt|gpt/.test(t)?c`Consumo exato e custo: <a href="https://platform.openai.com/usage" target="_blank" rel="noopener">platform.openai.com/usage</a>.`:/anthropic|claude/.test(t)?c`Consumo exato e custo: <a href="https://platform.claude.com/usage" target="_blank" rel="noopener">Claude Console</a>.`:"O consumo exato fica no painel do provedor da IA."}function $i({u:s,day:t,onDay:e,head:a,app:i,using:r="",names:o={}}){if(!s||!s.hoje)return c`<div class="panel uso-panel" id="uso-ia">${a}<p class="panel-lead">Carregando…</p></div>`;let n=new Date,l=Be(n),h=_=>_.cota?c`<span class="s alert">${_.cota} ${_.cota>1?"vezes":"vez"} sem cota</span>`:_.erros?c`<span class="s alert">${_.erros} com erro</span>`:c`<span class="s">≈ ${wi(_.tokens)} tokens</span>`,u=(_,I)=>c`<div class="uso-tile"><span class="k">${_}</span><span class="v">${I.chamadas||0}</span>${h(I)}</div>`,d=s.dias||[],f=Math.max(1,...d.map(_=>_.chamadas||0)),g=d.find(_=>_.dia===t)||d.find(_=>_.dia===l)||{dia:l,chamadas:0,erros:0,cota:0},x=_=>_.dia===l?"hoje":xi[ce(_.dia).getDay()],w=s.semana&&s.semana.tipos||{},M=[...Object.keys(s.mes&&s.mes.ias||{}),...Object.keys(s.semana&&s.semana.ias||{}),r],P=s.ultimas||[];return c`<div class="panel uso-panel" id="uso-ia">
    ${a}
    <div class="uso-tiles">${u("Hoje",s.hoje)}${u("7 dias",s.semana)}${u("Este m\xEAs",s.mes)}</div>
    <div class="uso-chart" role="group" aria-label="Chamadas de IA nos últimos 7 dias">
      ${d.map(_=>{let I=_.chamadas?Math.max(4,Math.round(_.chamadas/f*100)):0;return c`<button type="button" class="uso-bar ${_.dia===l?"today":""}" aria-pressed=${_.dia===g.dia?"true":"false"} aria-label="${x(_)}: ${yi(_.chamadas)}" @click=${()=>e(_.dia)}><i style="height:${I}%"></i></button>`})}
    </div>
    <div class="uso-days" aria-hidden="true">${d.map(_=>c`<span>${x(_)}</span>`)}</div>
    <p class="uso-cap" aria-live="polite">${g.dia===l?"Hoje":`${xi[ce(g.dia).getDay()]}, ${nt(ce(g.dia).getDate())}/${nt(ce(g.dia).getMonth()+1)}`}: <b>${yi(g.chamadas)}</b>${g.erros?`, ${g.erros} com erro`:""}${g.cota?`, ${g.cota} sem cota`:""}.</p>
    ${Object.keys(w).length?c`<ul class="uso-kinds">${Object.keys(w).sort((_,I)=>w[I]-w[_]).map(_=>c`<li>${bi[_]||_} <b>${w[_]}</b></li>`)}</ul>`:m}
    <details class="uso-last">
      <summary><svg class="uso-ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l4 2" /></svg><span>Últimas chamadas${P.length?` (${P.length})`:""}</span><svg class="uso-chev" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6" /></svg></summary>
      <ul>
        ${P.length?P.map(_=>c`<li><b>${bi[_.tipo]||_.tipo}</b><span>${Bs(_.ia,o)}</span>${_i[_.resultado]?c`<span class="r-err">${_i[_.resultado]}</span>`:m}
                <span class="t">${ki(_.segundos)} s · ≈ ${wi(_.tokens)} tokens${_.imagens?` \xB7 ${_.imagens} ${_.imagens>1?"imagens":"imagem"}`:""} · ${Us(_.quando,n)}</span></li>`):c`<li>Nenhuma chamada ainda.</li>`}
      </ul>
    </details>
    <p class="uso-note">${js(M)}</p>
  </div>`}var Si=`
  .uso-tiles { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; padding: 4px 0 12px; }
  .uso-tile { background: var(--rv-bg); border-radius: 12px; padding: 10px 12px; display: flex; flex-direction: column; gap: 2px; min-width: 0; }
  .uso-tile .k { font-size: 12px; font-weight: 600; letter-spacing: 0.06em; text-transform: uppercase; color: var(--rv-muted); }
  .uso-tile .v { font-family: var(--rv-display); font-weight: 700; font-size: 30px; line-height: 1.05; color: var(--rv-text); font-variant-numeric: tabular-nums; }
  .uso-tile .s { font-size: 12.5px; color: var(--rv-muted); line-height: 1.3; }
  .uso-tile .s.alert { color: var(--rv-late); font-weight: 600; }
  .uso-chart { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; align-items: end; height: 118px; padding-top: 6px; border-bottom: 1px solid var(--rv-line); }
  .uso-bar { display: flex; flex-direction: column; justify-content: flex-end; align-items: center; height: 100%; background: none; border: 0; padding: 0 4px; cursor: pointer; -webkit-tap-highlight-color: transparent; }
  .uso-bar i { display: block; width: 100%; max-width: 26px; min-height: 2px; border-radius: 4px 4px 0 0; background: var(--rv-accent); opacity: 0.45; }
  .uso-bar.today i, .uso-bar[aria-pressed="true"] i { opacity: 1; }
  .uso-bar:focus-visible { outline: 2px solid var(--rv-accent); outline-offset: 2px; border-radius: 4px; }
  .uso-days { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 2px; font-size: 12px; color: var(--rv-muted); text-align: center; padding-top: 4px; }
  .uso-cap { font-size: 13.5px; color: var(--rv-muted); margin: 0; padding: 8px 0 10px; }
  .uso-cap b { color: var(--rv-text); font-weight: 600; }
  .uso-kinds { display: flex; flex-wrap: wrap; gap: 5px; padding: 0 0 10px; margin: 0; list-style: none; }
  .uso-kinds li { font-size: 12.5px; padding: 2px 8px; border: 1px solid var(--rv-line); border-radius: 6px; color: var(--rv-muted); }
  .uso-kinds b { color: var(--rv-text); font-weight: 600; }
  .uso-last { padding: 2px 0 8px; }
  .uso-last summary { display: flex; align-items: center; gap: 8px; list-style: none; font-size: 14.5px; font-weight: 600; color: var(--rv-accent-ink); cursor: pointer; padding: 6px 0; }
  .uso-last summary::-webkit-details-marker { display: none; }
  .uso-last summary .uso-ic { width: 18px; height: 18px; flex: none; }
  .uso-last summary .uso-chev { width: 18px; height: 18px; flex: none; margin-left: auto; color: var(--rv-muted); transition: transform 0.2s; }
  .uso-last[open] summary .uso-chev { transform: rotate(180deg); }
  .uso-last ul { list-style: none; margin: 0; padding: 0; }
  .uso-last li { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: baseline; font-size: 13px; padding: 7px 0; border-top: 1px solid var(--rv-line); color: var(--rv-muted); }
  .uso-last li b { color: var(--rv-text); font-weight: 600; }
  .uso-last li .r-err { color: var(--rv-late); font-weight: 600; }
  .uso-last li .t { flex-basis: 100%; font-size: 12.5px; }
  .uso-note { font-size: 13px; line-height: 1.5; color: var(--rv-muted); margin: 0 0 10px; }
  .uso-note:last-child { margin-bottom: 16px; }
  .uso-note a { color: var(--rv-accent-ink); }
  .uso-note code { font-size: 12px; }
`;var yt=class{constructor(t){this.onLevel=t,this.chunks=[],this.length=0,this.rate=16e3}async start(){let t=navigator.mediaDevices;if(!t||!t.getUserMedia)throw Object.assign(new Error("no_api"),{name:"NoApi"});this.stream=await t.getUserMedia({audio:{channelCount:1,echoCancellation:!0,noiseSuppression:!0,autoGainControl:!0}});let e=window.AudioContext||window.webkitAudioContext;try{this.ctx=new e({sampleRate:16e3})}catch{this.ctx=new e}this.ctx.state==="suspended"&&await this.ctx.resume().catch(()=>{}),this.rate=this.ctx.sampleRate,this.src=this.ctx.createMediaStreamSource(this.stream),this.node=this.ctx.createScriptProcessor(4096,1,1),this.node.onaudioprocess=a=>{let i=a.inputBuffer.getChannelData(0);this.chunks.push(new Float32Array(i)),this.length+=i.length;let r=0;for(let o=0;o<i.length;o+=4)r+=i[o]*i[o];this.onLevel&&this.onLevel(Math.min(1,Math.sqrt(r/(i.length/4))*5))},this.src.connect(this.node),this.node.connect(this.ctx.destination)}seconds(){return this.length/this.rate}stop(){this._close();let t=new Float32Array(this.length),e=0;for(let o of this.chunks)t.set(o,e),e+=o.length;this.chunks=[];let a=this.rate/16e3,i=Math.floor(t.length/a),r=new Int16Array(i);for(let o=0;o<i;o++){let n=Math.floor(o*a),l=Math.max(n+1,Math.min(t.length,Math.floor((o+1)*a))),h=0;for(let d=n;d<l;d++)h+=t[d];let u=Math.max(-1,Math.min(1,h/(l-n)));r[o]=u<0?u*32768:u*32767}return r}cancel(){this._close(),this.chunks=[],this.length=0}_close(){try{this.node&&(this.node.onaudioprocess=null),this.src&&this.src.disconnect(),this.node&&this.node.disconnect()}catch{}if(this.stream)for(let t of this.stream.getTracks())t.stop();this.ctx&&this.ctx.state!=="closed"&&this.ctx.close().catch(()=>{}),this.stream=null,this.node=null,this.src=null}};function he(s){let t=s&&s.name||"";return t==="NotAllowedError"||t==="SecurityError"?"O microfone est\xE1 bloqueado. Permita o microfone para o Home Assistant (no navegador, no cadeado ao lado do endere\xE7o; no app do celular, nas permiss\xF5es do app Home Assistant) e tente de novo.":t==="NotFoundError"||t==="OverconstrainedError"?"N\xE3o achei um microfone neste aparelho.":t==="NotReadableError"?"O microfone est\xE1 sendo usado por outro app. Feche o outro e tente de novo.":t==="NoApi"?window.isSecureContext===!1?"O microfone aqui dentro s\xF3 funciona quando o Home Assistant \xE9 aberto por um endere\xE7o seguro (https), como o do Home Assistant Cloud ou o seu endere\xE7o externo. Neste endere\xE7o (http), o celular e o navegador n\xE3o deixam usar o microfone, nem pelo app do Home Assistant.":"Este navegador n\xE3o deixa usar o microfone aqui.":`N\xE3o consegui abrir o microfone (${s&&s.message||t||"erro"}).`}var ft=["vermelho","laranja","verde","azul","lilas"],de=ft.join("|"),Ue=()=>new RegExp(`\\*\\*(?=\\S)([^\\n]*?\\S)\\*\\*|\\+\\+(?=\\S)([^\\n]*?\\S)\\+\\+|\\{(${de}):([^{}\\n]+)\\}`,"g"),Mi={negrito:"**",maior:"++"},ue=s=>s.replace(/[*+]/g,"\\$&"),Vt=s=>Ue().test(String(s||""));function $t(s,t=0,e={}){let a=String(s||""),i=[],r=Ue(),o=0,n,l=(h,u)=>{u>h&&i.push({text:a.slice(h,u),start:t+h,bold:!!e.bold,big:!!e.big,color:e.color||""})};for(;n=r.exec(a);)l(o,n.index),n[1]!=null?i.push(...$t(n[1],t+n.index+2,{...e,bold:!0})):n[2]!=null?i.push(...$t(n[2],t+n.index+2,{...e,big:!0})):i.push(...$t(n[4],t+n.index+n[3].length+2,{...e,color:n[3]})),o=n.index+n[0].length;return l(o,a.length),i}function me(s,t={}){let e=String(s||""),a=[],i=Ue(),r=0,o,n=(l,h,u)=>l&&a.push({text:l,mark:h,bold:!!u.bold,big:!!u.big,color:u.color||""});for(;o=i.exec(e);){if(n(e.slice(r,o.index),!1,t),o[1]!=null||o[2]!=null){let l=o[1]!=null?"**":"++",h={...t,[o[1]!=null?"bold":"big"]:!0};n(l,!0,h),a.push(...me(o[1]!=null?o[1]:o[2],h)),n(l,!0,h)}else{let l={...t,color:o[3]};n(`{${o[3]}:`,!0,l),a.push(...me(o[4],l)),n("}",!0,l)}r=o.index+o[0].length}return n(e.slice(r),!1,t),a}var Ci=s=>$t(s).map(t=>t.text).join("");function Ai(s,t,e,a){let r=s.slice(t,e).split(`
`).map(o=>{let n=/^(\s*)([\s\S]*?)(\s*)$/.exec(o);return n[2]?n[1]+a(n[2])+n[3]:o}).join(`
`);return{text:s.slice(0,t)+r+s.slice(e),s:t,e:t+r.length}}function kt(s,t,e,a){s=String(s||""),t=Math.max(0,Math.min(t,s.length)),e=Math.max(t,Math.min(e,s.length));let i=s.slice(t,e),r=ft.includes(a)?a:"",o=Mi[a];if(o)return s.slice(t-2,t)===o&&s.slice(e,e+2)===o?{text:s.slice(0,t-2)+i+s.slice(e+2),s:t-2,e:e-2}:new RegExp(`^${ue(o)}[\\s\\S]+${ue(o)}$`).test(i)?{text:s.slice(0,t)+i.slice(2,-2)+s.slice(e),s:t,e:e-4}:t===e?{text:`${s.slice(0,t)}${o}${o}${s.slice(e)}`,s:t+2,e:t+2}:Ai(s,t,e,d=>`${o}${d}${o}`);if(!r&&a!=="sem-cor")return{text:s,s:t,e};let n=/\{([a-z]+):$/.exec(s.slice(Math.max(0,t-12),t));if(n&&ft.includes(n[1])&&s[e]==="}"){let d=t-n[0].length;if(!r||r===n[1])return{text:s.slice(0,d)+i+s.slice(e+1),s:d,e:d+i.length};let f=`{${r}:`;return{text:s.slice(0,d)+f+i+s.slice(e),s:d+f.length,e:d+f.length+i.length}}let l=new RegExp(`^\\{(${de}):([^{}\\n]+)\\}$`).exec(i);if(l){if(!r||r===l[1])return{text:s.slice(0,t)+l[2]+s.slice(e),s:t,e:t+l[2].length};let d=`{${r}:${l[2]}}`;return{text:s.slice(0,t)+d+s.slice(e),s:t,e:t+d.length}}let h=i.replace(new RegExp(`\\{(?:${de}):([^{}\\n]+)\\}`,"g"),"$1");if(!r)return{text:s.slice(0,t)+h+s.slice(e),s:t,e:t+h.length};if(t===e){let d=`{${r}:`;return{text:`${s.slice(0,t)}${d}}${s.slice(e)}`,s:t+d.length,e:t+d.length}}let u=s.slice(0,t)+h+s.slice(e);return Ai(u,t,t+h.length,d=>`{${r}:${d.replace(/[{}]/g,"")}}`)}var pe=/[\p{L}\p{M}\p{N}_]/u;function Ti(s,t,e){s=String(s||""),t=Math.max(0,Math.min(t,s.length));let a=ft.includes(e)?e:"",i=Mi[e];if(!i&&!a&&e!=="sem-cor")return{text:s,s:t,e:t};let r=i?new RegExp(`${ue(i)}(?=\\S)([^\\n]*?\\S)${ue(i)}`,"g"):new RegExp(`\\{(${de}):([^{}\\n]+)\\}`,"g"),o;for(;o=r.exec(s);){let f=o.index,g=f+o[0].length;if(t<f||t>g||t===f&&f>0&&pe.test(s[f-1])||t===g&&g<s.length&&pe.test(s[g]))continue;let x=i?2:o[1].length+2,w=i?o[1]:o[2],M=I=>Math.max(f,Math.min(f+w.length,I-x));if(i||!a||a===o[1])return{text:s.slice(0,f)+w+s.slice(g),s:M(t),e:M(t)};let P=`{${a}:${w}}`,_=t+(a.length-o[1].length);return{text:s.slice(0,f)+P+s.slice(g),s:Math.max(f,_),e:Math.max(f,_)}}if(!a&&e==="sem-cor")return{text:s,s:t,e:t};if(e==="maior"){let f=s.lastIndexOf(`
`,t-1)+1,g=s.indexOf(`
`,t)<0?s.length:s.indexOf(`
`,t),x=s.slice(f,g);if(!x.trim())return kt(s,t,t,e);let w=x.length-x.trimStart().length,M=kt(s,f+w,f+x.trimEnd().length,e),P=t<f+w?t:t+2;return{text:M.text,s:P,e:P}}let n=t,l=t;for(;n>0&&pe.test(s[n-1]);)n--;for(;l<s.length&&pe.test(s[l]);)l++;if(n===l)return kt(s,t,t,e);let h=kt(s,n,l,e),u=h.text.indexOf(s.slice(n,l),n)-n,d=t+Math.max(0,u);return{text:h.text,s:d,e:d}}var Ei=120,Ws=/[.,;:!?…'"»”’*]$/,fe=/\[([^[\]\n]{1,200})\]\((https?:\/\/[^\s()<>]+(?:\([^\s()<>]*\)[^\s()<>]*)*)\)|((?:https?:\/\/|www\.)[^\s<>"]+)/gi,ge=(s,t)=>s.split(t).length-1;function Ht(s){let t;try{t=new URL(s)}catch{return null}if(t.protocol!=="http:"&&t.protocol!=="https:")return null;let e=t.hostname;return!e||!e.includes(".")&&e!=="localhost"||e.split(".").some(a=>!a||/^-|-$/.test(a))?null:t.href}function Ys(s){let t=s;for(;;){let e=t.slice(-1);if(Ws.test(t))t=t.slice(0,-1);else if(e===")"&&ge(t,"(")<ge(t,")"))t=t.slice(0,-1);else if(e==="]"&&ge(t,"[")<ge(t,"]"))t=t.slice(0,-1);else break}return t}var Js=s=>{try{return decodeURIComponent(s)}catch{return s}},St=(s,t)=>s.length>t?`${s.slice(0,t-1).trimEnd()}\u2026`:s;function Zs(s){try{return new URL(s).hostname.replace(/^www\./,"")}catch{return""}}function Xs(s){let t;try{t=new URL(s)}catch{return St(String(s||""),32)}let e=t.host.replace(/^www\./,""),a=["q","query","search_query","p","k"].map(o=>t.searchParams.get(o)).find(o=>o&&o.trim());if(a)return St(`${e} \xB7 ${a.trim().replace(/\s+/g," ")}`,40);let i=t.pathname.split("/").filter(Boolean).map(Js);if(!i.length)return St(e+(t.search||t.hash?"/\u2026":""),36);let r=i.length>1?`${e}/\u2026/${i[i.length-1]}`:`${e}/${i[0]}`;return St(r+(r.length<36&&(t.search||t.hash)?"\u2026":""),36)}function ve(s){let t=String(s||""),e=[],a=0,i=o=>{o>a&&e.push({type:"text",text:t.slice(a,o),start:a})};fe.lastIndex=0;let r;for(;r=fe.exec(t);){let o=r.index,n=o+r[0].length,l=null,h="";if(r[2]){if(l=Ht(r[2]),h=r[1].replace(/\s+/g," ").trim(),!h||!l){fe.lastIndex=o+1;continue}}else{if(o>0&&/[\p{L}\p{N}@/]/u.test(t[o-1]))continue;let u=Ys(r[3]);n=o+u.length,/^www\./i.test(u)?l=u.length>4?Ht(`https://${u}`):null:l=Ht(u),fe.lastIndex=n}l&&(i(o),e.push({type:"link",url:l,name:St(h,Ei),label:h?St(h,40):Xs(l),start:o,end:n}),a=n)}return i(t.length),e}var je=s=>ve(s).some(t=>t.type==="link");function Q(s,{domain:t=!1}={}){return ve(s).map(e=>e.type==="text"?Ci(e.text):e.name?t?`${e.name} (${Zs(e.url)})`:e.name:e.label).join("")}function zi(s){let t=String(s||"").trim();return!t||/\s/.test(t)?null:/^https?:\/\//i.test(t)?Ht(t):/^[a-z][a-z0-9+.-]*:/i.test(t)&&!/^[^:/]+:\d+(\/|$)/.test(t)?null:Ht(`https://${t.replace(/^\/+/,"")}`)}function Pi(s,t=""){let e=String(t||"").replace(/[[\]]/g,"").replace(/\s+/g," ").trim().slice(0,Ei);return e?`[${e}](${String(s).replace(/\(/g,"%28").replace(/\)/g,"%29")})`:s}var j=s=>(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),G=s=>((s||"").split(`
`).find(t=>t.trim())||"").trim();function We(s,t){let e=String(s||"").replace(/\s+$/,"");return e?`${e}
${t}`:String(t)}var Oi=(s,t,e="")=>We(s,Pi(t,e)),Ri=/^([ \t]*)(☐|☑|\[ \]|\[[xX]\])[ \t]?/,Lt="\u2610",Fi="\u2611";function At(s){let t=Ri.exec(String(s||""));return t?{indent:t[1],done:t[2]===Fi||/x/i.test(t[2]),len:t[0].length}:null}var Ye=s=>String(s||"").split(`
`).some(t=>Ri.test(t));function qi(s,t){let e=String(s||"").split(`
`),a=e[t]!=null?At(e[t]):null;return a?(e[t]=`${a.indent}${a.done?Lt:Fi} ${e[t].slice(a.len)}`,e.join(`
`)):String(s||"")}function Je(s,t,e){let a=new Set((s||[]).map(i=>i.color));return t.find(i=>!a.has(i))||e}var lt=[{id:"vermelho",label:"Vermelho",fill:"#FF5A4F",ink:"#C42A1F"},{id:"coral",label:"Coral",fill:"#FF8A65",ink:"#C2410C"},{id:"laranja",label:"Laranja",fill:"#FFA23E",ink:"#B45309"},{id:"ouro",label:"Ouro",fill:"#F2C14E",ink:"#8A6100"},{id:"verde",label:"Verde",fill:"#8BD45F",ink:"#3F7A17"},{id:"menta",label:"Menta",fill:"#4ED3A6",ink:"#0E7A57"},{id:"turquesa",label:"Turquesa",fill:"#3CCBDA",ink:"#0B7285"},{id:"azul",label:"Azul",fill:"#62B5FF",ink:"#0B67A8"},{id:"indigo",label:"\xCDndigo",fill:"#8F9BFF",ink:"#3D4BC2"},{id:"lilas",label:"Lil\xE1s",fill:"#B99BFF",ink:"#6D3FD6"},{id:"rosa",label:"Rosa",fill:"#FF77A9",ink:"#BE185D"},{id:"grafite",label:"Grafite",fill:"#B5B9C2",ink:"#4E5560"}],L=s=>lt.find(t=>t.id===s);function be(s,t){let e=s.replace("#",""),a=parseInt(e.length===3?e.replace(/./g,i=>i+i):e,16);return`rgba(${a>>16&255}, ${a>>8&255}, ${a&255}, ${t})`}function gt(s,t,e="c"){return`--${e}:${s.fill};--${e}i:${t?s.fill:s.ink};--${e}s:${be(s.fill,t?.17:.15)};`}var Ze=s=>Array.from(s||"",t=>{let e=t.normalize("NFD")[0]||t;return e.toLowerCase().length===1?e.toLowerCase():t}).join(""),O=(s,t,e)=>`${s} ${s===1?t:e}`,z=(s,t=38)=>s.length>t?s.slice(0,t-1).trimEnd()+"\u2026":s,Ks=["Domingo","Segunda","Ter\xE7a","Quarta","Quinta","Sexta","S\xE1bado"],Qs=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],Di=s=>String(s).padStart(2,"0");var xe=s=>`${Di(s.getHours())}:${Di(s.getMinutes())}`;function Bt(s,t=new Date){let e=new Date(s),a=Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(e.getFullYear(),e.getMonth(),e.getDate()))/864e5);if(a===0)return`hoje, ${xe(e)}`;if(a===1)return`ontem, ${xe(e)}`;let r=`${Ks[e.getDay()].slice(0,3).toLowerCase()}, ${e.getDate()} ${Qs[e.getMonth()]}`;return e.getFullYear()===t.getFullYear()?r:`${r} ${e.getFullYear()}`}var Mt=()=>Array.from(crypto.getRandomValues(new Uint8Array(6)),s=>s.toString(16).padStart(2,"0")).join("");async function Xe(s,t=1800){let e=a=>new Promise((i,r)=>{let o=new FileReader;o.onload=()=>i(String(o.result).split(",")[1]||""),o.onerror=()=>r(o.error),o.readAsDataURL(a)});try{let a=await createImageBitmap(s,{imageOrientation:"from-image"}),i=Math.min(1,t/Math.max(a.width,a.height)),r=document.createElement("canvas");r.width=Math.round(a.width*i),r.height=Math.round(a.height*i),r.getContext("2d").drawImage(a,0,0,r.width,r.height),a.close&&a.close();let o=await new Promise(n=>r.toBlob(n,"image/jpeg",.86));return{mime:"image/jpeg",data:await e(o),url:URL.createObjectURL(o)}}catch{return{mime:s.type||"image/jpeg",data:await e(s),url:URL.createObjectURL(s)}}}var vt=[{id:"manha",label:"Manh\xE3",icon:"sunrise"},{id:"tarde",label:"Tarde",icon:"sun"},{id:"noite",label:"Noite",icon:"moon"}],Gs={manha:"05:00",tarde:"12:00",noite:"18:00"},Ii=["pautado","quadriculado","pontilhado","liso"],Ut=s=>String(s).padStart(2,"0"),Vi=/^([01]?\d|2[0-3]):([0-5]\d)$/;var Ct=s=>{let t=Vi.exec(s||"");return t?`${Ut(Number(t[1]))}:${t[2]}`:null},_e=s=>{let t=Vi.exec(s||"");return t?Number(t[1])*60+Number(t[2]):null},Tt=s=>`${Ut(Math.floor(s/60))}:${Ut(s%60)}`,Ge=[0,60,120,180,240,360,480],Ke=s=>s&&Ge.includes(s.dur)?s.dur:0,tr=s=>s.some(t=>!t.dur)?0:Math.max(...s.map(t=>t.dur)),ta=s=>s.getHours()*60+s.getMinutes();function tt(s){return{...Gs,...s&&s.periods||{}}}var Qe=s=>String(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase().replace(/\s+/g," ").trim(),et=(s,t)=>Qe(s)===Qe(t),we=s=>{let t=typeof s=="string"?s.replace(/\s+/g," ").trim().slice(0,80):"";return Qe(t)==="todos"?"":t},ea=(s,t="")=>!!s&&!s.archived&&(!t||!s.owner||et(s.owner,t));function jt(s,t){let e=vt.map(i=>({id:i.id,min:_e(t[i.id])})).filter(i=>i.min!=null);e.sort((i,r)=>i.min-r.min);let a=e[e.length-1];for(let i of e)i.min<=s&&(a=i);return a?a.id:"manha"}var Ni={page:0,time:1,period:2};function Hi(s,{person:t=""}={}){let e=tt(s),a=s&&s.app&&s.app.owners_off===!0?"":t,i=(s&&s.blocks||[]).filter(l=>ea(l,a)),r=new Map(i.map((l,h)=>[l.id,l.order!=null?l.order:h])),o=[];for(let l of i){for(let h of l.periods||[]){let u=_e(e[h]);u!=null&&o.push({min:u,block:l.id,page:null,kind:"period",period:h,dur:Ke(l)})}for(let h of l.times||[]){let u=_e(h);u!=null&&o.push({min:u,block:l.id,page:null,kind:"time",dur:Ke(l)})}}for(let l of s&&s.pages||[])if(r.has(l.block))for(let h of l.times||[]){let u=_e(h);u!=null&&o.push({min:u,block:l.block,page:l.id,kind:"page",dur:Ke(l)})}o.sort((l,h)=>l.min-h.min||Ni[l.kind]-Ni[h.kind]||r.get(l.block)-r.get(h.block));let n=new Set;return o.filter(l=>{let h=`${l.min}|${l.block}|${l.page||""}`;return n.has(h)?!1:(n.add(h),!0)})}function ye(s,t){if(!s.length)return null;let e=null;for(let o of s)o.min<=t&&(e=o.min);e==null&&(e=s[s.length-1].min);let a=(t-e+1440)%1440,i=s.filter(o=>o.min===e&&(!o.dur||a<o.dur));if(!i.length)return null;let r=tr(i);return{min:e,entries:i,main:i[0],end:r?(e+r)%1440:null}}function Li(s,t){if(!s.length)return null;let e=[...new Set(s.map(o=>o.min))],a=e.find(o=>o>t),i=a??e[0];if(e.length===1&&ye(s,t))return null;let r=s.filter(o=>o.min===i);return{min:i,entries:r,main:r[0],tomorrow:a==null}}function aa(s){let t=[];for(let e of s){let a=t[t.length-1];a&&a.min===e.min?a.entries.push(e):t.push({min:e.min,entries:[e],main:e})}return t}function ia(s,t,e=3){let a=aa(s);if(!a.length)return[];let i=ye(s,t),r=i?a.findIndex(n=>n.min===i.min):a.findIndex(n=>n.min>t);r<0&&(r=0);let o=[];for(let n=0;n<Math.min(e,a.length);n++){let l=a[(r+n)%a.length];o.push(n===0&&i?{...l,now:!0,yesterday:l.min>t,tomorrow:!1,end:i.end}:{...l,now:!1,yesterday:!1,tomorrow:l.min<=t})}return o}function Bi(s,t=new Date,e=!0){let a=ta(t),i=new Date(t.getFullYear(),t.getMonth(),t.getDate());return e&&s>a&&i.setDate(i.getDate()-1),!e&&s<=a&&i.setDate(i.getDate()+1),`${i.getFullYear()}-${Ut(i.getMonth()+1)}-${Ut(i.getDate())}T${Tt(s)}`}var Ui=(s,t="")=>c`<svg class="i ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_t(K[s]||K.notebook)}</svg>`,ji="memoria-conversa",Wi=s=>String(s).padStart(2,"0"),er=s=>{let t=new Date(s);return`${t.getFullYear()}-${Wi(t.getMonth()+1)}-${Wi(t.getDate())}`},Yi=s=>class extends s{_chatState(){if(!this._chat){let t=[];try{t=JSON.parse(sessionStorage.getItem(ji)||"[]")}catch{}this._chat={messages:Array.isArray(t)?t:[],draft:"",busy:!1,error:"",rec:null,files:[]}}return this._chat}_setChat(t){if(this._chat={...this._chatState(),...t},"messages"in t)try{sessionStorage.setItem(ji,JSON.stringify(this._chat.messages.slice(-30)))}catch{}this.requestUpdate()}_renderChatBtn(){return!this._aiOn()||!this.api||!this.api.chat?m:c`<button class="mic-top chat-top" aria-label="Conversar com a IA" title="Conversar com a IA" @click=${()=>this._openChat()}>${Ui("message-circle")}</button>`}_openChat(){this._haptic("light"),this._openSheet("chat",{}),this._chatScroll=!0,this.updateComplete.then(()=>{let t=this.renderRoot.querySelector(".chat-input textarea");t&&window.matchMedia&&window.matchMedia("(hover: hover) and (pointer: fine)").matches&&t.focus()})}_renderChatSheet(){let t=this._chatState(),e=this._voice||{};return gi({lit:{html:c,nothing:m},icon:Ui,app:"memoria",onRedraw:()=>this.requestUpdate(),messages:t.messages,draft:t.draft,busy:t.busy,error:t.error,voice:{ready:!!e.ready&&this._micOk(),on:t.rec==="on",starting:t.rec==="starting"},examples:this._chatExamples(),onDraft:a=>this._setChat({draft:a}),onSend:a=>this._chatSend(a),onMic:()=>this._chatMic(),onAction:(a,i)=>this._chatDo(a,i),onAll:a=>this._chatDoAll(a),onClear:()=>this._setChat({messages:[],error:""}),onClose:()=>this._closeSheet(),files:t.files||[],onAttach:a=>this._chatAttach(a),onFileRemove:a=>this._setChat({files:(t.files||[]).filter((i,r)=>r!==a)})})}_chatAttach(t){if(t==="camera")return this._openCamera({chat:!0});let e=document.createElement("input");e.type="file",e.accept=t==="fotos"?"image/*":"image/*,application/pdf",e.multiple=t==="fotos"&&!this._isHaAndroid(),e.style.display="none",e.addEventListener("change",()=>{let a=Array.from(e.files||[]);e.remove(),a.length&&this._chatAddFiles(a)}),document.body.appendChild(e),e.click()}async _chatAddFiles(t){let{files:e,error:a}=await le(t,this._chatState().files||[]);this._setChat({files:e,error:a}),this._chatScroll=!0}_chatAddShots(t){let e=(this._chatState().files||[]).filter(i=>!i.pdf),a=[...e,...t.map((i,r)=>({nome:`Foto ${e.length+r+1}.jpg`,pdf:!1,mime:i.mime||"image/jpeg",data:i.data,url:i.url}))].slice(0,4);this._setChat({files:a,error:""}),this._sheet!=="chat"&&this._openChat()}_micOk(){return!!(navigator.mediaDevices&&navigator.mediaDevices.getUserMedia)}_chatExamples(){let t=this._chatOpenBlock();return t?[`Resuma o bloco ${z(t.name,24)}`,"O que eu anotei de mais importante?"]:["O que abre agora?","O que eu anotei esta semana?",`Crie uma folha no ${z((this._blocks()[0]||{name:"Di\xE1rio"}).name,20)} com uma lista de compras`]}_chatOpenBlock(){let t=this._view();return t.name==="block"?this._block(t.id):t.name==="now"&&this._pad?this._block(this._pad.block):null}_chatScreen(){let t=this._view(),e=()=>{if(!this._pad)return"";let a=this._pagesOf(this._pad.block),i=this._pad.page!=="new"?this._page(this._pad.page):null;return i?`, na folha ${a.indexOf(i)+1} de ${a.length}`:", numa folha nova"};if(t.name==="block"){let a=this._block(t.id);return a?`o bloco "${a.name}"${e()}`:"um bloco"}if(t.name==="now"){let a=this._pad&&this._block(this._pad.block);return a?`Agora, com o bloco "${a.name}" aberto${e()}`:"Agora (nenhum bloco)"}return t.name==="shelf"?"Blocos (a estante com todos os blocos e o Seu dia)":t.name==="search"?this._query?`Buscar, procurando "${this._query}"`:"Buscar":t.name==="more"?"Mais (o menu: Categorias, Relat\xF3rio de anota\xE7\xF5es, Configura\xE7\xF5es e Sobre)":t.name==="categorias"?"Mais \u203A Categorias (as categorias dos blocos)":t.name==="config"?"Mais \u203A Configura\xE7\xF5es (integra\xE7\xF5es, dados, apar\xEAncia e op\xE7\xF5es)":t.name==="sobre"?"Mais \u203A Sobre (CorrerIA Code, quem faz o app, os outros apps da fam\xEDlia e o GitHub)":"o MemorIA"}_chatContext(){let t=this._chatOpenBlock(),e=tt(this._data),a=new Date(this._now),i=a.getHours()*60+a.getMinutes(),r=vt.find(h=>h.id===jt(i,e)),{cur:o}=this._slot(),n=o&&o.entries[0]?this._block(o.entries[0].block):null,l=this._blocks().slice();return t&&t.archived&&l.push(t),l.sort((h,u)=>+(u===t)-+(h===t)),{tela:this._chatScreen(),agora:`${r?r.label.toLowerCase():""}${n?`; o bloco do momento \xE9 "${n.name}"`:""}`,blocos:l.map(h=>{let u=this._pagesOf(h.id),d=this._cat(h.category);return{id:h.id,nome:h.name,categoria:d?d.name:"",dono:h.owner||"",abre:this._whenParts(h,!1).map(f=>f.icon==="clock"?`\xE0s ${f.label}`:`${f.label.toLowerCase()} (${f.time})`).join(", ").replace(/^(.)/,f=>f&&`abre ${f}`),aberto:h===t,total:u.length,folhas:u.slice(-(h===t?60:20)).map(f=>({n:u.indexOf(f)+1,titulo:G(Q(f.text)),texto:Q(f.text,{domain:!0}),escrita:er(f.created),horarios:(f.times||[]).join(", ")}))}})}}async _chatSend(t){let e=this._chatState();if(e.busy)return;let a=e.files||[],i=a.length?{role:"user",text:t,anexos:a.map(o=>o.nome)}:{role:"user",text:t},r=[...e.messages,i];this._setChat({messages:r,draft:"",busy:!0,error:"",files:[]}),this._chatScroll=!0;try{let o=await this.api.chat(r.map(l=>({role:l.role,text:l.text||(l.actions||[]).map(h=>h.label).join("; "),...l.anexos?{anexos:l.anexos}:{}})),this._chatContext(),a.map(l=>({data:l.data,mime:l.mime,nome:l.nome})));for(let l of a)l.url&&URL.revokeObjectURL(l.url);let n=(o.actions||[]).map(l=>({...l,label:this._chatLabel(l),icon:l.tipo==="acrescentar"?"list-plus":"notebook-pen",state:"todo"}));this._setChat({messages:[...this._chatState().messages,{role:"ia",text:o.reply||"",actions:n}],busy:!1})}catch(o){this._setChat({busy:!1,error:o.message||"A IA n\xE3o respondeu. Tente de novo.",...a.length?{files:a,messages:this._chatState().messages.filter(n=>n!==i)}:{}})}this._chatScroll=!0}_chatLabel(t){let e=z(G(Q(t.texto))||"",50);return t.tipo==="acrescentar"?`Acrescentar "${e}" na folha ${t.folha} de ${z(t.nome,24)}`:`Criar folha "${e}" em ${z(t.nome,24)}`}_setAction(t,e,a){let i=this._chatState().messages.map((r,o)=>o===t?{...r,actions:r.actions.map((n,l)=>l===e?{...n,...a}:n)}:r);this._setChat({messages:i})}async _chatDo(t,e){let a=((this._chatState().messages[t]||{}).actions||[])[e];if(!a||a.state==="done"||a.state==="doing")return;this._setAction(t,e,{state:"doing",note:""});let i=this._block(a.bloco),r=!1,o="";if(!i)o="Esse bloco n\xE3o existe mais.";else if(a.tipo==="criar"){let n=Date.now(),l={id:Mt(),block:i.id,text:a.texto,times:[],created:n,updated:n};this._putPage(l),this._queueSave(l.id,0),r=!0}else{let n=this._pagesOf(i.id)[a.folha-1];!n||j(G(Q(n.text)))!==j(a.titulo)?o="Essa folha mudou. Pe\xE7a de novo.":(this._putPage({...n,text:We(n.text,a.texto)}),this._queueSave(n.id,0),r=!0)}this._setAction(t,e,{state:r?"done":"failed",note:r?"":o||"N\xE3o deu certo."}),r&&this._haptic("success")}async _chatDoAll(t){let e=(this._chatState().messages[t]||{}).actions||[];for(let a=0;a<e.length;a++)e[a].state!=="done"&&await this._chatDo(t,a)}async _chatMic(){let t=this._chatState();if(t.rec==="on"){let a=this._chatRec;if(this._chatRec=null,clearTimeout(this._chatRecTimer),!a)return this._setChat({rec:null});let i=a.stop();if(this._setChat({rec:null}),i.length<16e3*.4)return this._setChat({error:"N\xE3o ouvi nada. Toque no microfone e fale."});this._setChat({busy:!0,error:""});try{let r=await this.api.voiceText(i);this._setChat({busy:!1}),r&&r.text&&this._chatSend(r.text)}catch(r){this._setChat({busy:!1,error:r.message||"N\xE3o consegui transcrever."})}return}if(t.rec)return;let e=new yt(()=>{});this._chatRec=e,this._setChat({rec:"starting",error:""});try{await e.start()}catch(a){return e.cancel(),this._chatRec=null,this._setChat({rec:null,error:he(a)})}if(this._chatRec!==e)return e.cancel();this._setChat({rec:"on"}),this._chatRecTimer=setTimeout(()=>this._chatState().rec==="on"&&this._chatMic(),120*1e3)}_chatStop(){clearTimeout(this._chatRecTimer),this._chatRec&&this._chatRec.cancel(),this._chatRec=null,this._chat&&this._chat.rec&&(this._chat={...this._chat,rec:null})}_chatAfterRender(){if(!this._chatScroll||this._sheet!=="chat")return;this._chatScroll=!1;let t=this.renderRoot.querySelector(".chat-log");t&&(t.scrollTop=t.scrollHeight)}};var oa=class{constructor(t,e){this.url=t,this.onStatus=e,this.nextId=1,this.pending=new Map,this.subs=new Set,this.byId=new Map,this.queue=[],this.open=!1,this.everOpened=!1,this.backoff=1e3,this.reconnectHandlers=[],this._connect()}_connect(){let t=new WebSocket(this.url);this.ws=t,t.onopen=()=>{this.open=!0,this.backoff=1e3;let e=this.everOpened;this.everOpened=!0;for(let a of this.subs)this._startSub(a);for(let a of this.queue.splice(0))t.send(a);if(this.onStatus&&this.onStatus(!0),e)for(let a of this.reconnectHandlers)a()},t.onmessage=e=>{let a;try{a=JSON.parse(e.data)}catch{return}if(a.type==="result"){let i=this.pending.get(a.id);if(!i)return;if(this.pending.delete(a.id),a.success)i.resolve(a.result);else{let r=new Error(a.error&&a.error.message||"Falhou");r.code=a.error&&a.error.code,a.error&&a.error.page&&(r.page=a.error.page),i.reject(r)}}else if(a.type==="event"){let i=this.byId.get(a.id);i&&i.cb(a.event)}},t.onclose=()=>{let e=this.open;this.open=!1,this.byId.clear();for(let[,a]of this.pending){let i=new Error("Sem conex\xE3o com o MemorIA");i.code="disconnected",a.reject(i)}this.pending.clear(),e&&this.onStatus&&this.onStatus(!1),setTimeout(()=>this._connect(),this.backoff),this.backoff=Math.min(this.backoff*2,15e3)}}onReconnect(t){this.reconnectHandlers.push(t)}_send(t){let e=JSON.stringify(t);this.open?this.ws.send(e):this.queue.push(e)}sendMessagePromise(t){let e=this.nextId++;return new Promise((a,i)=>{this.pending.set(e,{resolve:a,reject:i}),this._send({...t,id:e})})}subscribeMessage(t,e){let a={cb:t,msg:e,id:null,first:null};this.subs.add(a);let i=new Promise((r,o)=>{a.first={resolve:r,reject:o}});return this.open&&this._startSub(a),i.then(()=>async()=>{this.subs.delete(a),a.id!=null&&(this.byId.delete(a.id),this.open&&this.sendMessagePromise({type:"unsubscribe_events",subscription:a.id}).catch(()=>{}))})}_startSub(t){let e=this.nextId++;t.id=e,this.byId.set(e,t),this.pending.set(e,{resolve:()=>{t.first&&t.first.resolve(),t.first=null},reject:a=>{a.code!=="disconnected"&&(this.byId.delete(e),this.subs.delete(t),t.first&&t.first.reject(a),t.first=null)}}),this.ws.send(JSON.stringify({...t.msg,id:e}))}};function na(){try{if(window.parent===window)return null;let s=window.parent.document.querySelector("home-assistant");return s&&s.hass||null}catch{return null}}var Ji=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;function Zi(){let s=na();if(s&&s.themes&&typeof s.themes.darkMode=="boolean")return s.themes.darkMode;let t=document.documentElement.getAttribute("data-theme");return t==="dark"||t==="light"?t==="dark":!!(Ji&&Ji.matches)}function Xi(){return{topbar:!(window.parent!==window),haptic(t){try{let e=window.parent;e!==window&&e.dispatchEvent(new e.CustomEvent("haptic",{detail:t}))}catch{}},openInHA(t){try{let e=window.parent;if(e!==window&&e.document){e.history.pushState(null,"",t),e.dispatchEvent(new e.CustomEvent("location-changed",{detail:{replace:!1}}));return}}catch{}window.open(t,"_top")}}}var ke=class{constructor(){let t=new URL("ws",location.href);t.protocol=location.protocol==="https:"?"wss:":"ws:",this.statusHandlers=[],this.conn=new oa(t.href,e=>this.statusHandlers.forEach(a=>a(e)))}onStatus(t){this.statusHandlers.push(t)}onReconnect(t){this.conn.onReconnect(t)}call(t,e={}){return this.conn.sendMessagePromise({type:t,...e})}bootstrap(){return this.call("memoria/bootstrap")}subscribe(t){return this.conn.subscribeMessage(t,{type:"memoria/subscribe"})}savePage(t){return this.call("memoria/page/save",{page:t})}deletePage(t){return this.call("memoria/page/delete",{page_id:t})}saveBlock(t){return this.call("memoria/block/save",{block:t})}saveMarks(t,e,a){return this.call("memoria/marks/save",{page_id:t,at:e,lines:a})}deleteBlock(t){return this.call("memoria/block/delete",{block_id:t})}people(){return this.call("memoria/people")}saveCategory(t){return this.call("memoria/category/save",{category:t})}deleteCategory(t){return this.call("memoria/category/delete",{category_id:t})}aiStatus(){return this.call("memoria/ai/status")}usage(){return this.call("memoria/usage")}voiceStatus(t=!1){return this.call("memoria/voice/status",t?{fresh:!0}:{})}async voiceText(t){let e=await fetch(new URL("api/voice",location.href),{method:"POST",headers:{"content-type":"application/octet-stream"},body:t.buffer.slice(t.byteOffset,t.byteOffset+t.byteLength)}),a=await e.json().catch(()=>({}));if(!e.ok){let i=new Error(a.error||`Erro ${e.status}`);throw i.code=a.code,i}return a}async chat(t,e,a=[]){if(!a.length)return this.call("memoria/ai/chat",{messages:t,context:e});let i=await fetch(new URL("api/chat",location.href),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({messages:t,context:e,files:a})}),r=await i.json().catch(()=>({}));if(!i.ok){let o=new Error(r.error||`Erro ${i.status}`);throw o.code=r.code,o}return r}reportUrl(t){return new URL(`relatorio?${t}`,location.href).href}saveSettings(t){return this.call("memoria/settings/save",t)}exportUrl(t){return new URL(`api/export/${t}`,location.href).href}async importFile(t){let e=await fetch(new URL("api/import",location.href),{method:"POST",headers:{"content-type":"application/octet-stream","x-file-name":encodeURIComponent(t.name||"")},body:t}),a=await e.json().catch(()=>({}));if(!e.ok)throw new Error(a.error||`Erro ${e.status}`);return a}versions(){return this.call("memoria/versions/list")}restoreVersion(t){return this.call("memoria/versions/restore",{name:t})}backups(){return this.call("memoria/backups/list")}createBackup(){return this.call("memoria/backups/create")}restoreBackup(t){return this.call("memoria/backups/restore",{name:t})}eraseAll(){return this.call("memoria/data/erase")}async extract(t){let e=await fetch(new URL("api/extract",location.href),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t)}),a=await e.json().catch(()=>({}));if(!e.ok){let i=new Error(a.error||`Erro ${e.status}`);throw i.code=a.code,i}return a}};var Ki="memoria.theme",ar=600,ir=600,Qi={pautado:"Pautado",quadriculado:"Quadriculado",pontilhado:"Pontilhado",liso:"Liso"},sr=Array.from({length:14},()=>c`<i></i>`),$e=["categorias","config","sobre"],Se="memoria.blocos.categoria",Gi="memoria.blocos.vista",la="memoria.blocos.pessoa",ts="memoria.buscar.pessoa",rr="memoria.relatorio",es="memoria.buscar.arquivados",as="memoria.buscar.filtros",ca="memoria.emojis",or=["\u2705","\u274C","\u2B50","\u2764\uFE0F","\u{1F44D}","\u{1F64F}","\u{1F60A}","\u{1F602}","\u{1F389}","\u{1F4A1}","\u{1F4CC}","\u26A0\uFE0F","\u2757","\u2753","\u{1F449}","\u{1F4C5}","\u23F0","\u{1F6D2}","\u{1F48A}","\u{1F34E}","\u2615","\u{1F3E0}","\u{1F697}","\u{1F4B0}"];function nr(){let s=0;try{let t=window,e=t.visualViewport;for(e&&(s=t.innerHeight-(e.offsetTop+e.height));t.frameElement&&t.parent&&t.parent!==t;){let a=t.frameElement.getBoundingClientRect(),i=t.parent,r=i.visualViewport;s=Math.max(s,a.bottom-(r?r.offsetTop+r.height:i.innerHeight)),t=i}}catch{}return s>1?Math.round(s):0}var p=(s,t="")=>c`<svg class="i ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${_t(K[s]||K.notebook)}</svg>`,N={get(s,t){try{let e=localStorage.getItem(s);return e==null?t:JSON.parse(e)}catch{return t}},set(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}},lr={Agora:"clock-3",Blocos:"library",Buscar:"search",Mais:"ellipsis",Categorias:"tag",Configura\u00E7\u00F5es:"sliders-horizontal",Sobre:"info"},cr=(s="")=>/^Novo|^Nova/.test(s)?"plus":/^Folha/.test(s)?"notebook-text":/^Alterar/.test(s)?"pencil":/^Ajustes/.test(s)?"sliders-horizontal":{"Adicionar link":"link",Categoria:"tag","Colar mensagem":"clipboard-paste",Falar:"mic","Lendo\u2026":"scan-text","Revisar folha":"list-checks","Vers\xF5es anteriores":"archive-restore"}[s]||"notebook",hr=(s="")=>/^Apagar/.test(s)?"trash":/^Restaurar/.test(s)?"archive-restore":/^Importar/.test(s)?"upload":"circle-alert",is="memoria-fechadas",ss=s=>{if(!s)return"";let t=s.querySelector(":scope > .mais-head h2");return s.id||s.dataset&&s.dataset.card||(t?t.textContent.trim():"")},rs=(s,t)=>s.created-t.created||(s.id<t.id?-1:1),Wt=s=>String(s).padStart(2,"0"),Yt=s=>vt.find(t=>t.id===s),pr=1100,dr=()=>!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),ha=class extends Yi(ot){static properties={api:{attribute:!1},env:{attribute:!1},_data:{state:!0},_ready:{state:!0},_bootError:{state:!0},_online:{state:!0},_path:{state:!0},_sel:{state:!0},_sheet:{state:!0},_form:{state:!0},_toast:{state:!0},_query:{state:!0},_theme:{state:!0},_cam:{state:!0},_pad:{state:!0},_wide:{state:!0},_full:{state:!0},_turn:{state:!0},_peek:{state:!0},_choice:{state:!0},_now:{state:!0},_dark:{state:!0},_editing:{state:!0},_correria:{state:!0}};static styles=[ai,ii,ni,X(pi),X(vi),X(Si)];constructor(){super(),this.api=null,this.env=null,this._data=null,this._correria={ultimo:null},this._ready=!1,this._bootError=null,this._online=!0,this._path=history.state&&history.state.rvPath||"",this._sheet=null,this._form=null,this._toast=null,this._query="",this._theme=N.get(Ki,"auto"),this._cam=null,this._pad=null,this._turn=null,this._peek=null,this._choice=null,this._now=Date.now(),this._dark=!1,this._editing=null,this._user={name:""},this._people=[],this._archOpen=!1,this._ai={ready:!1,images:!1,entities:[]},this._aiAt=0,this._voice=null,this._backups=null,this._version="",this._saving=new Map,this._base=new Map,this._dropped=new Set,this._slotKey=null,this._lastTyped=0,this._cache={data:null,pages:new Map,schedule:[]},this._onPopState=this._onPopState.bind(this),this._onVisible=this._onVisible.bind(this),this._onResize=()=>(this._fitTitles(),this._measureSplit()),this._mql=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,this._wideMq=window.matchMedia?window.matchMedia(`(min-width: ${pr}px)`):null,this._wide=!!(this._wideMq&&this._wideMq.matches),this._onWide=()=>this._wide=!!(this._wideMq&&this._wideMq.matches),this._onFullKey=t=>t.key==="Escape"&&this._full&&!this._sheet&&this._setFull(!1),this._onFsChange=()=>{let t=this._fsDoc;t&&t.fullscreenElement?this._fsOn=!0:this._fsOn&&(this._fsOn=!1,this._full=!1,this._fullAgora())},this._onScheme=()=>this._syncDark()}connectedCallback(){super.connectedCallback(),ei(),window.addEventListener("popstate",this._onPopState),document.addEventListener("visibilitychange",this._onVisible),window.addEventListener("resize",this._onResize),this._mql&&this._mql.addEventListener&&this._mql.addEventListener("change",this._onScheme),this._wideMq&&this._wideMq.addEventListener&&this._wideMq.addEventListener("change",this._onWide),window.addEventListener("keydown",this._onFullKey),this._tickTimer=setInterval(()=>this._tick(),2e4),this._themeTimer=setInterval(()=>this._theme==="auto"&&this._syncDark(),1500),window.MutationObserver&&(this._hostTheme=new MutationObserver(()=>this._syncDark()),this._hostTheme.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]})),this._syncDark(),this.api&&!this._started&&this._start()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._onPopState),document.removeEventListener("visibilitychange",this._onVisible),window.removeEventListener("resize",this._onResize),this._mql&&this._mql.removeEventListener&&this._mql.removeEventListener("change",this._onScheme),this._wideMq&&this._wideMq.removeEventListener&&this._wideMq.removeEventListener("change",this._onWide),window.removeEventListener("keydown",this._onFullKey),this._fsDoc&&this._fsDoc.removeEventListener("fullscreenchange",this._onFsChange),clearInterval(this._tickTimer),clearInterval(this._themeTimer),clearInterval(this._kbTimer),this._hostTheme&&this._hostTheme.disconnect(),clearTimeout(this._toastTimer),clearTimeout(this._turnTimer),clearTimeout(this._peopleRetry),this._stopStream(),this._stopVoice(),this._chatStop();for(let t of[...this._saving.keys()])this._flushSave(t)}willUpdate(t){t.has("api")&&this.api&&!this._started&&this.isConnected&&this._start(),this._data&&this._cache.data!==this._data&&this._reindex()}_markTabs(){let t=this.renderRoot&&this.renderRoot.querySelector(".tabs-wrap > .more-tabs");if(t&&(t.parentElement.classList.toggle("tem-esq",t.scrollLeft>2),t.parentElement.classList.toggle("tem-dir",t.scrollLeft+t.clientWidth<t.scrollWidth-2),window.ResizeObserver&&(!this._tabsRo||this._tabsRo.t!==t))){this._tabsRo&&this._tabsRo.ro.disconnect();let e=new ResizeObserver(()=>this._markTabs());e.observe(t),t.querySelectorAll("button").forEach(a=>e.observe(a)),this._tabsRo={t,ro:e}}}_closedCards(){if(!this._fechadas)try{this._fechadas=new Set(JSON.parse(localStorage.getItem(is)||"[]"))}catch{this._fechadas=new Set}return this._fechadas}_applyFolds(){let t=this.renderRoot;if(!t||!t.querySelectorAll)return;let e=this._closedCards();for(let a of t.querySelectorAll(".panel > .mais-head")){let i=a.parentElement,r=ss(i);if(!r)continue;let o=e.has(r);i.classList.add("dobra"),i.classList.toggle("fechada",o),a.setAttribute("role","button"),a.setAttribute("tabindex","0"),a.setAttribute("aria-expanded",o?"false":"true")}}_toggleFold(t){let e=ss(t.parentElement);if(!e)return;let a=this._closedCards();a.has(e)?a.delete(e):a.add(e);try{localStorage.setItem(is,JSON.stringify([...a]))}catch{}this._haptic("light"),this._applyFolds()}firstUpdated(){let t=e=>{let a=e.target.closest&&e.target.closest(".panel.dobra > .mais-head");return a&&!e.target.closest("button, a, input, select, textarea, label")?a:null};this.renderRoot.addEventListener("click",e=>{let a=t(e);a&&this._toggleFold(a)}),this.renderRoot.addEventListener("keydown",e=>{if(e.key!=="Enter"&&e.key!==" ")return;let a=t(e);a&&(e.preventDefault(),this._toggleFold(a))})}updated(t){this.toggleAttribute("dark",this._dark),this.toggleAttribute("full",this._fullOn());for(let e of this.renderRoot.querySelectorAll("textarea.ink.live"))this._syncMirror(e);if(this._measureSplit(),this._markTabs(),this._applyFolds(),this._chatAfterRender(),t.has("_dark")&&(document.documentElement.style.colorScheme=this._dark?"dark":"light",document.body.style.background=this._dark?"#141217":"#f8f6fb"),this._turn&&t.has("_turn")){let e=this.renderRoot.querySelector(".turn .face.front .ink");e&&(e.scrollTop=this._turn.snap.scroll||0)}if(t.has("_path")&&this._view().name==="search"){let e=this.renderRoot.querySelector(".search-box input");e&&e.focus({preventScroll:!0})}if(this._fitTitles(),this._scrollChip){this._scrollChip=!1;let e=this.renderRoot.querySelector(".tchip.on, .tchip.peek");e&&e.scrollIntoView&&e.scrollIntoView({inline:"center",block:"nearest",behavior:"instant"})}}_fitTitles(){for(let t of this.renderRoot.querySelectorAll(".fit-title")){let e=`${t.textContent}|${t.clientWidth}`;if(t.dataset.fit===e)continue;t.style.fontSize="";let a=parseFloat(getComputedStyle(t).fontSize)||34;for(;t.scrollWidth>t.clientWidth+1&&a>20;)a-=2,t.style.fontSize=`${a}px`;t.dataset.fit=e}}_onVisible(){if(document.visibilityState==="visible")this._syncDark(),this._tick();else for(let[t,e]of this._saving)e.timer&&this._flushSave(t)}_syncDark(){let t;this._theme==="dark"?t=!0:this._theme==="light"?t=!1:t=Zi(),t!==this._dark&&(this._dark=t)}_setTheme(t){this._theme=t,N.set(Ki,t),this._syncDark()}async _start(){this._started=!0,this.api.onStatus(t=>{this._online=t}),this.api.onReconnect(()=>this._boot(!0)),await this._boot(!1),this.api.subscribe(t=>this._onEvent(t)).catch(()=>{})}async _boot(t){try{let e=await this.api.bootstrap();this._version=e.version||"",this._atalho=e.atalho||null,this._user=e.user||{name:""},this._people=Array.isArray(e.people)?e.people:[],!this._people.length&&!this._peopleRetry&&(this._peopleRetry=setTimeout(()=>this._loadPeople(),5e3)),this._ai=e.ai||{ready:!1,images:!1,entities:[]},this._aiAt=Date.now(),this._correria=e.correria||{ultimo:null};let a=e.data,i=a.pages.filter(r=>!this._dropped.has(r.id));for(let r of i)this._isDirty(r.id)||this._base.set(r.id,r.updated);for(let[r,o]of this._saving){let n=this._page(r);if(!n||!(o.dirty||o.inflight))continue;let l=i.findIndex(h=>h.id===r);l>=0?i[l]={...i[l],text:n.text}:i.push(n)}if(this._data={...a,pages:i},this._ready=!0,this._bootError=null,this._aiOn()&&!this._voiceAsked&&(this._voiceAsked=!0,this._loadVoice()),(!this._pad||!this._block(this._pad.block))&&this._enterView(),t)for(let[r,o]of this._saving)o.dirty&&this._flushSave(r);this._tick()}catch(e){this._ready||(this._bootError=e.message||String(e)),t||setTimeout(()=>this._boot(!1),3e3)}}_reindex(){let t=new Map;for(let a of this._data.pages)t.has(a.block)||t.set(a.block,[]),t.get(a.block).push(a);for(let a of t.values())a.sort(rs);let e=this._agoraPerson();this._cache={data:this._data,person:e,pages:t,schedule:Hi(this._data,{person:e})}}_allBlocks(){return[...this._data&&this._data.blocks||[]].sort((t,e)=>t.order-e.order||t.created-e.created)}_blocks(){return this._allBlocks().filter(t=>!t.archived)}_me(){return this._user&&this._user.person||""}_mine(t){return ea(t,this._agoraPerson())}_agoraPerson(){return this._ownersOn()&&!(this._full&&this._wide)?this._me():""}_catsOn(){return this._app("cats_off",!1)!==!0}_ownersOn(){return this._app("owners_off",!1)!==!0}_owner(t){return this._ownersOn()&&t&&t.owner||""}_block(t){return this._data&&this._data.blocks.find(e=>e.id===t)}_cats(){return[...this._data&&this._data.categories||[]].sort((t,e)=>t.order-e.order||t.name.localeCompare(e.name,"pt-BR"))}_cat(t){return t?this._cats().find(e=>e.id===t):null}_page(t){return this._data&&this._data.pages.find(e=>e.id===t)}_pagesOf(t){return this._data&&this._cache.data!==this._data&&this._reindex(),this._cache.pages.get(t)||[]}_schedule(){return this._data&&(this._cache.data!==this._data||this._cache.person!==this._agoraPerson())&&this._reindex(),this._cache.schedule}_app(t,e){let a=this._data&&this._data.app?this._data.app[t]:void 0;return a===void 0?e:a}_accentDaily(){return this._app("accent_daily",!0)!==!1}_accent(){return this._accentDaily()?li(lt,new Date(this._now)):L(this._app("accent","lilas"))||L("lilas")}_colorOf(t){return t&&L(t.color)||L("lilas")}_cv(t){return gt(this._colorOf(t),this._dark)}_putPage(t){let e=this._data.pages.slice(),a=e.findIndex(i=>i.id===t.id);a>=0?e[a]=t:e.push(t),this._data={...this._data,pages:e}}_removePage(t){this._data={...this._data,pages:this._data.pages.filter(e=>e.id!==t)}}_putBlock(t){let e=this._data.blocks.slice(),a=e.findIndex(i=>i.id===t.id);a>=0?e[a]=t:e.push(t),this._data={...this._data,blocks:e}}_isDirty(t){let e=this._saving.get(t);return!!(e&&(e.dirty||e.inflight||e.timer))}_onEvent(t){if(!(!this._data||!t)){if(t.kind==="page"){let e=t.page;if(this._dropped.has(e.id))return;let a=this._page(e.id);if(this._isDirty(e.id)&&a){e.text===a.text&&this._putPage({...e});return}this._base.set(e.id,e.updated),this._putPage(e)}else if(t.kind==="page_deleted")this._dropPageLocally(t.id);else if(t.kind==="marks"){let e={...this._data.marks||{}};t.marks?e[t.id]=t.marks:delete e[t.id],this._data={...this._data,marks:e}}else if(t.kind==="block"){this._putBlock(t.block);let e=this._pad&&this._block(this._pad.block);this._view().name==="now"&&(!e||!this._mine(e))&&(this._peek=null,this._choice=null,this._setPad(this._nowPad()))}else if(t.kind==="block_deleted")this._data={...this._data,blocks:this._data.blocks.filter(e=>e.id!==t.id),pages:this._data.pages.filter(e=>e.block!==t.id)},this._pad&&this._pad.block===t.id&&(this._view().name==="block"?this._go("/blocos",!0):this._enterView());else if(t.kind==="category"){let e=this._cats().slice(),a=e.findIndex(i=>i.id===t.category.id);a>=0?e[a]=t.category:e.push(t.category),this._data={...this._data,categories:e}}else if(t.kind==="category_deleted"){let e=this._data.blocks.map(a=>a.category===t.id?Object.fromEntries(Object.entries(a).filter(([i])=>i!=="category")):a);this._data={...this._data,categories:this._cats().filter(a=>a.id!==t.id),blocks:e}}else if(t.kind==="reset"){this._applyReset(t.data);return}else if(t.kind==="correria")this._correria={...this._correria,ultimo:t.ultimo||null};else if(t.kind==="settings"){let e=(t.app&&t.app.ai_entity)!==this._app("ai_entity",void 0),a=this._aiOn();this._data={...this._data,periods:t.periods,app:t.app},e&&this._refreshAi(),!a&&this._aiOn()&&this._loadVoice()}this._tick()}}_applyReset(t){for(let a of this._saving.values())clearTimeout(a.timer);this._saving.clear(),this._dropped.clear(),this._base=new Map(t.pages.map(a=>[a.id,a.updated])),this._data=t,this._pad=null,this._peek=null,this._choice=null,this._slotKey=null;let e=this._view();e.name==="block"&&!this._block(e.id)?this._go("/blocos",!0):this._enterView(),this._tick()}_dropPageLocally(t){let e=this._saving.get(t);e&&clearTimeout(e.timer),this._saving.delete(t),this._base.delete(t);let a=this._page(t);if(a&&(this._removePage(t),this._pad&&this._pad.page===t)){let i=this._pagesOf(a.block),r=i.filter(o=>rs(o,a)<0);this._pad={...this._pad,page:r.length?r[r.length-1].id:i.length?i[0].id:"new"}}}_onInk(t){let e=this._spreadText();e!=null&&(this._caretAbs=this._absOf(t.target,t.target.selectionStart)),this._onInkText(e??t.target.value)}_onInkText(t){let e=this._pad;if(!e)return;this._lastTyped=Date.now();let a=e.page!=="new"?this._page(e.page):null;if(a)this._putPage({...a,text:t});else{if(!t.trim())return;let i=Date.now();a={id:Mt(),block:e.block,text:t,times:[],created:i,updated:i},this._putPage(a),this._pad={...e,page:a.id},this._editing==="new"&&(this._editing=a.id)}this._queueSave(a.id)}_queueSave(t,e=ar){let a=this._saving.get(t)||{timer:null,inflight:!1,dirty:!1};a.dirty=!0,clearTimeout(a.timer),a.timer=setTimeout(()=>this._flushSave(t),e),this._saving.set(t,a)}async _flushSave(t){let e=this._saving.get(t);if(!e||(clearTimeout(e.timer),e.timer=null,e.inflight||!e.dirty))return;let a=this._page(t);if(!a){this._saving.delete(t);return}e.dirty=!1,e.inflight=!0,e.sentText=a.text;let i={id:t,block:a.block,text:a.text};this._base.has(t)?i.base=this._base.get(t):i.created=a.created;let r=!1;try{let o=await this.api.savePage(i);this._base.set(t,o.updated);let n=this._page(t);n&&!this._dropped.has(t)&&this._putPage({...o,text:n.text,times:n.times,block:n.block})}catch(o){o.code==="conflict"&&o.page?this._resolveConflict(t,o.page,e):o.code==="disconnected"?e.dirty=!0:(e.dirty=!0,this._showToast(`N\xE3o consegui salvar a folha: ${o.message}`)),r=o.code!=="disconnected"&&o.code!=="conflict"}finally{e.inflight=!1}if(e.deleteAfter){this._saving.delete(t),this.api.deletePage(t).catch(()=>{});return}e.dirty&&this._online&&!r?this._queueSave(t,200):!e.dirty&&!e.timer&&this._saving.delete(t)}_resolveConflict(t,e,a){let i=this._page(t),r=i?i.text:"";if(a.dirty=!1,this._base.set(t,e.updated),this._putPage(e),r.trim()&&r!==e.text){let o=Date.now(),n={id:Mt(),block:e.block,text:r,times:[],created:o,updated:o};this._putPage(n),this._queueSave(n.id,0),this._showToast("Esta folha mudou em outro aparelho. Sua vers\xE3o virou uma folha nova.",{label:"Ver",run:()=>this._openPage(e.block,n.id)})}}async _savePageMeta(t,e){let a=this._page(t);if(!a)return null;this._putPage({...a,...e});let i=this._saving.get(t);i&&(i.timer||i.dirty)&&await this._flushSave(t);try{let r=await this.api.savePage({id:t,block:a.block,...e,...this._base.has(t)?{}:{text:a.text,created:a.created}});this._base.set(t,r.updated);let o=this._page(t);return this._putPage({...r,text:o?o.text:r.text}),r}catch(r){return this._putPage(a),this._showToast(`N\xE3o consegui salvar: ${r.message}`),null}}_deletePage(t){let e=this._saving.get(t),a=this._base.has(t);if(this._dropped.add(t),this._dropPageLocally(t),e&&e.inflight){e.deleteAfter=!0,this._saving.set(t,e);return}a&&this.api.deletePage(t).catch(()=>{})}_leave(t){if(!t||!t.page||t.page==="new")return;let e=this._page(t.page);e&&(!e.text.trim()&&!(e.times||[]).length?this._deletePage(e.id):this._saving.has(e.id)&&this._flushSave(e.id))}_lastPad(t){let e=this._pagesOf(t);return{block:t,page:e.length?e[e.length-1].id:"new"}}_setPad(t,{keepTurn:e=!1}={}){let a=this._pad;a&&t&&a.block===t.block&&a.page===t.page||(e||(clearTimeout(this._turnTimer),this._turn=null,this._pendingPad=null),this._pad=t,a&&this._leave(a))}_padEntryPad(t){return t?t.page&&this._page(t.page)?{block:t.block,page:t.page}:this._lastPad(t.block):null}_slot(){let t=this._schedule(),e=ta(new Date(this._now));return{entries:t,min:e,cur:ye(t,e),next:Li(t,e)}}_keyOf(t){return t?`${t.min}|${t.block}|${t.page||""}`:""}_pickIn(t){return t?t.entries.find(e=>this._keyOf(e)===this._choice)||t.main:null}_nowPad(){let{cur:t}=this._slot();if(this._peek){let e=this._padEntryPad(this._pickIn(this._peek));if(e)return e}return t?this._padEntryPad(this._pickIn(t)):null}_enterView(){if(!this._data)return;let t=this._view();if(t.name!=="search"&&(this._sel=null),t.name==="block"){if(!this._block(t.id))return;let e=this._openAt&&this._openAt.block===t.id?this._openAt.page:null;this._openAt=null,this._setPad(e&&(e==="new"||this._page(e))?{block:t.id,page:e}:this._lastPad(t.id))}else t.name==="now"?(this._peek=null,this._choice=null,this._setPad(this._nowPad()),this._scrollChip=!0):this._pad&&this._leave(this._pad);if(t.name==="config"){let e=this._configTab();e==="integracoes"&&(this._refreshAi(!1),this._aiOn()&&!this._voice&&this._loadVoice(),this._aiOn()&&this._loadUsage()),e==="dados"&&this._loadBackups()}}_tick(){if(this._now=Date.now(),!this._data)return;let{cur:t}=this._slot(),e=t?`${t.min}|${t.entries.map(o=>this._keyOf(o)).join(",")}`:"";if(e===this._slotKey)return;let i=!(this._slotKey==null)&&this._view().name==="now"&&!this._peek,r=this.renderRoot&&this.renderRoot.querySelector("textarea.ink");i&&r&&this.renderRoot.activeElement===r||(this._slotKey=e,this._choice=null,this._scrollChip=!0,i&&this._setPad(this._nowPad()))}_peekAt(t){let{cur:e}=this._slot();this._choice=null,this._peek=e&&t.min===e.min?null:t,this._setPad(this._nowPad()),this._haptic("light")}_backToNow(){this._peek=null,this._choice=null,this._scrollChip=!0,this._setPad(this._nowPad())}_choose(t){this._choice=this._keyOf(t),this._setPad(this._padEntryPad(t))}_snap(t){let e=this._block(t.block),a=this._pagesOf(t.block),i=t.page!=="new"?this._page(t.page):null,r=i?a.indexOf(i):a.length,o=this.renderRoot.querySelector("textarea.ink");return{text:i?i.text:"",paper:e?e.paper:"pautado",created:i?i.created:null,times:i?i.times:[],num:r+1,total:a.length+(i?0:1),scroll:o&&this._pad&&this._pad.page===t.page?o.scrollTop:0}}_flip(t){if(this._turn||!this._pad)return;let e=this._pad,a=this._pagesOf(e.block),i=e.page==="new"||!this._page(e.page),r=i?a.length:a.findIndex(l=>l.id===e.page),o;if(t>0){if(i)return this._haptic("light");if(r>=a.length-1){if(!a[r].text.trim())return this._showToast("Esta folha ainda est\xE1 em branco");o="new"}else o=a[r+1].id}else{if(r<=0)return this._haptic("light");o=a[r-1].id}this._haptic("light");let n={block:e.block,page:o};if(this._wide){let l=this.renderRoot.querySelector("textarea.ink");l&&this.renderRoot.activeElement===l&&o!=="new"&&l.blur(),this._setPad(n),o==="new"&&this.updateComplete.then(()=>(this.renderRoot.querySelector("textarea.ink")||{focus(){}}).focus({preventScroll:!0}));return}if(o==="new"){let l=this.renderRoot.querySelector("textarea.ink");l&&l.focus({preventScroll:!0})}else{let l=this.renderRoot.querySelector("textarea.ink");l&&this.renderRoot.activeElement===l&&l.blur()}if(dr()){this._setPad(n);return}if(t>0){let l=this._snap(e);this._setPad(n),this._turn={dir:"next",snap:l,key:Date.now()}}else this._turn={dir:"prev",snap:this._snap(n),key:Date.now()},this._pendingPad=n;clearTimeout(this._turnTimer),this._turnTimer=setTimeout(()=>{let l=this._pendingPad;this._pendingPad=null,l&&this._setPad(l,{keepTurn:!0}),this._turn=null;let h=this.renderRoot.querySelector("textarea.ink");h&&!this._turn&&(h.scrollTop=0)},ir)}_touchStart(t){let e=t.touches&&t.touches[0];this._tx=e?{x:e.clientX,y:e.clientY,at:Date.now()}:null}_touchEnd(t){let e=this._tx;this._tx=null;let a=t.changedTouches&&t.changedTouches[0];if(!e||!a||Date.now()-e.at>600)return;let i=a.clientX-e.x,r=a.clientY-e.y;Math.abs(i)>60&&Math.abs(r)<45&&this._flip(i<0?1:-1)}async _openPage(t,e=null){this._closeSheet();let a=this._view();a.name==="block"&&a.id===t||a.name==="now"&&this._pad&&this._pad.block===t?this._setPad(e?{block:t,page:e}:this._lastPad(t)):(this._openAt={block:t,page:e},await this._go(`/bloco/${t}`)),e==="new"&&this.updateComplete.then(()=>{let i=this.renderRoot.querySelector("textarea.ink");i&&i.focus({preventScroll:!0})})}_view(){let t=(this._path||"").replace(/\/+$/,""),e;return(e=t.match(/^\/bloco\/([a-z0-9]+)$/i))?{name:"block",id:e[1]}:t==="/blocos"?{name:"shelf"}:t==="/buscar"?{name:"search"}:t==="/mais"?{name:"more"}:t==="/categorias"?{name:"categorias"}:t==="/sobre"?{name:"sobre"}:(e=t.match(/^\/config(?:\/(integracoes|dados|aparencia|opcoes))?$/))?{name:"config",tab:e[1]||"integracoes"}:{name:"now"}}async _go(t,e=!1,a=null){this._sheet&&this._closeSheet(),this._popping&&await this._popping;let i=(history.state&&history.state.rvDepth||0)+(e?0:1),r={...a||{},rvDepth:i,rvPath:t};e?history.replaceState(r,""):history.pushState(r,""),this._path=t,this._enterView();let o=this.renderRoot&&this.renderRoot.querySelector("main");o&&o.scrollTo({top:0,behavior:"instant"})}_back(){history.state&&history.state.rvDepth>0?history.back():this._go("",!0)}_openFromMenu(t){if(this._haptic("light"),t==="relatorio")return this._openReport();this._go(t,!1,{rvUp:!0})}_openReport(){if(!this.api.reportUrl)return this._showToast("Na pr\xE9via o relat\xF3rio n\xE3o abre. No app, ele abre pronto para imprimir ou baixar em PDF.");let t=N.get(rr,{})||{},e=new URLSearchParams;t.categoria&&(t.categoria==="sem"||this._cat(t.categoria))&&e.set("categoria",t.categoria),t.bloco&&this._block(t.bloco)&&e.set("bloco",t.bloco),e.set("tema",this._dark?"escuro":"claro"),e.set("cor",this._accent().fill),location.href=this.api.reportUrl(e.toString())}_fromMenu(){return $e.includes(this._view().name)&&!!(history.state&&history.state.rvUp)}_toMenu(){this._fromMenu()?history.back():this._go("/mais",!0)}_onSwipeStart(t){this._sw=this._sheet||this._cam||this._turn?null:di(t,".pad")}_onSwipeEnd(t){let e=ui(t,this._sw);if(this._sw=null,!e||this._sheet||this._cam)return;let a=[["now",""],["shelf","/blocos"],["search","/buscar"],["more","/mais"]],i=this._view().name;if(i==="block"){if(e>0)return;this._haptic("light"),this._back();return}if($e.includes(i)){if(e>0)return;this._haptic("light"),this._toMenu(),Le(this,"more",e);return}let r=a.findIndex(([n])=>n===i),o=r+e;r<0||o<0||o>=a.length||(this._haptic("light"),this._goTab(a[o][1]),Le(this,a[o][0],e))}_popEntry(t,e=1){if(!(history.state&&history.state[t]))return Promise.resolve();let a=new Promise(i=>{let r=()=>{clearTimeout(o),this._popWaiters=(this._popWaiters||[]).filter(n=>n!==r),this._popping===a&&(this._popping=null),i()},o=setTimeout(r,600);this._popWaiters=[...this._popWaiters||[],r]});return this._popping=a,history.go(-e),a}_goTab(t){let e=this._view().name;if($e.includes(e)){if(t==="/mais")return this._toMenu();if(t!==""&&this._fromMenu()){this._afterPop=t,history.back();return}}if(t===""){if(e==="now"){this._peek&&this._backToNow();let i=this.renderRoot.querySelector("main");i&&i.scrollTo({top:0});return}let a=history.state&&history.state.rvDepth||0;a>0?history.go(-a):this._go("",!0);return}if(t==="/blocos"&&e==="block"){this._go(t,!0);return}this._go(t,e!=="now")}_onPopState(){if(this._cam&&!(history.state&&history.state.rvCam)&&this._closeCamera(!0),this._parentSheet&&!(history.state&&history.state.rvSub)){let a=this._parentSheet;this._parentSheet=null,this._sheet&&history.state&&history.state.rvSheet&&(this._sheet=a.sheet,this._form=a.form)}this._sheet&&!(history.state&&history.state.rvSheet)&&(this._stopVoice(),this._chatStop(),this._sheet=null,this._form=null),this._sel&&!(history.state&&history.state.rvSel)&&!this._sheet&&(this._sel=null);let t=history.state&&history.state.rvPath||"";if(t!==this._path){this._path=t;let a=this._view();a.name==="block"&&this._data&&!this._block(a.id)?this._go("/blocos",!0):this._enterView()}for(let a of[...this._popWaiters||[]])a();let e=this._afterPop;this._afterPop=null,e!=null&&this._go(e,!0)}async _openSheet(t,e=null){let a=!!this._sheet;if(!a&&this._popping&&await this._popping,this._sheet=t,this._form=e,!a)try{history.pushState({...history.state||{},rvSheet:!0},"")}catch{}}_closeSheet(){if(!this._sheet)return Promise.resolve();this._releaseImages(),this._stopVoice(),this._sheet==="chat"&&this._chatStop();let t=!!this._parentSheet;return this._parentSheet=null,this._sheet=null,this._form=null,this._popEntry("rvSheet",t?2:1)}_openSubSheet(t,e){if(!this._sheet)return this._openSheet(t,e);this._parentSheet={sheet:this._sheet,form:this._form},this._sheet=t,this._form=e;try{history.pushState({...history.state||{},rvSheet:!0,rvSub:!0},"")}catch{}}_sheetBack(){this._parentSheet&&history.state&&history.state.rvSub?history.back():this._closeSheet()}_openConfirm(t){return this._openSubSheet("confirm",t)}_setForm(t){this._form={...this._form,...t}}_haptic(t){this.env&&this.env.haptic&&this.env.haptic(t)}_showToast(t,e=null){clearTimeout(this._toastTimer),this._toast={text:t,action:e,id:Date.now()},this._toastTimer=setTimeout(()=>this._toast=null,e?5e3:2600)}_userName(){let t=na();return(this._user&&this._user.name||t&&t.user&&t.user.name||"").trim().split(/\s+/)[0]}_aiOn(){return this._app("ai_off",!1)!==!0}_aiEff(){return this._aiOn()?this._ai||{}:{ready:!1,images:!1,entities:[],off:!0}}async _setAiOn(t){await this._saveSettings({app:{ai_off:t?null:!0}}),t&&(this._refreshAi(),this._loadVoice(!0))}async _loadVoice(t=!1){if(!(!this.api||!this.api.voiceStatus)){try{this._voice=await this.api.voiceStatus(t)}catch(e){this._voice={ready:!1,reason:e.message}}this.requestUpdate()}}async _chooseVoice(t){await this._saveSettings({app:{voice_engine:t||null}}),await this._loadVoice(!0),this._showToast("Fala para texto atualizada")}_renderMicBtn(){return!this._aiOn()||!this._voice||!this._voice.ready?m:c`<button class="mic-top" aria-label="Falar: criar uma folha falando" title="Falar" @click=${()=>this._openNew("voice")}>${p("mic")}</button>`}async _startVoice(){if(this._rec||!this._form)return;this._setForm({step:"voice",rec:"starting",secs:0,level:0,error:null});let t=new yt(e=>this._voiceLevel=e);this._rec=t;try{await t.start()}catch(e){t.cancel(),this._rec===t&&(this._rec=null),this._form&&this._form.step==="voice"&&this._setForm({rec:"off",error:he(e)});return}if(this._rec!==t||!this._form||this._form.step!=="voice")return t.cancel();this._setForm({rec:"on"}),clearInterval(this._recTimer),this._recTimer=setInterval(()=>{if(this._rec!==t)return clearInterval(this._recTimer);let e=t.seconds();this._setForm({secs:e,level:this._voiceLevel||0}),e>=120&&this._finishVoice()},120)}_stopVoice(){clearInterval(this._recTimer),this._rec&&this._rec.cancel(),this._rec=null}async _finishVoice(){let t=this._rec;if(!t)return;clearInterval(this._recTimer),this._rec=null;let e=t.stop();if(e.length<16e3*.4){this._setForm({rec:"off",error:"N\xE3o ouvi nada. Toque no microfone e fale."});return}let a=this._importToken=Date.now();this._setForm({step:"loading",error:null,prevStep:"voice",loadingText:"Transcrevendo o que voc\xEA disse\u2026"});try{let i=await this.api.voiceText(e);if(this._importToken!==a||this._sheet!=="new")return;this._setForm({text:i.text,heard:i.text}),this._readText(!0)}catch(i){if(this._importToken!==a||this._sheet!=="new")return;this._setForm({step:"voice",rec:"off",error:i.message||"N\xE3o consegui transcrever."})}}_renderVoiceStep(t){let e=this._form,a=e.rec==="on",i=Math.floor((e.secs||0)/60),r=String(Math.floor((e.secs||0)%60)).padStart(2,"0"),o=this._block(e.target);return c`
      ${t}
      <div class="voice ${a?"on":""}">
        <button class="voice-mic" style="--lvl:${a?(e.level||0).toFixed(2):0}" aria-label=${a?"Pronto: usar o que falei":"Come\xE7ar a falar"} @click=${()=>a?this._finishVoice():this._startVoice()}>
          <span class="voice-ring"></span>${p(a?"check":"mic")}
        </button>
        <div class="voice-state">${a?c`<b>Ouvindo…</b> <span class="voice-time">${i}:${r}</span>`:e.rec==="starting"?"Abrindo o microfone\u2026":"Toque no microfone e fale"}</div>
        <p class="voice-hint">${a?"Toque de novo quando terminar.":c`Por exemplo: <i>“Reunião de sexta: levar o orçamento e confirmar o horário com a Ana”</i>.`}</p>
        ${o?c`<p class="voice-hint">Vai para <b>${o.name}</b> (dá para trocar na revisão).</p>`:m}
      </div>
      ${e.error?c`<div class="imp-error">${p("circle-alert")}<span>${e.error}</span></div>`:m}
      <div class="sheet-actions">
        <button class="btn outline" @click=${()=>(this._stopVoice(),this._closeSheet())}>${p("x")}Cancelar</button>
        <button class="btn primary" ?disabled=${!a} @click=${()=>this._finishVoice()}>${p("sparkles")}Pronto</button>
      </div>
    `}_renderVoicePanel(){let t=this._voice,e=this._app("voice_engine","")||"",a=t&&t.options||[],i=!t||this._voiceChecking,r=i?"off":t.ready&&!t.missing?"ok":t.ready?"warn":"bad",o=i?"Verificando\u2026":t.ready?"Pronto para ouvir":"Sem fala para texto",n=i?"":t.ready?`Transcreve com ${t.name}.${t.missing?" O escolhido n\xE3o foi encontrado: usando o autom\xE1tico.":""}`:t.reason||"",l=async()=>{this._voiceChecking=!0,this.requestUpdate(),await this._loadVoice(!0),this._voiceChecking=!1,this.requestUpdate()};return c`<div class="panel" id="falar">
      ${this._secHead("mic","Falar","Quem transforma a fala em texto. N\xE3o muda o assistente de voz do Home Assistant.")}
      <div class="ai-state ${r}"><span class="dot"></span><div><b>${o}</b>${n?c`<span>${n}</span>`:m}</div></div>
      ${a.length||e?c`<label class="field" style="margin:14px 0 0">
            <span class="flabel">${p("mic","lbl-ic")}Fala para texto</span>
            <select class="select" aria-label="Fala para texto" @change=${h=>this._chooseVoice(h.target.value)}>
              <option value="" ?selected=${!e}>Automático${t&&t.auto?`: ${t.auto.name}`:""}</option>
              ${a.map(h=>c`<option value=${h.id} ?selected=${h.id===e}>${h.name}</option>`)}
              ${e&&!a.some(h=>h.id===e)?c`<option value=${e} selected>${e} (não encontrado)</option>`:m}
            </select>
          </label>`:m}
      <div class="ai-actions"><button class="btn outline" ?disabled=${i} @click=${l}>${p("rotate-ccw")}Verificar de novo</button></div>
      ${t&&!t.ready?c`<div class="steps-box">
            <b>Como configurar</b>
            <ol class="steps">
              <li>Com o Home Assistant Cloud, a fala para texto já vem pronta.</li>
              <li>Sem ele, instale um motor de fala: o app Whisper (local, de graça) com a integração Wyoming, ou a fala para texto de uma IA como Google Gemini ou OpenAI.</li>
              <li>Volte aqui, toque em Verificar de novo e escolha o motor na lista.</li>
            </ol>
          </div>`:m}
    </div>`}async _loadUsage(){if(this.api.usage){try{this._usage=await this.api.usage()}catch{this._usage=null}this.requestUpdate()}}_renderUsage(){let t=this._ai||{};return $i({u:this._usage,day:this._usageDay,onDay:e=>(this._usageDay=e,this.requestUpdate()),head:this._secHead("chart-column","Uso da IA","As chamadas do app para a IA. Os tokens s\xE3o estimados."),app:"MemorIA",using:t.using&&t.using.id||"",names:Object.fromEntries((t.entities||[]).map(e=>[e.id,e.name]))})}async _refreshAi(t=!0){if(!(!t&&Date.now()-this._aiAt<6e4)){this._aiChecking=!0,this.requestUpdate();try{this._ai=await this.api.aiStatus()}catch(e){this._ai={...this._ai,ready:!1,images:!1,reason:e.message}}this._aiAt=Date.now(),this._aiChecking=!1,this.requestUpdate()}}async _chooseAi(t){await this._saveSettings({app:{ai_entity:t}}),await this._refreshAi(),this._showToast("IA do app atualizada")}_openAiSettings(){this._closeSheet(),this._go("/config",this._view().name!=="now").then(()=>this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("#leitura-ia");t&&t.scrollIntoView({block:"start",behavior:"smooth"})}))}async _loadBackups(){try{this._backups=await this.api.backups()}catch(t){this._backups={available:!1,error:t.message,backups:[]}}this.requestUpdate()}async _createBackup(){this._busy="backup",this.requestUpdate();try{let t=await this.api.createBackup();this._showToast(`Backup salvo em ${t.folder}/${t.name}`),this._haptic("success"),await this._loadBackups()}catch(t){this._showToast(`N\xE3o consegui criar o backup. ${t.message}`)}this._busy=null,this.requestUpdate()}_export(t,e){this.api.exportUrl(t)||(e.preventDefault(),this._showToast("Na pr\xE9via os arquivos n\xE3o s\xE3o baixados."))}_pickImport(){let t=this.renderRoot.querySelector("#mm-import");t&&(t.value="",t.click())}_onImportFile(t){let e=t.target.files&&t.target.files[0];t.target.value="",e&&this._openConfirm({title:"Importar arquivo?",text:`Os blocos e folhas de agora s\xE3o trocados pelos de \u201C${z(e.name,40)}\u201D. Antes, o app guarda uma c\xF3pia do que existe hoje em Vers\xF5es anteriores.`,label:"Importar",run:async()=>{this._closeSheet();try{let a=await this.api.importFile(e);this._haptic("success"),this._showToast(`Importado: ${O(a.blocks,"bloco","blocos")} e ${O(a.pages,"folha","folhas")}`)}catch(a){this._showToast(`N\xE3o consegui importar. ${a.message}`)}}})}_confirmRestoreBackup(t){this._openConfirm({title:"Restaurar este backup?",text:`Os blocos e folhas de agora s\xE3o trocados pelos do backup de ${this._dateTime(t.date)}. Antes, o app guarda uma c\xF3pia do que existe hoje.`,label:"Restaurar",run:async()=>{this._closeSheet();try{let e=await this.api.restoreBackup(t.name);this._showToast(`Backup restaurado: ${O(e.pages,"folha","folhas")}`)}catch(e){this._showToast(e.message)}}})}async _openVersions(){this._openSheet("versions",{list:null,error:null});try{let t=await this.api.versions();this._sheet==="versions"&&this._setForm({list:t})}catch(t){this._sheet==="versions"&&this._setForm({error:t.message})}}_confirmRestoreVersion(t){this._openConfirm({title:"Restaurar esta vers\xE3o?",text:`Os blocos e folhas de agora s\xE3o trocados pelos de ${this._dateTime(t.when)}. Antes, o app guarda uma c\xF3pia do que existe hoje.`,label:"Restaurar",run:async()=>{this._closeSheet();try{await this.api.restoreVersion(t.name),this._showToast("Vers\xE3o restaurada")}catch(e){this._showToast(e.message)}}})}_confirmErase(){let t=this._data;this._openConfirm({title:"Apagar tudo?",text:`Saem ${O(t.blocks.length,"bloco","blocos")} e ${O(t.pages.length,"folha","folhas")}. Os ajustes continuam e uma c\xF3pia fica em Vers\xF5es anteriores.`,label:"Apagar tudo",danger:!0,run:async()=>{this._closeSheet();try{await this.api.eraseAll(),this._showToast("Tudo apagado. Uma c\xF3pia ficou em Vers\xF5es anteriores.")}catch(e){this._showToast(e.message)}}})}_dateTime(t){let e=new Date(t),a=i=>String(i).padStart(2,"0");return`${a(e.getDate())}/${a(e.getMonth()+1)}/${e.getFullYear()} \xE0s ${a(e.getHours())}:${a(e.getMinutes())}`}_openBlockSheet(t){let e=t||null;this._openSheet("block",{id:e?e.id:null,name:e?e.name:"",color:e?e.color:Je(this._data.blocks,lt.map(a=>a.id),"lilas"),paper:e?e.paper:"pautado",periods:e?[...e.periods||[]]:[],times:e?[...e.times||[]]:[],dur:e&&e.dur||0,category:e?e.category||"":this._shelfCat()&&this._shelfCat()!=="sem"?this._shelfCat():"",newCat:null,owner:e&&e.owner||""}),this._loadPeople(),e||this.updateComplete.then(()=>{let a=this.renderRoot.querySelector(".sheet input[type=text]");a&&a.focus()})}async _loadPeople(){if(this.api.people)try{let t=await this.api.people();Array.isArray(t.people)&&(this._people=t.people),(t.person||"")!==this._me()&&(this._user={...this._user,person:t.person||""},this._cache={...this._cache,data:null},this._view().name==="now"&&!this._sheet&&this._enterView()),this.requestUpdate()}catch{}}async _saveBlockSheet(t={}){let e=this._form,a={name:(e.name||"").trim()||"Novo bloco",color:e.color,paper:e.paper,periods:e.periods,times:e.times,dur:(e.periods.length||e.times.length)&&e.dur||0,category:e.category||"",owner:we(e.owner||""),...t};e.id&&(a.id=e.id);try{if(e.newCat!=null&&e.newCat.trim()){let r=e.newCat.trim(),o=this._cats().find(l=>j(l.name).trim()===j(r)),n=o||await this.api.saveCategory({name:r,color:this._cats().some(l=>l.color===e.color)?this._freeCatColor():e.color});o||this._putCategory(n),a.category=n.id,this._setForm({category:n.id,newCat:null})}let i=await this.api.saveBlock(a);await this._closeSheet(),this._onEvent({kind:"block",block:i}),this._haptic("success"),"archived"in t?this._afterArchive(i,!!t.archived):e.id?this._showToast("Bloco salvo"):this._openPage(i.id,"new")}catch(i){this._showToast(`N\xE3o consegui salvar o bloco: ${i.message}`)}}_afterArchive(t,e){if(!e)return this._showToast("Bloco de volta aos blocos");let a=this._view();a.name==="block"&&a.id===t.id&&this._go("/blocos",!0),this._showToast("Bloco arquivado",{label:"Desfazer",run:()=>this._setArchived(t,!1)})}async _setArchived(t,e){try{let a=await this.api.saveBlock({id:t.id,archived:e});this._onEvent({kind:"block",block:a}),this._haptic("success"),this._afterArchive(a,e)}catch(a){this._showToast(`N\xE3o consegui ${e?"arquivar":"desarquivar"}: ${a.message}`)}}_confirmDeleteBlock(){let t=this._form,e=this._block(t.id);if(!e)return;let a=this._pagesOf(e.id).length;this._openConfirm({title:`Apagar \u201C${z(e.name,24)}\u201D?`,text:a?`As ${O(a,"folha","folhas")} deste bloco tamb\xE9m ser\xE3o apagadas. N\xE3o d\xE1 para desfazer.`:"Este bloco est\xE1 vazio.",label:"Apagar bloco",danger:!0,run:async()=>{this._closeSheet();try{await this.api.deleteBlock(e.id),this._onEvent({kind:"block_deleted",id:e.id}),this._showToast("Bloco exclu\xEDdo")}catch(i){this._showToast(`N\xE3o consegui apagar: ${i.message}`)}}})}_freeCatColor(){return Je(this._cats(),lt.map(t=>t.id),"grafite")}_openCategorySheet(t){this._openSheet("category",{id:t?t.id:null,name:t?t.name:"",color:t?t.color:this._freeCatColor()}),t||this.updateComplete.then(()=>{let e=this.renderRoot.querySelector(".sheet input[type=text]");e&&e.focus()})}_putCategory(t){this._onEvent({kind:"category",category:t})}async _saveCategorySheet(){let t=this._form,e=(t.name||"").trim();if(!(!e||t.busy)){this._setForm({busy:!0});try{let a=await this.api.saveCategory({...t.id?{id:t.id}:{},name:e,color:t.color});this._putCategory(a),this._closeSheet(),this._haptic("success"),this._showToast(t.id?"Categoria salva":"Categoria criada")}catch(a){this._sheet==="category"&&this._setForm({busy:!1}),this._showToast(a.message)}}}_confirmDeleteCategory(){let t=this._cat(this._form.id);if(!t)return;let e=this._data.blocks.filter(a=>a.category===t.id).length;this._openConfirm({title:`Apagar \u201C${z(t.name,24)}\u201D?`,text:e?`${e===1?"O bloco dela fica":`Os ${e} blocos dela ficam`} sem categoria. As folhas n\xE3o mudam.`:"Nenhum bloco usa esta categoria.",label:"Apagar categoria",danger:!0,run:async()=>{this._closeSheet();try{await this.api.deleteCategory(t.id),this._onEvent({kind:"category_deleted",id:t.id}),N.get(Se,"")===t.id&&N.set(Se,""),this._showToast("Categoria apagada")}catch(a){this._showToast(`N\xE3o consegui apagar: ${a.message}`)}}})}async _saveSettings(t){let e={periods:this._data.periods,app:this._data.app},a={...this._data.app,...t.app||{}},i={...this._data.periods,...t.periods||{}};this._data={...this._data,app:a,periods:i};try{let r=await this.api.saveSettings(t);this._data={...this._data,...r}}catch(r){this._data={...this._data,...e},this._showToast(`N\xE3o consegui salvar: ${r.message}`)}this._tick()}_whenParts(t,e=!0){let a=tt(this._data),i=[];for(let r of t.periods||[]){let o=Yt(r);o&&i.push({icon:o.icon,label:o.label,time:a[r]})}for(let r of t.times||[])i.push({icon:"clock",label:r,time:r});if(e){let r=this._pagesOf(t.id).filter(o=>(o.times||[]).length).length;r&&i.push({icon:"pin",label:O(r,"trecho","trechos")})}return i}_openPageMenu(){let t=this._pad,e=t&&t.page!=="new"?this._page(t.page):null;e&&this._openSheet("pagemenu",{page:e.id})}async _setPageDur(t,e){await this._savePageMeta(t,{dur:e}),this._tick()}_durPick(t,e){return c`<div class="field">
      <span class="flabel" id="dur-l">${p("hourglass","lbl-ic")}Fica no Agora</span>
      <div class="chip-row grid dur-pick" role="radiogroup" aria-labelledby="dur-l">
        ${Ge.map(a=>c`<button class="pick ${t===a?"on":""}" role="radio" aria-checked=${t===a?"true":"false"} @click=${()=>e(a)}>${p(a?"hourglass":"arrow-right-left")}<span>${a?`${a/60} h`:"At\xE9 o pr\xF3ximo"}</span></button>`)}
      </div>
    </div>`}async _setPageTimes(t,e){let a=[...new Set(e.map(Ct).filter(Boolean))].sort();await this._savePageMeta(t,{times:a}),this._tick()}async _movePage(t,e){let a=this._page(t),i=this._block(e);if(!a||!i||a.block===e)return;let r=a.block,o=this._pagesOf(r),n=o.indexOf(a),l=o[n-1]||o[n+1];this._closeSheet();let h=this._pad&&this._pad.page===t;if(h&&(this._pad={block:r,page:l?l.id:"new"}),!await this._savePageMeta(t,{block:e})){h&&(this._pad={block:r,page:t});return}this._showToast(`Folha movida para ${z(i.name,22)}`,{label:"Ver",run:()=>this._openPage(e,t)})}_confirmDeletePage(t){let e=this._page(t);e&&this._openConfirm({title:"Arrancar esta folha?",text:e.text.trim()?`\u201C${z(G(Q(e.text)),60)}\u201D ser\xE1 apagada.`:"A folha em branco ser\xE1 removida.",label:"Apagar folha",danger:!0,run:()=>{this._closeSheet();let a={...e};this._deletePage(t),this._haptic("medium"),this._showToast("Folha apagada",{label:"Desfazer",run:()=>{this._dropped.delete(a.id),this._putPage(a),this._base.delete(a.id),this._queueSave(a.id,0),this._setPad({block:a.block,page:a.id})}})}})}_openLinkSheet(t){this._openSubSheet("link",{page:t,url:"",name:"",error:""}),this.updateComplete.then(()=>{let e=this.renderRoot.querySelector('.sheet textarea[aria-label="Link"]');e&&e.focus()})}_renderLinkSheet(){let t=this._form;return c`
      ${this._sheetHead("Adicionar link")}
      <label class="field">
        <span class="flabel">${p("link","lbl-ic")}Link</span>
        <textarea class="grow" rows="1" inputmode="url" autocomplete="off" autocapitalize="off" spellcheck="false" .value=${t.url} placeholder="https://…" aria-label="Link" @input=${e=>this._setForm({url:e.target.value,error:""})} @keydown=${e=>e.key==="Enter"&&(e.preventDefault(),this._addLink())}></textarea>
        ${t.error?c`<span class="field-error">${t.error}</span>`:m}
      </label>
      <label class="field">
        <span class="flabel">${p("pencil","lbl-ic")}Nome (opcional)</span>
        <textarea class="grow" rows="1" maxlength="120" .value=${t.name} placeholder="Ex.: Receita do bolo" aria-label="Nome do link" @input=${e=>this._setForm({name:e.target.value})} @keydown=${e=>e.key==="Enter"&&(e.preventDefault(),this._addLink())}></textarea>
      </label>
      <div class="sheet-actions">
        <button class="btn outline" @click=${()=>this._sheetBack()}>Cancelar</button>
        <button class="btn primary" ?disabled=${!(t.url||"").trim()} @click=${()=>this._addLink()}>Adicionar</button>
      </div>
    `}async _addLink(){let t=this._form,e=this._page(t.page);if(!e)return this._closeSheet();let a=zi(t.url);if(!a){this._setForm({error:"Esse link n\xE3o abre. Use um endere\xE7o como https://site.com.br"});return}this._putPage({...e,text:Oi(e.text,a,t.name)}),this._queueSave(e.id,0),this._closeSheet(),this._haptic("success"),this._showToast("Link adicionado")}async _copyPage(t){let e=this._page(t);if(e){try{await navigator.clipboard.writeText(e.text),this._showToast("Texto copiado")}catch{this._showToast("N\xE3o consegui copiar")}this._closeSheet()}}_defaultTarget(){let t=this._pad,e=t&&this._block(t.block);if(e&&!e.archived)return e.id;let a=this._blocks().find(i=>this._mine(i))||this._blocks()[0];return a?a.id:null}async _openNew(t="pick"){let e=this._defaultTarget();if(!e){this._openBlockSheet(null);return}this._releaseImages(),this._importToken=0;let a=this._openSheet("new",{target:e,step:t==="text"?"text":t==="voice"?"voice":"pick",text:"",images:[],result:"",provider:null,error:null,note:null});return t==="voice"&&this.updateComplete.then(()=>this._startVoice()),t==="photos"&&this._pickFiles("photos"),t==="scan"&&this._openCamera(),t==="text"&&this._focusSheetText(),a}_write(){let t=this._form.target;this._closeSheet(),this._openPage(t,"new")}_focusSheetText(){this.updateComplete.then(()=>{let t=this.renderRoot.querySelector(".sheet textarea");t&&t.focus()})}_pickFiles(t){let e=this.renderRoot.querySelector(t==="scan"?"#mm-scan":"#mm-photos");e&&(e.value="",e.click())}_releaseImages(){let t=this._form;if(t&&t.images)for(let e of t.images)e.url&&URL.revokeObjectURL(e.url)}_isHaAndroid(){return/Home Assistant\//.test(navigator.userAgent)&&/Android/.test(navigator.userAgent)}async _onFiles(t){let e=o=>o.type==="application/pdf"||/\.pdf$/i.test(o.name||""),a=[...t.target.files||[]].filter(o=>!o.type||o.type.startsWith("image/")||e(o)).slice(0,6);if(t.target.value="",a.some(e)&&(a=[a.find(e)]),!a.length)return;this._sheet!=="new"&&await this._openNew("pick");let i=this._form.step==="review";this._setForm({step:"loading",error:null,loadingText:"Preparando as fotos\u2026",prevStep:i?"review":"pick"});let r=[];for(let o of a)if(e(o)){let{files:n}=await le([o]);n[0]&&r.push({mime:"application/pdf",data:n[0].data,url:"",pdf:!0,nome:n[0].nome})}else r.push(await Xe(o));this._readImages(r,i)}_readImages(t,e){if(this._sheet!=="new"||!t.length)return;let a=e?[...this._form.images||[],...t]:(this._releaseImages(),t);this._setForm({step:"loading",images:a,prevStep:e?"review":"pick",loadingText:t.some(i=>i.pdf)?"Lendo o PDF com IA\u2026":t.length>1?`Lendo ${t.length} fotos com IA\u2026`:"Lendo a foto com IA\u2026"}),this._runExtract({images:t,appending:e})}async _runExtract({text:t,images:e,appending:a=!1}){let i=this._importToken=Date.now(),r=()=>i===this._importToken&&this._sheet==="new",o=a?(this._form.result||"").trim():"";try{let n=await this.api.extract({text:t,images:e?e.map(({data:h,mime:u})=>({data:h,mime:u})):void 0});if(!r())return;let l=(n.text||"").trim();if(!l){let h=t?"A IA n\xE3o devolveu nada para essa mensagem.":"N\xE3o consegui ler essa foto. Tente mais de perto e com boa luz.";a?this._setForm({step:"review",note:h}):this._setForm({step:t?"text":"pick",error:h});return}this._haptic("success"),this._setForm({step:"review",result:o?`${o}

${l}`:l,provider:n.provider||null,note:null,error:null})}catch(n){if(!r())return;if(t){this._setForm({step:"review",result:t.trim(),provider:"local",note:"A IA n\xE3o respondeu, ent\xE3o mantive o texto como veio."});return}a?this._setForm({step:"review",note:n.message||"Algo deu errado"}):this._setForm({step:"pick",error:n.message||"Algo deu errado"})}}_readText(t){let e=(this._form.text||"").trim();if(!e){this._focusSheetText();return}if(t&&this._aiEff().ready){this._setForm({step:"loading",error:null,note:null,prevStep:this._form.heard?"voice":"text",loadingText:"Organizando com IA\u2026"}),this._runExtract({text:e});return}this._createFromText(e)}async _pasteClipboard(){try{let t=await navigator.clipboard.readText();if(!t)throw new Error("empty");this._setForm({text:t,error:null})}catch{this._focusSheetText(),this._showToast("Toque e segure no campo para colar")}}_createFromText(t){let e=this._form.target;if(!this._block(e)||!t.trim())return;let a=Date.now(),i={id:Mt(),block:e,text:t.trim(),times:[],created:a,updated:a};this._putPage(i),this._queueSave(i.id,0),this._haptic("success"),this._closeSheet(),this._openPage(e,i.id),this._showToast("Folha criada")}async _openCamera(t={}){let e=navigator.mediaDevices,a=!!t.chat;if(!e||!e.getUserMedia){if(a)return this._chatAttach("fotos");this._pickFiles("scan");return}let i=!a&&!!(this._form&&this._form.step==="review");this._cam={status:"starting",shots:[],torch:!1,torchOk:!1,appending:i,chat:a,flash:0};try{history.pushState({...history.state||{},rvCam:!0},"")}catch{}try{let r=await e.getUserMedia({audio:!1,video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1440}}});if(!this._cam){r.getTracks().forEach(h=>h.stop());return}this._stream=r;let o=r.getVideoTracks()[0],n=o&&o.getCapabilities?o.getCapabilities():{};this._cam={...this._cam,status:"live",torchOk:!!n.torch},await this.updateComplete;let l=this.renderRoot.querySelector(".cam video");l&&(l.srcObject=r,l.play().catch(()=>{}))}catch(r){if(!this._cam)return;let o=r&&(r.name==="NotAllowedError"||r.name==="SecurityError");this._cam={...this._cam,status:"error",error:o?"Sem permiss\xE3o para usar a c\xE2mera. Libere a c\xE2mera para o app do Home Assistant nas configura\xE7\xF5es do celular, ou escolha uma foto.":"N\xE3o consegui abrir a c\xE2mera. Voc\xEA pode escolher uma foto da galeria."}}}_stopStream(){this._stream&&this._stream.getTracks().forEach(t=>t.stop()),this._stream=null}_closeCamera(t=!1){if(!this._cam)return;this._stopStream();let e=this._cam.shots||[];if(!this._cam.used)for(let a of e)URL.revokeObjectURL(a.url);this._cam=null,t||this._popEntry("rvCam")}async _toggleTorch(){let t=this._stream&&this._stream.getVideoTracks()[0];if(!t)return;let e=!this._cam.torch;try{await t.applyConstraints({advanced:[{torch:e}]}),this._cam={...this._cam,torch:e}}catch{this._cam={...this._cam,torchOk:!1}}}async _shoot(){let t=this.renderRoot.querySelector(".cam video");if(!t||!t.videoWidth||!this._cam||this._cam.shots.length>=6)return;let e=1800,a=Math.min(1,e/Math.max(t.videoWidth,t.videoHeight)),i=document.createElement("canvas");i.width=Math.round(t.videoWidth*a),i.height=Math.round(t.videoHeight*a),i.getContext("2d").drawImage(t,0,0,i.width,i.height);let r=await new Promise(n=>i.toBlob(n,"image/jpeg",.86));if(!r||!this._cam)return;let o=await Xe(r,e);this._haptic("light"),this._cam={...this._cam,shots:[...this._cam.shots,o],flash:Date.now()}}async _useShots(){if(!this._cam||!this._cam.shots.length)return;let t=this._cam.shots,e=this._cam.appending,a=this._cam.chat;if(this._cam={...this._cam,used:!0},this._closeCamera(),this._popping&&await this._popping,a)return this._chatAddShots(t);this._sheet!=="new"&&await this._openNew("pick"),this._readImages(t,e&&this._form.step==="review")}_cameraFallback(){let t=this._cam&&this._cam.appending;if(this._cam&&this._cam.chat)return this._closeCamera(),this._chatAttach("fotos");this._closeCamera(),t&&this._form&&this._setForm({step:"review"}),this._pickFiles("scan")}render(){if(!this._ready)return c`<div class="root"><div class="app"><main><div class="boot-msg">${this._bootError?c`${p("circle-alert")}<span>Não consegui abrir o MemorIA: ${this._bootError}. Tentando de novo…</span>`:c`<span class="spin">${p("loader-circle")}</span><span>Abrindo o caderno…</span>`}</div></main></div></div>`;let t=this._view(),e=(t.name==="now"||t.name==="block")&&this._pad?this._block(this._pad.block):null,a=e?this._colorOf(e):this._accent(),i=this._dark,r=`--rv-accent:${a.fill};--rv-accent-ink:${i?a.fill:a.ink};--rv-accent-soft:${be(a.fill,i?.18:.14)};--rv-accent-ink-light:${a.ink};`,o;return t.name==="block"?o=this._renderBlock(t.id):t.name==="shelf"?o=this._renderShelf():t.name==="search"?o=this._renderSearch():t.name==="more"?o=this._renderMore():t.name==="config"?o=this._renderConfig():t.name==="categorias"?o=this._renderCategories():t.name==="sobre"?o=this._renderAbout():o=this._renderNow(),c`
      <div class="root" style=${r}>
        <div class="app">
          ${!this.env||this.env.topbar?c`<header class="topbar"><div class="title">Memor<b>IA</b></div></header>`:m}
          ${this._online?m:c`<div class="offline">${p("wifi-off")}<span>Sem conexão com o MemorIA. Reconectando…</span></div>`}
          <main @touchstart=${n=>this._onSwipeStart(n)} @touchend=${n=>this._onSwipeEnd(n)}>${o}</main>
          ${this._editing!=null?this._renderWriteBar():this._renderNav(t)}
        </div>
        ${this._renderSheet()} ${this._renderToast()} ${this._renderCamera()}
        <input id="mm-photos" class="sr" type="file" accept="image/*,application/pdf" ?multiple=${!this._isHaAndroid()} tabindex="-1" aria-hidden="true" @change=${n=>this._onFiles(n)} />
        <input id="mm-scan" class="sr" type="file" accept="image/*" capture="environment" tabindex="-1" aria-hidden="true" @change=${n=>this._onFiles(n)} />
        <input id="mm-import" class="sr" type="file" accept=".zip,.json,application/zip,application/x-zip-compressed,application/json" tabindex="-1" aria-hidden="true" @change=${n=>this._onImportFile(n)} />
      </div>
    `}_renderNav(t){let e=(a,i,r,o)=>c`
      <button class="tab ${a.includes(t.name)?"on":""}" @click=${()=>this._goTab(i)} aria-label=${r}>${p(o)}<span>${r}</span></button>
    `;return c`
      <nav>
        <div class="tabs">
          ${e(["now"],"","Agora","clock-3")} ${e(["search"],"/buscar","Buscar","search")}
          <button class="tab fab" @click=${()=>this._openNew()} aria-label="Adicionar">
            <span class="pill">${p("plus")}</span>
          </button>
          ${e(["shelf","block"],"/blocos","Blocos","library")} ${e(["more",...$e],"/mais","Mais","ellipsis")}
        </div>
        ${this._full&&this._wide?c`<button class="full-exit" @click=${()=>this._setFull(!1)}>${p("minimize")}<span>Sair da tela cheia</span></button>`:m}
      </nav>
    `}_renderHead(t,e,a=!1,i=!1,r="",o=!1){let n=this._userName(),l=this._online?e:{text:"Reconectando ao MemorIA\u2026",tone:"off"};return c`<header class="brand-head">
      <div class="head-row"><p class="eyebrow"><span class="brand">Memor<span>IA</span></span>${n?` \xB7 Ol\xE1, ${n}`:""}</p>${this._renderChatBtn()}${this._renderMicBtn()}${o?this._renderFullBtn():m}</div>
      ${a?c`<button class="uplink" @click=${()=>this._toMenu()}>${p("chevron-left")}Mais</button>`:m}
      <h1 class="page-title ${i?"fit-title":""}"><span class="mais-ic page-ic" aria-hidden="true">${p(lr[r||t]||"notebook")}</span>${t}</h1>
      ${l?c`<p class="status"><span class="dot ${l.tone||""}" aria-hidden="true"></span><span>${l.text}</span>${l.extra||m}</p>`:m}
    </header>`}_renderNowEmpty(t,e,a,i=!1){return c`<section class="page">
      ${this._renderHead("Agora",t,!1,!1,"",!0)}
      <div class="panel now-empty"><div class="empty"><div class="em-icon">${p(i?"notebook-pen":"calendar-clock")}</div><h3>${e}</h3>${a}</div></div>
      <div class="sheet-actions" style="padding:0">
        ${i?c`<button class="btn outline" @click=${()=>this._pickImport()}>${p("upload")}Importar backup</button>`:c`<button class="btn outline" @click=${()=>this._goTab("/blocos")}>${p("library")}Ver blocos</button>`}
        <button class="btn primary" @click=${()=>this._openBlockSheet(null)}>${p("plus")}Novo bloco</button>
      </div>
    </section>`}_othersTimed(){let t=e=>(e.periods||[]).length||(e.times||[]).length||this._pagesOf(e.id).some(a=>(a.times||[]).length);return this._blocks().filter(e=>e.owner&&!this._mine(e)&&t(e))}_renderNow(){let{entries:t,min:e,cur:a}=this._slot(),i=this._pad,r=i?this._block(i.block):null;if(!r){if(!this._data.blocks.length)return this._renderNowEmpty({text:"Nenhum bloco ainda"},"Comece um bloco",c`<p>Crie um bloco de anotações e escolha quando ele abre sozinho: de manhã, à tarde, à noite ou num horário exato.</p>`,!0);if(!this._blocks().some(g=>this._mine(g)))return this._renderNowEmpty({text:"Nenhum bloco aqui",tone:"off"},"Nada para agora",c`<p>Os blocos arquivados e os de outras pessoas ficam em Blocos.</p>`);if(t.length&&!a)return c`<section class="page">
          ${this._renderHead("Agora",null,!1,!1,"",!0)}
          ${this._renderTline(ia(t,e),null)}
          <div class="panel now-empty now-idle"><div class="empty"><div class="em-icon">${p("calendar-clock")}</div><h3>Nada agora</h3><p>Toque num horário para espiar.</p></div></div>
        </section>`;let u=Yt(jt(e,tt(this._data))),d=this._othersTimed(),f=d.length===1?`${z(d[0].name,30)} \xE9 de ${d[0].owner}: s\xF3 abre no Agora de ${d[0].owner}.`:d.length?`Os blocos de outras pessoas (${d.slice(0,3).map(g=>z(g.name,24)).join(", ")}${d.length>3?"\u2026":""}) s\xF3 abrem no Agora delas.`:"";return this._renderNowEmpty({text:`${u.label} \xB7 nada com hor\xE1rio`,tone:"off"},"Nada com hor\xE1rio",c`<p>Um bloco ou uma folha com horário abre aqui sozinho. Escolha nos ajustes do bloco ou no ⋯ da folha.</p>${f?c`<p class="now-whose">${f}</p>`:m}`)}let o=Yt(jt(e,tt(this._data))),n=ia(t,e),l=this._peek||a,h;return this._peek?h={text:`Espiando ${Tt(this._peek.min)}`,tone:"off",extra:c`<button class="text-btn now-btn" @click=${()=>this._backToNow()}>${p("clock-3")}Voltar para agora</button>`}:a?h=null:h={text:o.label,tone:"off"},c`
      <section class="page">
        ${this._renderHead(r.name,h,!1,!0,"Agora",!0)}
        ${this._renderTline(n,a)}
        ${l&&l.entries.length>1?c`<div class="switcher">
              ${l.entries.map(u=>{let d=this._block(u.block);if(!d)return m;let f=this._keyOf(this._pickIn(l))===this._keyOf(u);return c`<button class="pick list ${f?"on":""}" style=${this._cv(d)} @click=${()=>this._choose(u)}><span class="dot"></span><span>${z(d.name,20)}${u.page?" \xB7 trecho":""}</span></button>`})}
            </div>`:m}
        ${this._renderPad()}
      </section>
    `}_renderTline(t,e){return t.length?c`<div class="tline" role="list" aria-label="Agora e a seguir">
      ${t.map(a=>{let i=this._block(a.main.block);if(!i)return m;let r=e&&a.min===e.min&&!this._peek,o=this._peek&&this._peek.min===a.min,n=a.main.kind==="page"?"pin":a.main.kind==="period"?Yt(a.main.period).icon:"clock";return c`<button class="tchip ${r?"on":""} ${o?"peek":""}" role="listitem" style=${this._cv(i)} @click=${()=>this._peekAt(a)} aria-label="${Tt(a.min)} ${i.name}">
          ${p(n)}<b>${Tt(a.min)}</b><span class="dot"></span><span>${z(i.name,18)}${a.entries.length>1?` +${a.entries.length-1}`:""}</span>
        </button>`})}
    </div>`:m}_renderPad(t={}){let e=this._pad,a=e&&this._block(e.block);if(!a)return m;let i=this._pagesOf(a.id),r=e.page!=="new"?this._page(e.page):null,o=r?i.indexOf(r):i.length,n=i.length+(r?0:1),l=this._app("hand",!0),h=r&&o===i.length-1,u=r&&!(h&&!r.text.trim()),d=!!r&&this._editing!==r.id&&(je(r.text)||Ye(r.text)||Vt(r.text)),f=!!r&&this._editing===r.id,g=`Folha ${o+1} de ${n} do bloco ${a.name}`,x=this._wide,w=x?this._splitOf(r,d):null,M=o>0?c`<button class="edge prev" @click=${()=>this._flip(-1)} aria-label="Folha anterior"><span class="hint">${p("chevron-left")}</span></button>`:m,P=u?c`<button class="edge next ${h?"new":""}" @click=${()=>this._flip(1)} aria-label=${h?"Virar para uma folha nova":"Pr\xF3xima folha"}><span class="hint">${p(h?"plus":"chevron-right")}</span></button>`:m,_=(F,at,v,b)=>c`
      ${d?this._renderInkView(r,l,g,F,at,v):m}
      <textarea
        class="ink ${l?"":"normal"} ${d?"behind":""} ${f&&Vt(F)?"live":""}"
        data-size="off"
        data-part=${b}
        @scroll=${y=>this._syncMirror(y.target)}
        .value=${Ha(F)}
        placeholder=${r||b==="r"?"":o===0?"Escreva a primeira folha deste bloco\u2026":"Folha nova. Escreva aqui\u2026"}
        spellcheck="true"
        aria-label=${b==="r"?`${g}, continua\xE7\xE3o`:g}
        @input=${y=>this._onInk(y)}
        @beforeinput=${y=>this._onBeforeInk(y)}
        @keydown=${y=>w&&this._inkKeys(y)}
        @focus=${()=>(this._editing=e.page,this._writing(!0))}
        @blur=${()=>{this._editing=null,this._wpop="",this._writing(!1),r&&this._saving.has(r.id)&&this._flushSave(r.id),setTimeout(()=>this._tick(),400)}}
      ></textarea>
      ${f&&Vt(F)?this._renderMirror(F,l):m}
    `,I=this._renderLeafTop({created:r?r.created:null,times:r?r.times:[],num:o+1,total:n},!!r,!0,this._editing!=null&&this._editing===e.page),C=w?[c`<div class="leaf ${a.paper} left">
            ${I}${_(w.left,0,0,"l")}${this._renderMeasure(r,l,d)}${M}
          </div>`,c`<div class="leaf ${a.paper} right">
            <div class="leaf-top"></div>
            ${w.right!=null?_(w.right,w.left.length+1,w.L,"r"):c`<div class="ink blank" @click=${()=>this._inkReady()}></div>`}${P}
          </div>`]:[c`<div class="leaf ${a.paper}">
            ${I}${_(r?r.text:"",0,0,"")}${M}${P}
          </div>`];return c`
      <div class="pad ${t.tall?"tall":""} ${x?"spread":""}" style=${this._cv(a)} @touchstart=${F=>this._touchStart(F)} @touchend=${F=>this._touchEnd(F)}>
        <div class="pad-cover"></div>
        <div class="pad-stack"></div>
        ${C}
        <div class="spiral" aria-hidden="true">${sr}</div>
        ${this._turn&&!x?c`<div class="turn ${this._turn.dir}" aria-hidden="true">
              <div class="face front leaf ${this._turn.snap.paper}">
                ${this._renderLeafTop(this._turn.snap,!1)}
                <div class="ink ${l?"":"normal"}">${this._inkParts(this._turn.snap.text)}</div>
              </div>
              <div class="face back"></div>
              <div class="shade"></div>
            </div>`:m}
      </div>
    `}_splitOf(t,e){let a=(t?t.text:"").split(`
`),i=`${t?t.id:"new"}|${e?"v":"e"}`,o=this._split&&this._split.key.split("|")[0]===i.split("|")[0]?Math.max(1,Math.min(a.length,this._split.L)):a.length;return{key:i,L:o,left:a.slice(0,o).join(`
`),right:o<a.length?a.slice(o).join(`
`):null}}_renderMeasure(t,e,a){let i=(t?t.text:"").split(`
`);return c`<div class="ink measure ${a?"ink-view":""} ${e?"":"normal"}" aria-hidden="true">${i.map((r,o)=>c`<span class="ln">${a?this._inkParts(r):r}\u200b</span>${o<i.length-1?`
`:""}`)}</div>`}_measureSplit(){let t=this.renderRoot.querySelector(".pad.spread .leaf.left"),e=t&&t.querySelector(".measure"),a=this._pad;if(!e||!a)return;let i=t.querySelector(".ink-view:not(.measure)")||t.querySelector("textarea.ink"),r=a.page!=="new"?this._page(a.page):null,o=!!i&&i.classList.contains("ink-view"),n=`${r?r.id:"new"}|${o?"v":"e"}`,l=i.getBoundingClientRect().top+i.clientHeight+.5,h=[...e.querySelectorAll(".ln")],u=0;for(let P of h){let _=P.getClientRects();if((_.length?_[_.length-1].bottom:0)>l)break;u++}if(u=Math.max(1,u),!this._split||this._split.key!==n||this._split.L!==u){this._split={key:n,L:u},this.requestUpdate();return}let d=this._caretAbs;if(this._caretAbs=null,d==null)return;let f=[...this.renderRoot.querySelectorAll(".pad.spread textarea.ink")],g=this.renderRoot.activeElement;if(!f.length||g&&!f.includes(g))return;let x=f[0],w=d<=x.value.length||f.length<2?x:f[1],M=w===x?Math.min(d,x.value.length):Math.min(d-x.value.length-1,w.value.length);this.renderRoot.activeElement!==w&&w.focus({preventScroll:!0}),(w.selectionStart!==M||w.selectionEnd!==M)&&w.setSelectionRange(M,M),w!==x&&this._scrollToCaret(w,M)}_spreadText(){let t=[...this.renderRoot.querySelectorAll(".pad.spread textarea.ink")];return t.length?t.map(e=>e.value).join(`
`):null}_absOf(t,e){if(t.dataset.part!=="r")return e;let a=this.renderRoot.querySelector('.pad.spread textarea.ink[data-part="l"]');return(a?a.value.length+1:0)+e}_inkKeys(t){let e=t.target,a=[...this.renderRoot.querySelectorAll(".pad.spread textarea.ink")];if(a.length<2||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)return;let[i,r]=a,o=e.selectionStart;if(o!==e.selectionEnd)return;let n=(l,h)=>{t.preventDefault(),l.focus({preventScroll:!0}),l.setSelectionRange(h,h),l===r&&this._scrollToCaret(r,h)};if(e===i){let l=i.value.lastIndexOf(`
`)+1;if(t.key==="ArrowRight"&&o===i.value.length)return n(r,0);if(t.key==="ArrowDown"&&o>=l)return n(r,Math.min(o-l,r.value.split(`
`)[0].length));if(t.key==="Delete"&&o===i.value.length)return t.preventDefault(),this._inkPutAbs(`${i.value}${r.value}`,o)}else{let l=r.value.indexOf(`
`)<0?r.value.length:r.value.indexOf(`
`),h=i.value.lastIndexOf(`
`)+1;if(t.key==="ArrowLeft"&&o===0)return n(i,i.value.length);if(t.key==="ArrowUp"&&o<=l)return n(i,Math.min(h+o,i.value.length));if(t.key==="Backspace"&&o===0)return t.preventDefault(),this._inkPutAbs(`${i.value}${r.value}`,i.value.length)}}_inkPutAbs(t,e){this._caretAbs=e,this._onInkText(t),this.requestUpdate()}_inkParts(t,e=!1,a=null,i=null,r=0,o=0){if(!je(t)&&!Ye(t)&&!Vt(t))return r?c`<span data-o=${r}>${t}</span>`:t;let n=(f,g)=>$t(f,g).map(x=>x.bold||x.big||x.color?c`<span data-o=${x.start} class="fmt ${x.bold?"b":""} ${x.big?"big":""} ${x.color?`c-${x.color}`:""}">${x.text}</span>`:c`<span data-o=${x.start}>${x.text}</span>`),l=(f,g)=>ve(f).map(x=>x.type==="link"?c`<a class="lnk" href=${x.url} target="_blank" rel="noopener noreferrer" title=${x.url} tabindex=${e?"0":"-1"} @click=${w=>this._openLink(w,x.url)}>${p("link")}<span>${x.label}</span></a>`:n(x.text,g+x.start)),h=[],u=r,d=String(t).split(`
`);return d.forEach((f,g)=>{let x=At(f);if(!x)h.push(l(f,u));else{let w=f.slice(x.len),M=i&&i.has(w.replace(/\s+/g," ").trim())?!x.done:x.done,P=_=>{_.stopPropagation(),a&&a(g+o)};h.push(c`<span class="chk-line ${M?"done":""}"><span data-o=${u}>${x.indent}</span><button class="chk" role="checkbox" aria-checked=${M?"true":"false"} aria-label=${`${M?"Desmarcar":"Marcar como feito"}: ${w.trim()||"item"}`} tabindex=${e?"0":"-1"} @click=${P}>${p("check")}</button>${l(w,u+x.len)}</span>`)}g<d.length-1&&h.push(c`<span data-o=${u+f.length}>\n</span>`),u+=f.length+1}),h}_renderMirror(t,e){return c`<div class="ink ink-mirror ${e?"":"normal"}" aria-hidden="true">${this._renderRuns(t)}</div>`}_renderRuns(t){let e=0;return c`${me(t).map(a=>{let i=e;return e+=a.text.length,c`<span data-o=${i} class="${a.mark?"mk":""} ${a.bold?"lb":""} ${a.big&&!a.mark?"lg":""} ${a.color?`lc c-${a.color}`:""}">${a.text}</span>`})}${/\n$/.test(t)?" ":""}`}_syncMirror(t){let e=t&&t.parentElement&&t.parentElement.querySelector(".ink-mirror");e&&e.scrollTop!==t.scrollTop&&(e.scrollTop=t.scrollTop)}_renderInkView(t,e,a,i=t.text,r=0,o=0){let n=this._view().name==="now",l=n?h=>this._markLine(t,h):h=>this._tickLine(t.id,h);return c`<div class="ink ink-view ${e?"":"normal"}" role="textbox" aria-readonly="true" aria-label=${a} tabindex="0" @click=${h=>this._editFromView(h,t)} @keydown=${h=>h.key==="Enter"&&!h.target.closest("a, .chk")&&this._editFromView(h,t)}>${this._inkParts(i,!0,l,n?this._marksOf(t.id):null,r,o)}</div>`}_occ(){let{cur:t}=this._slot(),e=this._peek||t;return e?Bi(e.min,new Date(this._now),!!t&&e.min===t.min):""}_marksOf(t){let e=(this._data.marks||{})[t],a=this._occ();return new Set(a&&e&&e.at===a?e.lines:[])}async _markLine(t,e){let a=String(t.text||"").split(`
`)[e]||"",i=At(a),r=i?a.slice(i.len).replace(/\s+/g," ").trim():"",o=this._occ();if(!r||!o)return;let n=this._marksOf(t.id);n.has(r)?n.delete(r):n.add(r);let l=[...n];this._haptic("light");let h=this._data.marks||{},u={...h};l.length?u[t.id]={at:o,lines:l}:delete u[t.id],this._data={...this._data,marks:u};try{await this.api.saveMarks(t.id,o,l)}catch(d){this._data={...this._data,marks:h},this._showToast(`N\xE3o consegui marcar: ${d.message}`)}}_openLink(t,e){t.stopPropagation(),this._haptic("light"),t.currentTarget.href||(t.preventDefault(),window.open(e,"_blank","noopener"))}_offsetAt(t,e){let a=this.renderRoot,i=null,r=0;try{if(t.clientX||t.clientY){if(document.caretPositionFromPoint){let l=document.caretPositionFromPoint(t.clientX,t.clientY,{shadowRoots:[a]});l&&({offsetNode:i,offset:r}=l)}else if(document.caretRangeFromPoint){let l=document.caretRangeFromPoint(t.clientX,t.clientY);l&&({startContainer:i,startOffset:r}=l)}}}catch{i=null}let o=i&&(i.nodeType===3?i.parentElement:i);if(o&&o.dataset&&o.dataset.o!=null&&i.nodeType===3)return Math.min(e.text.length,Number(o.dataset.o)+r);let n=t.target&&t.target.closest&&t.target.closest("[data-o]");return n?Math.min(e.text.length,Number(n.dataset.o)+n.textContent.length):e.text.length}_tickLine(t,e){let a=this._page(t);a&&(this._haptic("light"),this._putPage({...a,text:qi(a.text,e)}),this._queueSave(t,300))}_inkReady(){let t=[...this.renderRoot.querySelectorAll(".pad textarea.ink")];if(!t.length)return null;let e=t.find(i=>i===this.renderRoot.activeElement);if(e)return e;let a=t[t.length-1];return a.focus({preventScroll:!0}),a.setSelectionRange(a.value.length,a.value.length),a}_inkSet(t,e,a){t.value=e,t.setSelectionRange(a,a),t.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})),this.updateComplete.then(()=>this._scrollToCaret(t,a))}_inkCheck(){let t=[...this.renderRoot.querySelectorAll(".pad textarea.ink")].includes(this.renderRoot.activeElement),e=this._inkReady();if(!e)return;this._haptic("light");let a=e.value;if(!t&&a.trim()&&!/\n[ \t]*$/.test(a)){let h=`${/\n$/.test(a)||!a?"":`
`}${Lt} `;return this._inkSet(e,a+h,a.length+h.length)}let i=e.selectionStart,r=a.lastIndexOf(`
`,i-1)+1,o=At(a.slice(r));if(o)return this._inkSet(e,a.slice(0,r)+o.indent+a.slice(r+o.len),Math.max(r+o.indent.length,i-(o.len-o.indent.length)));let n=/^[ \t]*/.exec(a.slice(r))[0],l=r+n.length;this._inkSet(e,`${a.slice(0,l)}${Lt} ${a.slice(l)}`,i+2)}_onBeforeInk(t){if(t.inputType!=="insertLineBreak"&&t.inputType!=="insertParagraph"&&!(t.inputType==="insertText"&&t.data===`
`))return;let e=t.target,a=e.value,i=e.selectionStart;if(i!==e.selectionEnd)return;let r=a.lastIndexOf(`
`,i-1)+1,o=At(a.slice(r));if(!o||i<r+o.len)return;let n=a.indexOf(`
`,i);if(n<0&&(n=a.length),t.preventDefault(),!a.slice(r+o.len,n).trim())return this._inkSet(e,a.slice(0,r)+o.indent+a.slice(n),r+o.indent.length);let l=`
${o.indent}${Lt} `;this._inkSet(e,a.slice(0,i)+l+a.slice(i),i+l.length)}_inkDone(){let t=[...this.renderRoot.querySelectorAll(".pad textarea.ink")].find(e=>e===this.renderRoot.activeElement)||this.renderRoot.querySelector("textarea.ink");t&&(this._haptic("light"),t.blur())}_editFromView(t,e){if(t.target.closest&&t.target.closest("a, .chk"))return;let a=this._offsetAt(t,e),i=[...this.renderRoot.querySelectorAll(".pad textarea.ink")];if(!i.length)return;let r=i.length>1&&a>i[0].value.length,o=r?i[1]:i[0],n=r?a-i[0].value.length-1:a;(i.length>1||this._wide)&&(this._caretAbs=a),o.focus({preventScroll:!0}),o.setSelectionRange(n,n),this.updateComplete.then(()=>{this.renderRoot.activeElement===o&&(o.setSelectionRange(n,n),this._scrollToCaret(o,n))})}_scrollToCaret(t,e){let a=getComputedStyle(t),i=document.createElement("div");for(let n of["fontFamily","fontSize","fontWeight","lineHeight","letterSpacing","paddingTop","paddingRight","paddingBottom","paddingLeft"])i.style[n]=a[n];Object.assign(i.style,{position:"absolute",visibility:"hidden",left:"-9999px",top:"0",width:`${t.clientWidth}px`,whiteSpace:"pre-wrap",overflowWrap:"anywhere",boxSizing:"border-box"}),i.textContent=t.value.slice(0,e);let r=document.createElement("span");r.textContent="\u200B",i.appendChild(r),this.renderRoot.appendChild(i);let o=r.offsetTop;i.remove(),(o<t.scrollTop||o>t.scrollTop+t.clientHeight-40)&&(t.scrollTop=Math.max(0,o-t.clientHeight/3))}_renderLeafTop(t,e,a=!1,i=!1){let r=o=>o.preventDefault();return c`<div class="leaf-top">
      <span class="when">${t.created?Bt(t.created,new Date(this._now)):"folha nova"}</span>
      ${(t.times||[]).length?c`<span class="pin">${p("clock")}${t.times.join(" \xB7 ")}</span>`:m}
      ${a&&!i?c`<button type="button" class="icon-btn tool" @pointerdown=${r} @mousedown=${r} @click=${()=>this._inkCheck()} aria-label="Caixa de marcar" title="Caixa de marcar">${p("square-check")}</button>`:m}
      <span class="num">${t.num}/${t.total}</span>
      ${e?c`<button class="icon-btn" @click=${()=>this._openPageMenu()} aria-label="Opções da folha">${p("ellipsis")}</button>`:c`<span class="icon-btn ghost"></span>`}
    </div>`}_renderWriteBar(){let t=r=>{r.preventDefault();let o=this.renderRoot.querySelector("textarea.ink");o&&(this._selDown={s:o.selectionStart,e:o.selectionEnd,v:o.value})},e=this._wpop||"",a=r=>{this._haptic("light"),this._wpop=e===r?"":r,this.requestUpdate()},i=(r,o,n,l)=>c`<button type="button" class="wbtn ${l?"on":""}" @pointerdown=${t} @mousedown=${t} @click=${n} aria-label=${r} title=${r} aria-expanded=${l==null?m:l?"true":"false"}>${p(o)}</button>`;return c`<nav class="write" aria-label="Escrever">
      ${e==="cor"?c`<div class="wpop" role="toolbar" aria-label="Cor">
            ${ft.map(r=>{let o=L(r),n=o?o.label:r;return c`<button type="button" class="fmt-c c-${r}" @pointerdown=${t} @mousedown=${t} @click=${()=>this._inkFormat(r)} aria-label=${n} title=${n}><span></span></button>`})}
            <button type="button" class="fmt-x" @pointerdown=${t} @mousedown=${t} @click=${()=>this._inkFormat("sem-cor")} aria-label="Sem cor" title="Sem cor">${p("eraser")}</button>
          </div>`:m}
      ${e==="emoji"?c`<div class="wpop emojis" role="toolbar" aria-label="Emoji">
            ${this._emojis().map(r=>c`<button type="button" class="emo" @pointerdown=${t} @mousedown=${t} @click=${()=>this._inkEmoji(r)} aria-label=${r}>${r}</button>`)}
          </div>`:m}
      <div class="wtools">
        ${i("Caixa de marcar","square-check",()=>this._inkCheck())}
        ${i("Negrito","bold",()=>this._inkFormat("negrito"))}
        ${i("Maior","a-arrow-up",()=>this._inkFormat("maior"))}
        ${i("Cor","palette",()=>a("cor"),e==="cor")}
        ${i("Emoji","smile",()=>a("emoji"),e==="emoji")}
        <button type="button" class="ink-done" @pointerdown=${t} @mousedown=${t} @click=${()=>this._inkDone()}>${p("check")}Pronto</button>
      </div>
    </nav>`}_emojis(){let t=(N.get(ca,[])||[]).filter(e=>typeof e=="string"&&e.length<=16);return[...new Set([...t,...or])].slice(0,24)}_inkEmoji(t){let e=this._inkReady();if(!e)return;this._haptic("light");let a=e.selectionStart,i=e.selectionEnd;this._inkSet(e,e.value.slice(0,a)+t+e.value.slice(i),a+t.length),N.set(ca,[t,...(N.get(ca,[])||[]).filter(r=>r!==t)].slice(0,8))}_writing(t){if(clearInterval(this._kbTimer),this.toggleAttribute("writing",t),!t){this._kb=0,this.style.removeProperty("--kb");return}let e=()=>{let a=nr();a!==this._kb&&(this._kb=a,a?this.style.setProperty("--kb",`${a}px`):this.style.removeProperty("--kb"))};e(),this._kbTimer=setInterval(e,250)}_inkFormat(t){let e=this._inkReady();if(!e)return;this._haptic("light");let a=e.selectionStart,i=e.selectionEnd,r=this._selDown;this._selDown=null,a===i&&r&&r.s!==r.e&&r.v===e.value&&([a,i]=[r.s,r.e]);let o=a===i?Ti(e.value,a,t):kt(e.value,a,i,t);(ft.includes(t)||t==="sem-cor")&&(this._wpop="",this.requestUpdate()),o.text!==e.value&&(e.value=o.text,e.setSelectionRange(o.s,o.e),e.dispatchEvent(new Event("input",{bubbles:!0,composed:!0})))}_shelfCat(){if(!this._catsOn())return"";let t=N.get(Se,"")||"";return t==="sem"?this._cats().length&&this._allBlocks().some(e=>!this._cat(e.category))?"sem":"":this._cat(t)?t:""}_setShelfCat(t){this._haptic("light"),N.set(Se,t),this.requestUpdate()}_whoNames(){let t=[],e=a=>a&&!t.some(i=>et(i,a))&&t.push(a);e(this._me());for(let a of this._people||[])e(a);for(let a of this._allBlocks())e(we(a.owner||""));return t}_whoOn(){return this._ownersOn()&&(this._whoNames().length>1||this._allBlocks().some(t=>t.owner))}_shelfWho(t=la){if(!this._whoOn())return"*";let e=N.get(t,"")||"";if(e==="*")return"*";let a=e&&this._whoNames().find(i=>et(i,e));return a||this._me()||"*"}_setShelfWho(t,e=la){this._haptic("light"),N.set(e,t===this._me()?"":t),this.requestUpdate()}_ofWho(t,e){return e==="*"||!t.owner||et(t.owner,e)}_renderWhoChips(t,e){return this._whoOn()?c`<div class="chip-row who-filter" role="radiogroup" aria-label="De quem"><div class="chip-track">
      ${[...this._whoNames(),"*"].map(a=>{let i=a==="*"?t==="*":t!=="*"&&et(t,a);return c`<button class="pick ${i?"on":""}" role="radio" aria-checked=${i?"true":"false"} @click=${()=>this._setShelfWho(a,e)}>${p(a==="*"?"users":"user-round")}<span>${a==="*"?"Todos":z(a,18)}</span></button>`})}
    </div></div>`:m}_shelfList(){return N.get(Gi,"")==="lista"}_setShelfView(t){t!==this._shelfList()&&(this._haptic("light"),N.set(Gi,t?"lista":""),this.requestUpdate())}_renderShelf(){let t=this._allBlocks(),e=this._catsOn()?this._cats():[],a=this._shelfCat(),i=this._shelfWho(),r=g=>this._ofWho(g,i)&&(!a||(a==="sem"?!this._cat(g.category):g.category===a)),o=this._blocks().filter(r),n=t.filter(g=>g.archived&&r(g)).sort((g,x)=>x.archived-g.archived),l=o.reduce((g,x)=>g+this._pagesOf(x.id).length,0),h=e.length>0&&t.some(g=>!this._cat(g.category)),u=aa(this._schedule()),{cur:d}=this._slot(),f=(g,x,w=null,M="")=>c`<button class="pick ${w?"list":""} ${a===g?"on":""}" style=${w?gt(L(w.color)||L("grafite"),this._dark):""} aria-pressed=${a===g?"true":"false"} @click=${()=>this._setShelfCat(g)}>${w?c`<span class="dot"></span>`:p(M)}<span>${x}</span></button>`;return c`
      <section class="page">
        ${this._renderHead("Blocos",{text:`${O(o.length,"bloco","blocos")} \xB7 ${O(l,"folha","folhas")}`,extra:this._renderViewToggle()})}
        ${this._renderWhoChips(i,la)}
        ${e.length?c`<div class="chip-row cat-filter" role="group" aria-label="Categoria"><div class="chip-track">
              ${f("","Todos",null,"layers")} ${e.map(g=>f(g.id,z(g.name,22),g))} ${h?f("sem","Sem categoria",null,"x"):m}
            </div></div>`:m}
        ${this._shelfList()?this._renderShelfList(o):c`<div class="shelf">
          ${bt(o,g=>g.id,g=>{let x=this._pagesOf(g.id).length,w=this._whenParts(g);return c`<button class="cover" style=${this._cv(g)} @click=${()=>this._openPage(g.id)} aria-label="Abrir ${g.name}">
                <div class="sticker"><b>${g.name}</b><small>${O(x,"folha","folhas")}${this._owner(g)?c` · <span class="owner">de ${z(this._owner(g),16)}</span>`:m}</small></div>
                <div class="when">${w.length?w.map(M=>c`<span>${p(M.icon)}${M.label}</span>`):c`<span>${p("notebook")}Sem horário</span>`}</div>
              </button>`})}
          <button class="cover add" @click=${()=>this._openBlockSheet(null)}>${p("plus")}<span>Novo bloco</span></button>
        </div>`}
        ${n.length?this._renderArchived(n):m}
        ${u.length?c`<div class="panel">
              <div class="overline">Seu dia</div>
              ${u.map(g=>g.entries.map(x=>{let w=this._block(x.block);if(!w)return m;let M=x.page?this._page(x.page):null,P=x.kind==="period"?`${Yt(x.period).label}`:x.kind==="page"?`Trecho: ${z(G(Q(M&&M.text))||"folha",34)}`:"Hor\xE1rio fixo";return c`<button class="day-row ${d&&d.min===g.min?"on":""}" style=${this._cv(w)} @click=${()=>this._openPage(w.id,x.page||null)}>
                    <b>${Tt(x.min)}</b><span class="dot"></span>
                    <span class="grow"><span class="label">${w.name}</span><span class="hint">${P}</span></span>
                    ${d&&d.min===g.min?c`<span class="now-tag">agora</span>`:p("chevron-right")}
                  </button>`}))}
            </div>`:m}
      </section>
    `}_renderViewToggle(){let t=this._shelfList();return c`<span class="view-toggle" role="group" aria-label="Ver os blocos">
      <button class=${t?"":"on"} aria-pressed=${t?"false":"true"} aria-label="Em blocos" title="Em blocos" @click=${()=>this._setShelfView(!1)}>${p("layout-grid")}</button>
      <button class=${t?"on":""} aria-pressed=${t?"true":"false"} aria-label="Em lista" title="Em lista" @click=${()=>this._setShelfView(!0)}>${p("list")}</button>
    </span>`}_renderShelfList(t){return c`<div class="panel shelf-list">
      ${bt(t,e=>e.id,e=>{let a=this._whenParts(e),i=[O(this._pagesOf(e.id).length,"folha","folhas"),this._owner(e)?`de ${this._owner(e)}`:"",a.length?a.map(r=>r.label).join(" \xB7 "):"Sem hor\xE1rio"].filter(Boolean).join(" \xB7 ");return c`<button class="row block-row" style=${this._cv(e)} @click=${()=>this._openPage(e.id)} aria-label="Abrir ${e.name}">
            <span class="tile">${p("notebook")}</span>
            <span class="grow"><span class="label">${e.name}</span><span class="hint">${i}</span></span>
            ${p("chevron-right","chev")}
          </button>`})}
      <button class="row block-row add" @click=${()=>this._openBlockSheet(null)}>
        <span class="tile">${p("plus")}</span>
        <span class="grow"><span class="label">Novo bloco</span></span>
      </button>
    </div>`}_renderArchived(t){let e=this._archOpen;return c`<div class="panel arch-panel">
      <button class="row arch-head ${e?"open":""}" aria-expanded=${e?"true":"false"} @click=${()=>{this._haptic("light"),this._archOpen=!e,this.requestUpdate()}}>
        <span class="tile muted">${p("archive")}</span>
        <span class="grow"><span class="label">Arquivados (${t.length})</span></span>
        ${p("chevron-down","chev")}
      </button>
      ${e?bt(t,a=>a.id,a=>c`<button class="row arch-row" style=${this._cv(a)} @click=${()=>this._openPage(a.id)} aria-label="Abrir ${a.name} (arquivado)">
              <span class="tile">${p("notebook")}</span>
              <span class="grow"><span class="label">${a.name}</span><span class="hint">${[O(this._pagesOf(a.id).length,"folha","folhas"),this._owner(a)?`de ${this._owner(a)}`:"",`arquivado ${this._day(a.archived)}`].filter(Boolean).join(" \xB7 ")}</span></span>
              ${p("chevron-right","chev")}
            </button>`):m}
    </div>`}_day(t){let e=new Date(t),a=i=>String(i).padStart(2,"0");return`em ${a(e.getDate())}/${a(e.getMonth()+1)}${e.getFullYear()!==new Date(this._now).getFullYear()?`/${e.getFullYear()}`:""}`}_renderBlock(t){let e=this._block(t);if(!e)return c`<section class="page">
        <div class="panel"><div class="empty"><div class="em-icon">${p("circle-alert")}</div><h3>Bloco não encontrado</h3><p>Ele pode ter sido excluído em outro aparelho.</p></div></div>
        <button class="btn outline" style="width:100%" @click=${()=>this._go("/blocos",!0)}>${p("library")}Ver blocos</button>
      </section>`;let a=this._whenParts(e,!1),i=this._pagesOf(e.id).length,r=this._pagesOf(e.id).map((l,h)=>({n:h+1,times:l.times||[]})).filter(l=>l.times.length),o=r.length>2?[O(r.length,"folha com hor\xE1rio","folhas com hor\xE1rio")]:r.map(l=>`folha ${l.n} \xE0s ${l.times.join(", ")}`),n=[...a.map(l=>l.icon==="clock"?l.label:`${l.label} ${l.time}`),...o];return c`
      <section class="page">
        <div class="detail-head">
          <div class="dh-row">
            <button class="icon-btn" @click=${()=>this._back()} aria-label="Voltar">${p("chevron-left")}</button>
            <span class="grow"></span>
            ${this._renderChatBtn()}${this._renderMicBtn()}${this._renderFullBtn()}
            <button class="icon-btn" @click=${()=>this._openBlockSheet(e)} aria-label="Ajustes do bloco">${p("sliders-horizontal")}</button>
          </div>
          <div class="dh-text">
            <div class="overline">${[this._catsOn()&&this._cat(e.category)&&this._cat(e.category).name,O(i,"folha","folhas"),this._owner(e)?`de ${this._owner(e)}`:"",Qi[e.paper]||""].filter(Boolean).join(" \xB7 ")}</div>
            <h1 class="display fit-title">${e.name}</h1>
          </div>
        </div>
        ${e.archived?c`<div class="hint-card arch-card">${p("archive")}<span>Arquivado ${this._day(e.archived)}. Não abre sozinho.</span><button class="text-btn" @click=${()=>this._setArchived(e,!1)}>${p("archive-restore")}Desarquivar</button></div>`:c`<button class="when-line" @click=${()=>this._openBlockSheet(e)}>
          ${n.length?c`${p("calendar-clock")}<span>Abre sozinho${this._owner(e)&&!this._mine(e)?` no Agora de ${this._owner(e)}`:""}: ${n.map((l,h)=>c`${h?" \xB7 ":""}<b>${l}</b>`)}</span>`:c`${p("calendar-clock")}<span>Não abre sozinho. <b>Escolher horário</b></span>`}
        </button>`}
        ${this._renderPad({tall:!0})}
      </section>
    `}_fullOn(){if(!this._full||!this._wide)return!1;let t=this._view();return t.name==="block"||t.name==="now"&&!!this._pad}_fullAgora(){this._view().name!=="now"||!this._data||(this._peek=null,this._choice=null,this._setPad(this._nowPad()))}_renderFullBtn(){if(!this._wide)return m;let t=this._full?"Sair da tela cheia":"Tela cheia";return c`<button class="icon-btn full-btn ${this._full?"on":""}" @click=${()=>this._setFull(!this._full)} aria-label=${t} title=${t}>${p(this._full?"minimize":"maximize")}</button>`}_setFull(t){this._haptic("light"),this._full=t,this._fullAgora();let e=document.documentElement;try{window.frameElement&&(e=window.frameElement)}catch{}let a=e.ownerDocument;this._fsDoc!==a&&(this._fsDoc&&this._fsDoc.removeEventListener("fullscreenchange",this._onFsChange),this._fsDoc=a,a.addEventListener("fullscreenchange",this._onFsChange));try{t&&!a.fullscreenElement&&e.requestFullscreen&&e.requestFullscreen().catch(()=>{}),!t&&a.fullscreenElement&&a.exitFullscreen&&a.exitFullscreen().catch(()=>{})}catch{}}_renderSearch(){let t=this._query.trim(),e=j(t),a=N.get(es,!1)===!0,i=this._shelfWho(ts),r=this._data.pages.filter(h=>{let u=this._block(h.block);return u&&(a||!u.archived)&&this._ofWho(u,i)}),o=h=>+!!this._block(h.block).archived,n=[];e&&(n=r.filter(h=>j(h.text).includes(e)).sort((h,u)=>o(h)-o(u)||u.updated-h.updated).slice(0,80));let l=this._allBlocks().filter(h=>(a||!h.archived)&&this._ofWho(h,i)&&(!e||j(h.name).includes(e))).sort((h,u)=>+!!h.archived-+!!u.archived);return c`
      <section class="page">
        ${this._renderHead("Buscar",{text:`Em ${O(r.length,"folha","folhas")} \xB7 acentos n\xE3o importam`})}
        <label class="search-box">
          ${p("search")}
          <input type="search" placeholder="Buscar nos blocos" .value=${this._query} @input=${h=>this._query=h.target.value} enterkeyhint="search" aria-label="Buscar" />
          ${this._query?c`<button class="icon-btn" style="width:40px;height:40px" @click=${()=>this._query=""} aria-label="Limpar">${p("x")}</button>`:m}
        </label>
        ${this._renderSearchFilters(i,a)}
        ${l.length?this._renderSearchBlocks(l,t):m}
        ${e?this._sel?m:n.length?c`<p class="page-sub" style="margin-top:0">${O(n.length,"folha encontrada","folhas encontradas")}</p>
                <div class="panel">
                  ${n.map(h=>{let u=this._block(h.block),d=Q(h.text),f=G(d)||"Folha sem t\xEDtulo";return c`<button class="result" style=${this._cv(u)} @click=${()=>this._openPage(u.id,h.id)}>
                      <span class="dot"></span>
                      <span class="r-main">
                        <span class="r-title">${this._highlight(z(f,70),t)}</span>
                        <span class="r-snip">${this._highlight(this._snippet(d,f,e),t)}</span>
                        <span class="r-meta">${u.name}${u.archived?" \xB7 arquivado":""} · ${Bt(h.updated,new Date(this._now))}</span>
                      </span>
                    </button>`})}
                </div>`:l.length?m:c`<div class="panel"><div class="empty"><div class="em-icon">${p("search")}</div><h3>Nada encontrado</h3><p>Nenhuma folha com “${z(t,30)}”.</p></div></div>`:l.length?m:c`<p class="page-sub" style="margin-top:0">Procure qualquer palavra em todas as folhas.</p>`}
        ${this._sel?this._renderSelBar(l):m}
      </section>
    `}_renderSearchFilters(t,e){let a=N.get(as,!1)===!0;return c`<button type="button" class="filters-label" id="filtros" aria-expanded=${a?"false":"true"} @click=${()=>{this._haptic("light"),N.set(as,!a),this.requestUpdate()}}>${p("sliders-horizontal","lbl-ic")}<span>Filtros</span></button>
      ${a?m:c`<div class="filtros" role="group" aria-labelledby="filtros">
            ${this._renderWhoChips(t,ts)}
            <div class="chip-row search-opts"><button class="pick ${e?"on":""}" aria-pressed=${e?"true":"false"} @click=${()=>{this._haptic("light"),N.set(es,!e),this.requestUpdate()}}>${p("archive")}<span>Incluir arquivados</span></button></div>
          </div>`}`}_renderSearchBlocks(t,e){let a=this._sel,i=this._cats().length>0||this._ownersOn(),r=a?t.filter(l=>a.has(l.id)).length:0,o=r>0&&r===t.length,n=a?c`<div class="sel-head on">
          <button class="icon-btn" @click=${()=>this._selEnd()} aria-label="Cancelar seleção">${p("x")}</button>
          <span class="sel-n">${r?O(r,"selecionado","selecionados"):"Selecionar"}</span>
          <button class="text-btn" data-sel-all @click=${()=>this._selAll(t,o)}>${p(o?"x":"square-check")}${o?"Nenhum":"Todos"}</button>
        </div>`:c`<div class="sel-head">
          <span class="sel-n">${O(t.length,"bloco","blocos")}</span>
          ${i?c`<button class="text-btn" data-sel-start @click=${()=>this._selStart()}>${p("list-checks")}Selecionar</button>`:m}
        </div>`;return c`${n}
      <div class="panel shelf-list search-blocks">
        ${bt(t,l=>l.id,l=>{let h=this._cat(l.category),u=[h?h.name:"",O(this._pagesOf(l.id).length,"folha","folhas"),this._owner(l)?`de ${this._owner(l)}`:"",l.archived?"arquivado":""].filter(Boolean).join(" \xB7 "),d=a&&a.has(l.id);return a?c`<button class="row block-row selr ${d?"on":""}" style=${this._cv(l)} aria-pressed=${d?"true":"false"} @click=${()=>this._selToggle(l.id)}>
                  <span class="tile">${p(d?"check":"notebook")}</span>
                  <span class="grow"><span class="label">${this._highlight(l.name,e)}</span><span class="hint">${u}</span></span>
                </button>`:c`<button class="row block-row" style=${this._cv(l)} @click=${()=>this._openPage(l.id)} @contextmenu=${f=>{i&&(f.preventDefault(),this._selStart(l.id))}} aria-label="Abrir ${l.name}">
                  <span class="tile">${p("notebook")}</span>
                  <span class="grow"><span class="label">${this._highlight(l.name,e)}</span><span class="hint">${u}</span></span>
                  ${p("chevron-right","chev")}
                </button>`})}
      </div>`}_renderSelBar(t){let e=t.filter(a=>this._sel.has(a.id)).length;return c`<div class="sel-bar"><button class="btn primary" data-sel-change ?disabled=${!e} @click=${()=>this._openBulk(t)}>${p("pencil")}${e?`Alterar ${O(e,"bloco","blocos")}`:"Alterar"}</button></div>`}_selStart(t=null){if(this._haptic("light"),!this._sel){this._sel=new Set(t?[t]:[]);try{history.pushState({...history.state||{},rvSel:!0},"")}catch{}}}_selEnd(){history.state&&history.state.rvSel?history.back():this._sel=null}_selToggle(t){this._haptic("light");let e=new Set(this._sel);e.has(t)?e.delete(t):e.add(t),this._sel=e}_selAll(t,e){this._haptic("light"),this._sel=new Set(e?[]:t.map(a=>a.id))}_openBulk(t){let e=t.filter(a=>this._sel.has(a.id)).map(a=>a.id);e.length&&this._openSheet("bulk",{ids:e,category:null,owner:null})}_renderBulkSheet(){let t=this._form,e=O(t.ids.length,"bloco","blocos"),a=this._cats(),i=this._ownersOn()?this._whoNames():[],r=(n,l,h,u=null,d=null)=>{let f=t[n]===l;return c`<button class="pick ${d?"list":""} ${f?"on":""}" role="radio" aria-checked=${f?"true":"false"} style=${d||m} @click=${()=>this._setForm({[n]:l})}>${u?p(u):d?c`<span class="dot"></span>`:m}<span>${h}</span></button>`},o=t.category!==null||t.owner!==null;return c`
      ${this._sheetHead(`Alterar ${e}`)}
      ${a.length?c`<div class="field">
            <span class="flabel" id="bk-cat">${p("tag","lbl-ic")}Categoria</span>
            <div class="chip-row grid bulk-pick" role="radiogroup" aria-labelledby="bk-cat">
              ${r("category",null,"Manter")}${a.map(n=>r("category",n.id,z(n.name,22),null,this._cv(n)))}${r("category","","Sem categoria")}
            </div>
          </div>`:m}
      ${this._ownersOn()?c`<div class="field">
            <span class="flabel" id="bk-owner">${p("user-round","lbl-ic")}De quem é</span>
            <div class="chip-row grid bulk-pick" role="radiogroup" aria-labelledby="bk-owner">
              ${r("owner",null,"Manter")}${r("owner","","Todos","users")}${i.map(n=>r("owner",n,z(n,18),"user-round"))}
            </div>
          </div>`:m}
      <div class="sheet-actions">
        <button class="btn primary" data-bulk-ok ?disabled=${!o} @click=${()=>this._applyBulk()}>${p("check")}Aplicar</button>
      </div>
    `}async _applyBulk(){let t=this._form,e=[];for(let i of t.ids){let r=this._block(i);if(!r)continue;let o={};t.category!==null&&(r.category||"")!==t.category&&(o.category=t.category),t.owner!==null&&!et(r.owner||"",t.owner)&&(r.owner||t.owner)&&(o.owner=t.owner),Object.keys(o).length&&e.push({id:i,change:o,before:{category:r.category||"",owner:r.owner||""}})}if(await this._closeSheet(),!e.length)return this._showToast("Nada mudou.");let a=async i=>{for(let r of i)this._putBlock(await this.api.saveBlock({id:r.id,...r.change}))};try{await a(e)}catch(i){return this._showToast(`N\xE3o consegui alterar: ${i.message}`)}this._selEnd(),this._showToast(O(e.length,"bloco alterado","blocos alterados"),{label:"Desfazer",run:()=>a(e.map(i=>({id:i.id,change:Object.fromEntries(Object.keys(i.change).map(r=>[r,i.before[r]]))}))).catch(i=>this._showToast(`N\xE3o consegui desfazer: ${i.message}`))})}_snippet(t,e,a){let r=t.slice(t.indexOf(e)+e.length).replace(/\s+/g," ").trim()||"",o=Ze(r).indexOf(a);return o<=60?r.slice(0,160):`\u2026${r.slice(o-40,o+120)}`}_highlight(t,e){if(!e)return t;let a=Ze(t),i=j(e);if(!i)return t;let r=[],o=0,n;for(;(n=a.indexOf(i,o))!==-1;)n>o&&r.push(t.slice(o,n)),r.push(c`<mark>${t.slice(n,n+i.length)}</mark>`),o=n+i.length;return o<t.length&&r.push(t.slice(o)),r}_configTabs(){return[["integracoes","Integra\xE7\xF5es","blocks","integra\xE7\xF5es"],["dados","Dados","archive","dados e backup"],["aparencia","Apar\xEAncia","palette","apar\xEAncia"],["opcoes","Op\xE7\xF5es","toggle-right","op\xE7\xF5es"]]}_configTab(){let t=this._configTabs(),e=this._view().tab;return t.some(a=>a[0]===e)?e:t[0][0]}_configPath(t){return t==="integracoes"?"/config":`/config/${t}`}_moreRows(){let t=this._configTabs().map(i=>i[3]),e=`${t.slice(0,-1).join(", ")} e ${t[t.length-1]}.`,a=this._cats();return[...this._catsOn()?[["/categorias","tag","Categorias",a.length?`${z(a.map(i=>i.name).join(", "),44)}.`:"Para agrupar os blocos."]]:[],["relatorio","clipboard-list","Relat\xF3rio de anota\xE7\xF5es","Os blocos e as folhas, para imprimir ou salvar em PDF."],["/config","sliders-horizontal","Configura\xE7\xF5es",e[0].toUpperCase()+e.slice(1)],["/sobre","info","Sobre","CorrerIA Code, os apps e o GitHub."]]}_secHead(t,e,a=null){return c`<div class="mais-head"><span class="mais-ic" aria-hidden="true">${p(t)}</span><h2>${e}</h2></div>${a?c`<p class="panel-lead">${a}</p>`:m}`}_renderFoot(){return c`<p class="foot"><b>MemorIA</b><br />v${this._version} · suas anotações ficam no Home Assistant<br />e entram no backup dele.</p>`}_renderMore(){return c`
      <section class="page">
        ${this._renderHead("Mais",null)}
        <div class="panel more-menu" role="navigation" aria-label="Mais">
          <ul>
            ${this._moreRows().map(([t,e,a,i])=>c`<li>
                <button class="more-row" @click=${()=>this._openFromMenu(t)}>
                  <span class="mais-ic" aria-hidden="true">${p(e)}</span>
                  <span class="mb"><b>${a}</b><span>${i}</span></span>
                  ${p("chevron-right","chev")}
                </button>
              </li>`)}
          </ul>
        </div>
        ${this._renderFoot()}
      </section>
    `}_renderConfig(){let t=this._configTabs(),e=this._configTab(),a=r=>{r!==e&&(this._haptic("light"),this._go(this._configPath(r),!0,history.state&&history.state.rvUp?{rvUp:!0}:null))},i;return e==="integracoes"?i=c`${this._renderCorreriaPanel()} ${this._renderAiPanel()} ${this._aiOn()&&this.api.voiceStatus?this._renderVoicePanel():m}
        ${this._aiOn()?this._renderUsage():m} ${this._renderSensorPanel()}`:e==="dados"?i=this._renderDataPanel():e==="aparencia"?i=this._renderAppearanceTab():i=this._renderOptionsTab(),c`
      <section class="page">
        ${this._renderHead("Configura\xE7\xF5es",null,!0)}
        <div class="tabs-wrap"><div class="seg compact more-tabs" role="tablist" aria-label="Seções de Configurações" @scroll=${()=>this._markTabs()}>
          ${t.map(([r,o,n])=>c`<button class=${e===r?"on":""} role="tab" aria-selected=${e===r?"true":"false"} @click=${()=>a(r)}>${p(n)}<span>${o}</span></button>`)}
        </div><span class="tabs-fim esq" aria-hidden="true">${p("chevron-left")}</span><span class="tabs-fim dir" aria-hidden="true">${p("chevron-right")}</span></div>
        <div role="tabpanel" aria-label=${t.find(r=>r[0]===e)[1]}>${i}</div>
        ${this._renderFoot()}
      </section>
    `}_switch(t,e,a){return c`<label class="switch"><input type="checkbox" role="switch" .checked=${t} @change=${a} aria-label=${e} /><span class="track"></span></label>`}_renderAppearanceTab(){let t=this._accentDaily(),e=t?this._accent().id:this._app("accent","lilas");return c`
      <div class="panel">
        ${this._secHead("contrast","Tema","Cada aparelho guarda a sua escolha.")}
        ${ci({theme:this._theme,onTheme:a=>this._setTheme(a),icon:p})}
      </div>
      <div class="panel">
        ${this._secHead("palette","Cor do app","Em todos os aparelhos. Num bloco, vale a cor dele.")}
        <div class="row switch-row daily-row">
          <div class="grow"><div class="label">${p("calendar-days","lbl-ic")}Cor do dia</div><div class="hint">Muda a cor do app todo dia.</div></div>
          ${this._switch(t,"Cor do dia",a=>this._saveSettings({app:{accent_daily:a.target.checked?null:!1}}))}
        </div>
        ${hi({palette:lt,value:e,onPick:a=>this._saveSettings({app:{accent:a,accent_daily:!1}})})}
      </div>
      <div class="panel">
        ${this._secHead("pen-line","Letra de m\xE3o")}
        <div class="row switch-row">
          <div class="grow"><div class="label">${p("pen-line","lbl-ic")}Folhas com letra de mão</div><div class="hint" style="white-space:normal">Como num caderno de verdade.</div></div>
          ${this._switch(this._app("hand",!0),"Letra de m\xE3o",a=>this._saveSettings({app:{hand:a.target.checked}}))}
        </div>
      </div>
    `}_renderOptionsTab(){let t=tt(this._data),e=this._catsOn(),a=this._ownersOn();return c`<div class="panel" id="organizar">
      ${this._secHead("library","Blocos")}
      <div class="row switch-row">
        <div class="grow"><div class="label">${p("tag","lbl-ic")}Usar categorias</div><div class="hint" style="white-space:normal">${e?"A categoria de cada bloco e o filtro em Blocos.":"Desligado."}</div></div>
        ${this._switch(e,"Usar categorias",i=>this._saveSettings({app:{cats_off:i.target.checked?null:!0}}))}
      </div>
      <div class="row switch-row">
        <div class="grow"><div class="label">${p("users","lbl-ic")}Controle por pessoa</div><div class="hint" style="white-space:normal">${a?"De quem \xE9 cada bloco, o Agora de cada pessoa e o filtro De quem.":"Desligado: todo bloco \xE9 de todos."}</div></div>
        ${this._switch(a,"Controle por pessoa",i=>this._saveSettings({app:{owners_off:i.target.checked?null:!0}}))}
      </div>
    </div>
    <div class="panel" id="periodos">
      ${this._secHead("sun-moon","Per\xEDodos do dia","Blocos ligados a um per\xEDodo abrem sozinhos a partir desse hor\xE1rio. Hor\xE1rios exatos ficam em cada bloco ou folha.")}
      ${vt.map(i=>c`<div class="row">
          <span class="tile" style=${gt(this._accent(),this._dark)}>${p(i.icon)}</span>
          <div class="grow"><div class="label">${i.label}</div><div class="hint">começa às</div></div>
          ${this._timeSelect(t[i.id],`Come\xE7o da ${i.label}`,r=>this._saveSettings({periods:{[i.id]:r}}))}
        </div>`)}
    </div>
    ${this._renderShortcut()}`}_renderShortcut(){return this._atalho?c`<div class="panel shortcut" id="atalho">
      ${this._secHead("smartphone","Atalho no celular","Um \xEDcone na tela inicial do celular que abre o MemorIA direto.")}
      <ol class="steps">
        <li>No app do Home Assistant: <b>Configurações › Aplicativo complementar › Gerenciar atalhos</b>.</li>
        <li>Em <b>Atalho fixado</b>, escolha o tipo <b>Painel</b> e cole o <b>Caminho</b> abaixo.</li>
      </ol>
      <label class="field">
        <span class="flabel">${p("smartphone","lbl-ic")}Caminho</span>
        <span class="copy-row"
          ><input type="text" id="mm-atalho" readonly .value=${this._atalho} @focus=${t=>t.target.select()} /><button
            type="button"
            class="btn outline"
            @click=${()=>this._copyShortcut()}
          >
            ${p("copy")}Copiar
          </button></span
        >
      </label>
    </div>`:m}async _copyShortcut(){let t=this.renderRoot.querySelector("#mm-atalho");try{await navigator.clipboard.writeText(t.value),this._showToast("Caminho copiado")}catch{t.focus(),t.select(),this._showToast("Toque e segure no texto para copiar")}}_renderCorreriaPanel(){let t=this._app("correria",!1)===!0,e=this._correria&&this._correria.ultimo,a="";if(e&&e.em){let i=new Date(e.em);if(!Number.isNaN(i.getTime())){let r=new Date(this._now),o=Math.round((new Date(r.getFullYear(),r.getMonth(),r.getDate())-new Date(i.getFullYear(),i.getMonth(),i.getDate()))/864e5),n=o===0?"hoje":o===1?"ontem":`em ${String(i.getDate()).padStart(2,"0")}/${String(i.getMonth()+1).padStart(2,"0")}`;a=`${e.cliente||"CorrerIA"} usou ${n} \xE0s ${xe(i)}`}}return c`<div class="panel" id="correria">
      ${this._secHead("zap","CorrerIA")}
      <div class="row switch-row">
        <div class="grow"><div class="label">${p("zap","lbl-ic")}Usar com o CorrerIA</div><div class="hint" style="white-space:normal">${t?"Ligado: pelo WhatsApp, o Claude e o Gemini leem e mudam os seus blocos.":"Desligado."}</div></div>
        ${this._switch(t,"Usar com o CorrerIA",i=>this._saveSettings({app:{correria:i.target.checked?!0:null}}))}
      </div>
      ${t?c`<div class="sub-op"><div class="sub-box"><div class="ai-state ${a?"ok":"off"} correria-uso"><span class="dot"></span><div>${a?c`<b>${a}</b>`:c`<b>Ainda não usado</b><span>No app CorrerIA, conecte o WhatsApp, o Claude ou o Gemini.</span>`}</div></div></div></div>`:m}
    </div>`}_renderSensorPanel(){let t=this._app("sensor",!0);return c`<div class="panel" id="sensor">
      ${this._secHead("activity","Sensores no Home Assistant","Para usar em pain\xE9is e automa\xE7\xF5es do Home Assistant.")}
      <div class="row switch-row">
        <div class="grow"><div class="label">${p("activity","lbl-ic")}Criar sensores</div><div class="hint" style="white-space:normal">${t?"Ligado.":"Desligado: nenhum sensor no Home Assistant."}</div></div>
        ${this._switch(t,"Criar sensores",e=>this._saveSettings({app:{sensor:e.target.checked}}))}
      </div>
      ${t?c`<div class="sub-op"><div class="sub-box sensor-list">
            ${[["sensor.memoria_agora","o bloco e a folha do momento"],["sensor.memoria_ia_hoje","chamadas de IA hoje, com erros, cota e tokens estimados"]].map(([e,a])=>c`<div class="sensor-row"><code>${e}</code><span>${a}</span></div>`)}
          </div></div>`:m}
    </div>`}_renderCategories(){let t=this._cats(),e=this._blocks();return c`<section class="page">
      ${this._renderHead("Categorias",{text:t.length?O(t.length,"categoria","categorias"):"Nenhuma categoria ainda"},!0)}
      <div class="panel cats-panel">
        ${t.length?c`<p class="panel-lead">Toque numa categoria para mudar o nome ou a cor.</p>
              ${bt(t,a=>a.id,a=>{let i=e.filter(n=>n.category===a.id),r=this._data.blocks.filter(n=>n.archived&&n.category===a.id).length,o=[i.length?`${O(i.length,"bloco","blocos")}: ${i.map(n=>n.name).join(", ")}`:r?"":"Nenhum bloco",r?O(r,"arquivado","arquivados"):""].filter(Boolean).join(" \xB7 ");return c`<button class="row cat-row" style=${gt(L(a.color)||L("grafite"),this._dark)} @click=${()=>this._openCategorySheet(a)}>
                    <span class="tile">${p("tag")}</span>
                    <div class="grow"><div class="label">${a.name}</div><div class="hint">${o}</div></div>
                    ${p("chevron-right","chev")}
                  </button>`})}`:c`<div class="empty"><div class="em-icon">${p("tag")}</div><h3>Agrupe os blocos</h3><p>Por exemplo Trabalho, Casa e Estudos. Em Blocos, filtre por categoria.</p></div>`}
        <button class="row cat-row add" @click=${()=>this._openCategorySheet(null)}>
          <span class="tile" style=${gt(this._accent(),this._dark)}>${p("plus")}</span>
          <div class="grow"><div class="label">Nova categoria</div></div>
        </button>
      </div>
    </section>`}_renderAbout(){return c`<section class="page">
      ${this._renderHead("Sobre",null,!0)} ${oi({app:"MemorIA",version:this._version})}
    </section>`}_renderDataPanel(){let t=this._backups,e=i=>i>1048576?`${(i/1048576).toFixed(1).replace(".",",")} MB`:`${Math.max(1,Math.round(i/1024))} KB`,a=(i,r,o,n)=>c`<li>
      <div class="ot"><b>${r}</b><span>${o}</span></div>
      <a class="btn outline sm" href=${this.api.exportUrl(i)||"#"} download @click=${l=>this._export(i,l)}>${p("download")}${n}</a>
    </li>`;return c`<div id="dados">
      <div class="panel">
        ${this._secHead("download","Exportar")}
        <ul class="opts">
          ${a("zip","Tudo (ZIP)","Um arquivo de texto por bloco, a planilha e os dados completos.","Baixar ZIP")}
          ${a("csv","Planilha (CSV)","Abre no Excel e no Google Planilhas, com uma folha por linha.","Baixar CSV")}
          ${a("json","Dados completos (JSON)","Todos os campos, para backup ou para outro sistema.","Baixar JSON")}
        </ul>
      </div>
      <div class="panel">
        ${this._secHead("archive","Backup na pasta share",c`Cópia completa em <code>share/memoria</code>. Os backups do Home Assistant também incluem o MemorIA.`)}
        <div class="btn-row sec-actions">
          <button class="btn primary sm" ?disabled=${this._busy==="backup"||t&&t.available===!1} @click=${()=>this._createBackup()}>${p("archive")}${this._busy==="backup"?"Criando\u2026":"Criar backup"}</button>
        </div>
        ${t&&t.available===!1?c`<p class="data-note">A pasta share não está disponível para o app.</p>`:m}
        ${t&&t.backups&&t.backups.length?c`<div class="data-list">
              ${t.backups.slice(0,8).map(i=>c`<div class="data-item"><div><b>${this._dateTime(i.date)}</b><span title=${i.name}>${e(i.size)} · ${i.name}</span></div>
                  <button class="btn outline sm" @click=${()=>this._confirmRestoreBackup(i)}>${p("archive-restore")}Restaurar</button></div>`)}
            </div>`:m}
      </div>
      <div class="panel">
        ${this._secHead("upload","Importar","Um .zip ou .json exportado pelo MemorIA. Antes, o app guarda uma c\xF3pia do que existe hoje.")}
        <div class="btn-row sec-actions"><button class="btn outline sm" @click=${()=>this._pickImport()}>${p("upload")}Escolher arquivo</button></div>
      </div>
      <div class="panel">
        ${this._secHead("archive-restore","Vers\xF5es anteriores","Uma c\xF3pia a cada 10 minutos de uso e antes de importar, restaurar ou apagar.")}
        <div class="btn-row sec-actions"><button class="btn outline sm" @click=${()=>this._openVersions()}>${p("archive-restore")}Ver versões</button></div>
      </div>
      <div class="panel" id="onde">
        ${this._secHead("database","Onde ficam os dados",c`Os blocos, as folhas e os ajustes em <code>/data/memoria.json</code>, no backup do Home Assistant; as versões anteriores em <code>/data/versoes</code>.`)}
      </div>
      <div class="panel">
        ${this._secHead("trash","Come\xE7ar do zero","Apaga todos os blocos e folhas. Os ajustes continuam.")}
        <div class="btn-row sec-actions"><button class="btn danger sm" @click=${()=>this._confirmErase()}>${p("trash")}Apagar tudo</button></div>
      </div>
    </div>`}_renderAiPanel(){let t=this._ai||{},e=t.entities||[],a=this._app("ai_entity",""),i=this._aiChecking?"off":t.ready&&t.images?"ok":t.ready?"warn":"bad",r=this._aiChecking?"Verificando\u2026":t.ready&&t.images?"Pronta para ler fotos":t.ready?"S\xF3 l\xEA mensagens":"N\xE3o configurada",o="";t.ready&&(o=`Usando ${t.using.name}${a?"":" (a IA padr\xE3o do Home Assistant)"}.`,t.photos&&(o+=` Para fotos, ${t.photos.name}.`)),t.reason&&(o=`${o} ${t.reason}`.trim());let n=this._aiOn(),l=c`${this._secHead("sparkles","IA do Home Assistant","L\xEA mensagens, prints e fotos de anota\xE7\xF5es para criar folhas.")}
      <div class="row switch-row ai-switch">
        <div class="grow"><div class="label">${p("sparkles","lbl-ic")}Usar IA</div><div class="hint" style="white-space:normal">${n?"Ligado.":"Desligado: sem leitura por IA, sem Falar e sem Conversar."}</div></div>
        ${this._switch(n,"Usar IA",h=>this._setAiOn(h.target.checked))}
      </div>`;return n?c`<div class="panel" id="leitura-ia">
      ${l}
      <div class="sub-op"><div class="sub-box">
      <div class="ai-state ${i}"><span class="dot"></span><div><b>${r}</b>${o?c`<span>${o}</span>`:m}</div></div>
      ${e.length||a?c`<label class="field" style="margin:14px 0 0">
            <span class="flabel">${p("sparkles","lbl-ic")}IA usada pelo app</span>
            <select class="select" aria-label="IA usada pelo app" @change=${h=>this._chooseAi(h.target.value)}>
              <option value="" ?selected=${!a}>Padrão do Home Assistant</option>
              ${e.map(h=>c`<option value=${h.id} ?selected=${h.id===a}>${h.name}${h.images?"":" (s\xF3 texto)"}${h.available?"":" (indispon\xEDvel)"}</option>`)}
              ${a&&!e.some(h=>h.id===a)?c`<option value=${a} selected>${a} (não encontrada)</option>`:m}
            </select>
          </label>`:m}
      <div class="ai-actions"><button class="btn outline" ?disabled=${this._aiChecking} @click=${()=>this._refreshAi()}>${p("rotate-ccw")}Verificar de novo</button></div>
      ${t.ready&&t.images?m:c`<div class="steps-box">
            <b>Como configurar</b>
            <ol class="steps">
              <li>No Home Assistant, abra Configurações › Dispositivos e serviços › Adicionar integração.</li>
              <li>Escolha a IA: Anthropic (Claude), OpenAI, Google Gemini ou Ollama (modelo local, de graça). Cole a chave de API quando pedir.</li>
              <li>Na integração, adicione uma tarefa de IA (AI Task). Para ler fotos, use um modelo que entenda imagens.</li>
              <li>Volte aqui e escolha essa IA na lista.</li>
            </ol>
          </div>`}
      </div></div>
    </div>`:c`<div class="panel" id="leitura-ia">${l}</div>`}_renderSheet(){if(!this._sheet)return m;let t=m;this._sheet==="block"?t=this._renderBlockSheet():this._sheet==="category"?t=this._renderCategorySheet():this._sheet==="link"?t=this._renderLinkSheet():this._sheet==="chat"?t=this._renderChatSheet():this._sheet==="pagemenu"?t=this._renderPageMenu():this._sheet==="new"?t=this._renderNewSheet():this._sheet==="confirm"?t=this._renderConfirm():this._sheet==="versions"?t=this._renderVersions():this._sheet==="bulk"&&(t=this._renderBulkSheet());let e=this._form||{},a=this._sheet==="block"||this._sheet==="category"?{color:e.color}:this._block(e.target||e.page&&this._page(e.page)&&this._page(e.page).block),i=a?L(a.color):null,r=i?`--rv-accent:${i.fill};--rv-accent-ink:${this._dark?i.fill:i.ink};--rv-accent-soft:${be(i.fill,this._dark?.18:.14)};`:"";return c`
      <div class="scrim" @click=${()=>this._sheetBack()}></div>
      <div class="sheet" role="dialog" aria-modal="true" style=${r} @keydown=${o=>o.key==="Escape"&&this._sheetBack()}>
        <div class="grab"></div>
        ${t}
      </div>
    `}_sheetHead(t,e,a=""){return c`<div class="sheet-head">
      ${e?c`<button class="icon-btn back" @click=${e} aria-label="Voltar">${p("chevron-left")}</button>`:m}
      <h3 class="display">${p(a||cr(t),"sh-ic")}${t}</h3>
      <button class="icon-btn" @click=${()=>this._sheetBack()} aria-label="Fechar">${p("x")}</button>
    </div>`}_timeSelect(t,e,a){let i=Ct(t)||"",r=Array.from({length:48},(o,n)=>`${Wt(n>>1)}:${n%2?"30":"00"}`);return i&&!r.includes(i)&&(r.push(i),r.sort()),c`<select class="select time-select" aria-label=${e} @change=${o=>Ct(o.target.value)&&a(Ct(o.target.value))}>
      ${r.map(o=>c`<option value=${o} ?selected=${o===i}>${o}</option>`)}
    </select>`}_timePicker(t,e="Hor\xE1rio"){let a=o=>o.closest(".add-time-wrap").querySelectorAll("select"),i=o=>{let[n,l]=a(o.currentTarget);n.value="",l.value="",this._tpHour="",window.__selectSheet&&window.__selectSheet.open&&window.__selectSheet.open(n)},r=this._tpHour||"00";return c`<span class="add-time-wrap"><button class="pick add-time" @click=${i}>${p("plus")}<span>${e}</span></button>
      <select class="tp-box" tabindex="-1" aria-label="Hora" @change=${o=>{this._tpHour=o.target.value,this.requestUpdate();let n=a(o.target)[1];this.updateComplete.then(()=>window.__selectSheet&&window.__selectSheet.open(n))}}><option value="" hidden selected></option>${Array.from({length:24},(o,n)=>c`<option value=${Wt(n)}>${Wt(n)}h</option>`)}</select>
      <select class="tp-box" tabindex="-1" aria-label="Minutos" @change=${o=>{let n=Ct(`${this._tpHour}:${o.target.value}`),[l,h]=a(o.target);l.value="",h.value="",n&&t(n)}}><option value="" hidden selected></option>${Array.from({length:12},(o,n)=>c`<option value=${Wt(n*5)}>${r}:${Wt(n*5)}</option>`)}</select>
    </span>`}_renderBlockSheet(){let t=this._form,e=tt(this._data),a=i=>this._setForm({periods:t.periods.includes(i)?t.periods.filter(r=>r!==i):[...t.periods,i]});return c`
      ${this._sheetHead(t.id?"Ajustes do bloco":"Novo bloco")}
      <label class="field">
        <span class="flabel">${p("pencil","lbl-ic")}Nome</span>
        <input type="text" maxlength="60" .value=${t.name} placeholder="Ex.: Diário, Treino, Trabalho" @input=${i=>this._setForm({name:i.target.value})} @keydown=${i=>i.key==="Enter"&&this._saveBlockSheet()} />
      </label>
      ${this._catsOn()?c`<div class="field">
        <span class="flabel">${p("tag","lbl-ic")}Categoria</span>
        <div class="chip-row grid cat-pick">
          <button class="pick ${!t.category&&t.newCat==null?"on":""}" @click=${()=>this._setForm({category:"",newCat:null})}>${p("x")}<span>Sem categoria</span></button>
          ${this._cats().map(i=>c`<button class="pick list ${t.category===i.id&&t.newCat==null?"on":""}" style=${gt(L(i.color)||L("grafite"),this._dark)} @click=${()=>this._setForm({category:i.id,newCat:null})}><span class="dot"></span><span>${z(i.name,22)}</span></button>`)}
          <button class="pick ${t.newCat!=null?"on":""}" @click=${()=>{this._setForm({newCat:t.newCat==null?"":t.newCat}),this.updateComplete.then(()=>{let i=this.renderRoot.querySelector(".new-cat input");i&&i.focus()})}}>${p("plus")}<span>Nova</span></button>
        </div>
        ${t.newCat!=null?c`<label class="new-cat"><input type="text" maxlength="40" .value=${t.newCat} placeholder="Nome da nova categoria" aria-label="Nome da nova categoria" @input=${i=>this._setForm({newCat:i.target.value})} @keydown=${i=>i.key==="Enter"&&this._saveBlockSheet()} /></label>`:m}
      </div>`:m}
      ${this._ownersOn()?this._renderOwnerPick(t):m}
      <div class="field">
        <span class="flabel">${p("palette","lbl-ic")}Cor da capa</span>
        <div class="swatches">
          ${lt.map(i=>c`<button class="sw ${t.color===i.id?"on":""}" style="--c:${i.fill}" aria-label=${i.label} @click=${()=>this._setForm({color:i.id})}>${t.color===i.id?p("check"):m}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">${p("notebook-text","lbl-ic")}Folha</span>
        <div class="papers">
          ${Ii.map(i=>c`<button class="paper-opt ${t.paper===i?"on":""}" @click=${()=>this._setForm({paper:i})}><span class="sw-paper ${i}"></span>${Qi[i]}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">${p("clock","lbl-ic")}Quando abrir sozinho</span>
        <div class="chip-row grid periods-pick">
          ${vt.map(i=>c`<button class="pick ${t.periods.includes(i.id)?"on":""}" aria-pressed=${t.periods.includes(i.id)?"true":"false"} @click=${()=>a(i.id)}>${p(i.icon)}<span>${i.label}</span><small class="pick-sub">${e[i.id]}</small></button>`)}
        </div>
        <div class="time-list" style="margin-top:10px">
          ${t.times.map(i=>c`<span class="time-chip">${i}<button aria-label="Tirar ${i}" @click=${()=>this._setForm({times:t.times.filter(r=>r!==i)})}>${p("x")}</button></span>`)}
          ${t.times.length<24?this._timePicker(i=>this._setForm({times:[...new Set([...t.times,i])].sort()}),t.times.length?"Outro hor\xE1rio":"Hor\xE1rio exato"):m}
        </div>
      </div>
      ${t.periods.length||t.times.length?this._durPick(t.dur||0,i=>this._setForm({dur:i})):m}
      ${t.id?(()=>{let i=!!(this._block(t.id)||{}).archived;return c`<button class="menu-row arch-toggle" @click=${()=>this._saveBlockSheet({archived:!i})}>${p(i?"archive-restore":"archive")}${i?"Desarquivar bloco":"Arquivar bloco"}</button>`})():m}
      <div class="sheet-actions">
        ${t.id?c`<button class="btn danger" @click=${()=>this._confirmDeleteBlock()} aria-label="Apagar bloco">${p("trash")}</button>`:m}
        <button class="btn primary" @click=${()=>this._saveBlockSheet()}>${p(t.id?"check":"plus")}${t.id?"Salvar":"Criar bloco"}</button>
      </div>
    `}_renderOwnerPick(t){let e=this._people||[],a=we(t.owner||"");if(!e.length)return c`<label class="field">
        <span class="flabel">${p("user-round","lbl-ic")}De quem é</span>
        <input type="text" maxlength="80" .value=${t.owner||""} placeholder="Todos" aria-label="De quem é" @input=${r=>this._setForm({owner:r.target.value})} />
      </label>`;let i=a&&!e.some(r=>et(r,a))?[...e,a]:e;return c`<div class="field">
      <span class="flabel">${p("user-round","lbl-ic")}De quem é</span>
      <div class="chip-row grid owner-pick" role="radiogroup" aria-label="De quem é">
        ${["",...i].map(r=>{let o=r?et(a,r):!a;return c`<button class="pick ${o?"on":""}" role="radio" aria-checked=${o?"true":"false"} @click=${()=>this._setForm({owner:r})}>${p(r?"user-round":"users")}<span>${r||"Todos"}</span></button>`})}
      </div>
    </div>`}_renderCategorySheet(){let t=this._form;return c`
      ${this._sheetHead(t.id?"Categoria":"Nova categoria")}
      <label class="field">
        <span class="flabel">${p("pencil","lbl-ic")}Nome</span>
        <input type="text" maxlength="40" .value=${t.name} placeholder="Ex.: Trabalho, Casa, Estudos" @input=${e=>this._setForm({name:e.target.value})} @keydown=${e=>e.key==="Enter"&&this._saveCategorySheet()} />
      </label>
      <div class="field">
        <span class="flabel">${p("palette","lbl-ic")}Cor</span>
        <div class="swatches">
          ${lt.map(e=>c`<button class="sw ${t.color===e.id?"on":""}" style="--c:${e.fill}" aria-label=${e.label} @click=${()=>this._setForm({color:e.id})}>${t.color===e.id?p("check"):m}</button>`)}
        </div>
      </div>
      <div class="sheet-actions">
        ${t.id?c`<button class="btn danger" @click=${()=>this._confirmDeleteCategory()} aria-label="Apagar categoria">${p("trash")}</button>`:m}
        <button class="btn primary" ?disabled=${!(t.name||"").trim()||t.busy} @click=${()=>this._saveCategorySheet()}>${p(t.id?"check":"plus")}${t.id?"Salvar":"Criar categoria"}</button>
      </div>
    `}_renderPageMenu(){let t=this._page(this._form.page);if(!t)return this._sheetHead("Folha");let e=this._pagesOf(t.block),a=e.indexOf(t),i=this._block(t.block),r=i&&i.archived?[...this._blocks(),i]:this._blocks(),o=t.times||[];return c`
      ${this._sheetHead(`Folha ${a+1} de ${e.length}`)}
      <div class="field">
        <span class="flabel">${p("clock","lbl-ic")}Mostrar esta folha às…</span>
        <div class="time-list">
          ${o.map(n=>c`<span class="time-chip">${n}<button aria-label="Tirar ${n}" @click=${()=>this._setPageTimes(t.id,o.filter(l=>l!==n))}>${p("x")}</button></span>`)}
          ${this._timePicker(n=>this._setPageTimes(t.id,[...o,n]),o.length?"Outro hor\xE1rio":"Escolher hor\xE1rio")}
        </div>
      </div>
      ${o.length?this._durPick(t.dur||0,n=>this._setPageDur(t.id,n)):m}
      ${r.length>1?c`<div class="field">
            <span class="flabel">${p("notebook","lbl-ic")}Bloco</span>
            <div class="chip-row grid block-pick">
              ${r.map(n=>c`<button class="pick list ${t.block===n.id?"on":""}" style=${this._cv(n)} @click=${()=>this._movePage(t.id,n.id)}><span class="dot"></span><span>${z(n.name,22)}</span></button>`)}
            </div>
          </div>`:m}
      <button class="menu-row" @click=${()=>this._openLinkSheet(t.id)}>${p("link")}Adicionar link</button>
      <button class="menu-row" @click=${()=>this._copyPage(t.id)}>${p("copy")}Copiar texto</button>
      <button class="menu-row danger" @click=${()=>this._confirmDeletePage(t.id)}>${p("trash")}Apagar folha</button>
      <p class="sheet-note">Escrita ${Bt(t.created)} · editada ${Bt(t.updated)}</p>
    `}_renderNewSheet(){let t=this._form,e=this._aiEff(),a=this._blocks(),i=this._block(t.target),r=()=>{this._importToken=0,this._setForm({step:"pick",error:null,note:null})},o=t.error?c`<div class="imp-error">${p("circle-alert")}<span>${t.error}</span></div>`:m,n=t.images&&t.images.length?c`<div class="thumbs">${t.images.map(h=>h.pdf?c`<span class="thumb-pdf" title=${h.nome||"PDF"}>${p("file-text")}</span>`:c`<img src=${h.url} alt="" />`)}</div>`:m,l=a.length>1?c`<div class="field">
            <span class="flabel">${p("notebook","lbl-ic")}No bloco</span>
            <div class="chip-row grid block-pick">
              ${a.map(h=>c`<button class="pick list ${t.target===h.id?"on":""}" style=${this._cv(h)} @click=${()=>this._setForm({target:h.id})}><span class="dot"></span><span>${z(h.name,22)}</span></button>`)}
            </div>
          </div>`:m;if(t.step==="text")return c`
        ${this._sheetHead("Colar mensagem",r)}
        <label class="field">
          <span class="flabel">${p("message-square-text","lbl-ic")}Mensagem</span>
          <textarea rows="7" .value=${t.text} placeholder="Cole aqui a mensagem do WhatsApp, e-mail ou anotação…" @input=${h=>this._setForm({text:h.target.value,error:null})}></textarea>
        </label>
        ${o} ${l}
        <div class="sheet-actions ${e.ready?"tri":""}">
          <button class="btn outline" @click=${()=>this._pasteClipboard()}>${p("clipboard-paste")}Colar</button>
          ${e.ready?c`<button class="btn outline" ?disabled=${!(t.text||"").trim()} @click=${()=>this._readText(!1)}>${p("notebook-text")}Como está</button>`:m}
          <button class="btn primary" ?disabled=${!(t.text||"").trim()} @click=${()=>this._readText(!0)}>${e.ready?c`${p("sparkles")}Organizar`:c`${p("plus")}Criar folha`}</button>
        </div>
        ${e.ready||e.off?m:c`<p class="sheet-note">Sem IA configurada: a mensagem vira uma folha do jeito que está.</p>`}
      `;if(t.step==="voice")return this._renderVoiceStep(this._sheetHead("Falar",()=>(this._stopVoice(),r())));if(t.step==="loading")return c`
        ${this._sheetHead("Lendo\u2026")}
        ${n}
        <div class="imp-loading"><span class="spin">${p("loader-circle")}</span><span>${t.loadingText||"Lendo\u2026"}</span></div>
        <div class="sheet-actions">
          <button class="btn outline" @click=${()=>{this._importToken=0,this._setForm({step:t.prevStep||"pick"})}}>${p("x")}Cancelar</button>
        </div>
      `;if(t.step==="review"){let h=t.provider==="local"?"texto original":t.provider?`lido por ${t.provider}`:"";return c`
        ${this._sheetHead("Revisar folha",r)}
        ${n}
        ${h?c`<p class="sheet-note top">${h[0].toUpperCase()}${h.slice(1)}.</p>`:m}
        ${t.heard?c`<div class="heard">${p("mic")}<span>${t.heard}</span></div>`:m}
        ${t.note?c`<div class="imp-error soft">${p("sparkles")}<span>${t.note}</span></div>`:m}
        <textarea class="review-text" .value=${t.result} aria-label="Texto da folha" @input=${u=>this._setForm({result:u.target.value})}></textarea>
        ${e.images?c`<div class="extra-row chip-row grid two">
              <button class="pick" @click=${()=>this._pickFiles("photos")}>${p("images")}<span>Mais fotos</span></button>
              <button class="pick" @click=${()=>this._openCamera()}>${p("scan-text")}<span>Digitalizar mais</span></button>
            </div>`:m}
        ${l}
        <div class="sheet-actions">
          <button class="btn primary" ?disabled=${!(t.result||"").trim()} @click=${()=>this._createFromText(t.result)}>${p("plus")}Criar folha${i?` em ${z(i.name,18)}`:""}</button>
        </div>
      `}return c`
      ${this._sheetHead("Nova folha")}
      ${l}
      <div class="new-strip">
        <button class="main" @click=${()=>this._write()}>${p("pen-line")}<span>Escrever${i&&a.length<=1?` em ${z(i.name,20)}`:""}</span></button>
      </div>
      <div class="imp-options">
        ${e.ready&&this._voice&&this._voice.ready?c`<button class="imp-opt" @click=${()=>(this._setForm({step:"voice",error:null,heard:""}),this.updateComplete.then(()=>this._startVoice()))}>
              <span class="imp-ic">${p("mic")}</span>
              <span class="imp-tx"><b>Falar</b><small>Diga a anotação; a IA organiza</small></span>
              ${p("chevron-right")}
            </button>`:m}
        <button class="imp-opt" @click=${()=>(this._setForm({step:"text",error:null}),this._focusSheetText())}>
          <span class="imp-ic">${p("message-square-text")}</span>
          <span class="imp-tx"><b>Colar mensagem</b><small>WhatsApp, e-mail, anotação</small></span>
          ${p("chevron-right")}
        </button>
        ${e.off?m:c`<button class="imp-opt" ?disabled=${!e.images} @click=${()=>this._pickFiles("photos")}>
                <span class="imp-ic">${p("images")}</span>
                <span class="imp-tx"><b>Escolher fotos ou PDF</b><small>Prints, fotos da galeria ou um PDF</small></span>
                ${p("chevron-right")}
              </button>
              <button class="imp-opt" ?disabled=${!e.images} @click=${()=>this._openCamera()}>
                <span class="imp-ic">${p("scan-text")}</span>
                <span class="imp-tx"><b>Digitalizar com IA</b><small>Fotografe uma anotação em papel</small></span>
                ${p("chevron-right")}
              </button>`}
        <button class="imp-opt" data-new-block @click=${()=>this._openBlockSheet(null)}>
          <span class="imp-ic">${p("notebook")}</span>
          <span class="imp-tx"><b>Novo bloco</b><small>Um caderno novo, com cor e horário</small></span>
          ${p("chevron-right")}
        </button>
      </div>
      ${!e.images&&!e.off?c`<div class="imp-error soft">${p("sparkles")}<span>${e.reason||"Para ler fotos, o Home Assistant precisa de uma integra\xE7\xE3o de IA com tarefa de IA que entenda imagens."}
            <button class="text-btn inline" @click=${()=>this._openAiSettings()}>${p("sparkles")}Ver IA do Home Assistant</button></span></div>`:m}
      ${o}
    `}_renderVersions(){let t=this._form,e={"antes-de-importar":"antes de importar","antes-de-restaurar":"antes de restaurar","antes-de-apagar":"antes de apagar tudo"};return c`
      ${this._sheetHead("Vers\xF5es anteriores")}
      ${t.error?c`<div class="imp-error">${p("circle-alert")}<span>${t.error}</span></div>`:t.list==null?c`<div class="imp-loading"><span class="spin">${p("loader-circle")}</span><span>Carregando…</span></div>`:t.list.length?c`<div class="data-list">
                ${t.list.map(a=>c`<div class="data-item"><div><b>${this._dateTime(a.when)}</b><span>${O(a.blocks,"bloco","blocos")} · ${O(a.pages,"folha","folhas")} · ${e[a.reason]||"autom\xE1tica"}</span></div>
                    <button class="btn outline sm" @click=${()=>this._confirmRestoreVersion(a)}>${p("archive-restore")}Restaurar</button></div>`)}
              </div>`:c`<p class="sheet-note top">Ainda não há versões anteriores. Elas aparecem depois das primeiras alterações.</p>`}
    `}_renderConfirm(){let t=this._form,e=t.icon||hr(t.label);return c`
      <div class="sheet-head"><h3 class="display">${p(e,"sh-ic")}${t.title}</h3></div>
      <p class="confirm-text">${t.text}</p>
      <div class="sheet-actions">
        <button class="btn outline" @click=${()=>this._sheetBack()}>${p("x")}Cancelar</button>
        <button class="btn ${t.danger?"danger-fill":"primary"}" @click=${()=>t.run()}>${p(e)}${t.label}</button>
      </div>
    `}_renderCamera(){let t=this._cam;if(!t)return m;let e=t.shots.length;return c`
      <div class="cam" role="dialog" aria-label="Digitalizar com IA">
        <video playsinline muted autoplay></video>
        ${t.flash?c`<div class="cam-flash" .key=${t.flash}></div>`:m}
        <div class="cam-top">
          <button class="cam-btn" aria-label="Fechar" @click=${()=>this._closeCamera()}>${p("x")}</button>
          <span class="cam-title">${t.chat?"Tirar foto":"Digitalizar com IA"}</span>
          ${t.torchOk?c`<button class="cam-btn ${t.torch?"on":""}" aria-label="Lanterna" @click=${()=>this._toggleTorch()}>${p("zap")}</button>`:c`<span class="cam-btn ghost"></span>`}
        </div>
        ${t.status==="error"?c`<div class="cam-msg">
              ${p("camera")}
              <p>${t.error}</p>
              <button class="btn primary" @click=${()=>this._cameraFallback()}>${p("images")}Escolher foto</button>
            </div>`:c`<div class="cam-frame"><i></i><i></i><i></i><i></i></div>
              <p class="cam-hint">${t.status==="starting"?"Abrindo a c\xE2mera\u2026":e?`${O(e,"p\xE1gina","p\xE1ginas")}. Fotografe outra ou toque em Pronto.`:"Enquadre a anota\xE7\xE3o e toque no bot\xE3o"}</p>`}
        <div class="cam-bottom">
          <div class="cam-shots">${t.shots.slice(-3).map(a=>c`<img src=${a.url} alt="" />`)}${e>3?c`<span>+${e-3}</span>`:m}</div>
          <button class="cam-shutter" aria-label="Fotografar" ?disabled=${t.status!=="live"||e>=6} @click=${()=>this._shoot()}><span></span></button>
          <button class="cam-done" ?disabled=${!e} @click=${()=>this._useShots()}>${p("check")}Pronto${e?` (${e})`:""}</button>
        </div>
      </div>
    `}_renderToast(){if(!this._toast)return m;let t=this._toast;return c`<div class="toast ${this._sheet?"has-sheet":""}" role="status">
      <span>${t.text}</span>
      ${t.action?c`<button @click=${()=>{this._toast=null,t.action.run()}}>${p(t.action.icon||(t.action.label==="Desfazer"?"rotate-ccw":"chevron-right"))}${t.action.label}</button>`:m}
    </div>`}};customElements.get("memoria-app")||customElements.define("memoria-app",ha);var ur=document.getElementById("app"),pa=document.createElement("memoria-app");pa.env=Xi();pa.api=new ke;ur.replaceChildren(pa);})();
