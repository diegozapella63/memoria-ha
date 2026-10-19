/* MemorIA · Lit (BSD-3), Lucide icons (ISC), Barlow, Barlow Condensed & Caveat (OFL) */
window.litDisableBundleWarning=true;
(()=>{var X=globalThis,At=X.ShadowRoot&&(X.ShadyCSS===void 0||X.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,St=Symbol(),Zt=new WeakMap,Q=class{constructor(t,e,i){if(this._$cssResult$=!0,i!==St)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.i,e=this.t;if(At&&t===void 0){let i=e!==void 0&&e.length===1;i&&(t=Zt.get(e)),t===void 0&&((this.i=t=new CSSStyleSheet).replaceSync(this.cssText),i&&Zt.set(e,t))}return t}toString(){return this.cssText}},W=s=>new Q(typeof s=="string"?s:s+"",void 0,St),Tt=(s,...t)=>{let e=s.length===1?s[0]:t.reduce((i,a,r)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(a)+s[r+1],s[0]);return new Q(e,s,St)},ai=(s,t)=>{if(At)s.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(let e of t){let i=document.createElement("style"),a=X.litNonce;a!==void 0&&i.setAttribute("nonce",a),i.textContent=e.cssText,s.appendChild(i)}},Wt=At?s=>s:s=>s instanceof CSSStyleSheet?(t=>{let e="";for(let i of t.cssRules)e+=i.cssText;return W(e)})(s):s,{is:si,defineProperty:ri,getOwnPropertyDescriptor:oi,getOwnPropertyNames:ni,getOwnPropertySymbols:li,getPrototypeOf:ci}=Object,lt=globalThis,Yt=lt.trustedTypes,pi=Yt?Yt.emptyScript:"",hi=lt.reactiveElementPolyfillSupport,N=(s,t)=>s,$t={toAttribute(s,t){switch(t){case Boolean:s=s?pi:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,t){let e=s;switch(t){case Boolean:e=s!==null;break;case Number:e=s===null?null:Number(s);break;case Object:case Array:try{e=JSON.parse(s)}catch{e=null}}return e}},he=(s,t)=>!si(s,t),jt={attribute:!0,type:String,converter:$t,reflect:!1,useDefault:!1,hasChanged:he};Symbol.metadata??=Symbol("metadata"),lt.litPropertyMetadata??=new WeakMap;var A=class extends HTMLElement{static addInitializer(t){this.o(),(this.l??=[]).push(t)}static get observedAttributes(){return this.finalize(),this.u&&[...this.u.keys()]}static createProperty(t,e=jt){if(e.state&&(e.attribute=!1),this.o(),this.prototype.hasOwnProperty(t)&&((e=Object.create(e)).wrapped=!0),this.elementProperties.set(t,e),!e.noAccessor){let i=Symbol(),a=this.getPropertyDescriptor(t,i,e);a!==void 0&&ri(this.prototype,t,a)}}static getPropertyDescriptor(t,e,i){let{get:a,set:r}=oi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get:a,set(o){let n=a?.call(this);r?.call(this,o),this.requestUpdate(t,n,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??jt}static o(){if(this.hasOwnProperty(N("elementProperties")))return;let t=ci(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(N("finalized")))return;if(this.finalized=!0,this.o(),this.hasOwnProperty(N("properties"))){let e=this.properties,i=[...ni(e),...li(e)];for(let a of i)this.createProperty(a,e[a])}let t=this[Symbol.metadata];if(t!==null){let e=litPropertyMetadata.get(t);if(e!==void 0)for(let[i,a]of e)this.elementProperties.set(i,a)}this.u=new Map;for(let[e,i]of this.elementProperties){let a=this.p(e,i);a!==void 0&&this.u.set(a,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){let e=[];if(Array.isArray(t)){let i=new Set(t.flat(1/0).reverse());for(let a of i)e.unshift(Wt(a))}else t!==void 0&&e.push(Wt(t));return e}static p(t,e){let i=e.attribute;return i===!1?void 0:typeof i=="string"?i:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this.v=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this.m=null,this._()}_(){this.S=new Promise(t=>this.enableUpdating=t),this._$AL=new Map,this.$(),this.requestUpdate(),this.constructor.l?.forEach(t=>t(this))}addController(t){(this.P??=new Set).add(t),this.renderRoot!==void 0&&this.isConnected&&t.hostConnected?.()}removeController(t){this.P?.delete(t)}$(){let t=new Map,e=this.constructor.elementProperties;for(let i of e.keys())this.hasOwnProperty(i)&&(t.set(i,this[i]),delete this[i]);t.size>0&&(this.v=t)}createRenderRoot(){let t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return ai(t,this.constructor.elementStyles),t}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this.P?.forEach(t=>t.hostConnected?.())}enableUpdating(t){}disconnectedCallback(){this.P?.forEach(t=>t.hostDisconnected?.())}attributeChangedCallback(t,e,i){this._$AK(t,i)}C(t,e){let i=this.constructor.elementProperties.get(t),a=this.constructor.p(t,i);if(a!==void 0&&i.reflect===!0){let r=(i.converter?.toAttribute!==void 0?i.converter:$t).toAttribute(e,i.type);this.m=t,r==null?this.removeAttribute(a):this.setAttribute(a,r),this.m=null}}_$AK(t,e){let i=this.constructor,a=i.u.get(t);if(a!==void 0&&this.m!==a){let r=i.getPropertyOptions(a),o=typeof r.converter=="function"?{fromAttribute:r.converter}:r.converter?.fromAttribute!==void 0?r.converter:$t;this.m=a;let n=o.fromAttribute(e,r.type);this[a]=n??this.T?.get(a)??n,this.m=null}}requestUpdate(t,e,i,a=!1,r){if(t!==void 0){let o=this.constructor;if(a===!1&&(r=this[t]),i??=o.getPropertyOptions(t),!((i.hasChanged??he)(r,e)||i.useDefault&&i.reflect&&r===this.T?.get(t)&&!this.hasAttribute(o.p(t,i))))return;this.M(t,e,i)}this.isUpdatePending===!1&&(this.S=this.k())}M(t,e,{useDefault:i,reflect:a,wrapped:r},o){i&&!(this.T??=new Map).has(t)&&(this.T.set(t,o??e??this[t]),r!==!0||o!==void 0)||(this._$AL.has(t)||(this.hasUpdated||i||(e=void 0),this._$AL.set(t,e)),a===!0&&this.m!==t&&(this.A??=new Set).add(t))}async k(){this.isUpdatePending=!0;try{await this.S}catch(e){Promise.reject(e)}let t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this.v){for(let[a,r]of this.v)this[a]=r;this.v=void 0}let i=this.constructor.elementProperties;if(i.size>0)for(let[a,r]of i){let{wrapped:o}=r,n=this[a];o!==!0||this._$AL.has(a)||n===void 0||this.M(a,void 0,r,n)}}let t=!1,e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),this.P?.forEach(i=>i.hostUpdate?.()),this.update(e)):this.U()}catch(i){throw t=!1,this.U(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){this.P?.forEach(e=>e.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}U(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this.S}shouldUpdate(t){return!0}update(t){this.A&&=this.A.forEach(e=>this.C(e,this[e])),this.U()}updated(t){}firstUpdated(t){}};A.elementStyles=[],A.shadowRootOptions={mode:"open"},A[N("elementProperties")]=new Map,A[N("finalized")]=new Map,hi?.({ReactiveElement:A}),(lt.reactiveElementVersions??=[]).push("2.1.2");var Pt=globalThis,Xt=s=>s,K=Pt.trustedTypes,Qt=K?K.createPolicy("lit-html",{createHTML:s=>s}):void 0,zt="$lit$",k=`lit$${Math.random().toFixed(9).slice(2)}$`,Et="?"+k,di=`<${Et}>`,C=document,L=()=>C.createComment(""),B=s=>s===null||typeof s!="object"&&typeof s!="function",Ct=Array.isArray,de=s=>Ct(s)||typeof s?.[Symbol.iterator]=="function",_t=`[ 	
\f\r]`,D=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Kt=/-->/g,Gt=/>/g,z=RegExp(`>|${_t}(?:([^\\s"'>=/]+)(${_t}*=${_t}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),te=/'/g,ee=/"/g,ue=/^(?:script|style|textarea|title)$/i,Ft=s=>(t,...e)=>({_$litType$:s,strings:t,values:e}),c=Ft(1),ui=Ft(2),Ui=Ft(3),v=Symbol.for("lit-noChange"),d=Symbol.for("lit-nothing"),ie=new WeakMap,E=C.createTreeWalker(C,129);function fe(s,t){if(!Ct(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Qt!==void 0?Qt.createHTML(t):t}var ge=(s,t)=>{let e=s.length-1,i=[],a,r=t===2?"<svg>":t===3?"<math>":"",o=D;for(let n=0;n<e;n++){let l=s[n],h,f,p=-1,g=0;for(;g<l.length&&(o.lastIndex=g,f=o.exec(l),f!==null);)g=o.lastIndex,o===D?f[1]==="!--"?o=Kt:f[1]!==void 0?o=Gt:f[2]!==void 0?(ue.test(f[2])&&(a=RegExp("</"+f[2],"g")),o=z):f[3]!==void 0&&(o=z):o===z?f[0]===">"?(o=a??D,p=-1):f[1]===void 0?p=-2:(p=o.lastIndex-f[2].length,h=f[1],o=f[3]===void 0?z:f[3]==='"'?ee:te):o===ee||o===te?o=z:o===Kt||o===Gt?o=D:(o=z,a=void 0);let m=o===z&&s[n+1].startsWith("/>")?" ":"";r+=o===D?l+di:p>=0?(i.push(h),l.slice(0,p)+zt+l.slice(p)+k+m):l+k+(p===-2?n:m)}return[fe(s,r+(s[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),i]},U=class s{constructor({strings:t,_$litType$:e},i){let a;this.parts=[];let r=0,o=0,n=t.length-1,l=this.parts,[h,f]=ge(t,e);if(this.el=s.createElement(h,i),E.currentNode=this.el.content,e===2||e===3){let p=this.el.content.firstChild;p.replaceWith(...p.childNodes)}for(;(a=E.nextNode())!==null&&l.length<n;){if(a.nodeType===1){if(a.hasAttributes())for(let p of a.getAttributeNames())if(p.endsWith(zt)){let g=f[o++],m=a.getAttribute(p).split(k),x=/([.?@])?(.*)/.exec(g);l.push({type:1,index:r,name:x[2],strings:m,ctor:x[1]==="."?tt:x[1]==="?"?et:x[1]==="@"?it:H}),a.removeAttribute(p)}else p.startsWith(k)&&(l.push({type:6,index:r}),a.removeAttribute(p));if(ue.test(a.tagName)){let p=a.textContent.split(k),g=p.length-1;if(g>0){a.textContent=K?K.emptyScript:"";for(let m=0;m<g;m++)a.append(p[m],L()),E.nextNode(),l.push({type:2,index:++r});a.append(p[g],L())}}}else if(a.nodeType===8)if(a.data===Et)l.push({type:2,index:r});else{let p=-1;for(;(p=a.data.indexOf(k,p+1))!==-1;)l.push({type:7,index:r}),p+=k.length-1}r++}}static createElement(t,e){let i=C.createElement("template");return i.innerHTML=t,i}};function F(s,t,e=s,i){if(t===v)return t;let a=i!==void 0?e.N?.[i]:e.O,r=B(t)?void 0:t._$litDirective$;return a?.constructor!==r&&(a?._$AO?.(!1),r===void 0?a=void 0:(a=new r(s),a._$AT(s,e,i)),i!==void 0?(e.N??=[])[i]=a:e.O=a),a!==void 0&&(t=F(s,a._$AS(s,t.values),a,i)),t}var G=class{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}R(t){let{el:{content:e},parts:i}=this._$AD,a=(t?.creationScope??C).importNode(e,!0);E.currentNode=a;let r=E.nextNode(),o=0,n=0,l=i[0];for(;l!==void 0;){if(o===l.index){let h;l.type===2?h=new ct(r,r.nextSibling,this,t):l.type===1?h=new l.ctor(r,l.name,l.strings,this,t):l.type===6&&(h=new at(r,this,t)),this._$AV.push(h),l=i[++n]}o!==l?.index&&(r=E.nextNode(),o++)}return E.currentNode=C,a}V(t){let e=0;for(let i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(t,i,e),e+=i.strings.length-2):i._$AI(t[e])),e++}},ct=class me{get _$AU(){return this._$AM?._$AU??this.D}constructor(t,e,i,a){this.type=2,this._$AH=d,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=i,this.options=a,this.D=a?.isConnected??!0}get parentNode(){let t=this._$AA.parentNode,e=this._$AM;return e!==void 0&&t?.nodeType===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=F(this,t,e),B(t)?t===d||t==null||t===""?(this._$AH!==d&&this._$AR(),this._$AH=d):t!==this._$AH&&t!==v&&this.L(t):t._$litType$!==void 0?this.j(t):t.nodeType!==void 0?this.I(t):de(t)?this.H(t):this.L(t)}B(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}I(t){this._$AH!==t&&(this._$AR(),this._$AH=this.B(t))}L(t){this._$AH!==d&&B(this._$AH)?this._$AA.nextSibling.data=t:this.I(C.createTextNode(t)),this._$AH=t}j(t){let{values:e,_$litType$:i}=t,a=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=U.createElement(fe(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===a)this._$AH.V(e);else{let r=new G(a,this),o=r.R(this.options);r.V(e),this.I(o),this._$AH=r}}_$AC(t){let e=ie.get(t.strings);return e===void 0&&ie.set(t.strings,e=new U(t)),e}H(t){Ct(this._$AH)||(this._$AH=[],this._$AR());let e=this._$AH,i,a=0;for(let r of t)a===e.length?e.push(i=new me(this.B(L()),this.B(L()),this,this.options)):i=e[a],i._$AI(r),a++;a<e.length&&(this._$AR(i&&i._$AB.nextSibling,a),e.length=a)}_$AR(t=this._$AA.nextSibling,e){for(this._$AP?.(!1,!0,e);t!==this._$AB;){let i=Xt(t).nextSibling;Xt(t).remove(),t=i}}setConnected(t){this._$AM===void 0&&(this.D=t,this._$AP?.(t))}},H=class{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,i,a,r){this.type=1,this._$AH=d,this._$AN=void 0,this.element=t,this.name=e,this._$AM=a,this.options=r,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=d}_$AI(t,e=this,i,a){let r=this.strings,o=!1;if(r===void 0)t=F(this,t,e,0),o=!B(t)||t!==this._$AH&&t!==v,o&&(this._$AH=t);else{let n=t,l,h;for(t=r[0],l=0;l<r.length-1;l++)h=F(this,n[i+l],e,l),h===v&&(h=this._$AH[l]),o||=!B(h)||h!==this._$AH[l],h===d?t=d:t!==d&&(t+=(h??"")+r[l+1]),this._$AH[l]=h}o&&!a&&this.W(t)}W(t){t===d?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}},tt=class extends H{constructor(){super(...arguments),this.type=3}W(t){this.element[this.name]=t===d?void 0:t}},et=class extends H{constructor(){super(...arguments),this.type=4}W(t){this.element.toggleAttribute(this.name,!!t&&t!==d)}},it=class extends H{constructor(t,e,i,a,r){super(t,e,i,a,r),this.type=5}_$AI(t,e=this){if((t=F(this,t,e,0)??d)===v)return;let i=this._$AH,a=t===d&&i!==d||t.capture!==i.capture||t.once!==i.once||t.passive!==i.passive,r=t!==d&&(i===d||a);a&&this.element.removeEventListener(this.name,this,i),r&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,t):this._$AH.handleEvent(t)}},at=class{constructor(t,e,i){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(t){F(this,t)}},fi={q:zt,J:k,Z:Et,F:1,G:ge,K:G,X:de,Y:F,tt:ct,st:H,it:et,et:it,ht:tt,ot:at},gi=Pt.litHtmlPolyfillSupport;gi?.(U,ct),(Pt.litHtmlVersions??=[]).push("3.3.3");var ve=(s,t,e)=>{let i=e?.renderBefore??t,a=i._$litPart$;if(a===void 0){let r=e?.renderBefore??null;i._$litPart$=a=new ct(t.insertBefore(L(),r),r,void 0,e??{})}return a._$AI(s),a},Ht=globalThis;var T=class extends A{constructor(){super(...arguments),this.renderOptions={host:this},this.rt=void 0}createRenderRoot(){let t=super.createRenderRoot();return this.renderOptions.renderBefore??=t.firstChild,t}update(t){let e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.rt=ve(e,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this.rt?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this.rt?.setConnected(!1)}render(){return v}};T._$litElement$=!0,T.finalized=!0,Ht.litElementHydrateSupport?.({LitElement:T});var mi=Ht.litElementPolyfillSupport;mi?.({LitElement:T});(Ht.litElementVersions??=[]).push("4.2.2");var{tt:vi}=fi,ae=s=>s,xi=s=>s===null||typeof s!="object"&&typeof s!="function";var se=(s,t)=>t===void 0?s?._$litType$!==void 0:s?._$litType$===t,bi=s=>s?._$litType$?.h!=null;var xe=s=>s.strings===void 0,re=()=>document.createComment(""),S=(s,t,e)=>{let i=s._$AA.parentNode,a=t===void 0?s._$AB:t._$AA;if(e===void 0){let r=i.insertBefore(re(),a),o=i.insertBefore(re(),a);e=new vi(r,o,s,s.options)}else{let r=e._$AB.nextSibling,o=e._$AM,n=o!==s;if(n){let l;e._$AQ?.(s),e._$AM=s,e._$AP!==void 0&&(l=s._$AU)!==o._$AU&&e._$AP(l)}if(r!==a||n){let l=e._$AA;for(;l!==r;){let h=ae(l).nextSibling;ae(i).insertBefore(l,a),l=h}}}return e},M=(s,t,e=s)=>(s._$AI(t,e),s),_i={},q=(s,t=_i)=>s._$AH=t,kt=s=>s._$AH,wt=s=>{s._$AR(),s._$AA.remove()},be=s=>{s._$AR()};var b=s=>(...t)=>({_$litDirective$:s,values:t}),w=class{constructor(t){}get _$AU(){return this._$AM._$AU}_$AT(t,e,i){this.nt=t,this._$AM=e,this.ct=i}_$AS(t,e){return this.update(t,e)}update(t,e){return this.render(...e)}};var I=(s,t)=>{let e=s._$AN;if(e===void 0)return!1;for(let i of e)i._$AO?.(t,!1),I(i,t);return!0},st=s=>{let t,e;do{if((t=s._$AM)===void 0)break;e=t._$AN,e.delete(s),s=t}while(e?.size===0)},_e=s=>{for(let t;t=s._$AM;s=t){let e=t._$AN;if(e===void 0)t._$AN=e=new Set;else if(e.has(s))break;e.add(s),$i(t)}};function wi(s){this._$AN!==void 0?(st(this),this._$AM=s,_e(this)):this._$AM=s}function yi(s,t=!1,e=0){let i=this._$AH,a=this._$AN;if(a!==void 0&&a.size!==0)if(t)if(Array.isArray(i))for(let r=e;r<i.length;r++)I(i[r],!1),st(i[r]);else i!=null&&(I(i,!1),st(i));else I(this,s)}var $i=s=>{s.type==2&&(s._$AP??=yi,s._$AQ??=wi)},J=class extends w{constructor(){super(...arguments),this._$AN=void 0}_$AT(t,e,i){super._$AT(t,e,i),_e(this),this.isConnected=t._$AU}_$AO(t,e=!0){t!==this.isConnected&&(this.isConnected=t,t?this.reconnected?.():this.disconnected?.()),e&&(I(this,t),st(this))}setValue(t){if(xe(this.nt))this.nt._$AI(t,this);else{let e=[...this.nt._$AH];e[this.ct]=t,this.nt._$AI(e,this,0)}}disconnected(){}reconnected(){}};var rt=class{constructor(t){this.lt=t}disconnect(){this.lt=void 0}reconnect(t){this.lt=t}deref(){return this.lt}},ot=class{constructor(){this.ut=void 0,this.dt=void 0}get(){return this.ut}pause(){this.ut??=new Promise(t=>this.dt=t)}resume(){this.dt?.(),this.ut=this.dt=void 0}};var nt=class extends J{constructor(){super(...arguments),this.ft=new rt(this),this.vt=new ot}render(t,e){return v}update(t,[e,i]){if(this.isConnected||this.disconnected(),e===this.yt)return v;this.yt=e;let a=0,{ft:r,vt:o}=this;return(async(n,l)=>{for await(let h of n)if(await l(h)===!1)return})(e,async n=>{for(;o.get();)await o.get();let l=r.deref();if(l!==void 0){if(l.yt!==e)return!1;i!==void 0&&(n=i(n,a)),l.commitValue(n,a),a++}return!0}),v}commitValue(t,e){this.setValue(t)}disconnected(){this.ft.disconnect(),this.vt.pause()}reconnected(){this.ft.reconnect(this),this.vt.resume()}},qi=b(nt),Ji=b(class extends nt{constructor(s){if(super(s),s.type!==2)throw Error("asyncAppend can only be used in child expressions")}update(s,t){return this.rt=s,super.update(s,t)}commitValue(s,t){t===0&&be(this.rt);let e=S(this.rt);M(e,s)}}),oe=s=>bi(s)?s._$litType$.h:s.strings,Zi=b(class extends w{constructor(s){super(s),this.bt=new WeakMap}render(s){return[s]}update(s,[t]){let e=se(this.gt)?oe(this.gt):null,i=se(t)?oe(t):null;if(e!==null&&(i===null||e!==i)){let a=kt(s).pop(),r=this.bt.get(e);if(r===void 0){let o=document.createDocumentFragment();r=ve(d,o),r.setConnected(!1),this.bt.set(e,r)}q(r,[a]),S(r,void 0,a)}if(i!==null){if(e===null||e!==i){let a=this.bt.get(i);if(a!==void 0){let r=kt(a).pop();be(s),S(s,void 0,r),q(s,[r])}}this.gt=t}else this.gt=void 0;return this.render(t)}});var Wi=b(class extends w{constructor(s){if(super(s),s.type!==1||s.name!=="class"||s.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(t=>s[t]).join(" ")+" "}update(s,[t]){if(this.wt===void 0){this.wt=new Set,s.strings!==void 0&&(this._t=new Set(s.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(let i in t)t[i]&&!this._t?.has(i)&&this.wt.add(i);return this.render(t)}let e=s.element.classList;for(let i of this.wt)i in t||(e.remove(i),this.wt.delete(i));for(let i in t){let a=!!t[i];a===this.wt.has(i)||this._t?.has(i)||(a?(e.add(i),this.wt.add(i)):(e.remove(i),this.wt.delete(i)))}return v}}),ki={},Yi=b(class extends w{constructor(){super(...arguments),this.St=ki}render(s,t){return t()}update(s,[t,e]){if(Array.isArray(t)){if(Array.isArray(this.St)&&this.St.length===t.length&&t.every((i,a)=>i===this.St[a]))return v}else if(this.St===t)return v;return this.St=Array.isArray(t)?Array.from(t):t,this.render(t,e)}});var ji=b(class extends w{constructor(){super(...arguments),this.key=d}render(s,t){return this.key=s,t}update(s,[t,e]){return t!==this.key&&(q(s),this.key=t),e}}),we=b(class extends w{constructor(s){if(super(s),s.type!==3&&s.type!==1&&s.type!==4)throw Error("The `live` directive is not allowed on child or event bindings");if(!xe(s))throw Error("`live` bindings can only contain a single expression")}render(s){return s}update(s,[t]){if(t===v||t===d)return t;let e=s.element,i=s.name;if(s.type===3){if(t===e[i])return v}else if(s.type===4){if(!!t===e.hasAttribute(i))return v}else if(s.type===1&&e.getAttribute(i)===t+"")return v;return q(s),t}});var yt=new WeakMap,Xi=b(class extends J{render(s){return d}update(s,[t]){let e=t!==this.lt;return e&&this.$t(void 0),(e||this.Tt!==this.xt)&&(this.lt=t,this.Et=s.options?.host,this.$t(this.xt=s.element)),d}$t(s){if(this.lt!==void 0)if(this.isConnected||(s=void 0),typeof this.lt=="function"){let t=this.Et??globalThis,e=yt.get(t);e===void 0&&(e=new WeakMap,yt.set(t,e)),e.get(this.lt)!==void 0&&this.lt.call(this.Et,void 0),e.set(this.lt,s),s!==void 0&&this.lt.call(this.Et,s)}else this.lt.value=s}get Tt(){return typeof this.lt=="function"?yt.get(this.Et??globalThis)?.get(this.lt):this.lt?.value}disconnected(){this.Tt===this.xt&&this.$t(void 0)}reconnected(){this.$t(this.xt)}}),ne=(s,t,e)=>{let i=new Map;for(let a=t;a<=e;a++)i.set(s[a],a);return i},ye=b(class extends w{constructor(s){if(super(s),s.type!==2)throw Error("repeat() can only be used in text expressions")}Ct(s,t,e){let i;e===void 0?e=t:t!==void 0&&(i=t);let a=[],r=[],o=0;for(let n of s)a[o]=i?i(n,o):o,r[o]=e(n,o),o++;return{values:r,keys:a}}render(s,t,e){return this.Ct(s,t,e).values}update(s,[t,e,i]){let a=kt(s),{values:r,keys:o}=this.Ct(t,e,i);if(!Array.isArray(a))return this.Pt=o,r;let n=this.Pt??=[],l=[],h,f,p=0,g=a.length-1,m=0,x=r.length-1;for(;p<=g&&m<=x;)if(a[p]===null)p++;else if(a[g]===null)g--;else if(n[p]===o[m])l[m]=M(a[p],r[m]),p++,m++;else if(n[g]===o[x])l[x]=M(a[g],r[x]),g--,x--;else if(n[p]===o[x])l[x]=M(a[p],r[x]),S(s,l[x+1],a[p]),p++,x--;else if(n[g]===o[m])l[m]=M(a[g],r[m]),S(s,a[p],a[g]),g--,m++;else if(h===void 0&&(h=ne(o,m,x),f=ne(n,p,g)),h.has(n[p]))if(h.has(n[g])){let y=f.get(o[m]),bt=y!==void 0?a[y]:null;if(bt===null){let Jt=S(s,a[p]);M(Jt,r[m]),l[m]=Jt}else l[m]=M(bt,r[m]),S(s,a[p],bt),a[y]=null;m++}else wt(a[g]),g--;else wt(a[p]),p++;for(;m<=x;){let y=S(s,l[x+1]);M(y,r[m]),l[m++]=y}for(;p<=g;){let y=a[p++];y!==null&&wt(y)}return this.Pt=o,q(s,l),v}}),$e="important",Mi=" !"+$e,Qi=b(class extends w{constructor(s){if(super(s),s.type!==1||s.name!=="style"||s.strings?.length>2)throw Error("The `styleMap` directive must be used in the `style` attribute and must be the only part in the attribute.")}render(s){return Object.keys(s).reduce((t,e)=>{let i=s[e];return i==null?t:t+`${e=e.includes("-")?e:e.replace(/(?:^(webkit|moz|ms|o)|)(?=[A-Z])/g,"-$&").toLowerCase()}:${i};`},"")}update(s,[t]){let{style:e}=s.element;if(this.Mt===void 0)return this.Mt=new Set(Object.keys(t)),this.render(t);for(let i of this.Mt)t[i]==null&&(this.Mt.delete(i),i.includes("-")?e.removeProperty(i):e[i]=null);for(let i in t){let a=t[i];if(a!=null){this.Mt.add(i);let r=typeof a=="string"&&a.endsWith(Mi);i.includes("-")||r?e.setProperty(i,r?a.slice(0,-11):a,r?$e:""):e[i]=a}}return v}}),Ki=b(class extends w{constructor(s){if(super(s),s.type!==2)throw Error("templateContent can only be used in child bindings")}render(s){return this.At===s?v:(this.At=s,document.importNode(s.content,!0))}}),V=class extends w{constructor(t){if(super(t),this.gt=d,t.type!==2)throw Error(this.constructor.directiveName+"() can only be used in child bindings")}render(t){if(t===d||t==null)return this.kt=void 0,this.gt=t;if(t===v)return t;if(typeof t!="string")throw Error(this.constructor.directiveName+"() called with a non-string value");if(t===this.gt)return this.kt;this.gt=t;let e=[t];return e.raw=e,this.kt={_$litType$:this.constructor.resultType,strings:e,values:[]}}};V.directiveName="unsafeHTML",V.resultType=1;var Gi=b(V);var Z=class extends V{};Z.directiveName="unsafeSVG",Z.resultType=2;var ke=b(Z),le=s=>!xi(s)&&typeof s.then=="function",ce=1073741823;var Mt=class extends J{constructor(){super(...arguments),this.Ot=ce,this.Ut=[],this.ft=new rt(this),this.vt=new ot}render(...t){return t.find(e=>!le(e))??v}update(t,e){let i=this.Ut,a=i.length;this.Ut=e;let r=this.ft,o=this.vt;this.isConnected||this.disconnected();for(let n=0;n<e.length&&!(n>this.Ot);n++){let l=e[n];if(!le(l))return this.Ot=n,l;n<a&&l===i[n]||(this.Ot=ce,a=0,Promise.resolve(l).then(async h=>{for(;o.get();)await o.get();let f=r.deref();if(f!==void 0){let p=f.Ut.indexOf(l);p>-1&&p<f.Ot&&(f.Ot=p,f.setValue(h))}}))}return v}disconnected(){this.ft.disconnect(),this.vt.pause()}reconnected(){this.ft.reconnect(this),this.vt.resume()}},ta=b(Mt);var Ai=Symbol.for(""),Si=s=>{if(s?.r===Ai)return s?._$litStatic$};var pe=new Map,Me=s=>(t,...e)=>{let i=e.length,a,r,o=[],n=[],l,h=0,f=!1;for(;h<i;){for(l=t[h];h<i&&(r=e[h],(a=Si(r))!==void 0);)l+=a+t[++h],f=!0;h!==i&&n.push(r),o.push(l),h++}if(h===i&&o.push(t[i]),f){let p=o.join("$$lit$$");(t=pe.get(p))===void 0&&(o.raw=o,pe.set(p,t=o)),e=n}return s(t,...e)},ea=Me(c),ia=Me(ui);window.litDisableBundleWarning||console.warn("Lit has been loaded from a bundle that combines all core features into a single file. To reduce transfer size and parsing cost, consider using the `lit` npm package directly in your project.");var Rt={menu:'<path d="M4 5h16"/><path d="M4 12h16"/><path d="M4 19h16"/>',"chevron-left":'<path d="m15 18-6-6 6-6"/>',"chevron-right":'<path d="m9 18 6-6-6-6"/>',"chevron-down":'<path d="m6 9 6 6 6-6"/>',plus:'<path d="M5 12h14"/><path d="M12 5v14"/>',search:'<path d="m21 21-4.34-4.34"/><circle cx="11" cy="11" r="8"/>',x:'<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',check:'<path d="M20 6 9 17l-5-5"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',moon:'<path d="M20.985 12.486a9 9 0 1 1-9.473-9.472c.405-.022.617.46.402.803a6 6 0 0 0 8.268 8.268c.344-.215.825-.004.803.401"/>',sunrise:'<path d="M12 2v8"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m8 6 4-4 4 4"/><path d="M16 18a4 4 0 0 0-8 0"/>',sunset:'<path d="M12 10V2"/><path d="m4.93 10.93 1.41 1.41"/><path d="M2 18h2"/><path d="M20 18h2"/><path d="m19.07 10.93-1.41 1.41"/><path d="M22 22H2"/><path d="m16 6-4 4-4-4"/><path d="M16 18a4 4 0 0 0-8 0"/>',notebook:'<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M16 2v20"/>',"notebook-pen":'<path d="M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4"/><path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><path d="M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z"/>',"notebook-text":'<path d="M2 6h4"/><path d="M2 10h4"/><path d="M2 14h4"/><path d="M2 18h4"/><rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9.5 8h5"/><path d="M9.5 12H16"/><path d="M9.5 16H14"/>',"book-open":'<path d="M12 5v16"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/>',library:'<path d="m16 6 4 14"/><path d="M12 6v14"/><path d="M8 8v12"/><path d="M4 4v16"/>',pin:'<path d="M12 17v5"/><path d="M9 10.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-.76a2 2 0 0 0-1.11-1.79l-1.78-.9A2 2 0 0 1 15 10.76V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H8a2 2 0 0 0 0 4 1 1 0 0 1 1 1z"/>',"pin-off":'<path d="M12 17v5"/><path d="M15 9.34V7a1 1 0 0 1 1-1 2 2 0 0 0 0-4H7.89"/><path d="m2 2 20 20"/><path d="M9 9v1.76a2 2 0 0 1-1.11 1.79l-1.78.9A2 2 0 0 0 5 15.24V16a1 1 0 0 0 1 1h11"/>',"pen-line":'<path d="M13 21h8"/><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/>',trash:'<path d="M10 11v6"/><path d="M14 11v6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M3 6h18"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',ellipsis:'<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>',"sliders-horizontal":'<path d="M10 5H3"/><path d="M12 19H3"/><path d="M14 3v4"/><path d="M16 17v4"/><path d="M21 12h-9"/><path d="M21 19h-5"/><path d="M21 5h-7"/><path d="M8 10v4"/><path d="M8 12H3"/>',palette:'<path d="M12 22a1 1 0 0 1 0-20 10 9 0 0 1 10 9 5 5 0 0 1-5 5h-2.25a1.75 1.75 0 0 0-1.4 2.8l.3.4a1.75 1.75 0 0 1-1.4 2.8z"/><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>',"sun-moon":'<path d="M12 2v2"/><path d="M14.837 16.385a6 6 0 1 1-7.223-7.222c.624-.147.97.66.715 1.248a4 4 0 0 0 5.26 5.259c.589-.255 1.396.09 1.248.715"/><path d="M16 12a4 4 0 0 0-4-4"/><path d="m19 5-1.256 1.256"/><path d="M20 12h2"/>',type:'<path d="M12 4v16"/><path d="M4 7V5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2"/><path d="M9 20h6"/>',"grid-3x3":'<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/><path d="M9 3v18"/><path d="M15 3v18"/>',list:'<path d="M3 5h.01"/><path d="M3 12h.01"/><path d="M3 19h.01"/><path d="M8 5h13"/><path d="M8 12h13"/><path d="M8 19h13"/>',layers:'<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"/><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"/><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"/>',copy:'<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',"share-2":'<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',eraser:'<path d="M21 21H8a2 2 0 0 1-1.42-.587l-3.994-3.999a2 2 0 0 1 0-2.828l10-10a2 2 0 0 1 2.829 0l5.999 6a2 2 0 0 1 0 2.828L12.834 21"/><path d="m5.082 11.09 8.828 8.828"/>',"circle-alert":'<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',sparkles:'<path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/>',"clipboard-paste":'<path d="M11 14h10"/><path d="M16 4h2a2 2 0 0 1 2 2v1.344"/><path d="m17 18 4-4-4-4"/><path d="M8 4H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 1.793-1.113"/><rect x="8" y="2" width="8" height="4" rx="1"/>',images:'<path d="m22 11-1.296-1.296a2.4 2.4 0 0 0-3.408 0L11 16"/><path d="M4 8a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2"/><circle cx="13" cy="7" r="1" fill="currentColor"/><rect x="8" y="2" width="14" height="14" rx="2"/>',camera:'<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"/><circle cx="12" cy="13" r="3"/>',"scan-text":'<path d="M3 7V5a2 2 0 0 1 2-2h2"/><path d="M17 3h2a2 2 0 0 1 2 2v2"/><path d="M21 17v2a2 2 0 0 1-2 2h-2"/><path d="M7 21H5a2 2 0 0 1-2-2v-2"/><path d="M7 8h8"/><path d="M7 12h10"/><path d="M7 16h6"/>',"message-square-text":'<path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/><path d="M7 11h10"/><path d="M7 15h6"/><path d="M7 7h8"/>',"loader-circle":'<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',zap:'<path d="M15.914 4a1.5 1.5 0 00-2.474-1.561l-9 9A1.5 1.5 0 005.5 14h4.002a.5.5 0 01.471.666L8.086 20a1.5 1.5 0 002.475 1.56l9-9A1.5 1.5 0 0018.5 10h-3.997a.5.5 0 01-.472-.667z"/>',"wifi-off":'<path d="M12 20h.01"/><path d="M8.5 16.429a5 5 0 0 1 7 0"/><path d="M5 12.859a10 10 0 0 1 5.17-2.69"/><path d="M19 12.859a10 10 0 0 0-2.007-1.523"/><path d="M2 8.82a15 15 0 0 1 4.177-2.643"/><path d="M22 8.82a15 15 0 0 0-11.288-3.764"/><path d="m2 2 20 20"/>',"calendar-clock":'<path d="M16 14v2.2l1.6 1"/><path d="M16 2v3"/><path d="M21 7.338V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2h2.338"/><path d="M3 9h5.859"/><path d="M8 2v3"/><circle cx="16" cy="16" r="6"/>',"clock-3":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6h4"/>',"arrow-right-left":'<path d="m16 3 4 4-4 4"/><path d="M20 7H4"/><path d="m8 21-4-4 4-4"/><path d="M4 17h16"/>',"rotate-ccw":'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',"list-plus":'<path d="M16 5H3"/><path d="M11 12H3"/><path d="M16 19H3"/><path d="M18 9v6"/><path d="M21 12h-6"/>',"external-link":'<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',house:'<path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"/><path d="M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',heart:'<path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/>',star:'<path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/>',briefcase:'<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',dumbbell:'<path d="M17.596 12.768a2 2 0 1 0 2.829-2.829l-1.768-1.767a2 2 0 0 0 2.828-2.829l-2.828-2.828a2 2 0 0 0-2.829 2.828l-1.767-1.768a2 2 0 1 0-2.829 2.829z"/><path d="m2.5 21.5 1.4-1.4"/><path d="m20.1 3.9 1.4-1.4"/><path d="M5.343 21.485a2 2 0 1 0 2.829-2.828l1.767 1.768a2 2 0 1 0 2.829-2.829l-6.364-6.364a2 2 0 1 0-2.829 2.829l1.768 1.767a2 2 0 0 0-2.828 2.829z"/><path d="m9.6 14.4 4.8-4.8"/>',lightbulb:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/>',"graduation-cap":'<path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"/><path d="M22 10v6"/><path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"/>',"book-open-text":'<path d="M12 5v16"/><path d="M16 13h2"/><path d="M16 9h2"/><path d="M20.001 19A2 2 0 0022 17V5a2 2 0 00-1.999-2L16 3.002A5 5 0 0012 5a5 5 0 00-4-2H4a2 2 0 00-2 2v12a2 2 0 001.999 2H8a5 5 0 014 2 5 5 0 014-2z"/><path d="M6 13h2"/><path d="M6 9h2"/>',coffee:'<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>',bed:'<path d="M2 4v16"/><path d="M2 8h18a2 2 0 0 1 2 2v10"/><path d="M2 17h20"/><path d="M6 8v9"/>',utensils:'<path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/>',headphones:'<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>',plane:'<path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>',"flower-2":'<path d="M12 5a3 3 0 1 1 3 3m-3-3a3 3 0 1 0-3 3m3-3v1M9 8a3 3 0 1 0 3 3M9 8h1m5 0a3 3 0 1 1-3 3m3-3h-1m-2 3v-1"/><circle cx="12" cy="8" r="2"/><path d="M12 10v12"/><path d="M12 22c4.2 0 7-1.667 7-5-4.2 0-7 1.667-7 5Z"/><path d="M12 22c-4.2 0-7-1.667-7-5 4.2 0 7 1.667 7 5Z"/>',wallet:'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',baby:'<path d="M10 16c.5.3 1.2.5 2 .5s1.5-.2 2-.5"/><path d="M15 12h.01"/><path d="M19.38 6.813A9 9 0 0 1 20.8 10.2a2 2 0 0 1 0 3.6 9 9 0 0 1-17.6 0 2 2 0 0 1 0-3.6A9 9 0 0 1 12 3c2 0 3.5 1.1 3.5 2.5s-.9 2.5-2 2.5c-.8 0-1.5-.4-1.5-1"/><path d="M9 12h.01"/>',dog:'<path d="M11.25 16.25h1.5L12 17z"/><path d="M16 14v.5"/><path d="M4.42 11.247A13.152 13.152 0 0 0 4 14.556C4 18.728 7.582 21 12 21s8-2.272 8-6.444a11.702 11.702 0 0 0-.493-3.309"/><path d="M8 14v.5"/><path d="M8.5 8.5c-.384 1.05-1.083 2.028-2.344 2.5-1.931.722-3.576-.297-3.656-1-.113-.994 1.177-6.53 4-7 1.923-.321 3.651.845 3.651 2.235A7.497 7.497 0 0 1 14 5.277c0-1.39 1.844-2.598 3.767-2.277 2.823.47 4.113 6.006 4 7-.08.703-1.725 1.722-3.656 1-1.261-.472-1.855-1.45-2.239-2.5"/>',pencil:'<path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/>'};var Ae="./fonts/barlow-400.woff2";var Se="./fonts/barlow-500.woff2";var Te="./fonts/barlow-600.woff2";var Pe="./fonts/barlow-condensed-500.woff2";var ze="./fonts/barlow-condensed-600.woff2";var Ee="./fonts/barlow-condensed-700.woff2";var Ce="./fonts/caveat-var.woff2";var Fe='system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',He=`"MM Barlow", ${Fe}`,Re=`"MM Barlow Condensed", ${Fe}`,Ve='"MM Caveat", "Segoe Print", "Bradley Hand", cursive';function Oe(){if(document.getElementById("memoria-fonts"))return;let s=(e,i,a)=>`@font-face{font-family:"${e}";src:url(${JSON.stringify(i)}) format("woff2");font-weight:${a};font-style:normal;font-display:swap}`,t=document.createElement("style");t.id="memoria-fonts",t.textContent=[s("MM Barlow",Ae,400),s("MM Barlow",Se,500),s("MM Barlow",Te,"600 900"),s("MM Barlow Condensed",Pe,500),s("MM Barlow Condensed",ze,600),s("MM Barlow Condensed",Ee,"700 900"),s("MM Caveat",Ce,"400 700")].join(`
`),document.head.appendChild(t)}var De=Tt`
  :host {
    --rv-body: ${W(He)};
    --rv-display: ${W(Re)};
    --mm-hand: ${W(Ve)};
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
  .detail-head {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    margin: -6px -8px 6px -12px;
  }
  .detail-head .dh-text {
    flex: 1;
    min-width: 0;
    padding-top: 6px;
  }
  .detail-head h1 {
    font-size: clamp(34px, 9vw, 46px);
    overflow-wrap: anywhere;
    font-weight: 700;
    line-height: 1;
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
  .hidden-input {
    position: absolute;
    inset: 0;
    opacity: 0;
    width: 100%;
    height: 100%;
    border: 0;
    padding: 0;
    pointer-events: none;
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
  .tab.fab {
    color: var(--rv-text);
    font-weight: 600;
  }
  .tab.fab .pill {
    width: 58px;
    height: 38px;
    border-radius: 14px;
    background: var(--rv-accent);
    color: var(--rv-on-accent);
    display: grid;
    place-items: center;
    margin-top: -4px;
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
  .more-row {
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
`,Ne=Tt`
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
  .time-list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    align-items: center;
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
  .add-time {
    position: relative;
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
  .time-input {
    font-family: var(--rv-display);
    font-size: 19px;
    font-weight: 600;
    font-variant-numeric: tabular-nums;
    border: 1.5px solid var(--rv-line-strong);
    background: var(--rv-surface-2);
    border-radius: 12px;
    padding: 6px 10px;
    min-width: 104px;
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
  .ai-actions {
    display: flex;
    margin: 14px 0 6px;
  }
  .ai-actions .btn {
    flex: none;
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
`;var P=[{id:"vermelho",label:"Vermelho",fill:"#FF5A4F",ink:"#C42A1F"},{id:"coral",label:"Coral",fill:"#FF8A65",ink:"#C2410C"},{id:"rosa",label:"Rosa",fill:"#FF77A9",ink:"#BE185D"},{id:"framboesa",label:"Framboesa",fill:"#E8508A",ink:"#A3124F"},{id:"laranja",label:"Laranja",fill:"#FFA23E",ink:"#B45309"},{id:"ouro",label:"Ouro",fill:"#F2C14E",ink:"#8A6100"},{id:"lilas",label:"Lil\xE1s",fill:"#B99BFF",ink:"#6D3FD6"},{id:"azul",label:"Azul",fill:"#62B5FF",ink:"#0B67A8"},{id:"menta",label:"Menta",fill:"#4ED3A6",ink:"#0E7A57"},{id:"grafite",label:"Grafite",fill:"#B9ADAE",ink:"#5E5253"}],pt=s=>P.find(t=>t.id===s);function ht(s,t){let e=s.replace("#",""),i=parseInt(e.length===3?e.replace(/./g,a=>a+a):e,16);return`rgba(${i>>16&255}, ${i>>8&255}, ${i&255}, ${t})`}function Vt(s,t,e="c"){return`--${e}:${s.fill};--${e}i:${t?s.fill:s.ink};--${e}s:${ht(s.fill,t?.17:.15)};`}var dt=s=>(s||"").normalize("NFD").replace(/[̀-ͯ]/g,"").toLowerCase(),Ot=s=>Array.from(s||"",t=>{let e=t.normalize("NFD")[0]||t;return e.toLowerCase().length===1?e.toLowerCase():t}).join(""),$=(s,t,e)=>`${s} ${s===1?t:e}`,_=(s,t=38)=>s.length>t?s.slice(0,t-1).trimEnd()+"\u2026":s,Ri=["Domingo","Segunda","Ter\xE7a","Quarta","Quinta","Sexta","S\xE1bado"],Vi=["jan","fev","mar","abr","mai","jun","jul","ago","set","out","nov","dez"],Ie=s=>String(s).padStart(2,"0");var Le=s=>`${Ie(s.getHours())}:${Ie(s.getMinutes())}`;function Y(s,t=new Date){let e=new Date(s),i=Math.round((new Date(t.getFullYear(),t.getMonth(),t.getDate())-new Date(e.getFullYear(),e.getMonth(),e.getDate()))/864e5);if(i===0)return`hoje, ${Le(e)}`;if(i===1)return`ontem, ${Le(e)}`;let r=`${Ri[e.getDay()].slice(0,3).toLowerCase()}, ${e.getDate()} ${Vi[e.getMonth()]}`;return e.getFullYear()===t.getFullYear()?r:`${r} ${e.getFullYear()}`}var ut=()=>Array.from(crypto.getRandomValues(new Uint8Array(6)),s=>s.toString(16).padStart(2,"0")).join(""),ft=s=>((s||"").split(`
`).find(t=>t.trim())||"").trim();async function Dt(s,t=1800){let e=i=>new Promise((a,r)=>{let o=new FileReader;o.onload=()=>a(String(o.result).split(",")[1]||""),o.onerror=()=>r(o.error),o.readAsDataURL(i)});try{let i=await createImageBitmap(s,{imageOrientation:"from-image"}),a=Math.min(1,t/Math.max(i.width,i.height)),r=document.createElement("canvas");r.width=Math.round(i.width*a),r.height=Math.round(i.height*a),r.getContext("2d").drawImage(i,0,0,r.width,r.height),i.close&&i.close();let o=await new Promise(n=>r.toBlob(n,"image/jpeg",.86));return{mime:"image/jpeg",data:await e(o),url:URL.createObjectURL(o)}}catch{return{mime:s.type||"image/jpeg",data:await e(s),url:URL.createObjectURL(s)}}}var Nt=class{constructor(t,e){this.url=t,this.onStatus=e,this.nextId=1,this.pending=new Map,this.subs=new Set,this.byId=new Map,this.queue=[],this.open=!1,this.everOpened=!1,this.backoff=1e3,this.reconnectHandlers=[],this._connect()}_connect(){let t=new WebSocket(this.url);this.ws=t,t.onopen=()=>{this.open=!0,this.backoff=1e3;let e=this.everOpened;this.everOpened=!0;for(let i of this.subs)this._startSub(i);for(let i of this.queue.splice(0))t.send(i);if(this.onStatus&&this.onStatus(!0),e)for(let i of this.reconnectHandlers)i()},t.onmessage=e=>{let i;try{i=JSON.parse(e.data)}catch{return}if(i.type==="result"){let a=this.pending.get(i.id);if(!a)return;if(this.pending.delete(i.id),i.success)a.resolve(i.result);else{let r=new Error(i.error&&i.error.message||"Falhou");r.code=i.error&&i.error.code,i.error&&i.error.page&&(r.page=i.error.page),a.reject(r)}}else if(i.type==="event"){let a=this.byId.get(i.id);a&&a.cb(i.event)}},t.onclose=()=>{let e=this.open;this.open=!1,this.byId.clear();for(let[,i]of this.pending){let a=new Error("Sem conex\xE3o com o MemorIA");a.code="disconnected",i.reject(a)}this.pending.clear(),e&&this.onStatus&&this.onStatus(!1),setTimeout(()=>this._connect(),this.backoff),this.backoff=Math.min(this.backoff*2,15e3)}}onReconnect(t){this.reconnectHandlers.push(t)}_send(t){let e=JSON.stringify(t);this.open?this.ws.send(e):this.queue.push(e)}sendMessagePromise(t){let e=this.nextId++;return new Promise((i,a)=>{this.pending.set(e,{resolve:i,reject:a}),this._send({...t,id:e})})}subscribeMessage(t,e){let i={cb:t,msg:e,id:null,first:null};this.subs.add(i);let a=new Promise((r,o)=>{i.first={resolve:r,reject:o}});return this.open&&this._startSub(i),a.then(()=>async()=>{this.subs.delete(i),i.id!=null&&(this.byId.delete(i.id),this.open&&this.sendMessagePromise({type:"unsubscribe_events",subscription:i.id}).catch(()=>{}))})}_startSub(t){let e=this.nextId++;t.id=e,this.byId.set(e,t),this.pending.set(e,{resolve:()=>{t.first&&t.first.resolve(),t.first=null},reject:i=>{i.code!=="disconnected"&&(this.byId.delete(e),this.subs.delete(t),t.first&&t.first.reject(i),t.first=null)}}),this.ws.send(JSON.stringify({...t.msg,id:e}))}};function It(){try{if(window.parent===window)return null;let s=window.parent.document.querySelector("home-assistant");return s&&s.hass||null}catch{return null}}var Be=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null;function Ue(){let s=It();return s&&s.themes&&typeof s.themes.darkMode=="boolean"?s.themes.darkMode:!!(Be&&Be.matches)}function qe(){return{topbar:!(window.parent!==window),haptic(t){try{let e=window.parent;e!==window&&e.dispatchEvent(new e.CustomEvent("haptic",{detail:t}))}catch{}},openInHA(t){try{let e=window.parent;if(e!==window&&e.document){e.history.pushState(null,"",t),e.dispatchEvent(new e.CustomEvent("location-changed",{detail:{replace:!1}}));return}}catch{}window.open(t,"_top")}}}var gt=class{constructor(){let t=new URL("ws",location.href);t.protocol=location.protocol==="https:"?"wss:":"ws:",this.statusHandlers=[],this.conn=new Nt(t.href,e=>this.statusHandlers.forEach(i=>i(e)))}onStatus(t){this.statusHandlers.push(t)}onReconnect(t){this.conn.onReconnect(t)}call(t,e={}){return this.conn.sendMessagePromise({type:t,...e})}bootstrap(){return this.call("memoria/bootstrap")}subscribe(t){return this.conn.subscribeMessage(t,{type:"memoria/subscribe"})}savePage(t){return this.call("memoria/page/save",{page:t})}deletePage(t){return this.call("memoria/page/delete",{page_id:t})}saveBlock(t){return this.call("memoria/block/save",{block:t})}deleteBlock(t){return this.call("memoria/block/delete",{block_id:t})}aiStatus(){return this.call("memoria/ai/status")}saveSettings(t){return this.call("memoria/settings/save",t)}async extract(t){let e=await fetch(new URL("api/extract",location.href),{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(t)}),i=await e.json().catch(()=>({}));if(!e.ok){let a=new Error(i.error||`Erro ${e.status}`);throw a.code=i.code,a}return i}};var j=[{id:"manha",label:"Manh\xE3",icon:"sunrise"},{id:"tarde",label:"Tarde",icon:"sun"},{id:"noite",label:"Noite",icon:"moon"}],Oi={manha:"05:00",tarde:"12:00",noite:"18:00"},Ze=["pautado","quadriculado","pontilhado","liso"],Lt=s=>String(s).padStart(2,"0"),We=/^([01]?\d|2[0-3]):([0-5]\d)$/;var vt=s=>{let t=We.exec(s||"");return t?`${Lt(Number(t[1]))}:${t[2]}`:null},mt=s=>{let t=We.exec(s||"");return t?Number(t[1])*60+Number(t[2]):null},R=s=>`${Lt(Math.floor(s/60))}:${Lt(s%60)}`,Ye=s=>s.getHours()*60+s.getMinutes();function O(s){return{...Oi,...s&&s.periods||{}}}function je(s,t){let e=j.map(a=>({id:a.id,min:mt(t[a.id])})).filter(a=>a.min!=null);e.sort((a,r)=>a.min-r.min);let i=e[e.length-1];for(let a of e)a.min<=s&&(i=a);return i?i.id:"manha"}var Je={page:0,time:1,period:2};function Xe(s){let t=O(s),e=s&&s.blocks||[],i=new Map(e.map((o,n)=>[o.id,o.order!=null?o.order:n])),a=[];for(let o of e){for(let n of o.periods||[]){let l=mt(t[n]);l!=null&&a.push({min:l,block:o.id,page:null,kind:"period",period:n})}for(let n of o.times||[]){let l=mt(n);l!=null&&a.push({min:l,block:o.id,page:null,kind:"time"})}}for(let o of s&&s.pages||[])if(i.has(o.block))for(let n of o.times||[]){let l=mt(n);l!=null&&a.push({min:l,block:o.block,page:o.id,kind:"page"})}a.sort((o,n)=>o.min-n.min||Je[o.kind]-Je[n.kind]||i.get(o.block)-i.get(n.block));let r=new Set;return a.filter(o=>{let n=`${o.min}|${o.block}|${o.page||""}`;return r.has(n)?!1:(r.add(n),!0)})}function Qe(s,t){if(!s.length)return null;let e=null;for(let a of s)a.min<=t&&(e=a.min);e==null&&(e=s[s.length-1].min);let i=s.filter(a=>a.min===e);return{min:e,entries:i,main:i[0]}}function Ke(s,t){if(!s.length)return null;let e=[...new Set(s.map(o=>o.min))],i=e.find(o=>o>t),a=i??e[0];if(e.length===1&&a<=t)return null;let r=s.filter(o=>o.min===a);return{min:a,entries:r,main:r[0],tomorrow:i==null}}function Bt(s){let t=[];for(let e of s){let i=t[t.length-1];i&&i.min===e.min?i.entries.push(e):t.push({min:e.min,entries:[e],main:e})}return t}var Ge="memoria.theme",Di=600,Ni=600,ti={pautado:"Pautado",quadriculado:"Quadriculado",pontilhado:"Pontilhado",liso:"Liso"},Ii=Array.from({length:14},()=>c`<i></i>`),u=(s,t="")=>c`<svg class="i ${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ke(Rt[s]||Rt.notebook)}</svg>`,ei={get(s,t){try{let e=localStorage.getItem(s);return e==null?t:JSON.parse(e)}catch{return t}},set(s,t){try{localStorage.setItem(s,JSON.stringify(t))}catch{}}},ii=(s,t)=>s.created-t.created||(s.id<t.id?-1:1),xt=s=>j.find(t=>t.id===s),Li=()=>!!(window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches),Ut=class extends T{static properties={api:{attribute:!1},env:{attribute:!1},_data:{state:!0},_ready:{state:!0},_bootError:{state:!0},_online:{state:!0},_path:{state:!0},_sheet:{state:!0},_form:{state:!0},_toast:{state:!0},_query:{state:!0},_theme:{state:!0},_cam:{state:!0},_pad:{state:!0},_turn:{state:!0},_peek:{state:!0},_choice:{state:!0},_now:{state:!0},_dark:{state:!0}};static styles=[De,Ne];constructor(){super(),this.api=null,this.env=null,this._data=null,this._ready=!1,this._bootError=null,this._online=!0,this._path=history.state&&history.state.rvPath||"",this._sheet=null,this._form=null,this._toast=null,this._query="",this._theme=ei.get(Ge,"auto"),this._cam=null,this._pad=null,this._turn=null,this._peek=null,this._choice=null,this._now=Date.now(),this._dark=!1,this._user={name:""},this._ai={ready:!1,images:!1,entities:[]},this._aiAt=0,this._version="",this._saving=new Map,this._base=new Map,this._dropped=new Set,this._slotKey=null,this._lastTyped=0,this._cache={data:null,pages:new Map,schedule:[]},this._onPopState=this._onPopState.bind(this),this._onVisible=this._onVisible.bind(this),this._mql=window.matchMedia?window.matchMedia("(prefers-color-scheme: dark)"):null,this._onScheme=()=>this._syncDark()}connectedCallback(){super.connectedCallback(),Oe(),window.addEventListener("popstate",this._onPopState),document.addEventListener("visibilitychange",this._onVisible),this._mql&&this._mql.addEventListener&&this._mql.addEventListener("change",this._onScheme),this._tickTimer=setInterval(()=>this._tick(),2e4),this._themeTimer=setInterval(()=>this._syncDark(),3e3),this._syncDark(),this.api&&!this._started&&this._start()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener("popstate",this._onPopState),document.removeEventListener("visibilitychange",this._onVisible),this._mql&&this._mql.removeEventListener&&this._mql.removeEventListener("change",this._onScheme),clearInterval(this._tickTimer),clearInterval(this._themeTimer),clearTimeout(this._toastTimer),clearTimeout(this._turnTimer),this._stopStream();for(let t of[...this._saving.keys()])this._flushSave(t)}willUpdate(t){t.has("api")&&this.api&&!this._started&&this.isConnected&&this._start(),this._data&&this._cache.data!==this._data&&this._reindex()}updated(t){if(this.toggleAttribute("dark",this._dark),this._turn&&t.has("_turn")){let e=this.renderRoot.querySelector(".turn .face.front .ink");e&&(e.scrollTop=this._turn.snap.scroll||0)}if(t.has("_path")&&this._view().name==="search"){let e=this.renderRoot.querySelector(".search-box input");e&&e.focus({preventScroll:!0})}if(this._scrollChip){this._scrollChip=!1;let e=this.renderRoot.querySelector(".tchip.on, .tchip.peek");e&&e.scrollIntoView&&e.scrollIntoView({inline:"center",block:"nearest",behavior:"instant"})}}_onVisible(){if(document.visibilityState==="visible")this._syncDark(),this._tick();else for(let[t,e]of this._saving)e.timer&&this._flushSave(t)}_syncDark(){let t;this._theme==="dark"?t=!0:this._theme==="light"?t=!1:t=Ue(),t!==this._dark&&(this._dark=t)}_setTheme(t){this._theme=t,ei.set(Ge,t),this._syncDark()}async _start(){this._started=!0,this.api.onStatus(t=>{this._online=t}),this.api.onReconnect(()=>this._boot(!0)),await this._boot(!1),this.api.subscribe(t=>this._onEvent(t)).catch(()=>{})}async _boot(t){try{let e=await this.api.bootstrap();this._version=e.version||"",this._user=e.user||{name:""},this._ai=e.ai||{ready:!1,images:!1,entities:[]},this._aiAt=Date.now();let i=e.data,a=i.pages.filter(r=>!this._dropped.has(r.id));for(let r of a)this._isDirty(r.id)||this._base.set(r.id,r.updated);for(let[r,o]of this._saving){let n=this._page(r);if(!n||!(o.dirty||o.inflight))continue;let l=a.findIndex(h=>h.id===r);l>=0?a[l]={...a[l],text:n.text}:a.push(n)}if(this._data={...i,pages:a},this._ready=!0,this._bootError=null,(!this._pad||!this._block(this._pad.block))&&this._enterView(),t)for(let[r,o]of this._saving)o.dirty&&this._flushSave(r);this._tick()}catch(e){this._ready||(this._bootError=e.message||String(e)),t||setTimeout(()=>this._boot(!1),3e3)}}_reindex(){let t=new Map;for(let e of this._data.pages)t.has(e.block)||t.set(e.block,[]),t.get(e.block).push(e);for(let e of t.values())e.sort(ii);this._cache={data:this._data,pages:t,schedule:Xe(this._data)}}_blocks(){return[...this._data&&this._data.blocks||[]].sort((t,e)=>t.order-e.order||t.created-e.created)}_block(t){return this._data&&this._data.blocks.find(e=>e.id===t)}_page(t){return this._data&&this._data.pages.find(e=>e.id===t)}_pagesOf(t){return this._data&&this._cache.data!==this._data&&this._reindex(),this._cache.pages.get(t)||[]}_schedule(){return this._data&&this._cache.data!==this._data&&this._reindex(),this._cache.schedule}_app(t,e){let i=this._data&&this._data.app?this._data.app[t]:void 0;return i===void 0?e:i}_accent(){return pt(this._app("accent","lilas"))||P[6]}_colorOf(t){return t&&pt(t.color)||P[6]}_cv(t){return Vt(this._colorOf(t),this._dark)}_putPage(t){let e=this._data.pages.slice(),i=e.findIndex(a=>a.id===t.id);i>=0?e[i]=t:e.push(t),this._data={...this._data,pages:e}}_removePage(t){this._data={...this._data,pages:this._data.pages.filter(e=>e.id!==t)}}_putBlock(t){let e=this._data.blocks.slice(),i=e.findIndex(a=>a.id===t.id);i>=0?e[i]=t:e.push(t),this._data={...this._data,blocks:e}}_isDirty(t){let e=this._saving.get(t);return!!(e&&(e.dirty||e.inflight||e.timer))}_onEvent(t){if(!(!this._data||!t)){if(t.kind==="page"){let e=t.page;if(this._dropped.has(e.id))return;let i=this._page(e.id);if(this._isDirty(e.id)&&i){e.text===i.text&&this._putPage({...e});return}this._base.set(e.id,e.updated),this._putPage(e)}else if(t.kind==="page_deleted")this._dropPageLocally(t.id);else if(t.kind==="block")this._putBlock(t.block);else if(t.kind==="block_deleted")this._data={...this._data,blocks:this._data.blocks.filter(e=>e.id!==t.id),pages:this._data.pages.filter(e=>e.block!==t.id)},this._pad&&this._pad.block===t.id&&(this._view().name==="block"?this._go("/blocos",!0):this._enterView());else if(t.kind==="settings"){let e=(t.app&&t.app.ai_entity)!==this._app("ai_entity",void 0);this._data={...this._data,periods:t.periods,app:t.app},e&&this._refreshAi()}this._tick()}}_dropPageLocally(t){let e=this._saving.get(t);e&&clearTimeout(e.timer),this._saving.delete(t),this._base.delete(t);let i=this._page(t);if(i&&(this._removePage(t),this._pad&&this._pad.page===t)){let a=this._pagesOf(i.block),r=a.filter(o=>ii(o,i)<0);this._pad={...this._pad,page:r.length?r[r.length-1].id:a.length?a[0].id:"new"}}}_onInk(t){let e=t.target.value,i=this._pad;if(!i)return;this._lastTyped=Date.now();let a=i.page!=="new"?this._page(i.page):null;if(a)this._putPage({...a,text:e});else{if(!e.trim())return;let r=Date.now();a={id:ut(),block:i.block,text:e,times:[],created:r,updated:r},this._putPage(a),this._pad={...i,page:a.id}}this._queueSave(a.id)}_queueSave(t,e=Di){let i=this._saving.get(t)||{timer:null,inflight:!1,dirty:!1};i.dirty=!0,clearTimeout(i.timer),i.timer=setTimeout(()=>this._flushSave(t),e),this._saving.set(t,i)}async _flushSave(t){let e=this._saving.get(t);if(!e||(clearTimeout(e.timer),e.timer=null,e.inflight||!e.dirty))return;let i=this._page(t);if(!i){this._saving.delete(t);return}e.dirty=!1,e.inflight=!0,e.sentText=i.text;let a={id:t,block:i.block,text:i.text};this._base.has(t)?a.base=this._base.get(t):a.created=i.created;let r=!1;try{let o=await this.api.savePage(a);this._base.set(t,o.updated);let n=this._page(t);n&&!this._dropped.has(t)&&this._putPage({...o,text:n.text,times:n.times,block:n.block})}catch(o){o.code==="conflict"&&o.page?this._resolveConflict(t,o.page,e):o.code==="disconnected"?e.dirty=!0:(e.dirty=!0,this._showToast(`N\xE3o consegui salvar a folha: ${o.message}`)),r=o.code!=="disconnected"&&o.code!=="conflict"}finally{e.inflight=!1}if(e.deleteAfter){this._saving.delete(t),this.api.deletePage(t).catch(()=>{});return}e.dirty&&this._online&&!r?this._queueSave(t,200):!e.dirty&&!e.timer&&this._saving.delete(t)}_resolveConflict(t,e,i){let a=this._page(t),r=a?a.text:"";if(i.dirty=!1,this._base.set(t,e.updated),this._putPage(e),r.trim()&&r!==e.text){let o=Date.now(),n={id:ut(),block:e.block,text:r,times:[],created:o,updated:o};this._putPage(n),this._queueSave(n.id,0),this._showToast("Esta folha mudou em outro aparelho. Sua vers\xE3o virou uma folha nova.",{label:"Ver",run:()=>this._openPage(e.block,n.id)})}}async _savePageMeta(t,e){let i=this._page(t);if(!i)return null;this._putPage({...i,...e});let a=this._saving.get(t);a&&(a.timer||a.dirty)&&await this._flushSave(t);try{let r=await this.api.savePage({id:t,block:i.block,...e,...this._base.has(t)?{}:{text:i.text,created:i.created}});this._base.set(t,r.updated);let o=this._page(t);return this._putPage({...r,text:o?o.text:r.text}),r}catch(r){return this._putPage(i),this._showToast(`N\xE3o consegui salvar: ${r.message}`),null}}_deletePage(t){let e=this._saving.get(t),i=this._base.has(t);if(this._dropped.add(t),this._dropPageLocally(t),e&&e.inflight){e.deleteAfter=!0,this._saving.set(t,e);return}i&&this.api.deletePage(t).catch(()=>{})}_leave(t){if(!t||!t.page||t.page==="new")return;let e=this._page(t.page);e&&(!e.text.trim()&&!(e.times||[]).length?this._deletePage(e.id):this._saving.has(e.id)&&this._flushSave(e.id))}_lastPad(t){let e=this._pagesOf(t);return{block:t,page:e.length?e[e.length-1].id:"new"}}_setPad(t,{keepTurn:e=!1}={}){let i=this._pad;i&&t&&i.block===t.block&&i.page===t.page||(e||(clearTimeout(this._turnTimer),this._turn=null,this._pendingPad=null),this._pad=t,i&&this._leave(i))}_padEntryPad(t){return t?t.page&&this._page(t.page)?{block:t.block,page:t.page}:this._lastPad(t.block):null}_slot(){let t=this._schedule(),e=Ye(new Date(this._now));return{entries:t,min:e,cur:Qe(t,e),next:Ke(t,e)}}_keyOf(t){return t?`${t.min}|${t.block}|${t.page||""}`:""}_pickIn(t){return t?t.entries.find(e=>this._keyOf(e)===this._choice)||t.main:null}_nowPad(){let{cur:t}=this._slot();if(this._peek){let a=this._padEntryPad(this._pickIn(this._peek));if(a)return a}if(t)return this._padEntryPad(this._pickIn(t));let e=[...this._data.pages].sort((a,r)=>r.updated-a.updated)[0],i=e&&this._block(e.block)||this._blocks()[0];return i?this._lastPad(i.id):null}_enterView(){if(!this._data)return;let t=this._view();if(t.name==="block"){if(!this._block(t.id))return;let e=this._openAt&&this._openAt.block===t.id?this._openAt.page:null;this._openAt=null,this._setPad(e&&(e==="new"||this._page(e))?{block:t.id,page:e}:this._lastPad(t.id))}else t.name==="now"?(this._peek=null,this._choice=null,this._setPad(this._nowPad()),this._scrollChip=!0):this._pad&&this._leave(this._pad);t.name==="more"&&this._refreshAi(!1)}_tick(){if(this._now=Date.now(),!this._data)return;let{cur:t}=this._slot(),e=t?`${t.min}|${t.entries.map(o=>this._keyOf(o)).join(",")}`:"";if(e===this._slotKey)return;let a=!(this._slotKey==null)&&this._view().name==="now"&&!this._peek,r=this.renderRoot&&this.renderRoot.querySelector("textarea.ink");a&&r&&this.renderRoot.activeElement===r||(this._slotKey=e,this._choice=null,this._scrollChip=!0,a&&this._setPad(this._nowPad()))}_peekAt(t){let{cur:e}=this._slot();this._choice=null,this._peek=e&&t.min===e.min?null:t,this._setPad(this._nowPad()),this._haptic("light")}_backToNow(){this._peek=null,this._choice=null,this._scrollChip=!0,this._setPad(this._nowPad())}_choose(t){this._choice=this._keyOf(t),this._setPad(this._padEntryPad(t))}_snap(t){let e=this._block(t.block),i=this._pagesOf(t.block),a=t.page!=="new"?this._page(t.page):null,r=a?i.indexOf(a):i.length,o=this.renderRoot.querySelector("textarea.ink");return{text:a?a.text:"",paper:e?e.paper:"pautado",created:a?a.created:null,times:a?a.times:[],num:r+1,total:i.length+(a?0:1),scroll:o&&this._pad&&this._pad.page===t.page?o.scrollTop:0}}_flip(t){if(this._turn||!this._pad)return;let e=this._pad,i=this._pagesOf(e.block),a=e.page==="new"||!this._page(e.page),r=a?i.length:i.findIndex(l=>l.id===e.page),o;if(t>0){if(a)return this._haptic("light");if(r>=i.length-1){if(!i[r].text.trim())return this._showToast("Esta folha ainda est\xE1 em branco");o="new"}else o=i[r+1].id}else{if(r<=0)return this._haptic("light");o=i[r-1].id}this._haptic("light");let n={block:e.block,page:o};if(o==="new"){let l=this.renderRoot.querySelector("textarea.ink");l&&l.focus({preventScroll:!0})}else{let l=this.renderRoot.querySelector("textarea.ink");l&&this.renderRoot.activeElement===l&&l.blur()}if(Li()){this._setPad(n);return}if(t>0){let l=this._snap(e);this._setPad(n),this._turn={dir:"next",snap:l,key:Date.now()}}else this._turn={dir:"prev",snap:this._snap(n),key:Date.now()},this._pendingPad=n;clearTimeout(this._turnTimer),this._turnTimer=setTimeout(()=>{let l=this._pendingPad;this._pendingPad=null,l&&this._setPad(l,{keepTurn:!0}),this._turn=null;let h=this.renderRoot.querySelector("textarea.ink");h&&!this._turn&&(h.scrollTop=0)},Ni)}_touchStart(t){let e=t.touches&&t.touches[0];this._tx=e?{x:e.clientX,y:e.clientY,at:Date.now()}:null}_touchEnd(t){let e=this._tx;this._tx=null;let i=t.changedTouches&&t.changedTouches[0];if(!e||!i||Date.now()-e.at>600)return;let a=i.clientX-e.x,r=i.clientY-e.y;Math.abs(a)>60&&Math.abs(r)<45&&this._flip(a<0?1:-1)}async _openPage(t,e=null){this._closeSheet();let i=this._view();i.name==="block"&&i.id===t||i.name==="now"&&this._pad&&this._pad.block===t?this._setPad(e?{block:t,page:e}:this._lastPad(t)):(this._openAt={block:t,page:e},await this._go(`/bloco/${t}`)),e==="new"&&this.updateComplete.then(()=>{let a=this.renderRoot.querySelector("textarea.ink");a&&a.focus({preventScroll:!0})})}_view(){let t=(this._path||"").replace(/\/+$/,""),e;return(e=t.match(/^\/bloco\/([a-z0-9]+)$/i))?{name:"block",id:e[1]}:t==="/blocos"?{name:"shelf"}:t==="/buscar"?{name:"search"}:t==="/mais"?{name:"more"}:{name:"now"}}async _go(t,e=!1){this._sheet&&this._closeSheet(),this._popping&&await this._popping;let i=(history.state&&history.state.rvDepth||0)+(e?0:1);e?history.replaceState({rvDepth:i,rvPath:t},""):history.pushState({rvDepth:i,rvPath:t},""),this._path=t,this._enterView();let a=this.renderRoot&&this.renderRoot.querySelector("main");a&&a.scrollTo({top:0,behavior:"instant"})}_back(){history.state&&history.state.rvDepth>0?history.back():this._go("",!0)}_popEntry(t){if(!(history.state&&history.state[t]))return Promise.resolve();let e=new Promise(i=>{let a=()=>{clearTimeout(r),this._popWaiters=(this._popWaiters||[]).filter(o=>o!==a),this._popping===e&&(this._popping=null),i()},r=setTimeout(a,600);this._popWaiters=[...this._popWaiters||[],a]});return this._popping=e,history.back(),e}_goTab(t){let e=this._view().name;if(t===""){if(e==="now"){this._peek&&this._backToNow();let a=this.renderRoot.querySelector("main");a&&a.scrollTo({top:0});return}let i=history.state&&history.state.rvDepth||0;i>0?history.go(-i):this._go("",!0);return}if(t==="/blocos"&&e==="block"){this._go(t,!0);return}this._go(t,e!=="now")}_onPopState(){this._cam&&!(history.state&&history.state.rvCam)&&this._closeCamera(!0),this._sheet&&!(history.state&&history.state.rvSheet)&&(this._sheet=null,this._form=null);let t=history.state&&history.state.rvPath||"";if(t!==this._path){this._path=t;let e=this._view();e.name==="block"&&this._data&&!this._block(e.id)?this._go("/blocos",!0):this._enterView()}for(let e of[...this._popWaiters||[]])e()}async _openSheet(t,e=null){let i=!!this._sheet;if(!i&&this._popping&&await this._popping,this._sheet=t,this._form=e,!i)try{history.pushState({...history.state||{},rvSheet:!0},"")}catch{}}_closeSheet(){return this._sheet?(this._releaseImages(),this._sheet=null,this._form=null,this._popEntry("rvSheet")):Promise.resolve()}_setForm(t){this._form={...this._form,...t}}_haptic(t){this.env&&this.env.haptic&&this.env.haptic(t)}_showToast(t,e=null){clearTimeout(this._toastTimer),this._toast={text:t,action:e,id:Date.now()},this._toastTimer=setTimeout(()=>this._toast=null,e?5e3:2600)}_userName(){let t=It();return(this._user&&this._user.name||t&&t.user&&t.user.name||"").trim().split(/\s+/)[0]}async _refreshAi(t=!0){if(!(!t&&Date.now()-this._aiAt<6e4)){this._aiChecking=!0,this.requestUpdate();try{this._ai=await this.api.aiStatus()}catch(e){this._ai={...this._ai,ready:!1,images:!1,reason:e.message}}this._aiAt=Date.now(),this._aiChecking=!1,this.requestUpdate()}}async _chooseAi(t){await this._saveSettings({app:{ai_entity:t}}),await this._refreshAi(),this._showToast("IA do app atualizada")}_openAiSettings(){this._closeSheet(),this._go("/mais",this._view().name!=="now").then(()=>this.updateComplete.then(()=>{let t=this.renderRoot.querySelector("#leitura-ia");t&&t.scrollIntoView({block:"start",behavior:"smooth"})}))}_openBlockSheet(t){let e=t||null,i=new Set(this._data.blocks.map(r=>r.color)),a=(P.find(r=>!i.has(r.id))||P[6]).id;this._openSheet("block",{id:e?e.id:null,name:e?e.name:"",color:e?e.color:a,paper:e?e.paper:"pautado",periods:e?[...e.periods||[]]:[],times:e?[...e.times||[]]:[]}),e||this.updateComplete.then(()=>{let r=this.renderRoot.querySelector(".sheet input[type=text]");r&&r.focus()})}async _saveBlockSheet(){let t=this._form,e={name:(t.name||"").trim()||"Novo bloco",color:t.color,paper:t.paper,periods:t.periods,times:t.times};t.id&&(e.id=t.id);try{let i=await this.api.saveBlock(e);this._putBlock(i),this._closeSheet(),this._haptic("success"),t.id?this._showToast("Bloco salvo"):this._openPage(i.id,"new")}catch(i){this._showToast(`N\xE3o consegui salvar o bloco: ${i.message}`)}}_confirmDeleteBlock(){let t=this._form,e=this._block(t.id);if(!e)return;let i=this._pagesOf(e.id).length;this._openSheet("confirm",{title:`Excluir \u201C${_(e.name,24)}\u201D?`,text:i?`As ${$(i,"folha","folhas")} deste bloco tamb\xE9m ser\xE3o apagadas. N\xE3o d\xE1 para desfazer.`:"Este bloco est\xE1 vazio.",label:"Excluir bloco",danger:!0,run:async()=>{this._closeSheet();try{await this.api.deleteBlock(e.id),this._onEvent({kind:"block_deleted",id:e.id}),this._showToast("Bloco exclu\xEDdo")}catch(a){this._showToast(`N\xE3o consegui excluir: ${a.message}`)}}})}async _saveSettings(t){let e={periods:this._data.periods,app:this._data.app},i={...this._data.app,...t.app||{}},a={...this._data.periods,...t.periods||{}};this._data={...this._data,app:i,periods:a};try{let r=await this.api.saveSettings(t);this._data={...this._data,...r}}catch(r){this._data={...this._data,...e},this._showToast(`N\xE3o consegui salvar: ${r.message}`)}this._tick()}_whenParts(t,e=!0){let i=O(this._data),a=[];for(let r of t.periods||[]){let o=xt(r);o&&a.push({icon:o.icon,label:o.label,time:i[r]})}for(let r of t.times||[])a.push({icon:"clock",label:r,time:r});if(e){let r=this._pagesOf(t.id).filter(o=>(o.times||[]).length).length;r&&a.push({icon:"pin",label:$(r,"trecho","trechos")})}return a}_openPageMenu(){let t=this._pad,e=t&&t.page!=="new"?this._page(t.page):null;e&&this._openSheet("pagemenu",{page:e.id})}async _setPageTimes(t,e){let i=[...new Set(e.map(vt).filter(Boolean))].sort();await this._savePageMeta(t,{times:i}),this._tick()}async _movePage(t,e){let i=this._page(t),a=this._block(e);if(!i||!a||i.block===e)return;let r=i.block,o=this._pagesOf(r),n=o.indexOf(i),l=o[n-1]||o[n+1];this._closeSheet();let h=this._pad&&this._pad.page===t;if(h&&(this._pad={block:r,page:l?l.id:"new"}),!await this._savePageMeta(t,{block:e})){h&&(this._pad={block:r,page:t});return}this._showToast(`Folha movida para ${_(a.name,22)}`,{label:"Ver",run:()=>this._openPage(e,t)})}_confirmDeletePage(t){let e=this._page(t);e&&this._openSheet("confirm",{title:"Arrancar esta folha?",text:e.text.trim()?`\u201C${_(ft(e.text),60)}\u201D ser\xE1 apagada.`:"A folha em branco ser\xE1 removida.",label:"Apagar folha",danger:!0,run:()=>{this._closeSheet();let i={...e};this._deletePage(t),this._haptic("medium"),this._showToast("Folha apagada",{label:"Desfazer",run:()=>{this._dropped.delete(i.id),this._putPage(i),this._base.delete(i.id),this._queueSave(i.id,0),this._setPad({block:i.block,page:i.id})}})}})}async _copyPage(t){let e=this._page(t);if(e){try{await navigator.clipboard.writeText(e.text),this._showToast("Texto copiado")}catch{this._showToast("N\xE3o consegui copiar")}this._closeSheet()}}_defaultTarget(){let t=this._pad;if(t&&this._block(t.block))return t.block;let e=this._blocks()[0];return e?e.id:null}async _openNew(t="pick"){let e=this._defaultTarget();if(!e){this._openBlockSheet(null);return}this._releaseImages(),this._importToken=0;let i=this._openSheet("new",{target:e,step:t==="text"?"text":"pick",text:"",images:[],result:"",provider:null,error:null,note:null});return t==="photos"&&this._pickFiles("photos"),t==="scan"&&this._openCamera(),t==="text"&&this._focusSheetText(),i}_write(){let t=this._form.target;this._closeSheet(),this._openPage(t,"new")}_focusSheetText(){this.updateComplete.then(()=>{let t=this.renderRoot.querySelector(".sheet textarea");t&&t.focus()})}_pickFiles(t){let e=this.renderRoot.querySelector(t==="scan"?"#mm-scan":"#mm-photos");e&&(e.value="",e.click())}_releaseImages(){let t=this._form;if(t&&t.images)for(let e of t.images)e.url&&URL.revokeObjectURL(e.url)}_isHaAndroid(){return/Home Assistant\//.test(navigator.userAgent)&&/Android/.test(navigator.userAgent)}async _onFiles(t){let e=[...t.target.files||[]].filter(r=>!r.type||r.type.startsWith("image/")).slice(0,6);if(t.target.value="",!e.length)return;this._sheet!=="new"&&await this._openNew("pick");let i=this._form.step==="review";this._setForm({step:"loading",error:null,loadingText:"Preparando as fotos\u2026",prevStep:i?"review":"pick"});let a=[];for(let r of e)a.push(await Dt(r));this._readImages(a,i)}_readImages(t,e){if(this._sheet!=="new"||!t.length)return;let i=e?[...this._form.images||[],...t]:(this._releaseImages(),t);this._setForm({step:"loading",images:i,prevStep:e?"review":"pick",loadingText:t.length>1?`Lendo ${t.length} fotos com IA\u2026`:"Lendo a foto com IA\u2026"}),this._runExtract({images:t,appending:e})}async _runExtract({text:t,images:e,appending:i=!1}){let a=this._importToken=Date.now(),r=()=>a===this._importToken&&this._sheet==="new",o=i?(this._form.result||"").trim():"";try{let n=await this.api.extract({text:t,images:e?e.map(({data:h,mime:f})=>({data:h,mime:f})):void 0});if(!r())return;let l=(n.text||"").trim();if(!l){let h=t?"A IA n\xE3o devolveu nada para essa mensagem.":"N\xE3o consegui ler essa foto. Tente mais de perto e com boa luz.";i?this._setForm({step:"review",note:h}):this._setForm({step:t?"text":"pick",error:h});return}this._haptic("success"),this._setForm({step:"review",result:o?`${o}

${l}`:l,provider:n.provider||null,note:null,error:null})}catch(n){if(!r())return;if(t){this._setForm({step:"review",result:t.trim(),provider:"local",note:"A IA n\xE3o respondeu, ent\xE3o mantive o texto como veio."});return}i?this._setForm({step:"review",note:n.message||"Algo deu errado"}):this._setForm({step:"pick",error:n.message||"Algo deu errado"})}}_readText(t){let e=(this._form.text||"").trim();if(!e){this._focusSheetText();return}if(t&&this._ai.ready){this._setForm({step:"loading",error:null,note:null,prevStep:"text",loadingText:"Organizando com IA\u2026"}),this._runExtract({text:e});return}this._createFromText(e)}async _pasteClipboard(){try{let t=await navigator.clipboard.readText();if(!t)throw new Error("empty");this._setForm({text:t,error:null})}catch{this._focusSheetText(),this._showToast("Toque e segure no campo para colar")}}_createFromText(t){let e=this._form.target;if(!this._block(e)||!t.trim())return;let i=Date.now(),a={id:ut(),block:e,text:t.trim(),times:[],created:i,updated:i};this._putPage(a),this._queueSave(a.id,0),this._haptic("success"),this._closeSheet(),this._openPage(e,a.id),this._showToast("Folha criada")}async _openCamera(){let t=navigator.mediaDevices;if(!t||!t.getUserMedia){this._pickFiles("scan");return}let e=!!(this._form&&this._form.step==="review");this._cam={status:"starting",shots:[],torch:!1,torchOk:!1,appending:e,flash:0};try{history.pushState({...history.state||{},rvCam:!0},"")}catch{}try{let i=await t.getUserMedia({audio:!1,video:{facingMode:{ideal:"environment"},width:{ideal:1920},height:{ideal:1440}}});if(!this._cam){i.getTracks().forEach(n=>n.stop());return}this._stream=i;let a=i.getVideoTracks()[0],r=a&&a.getCapabilities?a.getCapabilities():{};this._cam={...this._cam,status:"live",torchOk:!!r.torch},await this.updateComplete;let o=this.renderRoot.querySelector(".cam video");o&&(o.srcObject=i,o.play().catch(()=>{}))}catch(i){if(!this._cam)return;let a=i&&(i.name==="NotAllowedError"||i.name==="SecurityError");this._cam={...this._cam,status:"error",error:a?"Sem permiss\xE3o para usar a c\xE2mera. Libere a c\xE2mera para o app do Home Assistant nas configura\xE7\xF5es do celular, ou escolha uma foto.":"N\xE3o consegui abrir a c\xE2mera. Voc\xEA pode escolher uma foto da galeria."}}}_stopStream(){this._stream&&this._stream.getTracks().forEach(t=>t.stop()),this._stream=null}_closeCamera(t=!1){if(!this._cam)return;this._stopStream();let e=this._cam.shots||[];if(!this._cam.used)for(let i of e)URL.revokeObjectURL(i.url);this._cam=null,t||this._popEntry("rvCam")}async _toggleTorch(){let t=this._stream&&this._stream.getVideoTracks()[0];if(!t)return;let e=!this._cam.torch;try{await t.applyConstraints({advanced:[{torch:e}]}),this._cam={...this._cam,torch:e}}catch{this._cam={...this._cam,torchOk:!1}}}async _shoot(){let t=this.renderRoot.querySelector(".cam video");if(!t||!t.videoWidth||!this._cam||this._cam.shots.length>=6)return;let e=1800,i=Math.min(1,e/Math.max(t.videoWidth,t.videoHeight)),a=document.createElement("canvas");a.width=Math.round(t.videoWidth*i),a.height=Math.round(t.videoHeight*i),a.getContext("2d").drawImage(t,0,0,a.width,a.height);let r=await new Promise(n=>a.toBlob(n,"image/jpeg",.86));if(!r||!this._cam)return;let o=await Dt(r,e);this._haptic("light"),this._cam={...this._cam,shots:[...this._cam.shots,o],flash:Date.now()}}async _useShots(){if(!this._cam||!this._cam.shots.length)return;let t=this._cam.shots,e=this._cam.appending;this._cam={...this._cam,used:!0},this._closeCamera(),this._popping&&await this._popping,this._sheet!=="new"&&await this._openNew("pick"),this._readImages(t,e&&this._form.step==="review")}_cameraFallback(){let t=this._cam&&this._cam.appending;this._closeCamera(),t&&this._form&&this._setForm({step:"review"}),this._pickFiles("scan")}render(){if(!this._ready)return c`<div class="root"><div class="app"><main><div class="boot-msg">${this._bootError?c`${u("circle-alert")}<span>Não consegui abrir o MemorIA: ${this._bootError}. Tentando de novo…</span>`:c`<span class="spin">${u("loader-circle")}</span><span>Abrindo o caderno…</span>`}</div></main></div></div>`;let t=this._view(),e=(t.name==="now"||t.name==="block")&&this._pad?this._block(this._pad.block):null,i=e?this._colorOf(e):this._accent(),a=this._dark,r=`--rv-accent:${i.fill};--rv-accent-ink:${a?i.fill:i.ink};--rv-accent-soft:${ht(i.fill,a?.18:.14)};--rv-accent-ink-light:${i.ink};`,o;return t.name==="block"?o=this._renderBlock(t.id):t.name==="shelf"?o=this._renderShelf():t.name==="search"?o=this._renderSearch():t.name==="more"?o=this._renderMore():o=this._renderNow(),c`
      <div class="root" style=${r}>
        <div class="app">
          ${!this.env||this.env.topbar?c`<header class="topbar"><div class="title">Memor<b>IA</b></div></header>`:d}
          ${this._online?d:c`<div class="offline">${u("wifi-off")}<span>Sem conexão com o MemorIA. Reconectando…</span></div>`}
          <main>${o}</main>
          ${this._renderNav(t)}
        </div>
        ${this._renderSheet()} ${this._renderToast()} ${this._renderCamera()}
        <input id="mm-photos" class="sr" type="file" accept="image/*" ?multiple=${!this._isHaAndroid()} tabindex="-1" aria-hidden="true" @change=${n=>this._onFiles(n)} />
        <input id="mm-scan" class="sr" type="file" accept="image/*" capture="environment" tabindex="-1" aria-hidden="true" @change=${n=>this._onFiles(n)} />
      </div>
    `}_renderNav(t){let e=(i,a,r,o)=>c`
      <button class="tab ${i.includes(t.name)?"on":""}" @click=${()=>this._goTab(a)} aria-label=${r}>${u(o)}<span>${r}</span></button>
    `;return c`
      <nav>
        <div class="tabs">
          ${e(["now"],"","Agora","clock-3")} ${e(["shelf","block"],"/blocos","Blocos","library")}
          <button class="tab fab" @click=${()=>this._openNew()} aria-label="Nova folha">
            <span class="pill">${u("plus")}</span><span>Nova</span>
          </button>
          ${e(["search"],"/buscar","Buscar","search")} ${e(["more"],"/mais","Mais","sliders-horizontal")}
        </div>
      </nav>
    `}_renderHead(t,e){let i=this._userName(),a=this._online?e:{text:"Reconectando ao MemorIA\u2026",tone:"off"};return c`<header class="brand-head">
      <p class="eyebrow"><span class="brand">Memor<span>IA</span></span>${i?` \xB7 Ol\xE1, ${i}`:""}</p>
      <h1 class="page-title">${t}</h1>
      ${a?c`<p class="status"><span class="dot ${a.tone||""}" aria-hidden="true"></span><span>${a.text}</span>${a.extra||d}</p>`:d}
    </header>`}_renderNow(){let{entries:t,min:e,cur:i,next:a}=this._slot(),r=this._pad,o=r?this._block(r.block):null;if(!o)return c`<section class="page">
        ${this._renderHead("Agora",{text:"Nenhum bloco ainda"})}
        <div class="panel"><div class="empty"><div class="em-icon">${u("notebook-pen")}</div><h3>Comece um bloco</h3><p>Crie um bloco de anotações e escolha quando ele abre sozinho: de manhã, à tarde, à noite ou num horário exato.</p></div></div>
        <button class="btn primary" style="width:100%" @click=${()=>this._openBlockSheet(null)}>${u("plus")}Novo bloco</button>
      </section>`;let n=xt(je(e,O(this._data))),l=Bt(t),h=this._peek||i,f;if(this._peek)f={text:`Espiando ${R(this._peek.min)}`,tone:"off",extra:c`<button class="text-btn now-btn" @click=${()=>this._backToNow()}>Voltar para agora</button>`};else if(i){let p=a?this._block(a.main.block):null;f={text:`${n.label} \xB7 desde ${R(i.min)}${p?` \xB7 depois ${_(p.name,18)} \xE0s ${R(a.min)}`:""}`}}else f={text:`${n.label} \xB7 nenhum bloco com hor\xE1rio`,tone:"off"};return c`
      <section class="page">
        ${this._renderHead(o.name,f)}
        ${l.length?c`<div class="tline" role="list" aria-label="Seu dia">
              ${l.map(p=>{let g=this._block(p.main.block);if(!g)return d;let m=i&&p.min===i.min&&!this._peek,x=this._peek&&this._peek.min===p.min,y=p.main.kind==="page"?"pin":p.main.kind==="period"?xt(p.main.period).icon:"clock";return c`<button class="tchip ${m?"on":""} ${x?"peek":""}" role="listitem" style=${this._cv(g)} @click=${()=>this._peekAt(p)} aria-label="${R(p.min)} ${g.name}">
                  ${u(y)}<b>${R(p.min)}</b><span class="dot"></span><span>${_(g.name,18)}${p.entries.length>1?` +${p.entries.length-1}`:""}</span>
                </button>`})}
            </div>`:c`<div class="hint-card">
              ${u("calendar-clock")}
              <span>Nenhum bloco abre sozinho ainda. Escolha quando cada bloco aparece aqui: de manhã, à tarde, à noite ou às 07h, 10h, 22h…</span>
              <button class="text-btn" @click=${()=>this._openBlockSheet(o)}>Escolher</button>
            </div>`}
        ${h&&h.entries.length>1?c`<div class="switcher">
              ${h.entries.map(p=>{let g=this._block(p.block);if(!g)return d;let m=this._keyOf(this._pickIn(h))===this._keyOf(p);return c`<button class="pick list ${m?"on":""}" style=${this._cv(g)} @click=${()=>this._choose(p)}><span class="dot"></span><span>${_(g.name,20)}${p.page?" \xB7 trecho":""}</span></button>`})}
            </div>`:d}
        ${this._renderPad()}
      </section>
    `}_renderPad(t={}){let e=this._pad,i=e&&this._block(e.block);if(!i)return d;let a=this._pagesOf(i.id),r=e.page!=="new"?this._page(e.page):null,o=r?a.indexOf(r):a.length,n=a.length+(r?0:1),l=this._app("hand",!0),h=r&&o===a.length-1,f=r&&!(h&&!r.text.trim());return c`
      <div class="pad ${t.tall?"tall":""}" style=${this._cv(i)} @touchstart=${p=>this._touchStart(p)} @touchend=${p=>this._touchEnd(p)}>
        <div class="pad-cover"></div>
        <div class="pad-stack"></div>
        <div class="leaf ${i.paper}">
          ${this._renderLeafTop({created:r?r.created:null,times:r?r.times:[],num:o+1,total:n},!!r)}
          <textarea
            class="ink ${l?"":"normal"}"
            .value=${we(r?r.text:"")}
            placeholder=${r?"":o===0?"Escreva a primeira folha deste bloco\u2026":"Folha nova. Escreva aqui\u2026"}
            spellcheck="true"
            aria-label="Folha ${o+1} de ${n} do bloco ${i.name}"
            @input=${p=>this._onInk(p)}
            @blur=${()=>{r&&this._saving.has(r.id)&&this._flushSave(r.id),setTimeout(()=>this._tick(),400)}}
          ></textarea>
          ${o>0?c`<button class="edge prev" @click=${()=>this._flip(-1)} aria-label="Folha anterior"><span class="hint">${u("chevron-left")}</span></button>`:d}
          ${f?c`<button class="edge next ${h?"new":""}" @click=${()=>this._flip(1)} aria-label=${h?"Virar para uma folha nova":"Pr\xF3xima folha"}><span class="hint">${u(h?"plus":"chevron-right")}</span></button>`:d}
        </div>
        <div class="spiral" aria-hidden="true">${Ii}</div>
        ${this._turn?c`<div class="turn ${this._turn.dir}" aria-hidden="true">
              <div class="face front leaf ${this._turn.snap.paper}">
                ${this._renderLeafTop(this._turn.snap,!1)}
                <div class="ink ${l?"":"normal"}">${this._turn.snap.text}</div>
              </div>
              <div class="face back"></div>
              <div class="shade"></div>
            </div>`:d}
      </div>
    `}_renderLeafTop(t,e){return c`<div class="leaf-top">
      <span class="when">${t.created?Y(t.created,new Date(this._now)):"folha nova"}</span>
      ${(t.times||[]).length?c`<span class="pin">${u("clock")}${t.times.join(" \xB7 ")}</span>`:d}
      <span class="num">${t.num}/${t.total}</span>
      ${e?c`<button class="icon-btn" @click=${()=>this._openPageMenu()} aria-label="Opções da folha">${u("ellipsis")}</button>`:c`<span class="icon-btn ghost"></span>`}
    </div>`}_renderShelf(){let t=this._blocks(),e=this._data.pages.length,i=Bt(this._schedule()),{cur:a}=this._slot();return c`
      <section class="page">
        ${this._renderHead("Blocos",{text:`${$(t.length,"bloco","blocos")} \xB7 ${$(e,"folha","folhas")}`})}
        <div class="shelf">
          ${ye(t,r=>r.id,r=>{let o=this._pagesOf(r.id).length,n=this._whenParts(r);return c`<button class="cover" style=${this._cv(r)} @click=${()=>this._openPage(r.id)} aria-label="Abrir ${r.name}">
                <div class="sticker"><b>${r.name}</b><small>${$(o,"folha","folhas")}</small></div>
                <div class="when">${n.length?n.map(l=>c`<span>${u(l.icon)}${l.label}</span>`):c`<span>${u("notebook")}Sem horário</span>`}</div>
              </button>`})}
          <button class="cover add" @click=${()=>this._openBlockSheet(null)}>${u("plus")}<span>Novo bloco</span></button>
        </div>
        ${i.length?c`<div class="panel">
              <div class="overline">Seu dia</div>
              ${i.map(r=>r.entries.map(o=>{let n=this._block(o.block);if(!n)return d;let l=o.page?this._page(o.page):null,h=o.kind==="period"?`${xt(o.period).label}`:o.kind==="page"?`Trecho: ${_(ft(l&&l.text)||"folha",34)}`:"Hor\xE1rio fixo";return c`<button class="day-row ${a&&a.min===r.min?"on":""}" style=${this._cv(n)} @click=${()=>this._openPage(n.id,o.page||null)}>
                    <b>${R(o.min)}</b><span class="dot"></span>
                    <span class="grow"><span class="label">${n.name}</span><span class="hint">${h}</span></span>
                    ${a&&a.min===r.min?c`<span class="now-tag">agora</span>`:u("chevron-right")}
                  </button>`}))}
            </div>`:d}
      </section>
    `}_renderBlock(t){let e=this._block(t);if(!e)return c`<section class="page">
        <div class="panel"><div class="empty"><div class="em-icon">${u("circle-alert")}</div><h3>Bloco não encontrado</h3><p>Ele pode ter sido excluído em outro aparelho.</p></div></div>
        <button class="btn outline" style="width:100%" @click=${()=>this._go("/blocos",!0)}>Ver blocos</button>
      </section>`;let i=this._whenParts(e,!1),a=this._pagesOf(e.id).length;return c`
      <section class="page">
        <div class="detail-head">
          <button class="icon-btn" @click=${()=>this._back()} aria-label="Voltar">${u("chevron-left")}</button>
          <div class="dh-text">
            <div class="overline">${$(a,"folha","folhas")} · ${ti[e.paper]||""}</div>
            <h1 class="display">${e.name}</h1>
          </div>
          <button class="icon-btn" @click=${()=>this._openBlockSheet(e)} aria-label="Ajustes do bloco">${u("sliders-horizontal")}</button>
        </div>
        <button class="when-line" @click=${()=>this._openBlockSheet(e)}>
          ${i.length?c`${u("calendar-clock")}<span>Abre sozinho: ${i.map((r,o)=>c`${o?" \xB7 ":""}<b>${r.icon==="clock"?r.label:`${r.label} ${r.time}`}</b>`)}</span>`:c`${u("calendar-clock")}<span>Não abre sozinho. <b>Escolher horário</b></span>`}
        </button>
        ${this._renderPad({tall:!0})}
      </section>
    `}_renderSearch(){let t=this._query.trim(),e=dt(t),i=[];return e&&(i=this._data.pages.filter(a=>this._block(a.block)&&dt(a.text).includes(e)).sort((a,r)=>r.updated-a.updated).slice(0,80)),c`
      <section class="page">
        ${this._renderHead("Buscar",{text:`Em ${$(this._data.pages.length,"folha","folhas")} \xB7 acentos n\xE3o importam`})}
        <label class="search-box">
          ${u("search")}
          <input type="search" placeholder="Buscar em todos os blocos" .value=${this._query} @input=${a=>this._query=a.target.value} enterkeyhint="search" aria-label="Buscar" />
          ${this._query?c`<button class="icon-btn" style="width:40px;height:40px" @click=${()=>this._query=""} aria-label="Limpar">${u("x")}</button>`:d}
        </label>
        ${e?i.length?c`<p class="page-sub" style="margin-top:0">${$(i.length,"folha encontrada","folhas encontradas")}</p>
                <div class="panel">
                  ${i.map(a=>{let r=this._block(a.block),o=ft(a.text)||"Folha sem t\xEDtulo";return c`<button class="result" style=${this._cv(r)} @click=${()=>this._openPage(r.id,a.id)}>
                      <span class="dot"></span>
                      <span class="r-main">
                        <span class="r-title">${this._highlight(_(o,70),t)}</span>
                        <span class="r-snip">${this._highlight(this._snippet(a.text,o,e),t)}</span>
                        <span class="r-meta">${r.name} · ${Y(a.updated,new Date(this._now))}</span>
                      </span>
                    </button>`})}
                </div>`:c`<div class="panel"><div class="empty"><div class="em-icon">${u("search")}</div><h3>Nada encontrado</h3><p>Nenhuma folha com “${_(t,30)}”.</p></div></div>`:c`<p class="page-sub" style="margin-top:0">Procure qualquer palavra em todas as folhas.</p>`}
      </section>
    `}_snippet(t,e,i){let r=t.slice(t.indexOf(e)+e.length).replace(/\s+/g," ").trim()||"",o=Ot(r).indexOf(i);return o<=60?r.slice(0,160):`\u2026${r.slice(o-40,o+120)}`}_highlight(t,e){if(!e)return t;let i=Ot(t),a=dt(e);if(!a)return t;let r=[],o=0,n;for(;(n=i.indexOf(a,o))!==-1;)n>o&&r.push(t.slice(o,n)),r.push(c`<mark>${t.slice(n,n+a.length)}</mark>`),o=n+a.length;return o<t.length&&r.push(t.slice(o)),r}_renderMore(){let t=this._app("accent","lilas"),e=O(this._data),i=this._ai||{},a=(r,o,n)=>c`<label class="switch"><input type="checkbox" role="switch" .checked=${r} @change=${n} aria-label=${o} /><span class="track"></span></label>`;return c`
      <section class="page">
        ${this._renderHead("Mais",{text:`MemorIA ${this._version} \xB7 salvo no Home Assistant`})}

        <div class="panel">
          <div class="overline">Aparência</div>
          <div class="row col">
            <div class="label">Tema</div>
            <div class="seg" role="radiogroup" aria-label="Tema">
              ${[["auto","Autom\xE1tico","sun-moon"],["light","Claro","sun"],["dark","Escuro","moon"]].map(([r,o,n])=>c`<button class=${this._theme===r?"on":""} role="radio" aria-checked=${this._theme===r?"true":"false"} @click=${()=>this._setTheme(r)}>${u(n)}${o}</button>`)}
            </div>
            <div class="hint" style="white-space:normal">${this._theme==="auto"?"Segue o modo claro/escuro do Home Assistant.":"Vale s\xF3 para este aparelho."}</div>
          </div>
          <div class="row col">
            <div class="label">Cor do app</div>
            <div class="swatches">
              ${P.map(r=>c`<button class="sw ${t===r.id?"on":""}" style="--c:${r.fill}" aria-label=${r.label} @click=${()=>this._saveSettings({app:{accent:r.id}})}>${t===r.id?u("check"):d}</button>`)}
            </div>
            <div class="hint" style="white-space:normal">Dentro de um bloco, vale a cor do bloco.</div>
          </div>
          <div class="row">
            <div class="grow"><div class="label">Letra de mão</div><div class="hint" style="white-space:normal">Folhas escritas como num caderno de verdade</div></div>
            ${a(this._app("hand",!0),"Letra de m\xE3o",r=>this._saveSettings({app:{hand:r.target.checked}}))}
          </div>
        </div>

        <div class="panel">
          <div class="overline">Períodos do dia</div>
          ${j.map(r=>c`<div class="row">
              <span class="tile" style=${Vt(this._accent(),this._dark)}>${u(r.icon)}</span>
              <div class="grow"><div class="label">${r.label}</div><div class="hint">começa às</div></div>
              <input class="time-input" type="time" .value=${e[r.id]} aria-label="Começo da ${r.label}" @change=${o=>vt(o.target.value)&&this._saveSettings({periods:{[r.id]:o.target.value}})} />
            </div>`)}
          <div class="row"><div class="hint" style="white-space:normal">Blocos ligados a um período abrem sozinhos a partir desse horário. Horários exatos (07:00, 22:00…) ficam em cada bloco ou folha.</div></div>
        </div>

        <div class="panel">
          <div class="overline">Home Assistant</div>
          <div class="row">
            <div class="grow"><div class="label">Sensor “MemorIA agora”</div><div class="hint" style="white-space:normal"><code>sensor.memoria_agora</code> com o bloco e a folha do momento, para painéis e automações</div></div>
            ${a(this._app("sensor",!0),"Sensor MemorIA agora",r=>this._saveSettings({app:{sensor:r.target.checked}}))}
          </div>
        </div>

        ${this._renderAiPanel()}

        <p class="foot"><b>MemorIA</b><br />v${this._version} · suas anotações ficam no Home Assistant<br />e entram no backup dele.</p>
      </section>
    `}_renderAiPanel(){let t=this._ai||{},e=t.entities||[],i=this._app("ai_entity",""),a=this._aiChecking?"off":t.ready&&t.images?"ok":t.ready?"warn":"bad",r=this._aiChecking?"Verificando\u2026":t.ready&&t.images?"Pronta para ler fotos":t.ready?"S\xF3 l\xEA mensagens":"N\xE3o configurada",o="";return t.ready&&(o=`Usando ${t.using.name}${i?"":" (a IA padr\xE3o do Home Assistant)"}.`,t.photos&&(o+=` Para fotos, ${t.photos.name}.`)),t.reason&&(o=`${o} ${t.reason}`.trim()),c`<div class="panel" id="leitura-ia">
      <div class="overline">Leitura por IA</div>
      <p class="panel-lead">Lê mensagens coladas, prints e fotos de anotações em papel para criar folhas. Usa a integração de IA configurada no Home Assistant (Anthropic Claude, OpenAI, Google Gemini ou um modelo local pelo Ollama); o app não guarda nenhuma chave.</p>
      <div class="ai-state ${a}"><span class="dot"></span><div><b>${r}</b>${o?c`<span>${o}</span>`:d}</div></div>
      ${e.length||i?c`<label class="field" style="margin:14px 0 0">
            <span class="flabel">IA usada pelo app</span>
            <select class="select" aria-label="IA usada pelo app" @change=${n=>this._chooseAi(n.target.value)}>
              <option value="" ?selected=${!i}>Padrão do Home Assistant</option>
              ${e.map(n=>c`<option value=${n.id} ?selected=${n.id===i}>${n.name}${n.images?"":" (s\xF3 texto)"}${n.available?"":" (indispon\xEDvel)"}</option>`)}
              ${i&&!e.some(n=>n.id===i)?c`<option value=${i} selected>${i} (não encontrada)</option>`:d}
            </select>
            <span class="field-hint">${u("sparkles")}<span>“Padrão do Home Assistant” usa a IA preferida definida em Configurações › Sistema › Geral.</span></span>
          </label>`:d}
      <div class="ai-actions"><button class="btn outline" ?disabled=${this._aiChecking} @click=${()=>this._refreshAi()}>${u("rotate-ccw")}Verificar de novo</button></div>
      ${t.ready&&t.images?d:c`<div class="steps-box">
            <b>Como configurar</b>
            <ol class="steps">
              <li>No Home Assistant, abra Configurações › Dispositivos e serviços › Adicionar integração.</li>
              <li>Escolha a IA: Anthropic (Claude), OpenAI, Google Gemini ou Ollama (modelo local, de graça). Cole a chave de API quando pedir.</li>
              <li>Na integração, adicione uma tarefa de IA (AI Task). Para ler fotos, use um modelo que entenda imagens.</li>
              <li>Volte aqui e escolha essa IA na lista.</li>
            </ol>
          </div>`}
    </div>`}_renderSheet(){if(!this._sheet)return d;let t=d;this._sheet==="block"?t=this._renderBlockSheet():this._sheet==="pagemenu"?t=this._renderPageMenu():this._sheet==="new"?t=this._renderNewSheet():this._sheet==="confirm"&&(t=this._renderConfirm());let e=this._form||{},i=this._sheet==="block"?{color:e.color}:this._block(e.target||e.page&&this._page(e.page)&&this._page(e.page).block),a=i?pt(i.color):null,r=a?`--rv-accent:${a.fill};--rv-accent-ink:${this._dark?a.fill:a.ink};--rv-accent-soft:${ht(a.fill,this._dark?.18:.14)};`:"";return c`
      <div class="scrim" @click=${()=>this._closeSheet()}></div>
      <div class="sheet" role="dialog" aria-modal="true" style=${r} @keydown=${o=>o.key==="Escape"&&this._closeSheet()}>
        <div class="grab"></div>
        ${t}
      </div>
    `}_sheetHead(t,e){return c`<div class="sheet-head">
      ${e?c`<button class="icon-btn back" @click=${e} aria-label="Voltar">${u("chevron-left")}</button>`:d}
      <h3 class="display">${t}</h3>
      <button class="icon-btn" @click=${()=>this._closeSheet()} aria-label="Fechar">${u("x")}</button>
    </div>`}_timePicker(t,e="Hor\xE1rio"){return c`<button class="pick add-time" @click=${a=>{let r=a.currentTarget.querySelector("input");try{r.showPicker()}catch{r.focus(),r.click()}}}>${u("plus")}<span>${e}</span>
      <input class="hidden-input" type="time" tabindex="-1" @click=${a=>a.stopPropagation()} @change=${a=>{let r=vt(a.target.value);a.target.value="",r&&t(r)}} />
    </button>`}_renderBlockSheet(){let t=this._form,e=O(this._data),i=a=>this._setForm({periods:t.periods.includes(a)?t.periods.filter(r=>r!==a):[...t.periods,a]});return c`
      ${this._sheetHead(t.id?"Ajustes do bloco":"Novo bloco")}
      <label class="field">
        <span class="flabel">Nome</span>
        <input type="text" maxlength="60" .value=${t.name} placeholder="Ex.: Diário, Treino, Trabalho" @input=${a=>this._setForm({name:a.target.value})} @keydown=${a=>a.key==="Enter"&&this._saveBlockSheet()} />
      </label>
      <div class="field">
        <span class="flabel">Cor da capa</span>
        <div class="swatches">
          ${P.map(a=>c`<button class="sw ${t.color===a.id?"on":""}" style="--c:${a.fill}" aria-label=${a.label} @click=${()=>this._setForm({color:a.id})}>${t.color===a.id?u("check"):d}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">Folha</span>
        <div class="papers">
          ${Ze.map(a=>c`<button class="paper-opt ${t.paper===a?"on":""}" @click=${()=>this._setForm({paper:a})}><span class="sw-paper ${a}"></span>${ti[a]}</button>`)}
        </div>
      </div>
      <div class="field">
        <span class="flabel">Quando abrir sozinho</span>
        <div class="chip-row">
          ${j.map(a=>c`<button class="pick ${t.periods.includes(a.id)?"on":""}" @click=${()=>i(a.id)}>${u(a.icon)}<span>${a.label}</span><small class="pick-sub">${e[a.id]}</small></button>`)}
        </div>
        <div class="time-list" style="margin-top:10px">
          ${t.times.map(a=>c`<span class="time-chip">${a}<button aria-label="Tirar ${a}" @click=${()=>this._setForm({times:t.times.filter(r=>r!==a)})}>${u("x")}</button></span>`)}
          ${t.times.length<24?this._timePicker(a=>this._setForm({times:[...new Set([...t.times,a])].sort()}),t.times.length?"Outro hor\xE1rio":"Hor\xE1rio exato"):d}
        </div>
        <div class="field-hint">${u("clock")}<span>${t.periods.length||t.times.length?"Nesses momentos a tela Agora abre este bloco. Folhas com hor\xE1rio pr\xF3prio t\xEAm prioridade.":"Sem hor\xE1rio, o bloco s\xF3 abre quando voc\xEA escolher."}</span></div>
      </div>
      <div class="sheet-actions">
        ${t.id?c`<button class="btn danger" @click=${()=>this._confirmDeleteBlock()} aria-label="Excluir bloco">${u("trash")}</button>`:d}
        <button class="btn primary" @click=${()=>this._saveBlockSheet()}>${t.id?"Salvar":"Criar bloco"}</button>
      </div>
    `}_renderPageMenu(){let t=this._page(this._form.page);if(!t)return this._sheetHead("Folha");let e=this._pagesOf(t.block),i=e.indexOf(t),a=this._blocks(),r=t.times||[];return c`
      ${this._sheetHead(`Folha ${i+1} de ${e.length}`)}
      <div class="field">
        <span class="flabel">Mostrar esta folha às…</span>
        <div class="time-list">
          ${r.map(o=>c`<span class="time-chip">${o}<button aria-label="Tirar ${o}" @click=${()=>this._setPageTimes(t.id,r.filter(n=>n!==o))}>${u("x")}</button></span>`)}
          ${this._timePicker(o=>this._setPageTimes(t.id,[...r,o]),r.length?"Outro hor\xE1rio":"Escolher hor\xE1rio")}
        </div>
        <div class="field-hint">${u("pin")}<span>${r.length?`\xC0s ${r.join(", ")} a tela Agora abre direto nesta folha.`:"Um trecho com hor\xE1rio: ex.: \xE0s 10h esta folha aparece sozinha."}</span></div>
      </div>
      ${a.length>1?c`<div class="field">
            <span class="flabel">Bloco</span>
            <div class="chip-row">
              ${a.map(o=>c`<button class="pick list ${t.block===o.id?"on":""}" style=${this._cv(o)} @click=${()=>this._movePage(t.id,o.id)}><span class="dot"></span><span>${_(o.name,22)}</span></button>`)}
            </div>
          </div>`:d}
      <button class="menu-row" @click=${()=>this._copyPage(t.id)}>${u("copy")}Copiar texto</button>
      <button class="menu-row danger" @click=${()=>this._confirmDeletePage(t.id)}>${u("trash")}Apagar folha</button>
      <p class="sheet-note">Escrita ${Y(t.created)} · editada ${Y(t.updated)}</p>
    `}_renderNewSheet(){let t=this._form,e=this._ai||{},i=this._blocks(),a=this._block(t.target),r=()=>{this._importToken=0,this._setForm({step:"pick",error:null,note:null})},o=t.error?c`<div class="imp-error">${u("circle-alert")}<span>${t.error}</span></div>`:d,n=t.images&&t.images.length?c`<div class="thumbs">${t.images.map(h=>c`<img src=${h.url} alt="" />`)}</div>`:d,l=i.length>1?c`<div class="field">
            <span class="flabel">No bloco</span>
            <div class="chip-row">
              ${i.map(h=>c`<button class="pick list ${t.target===h.id?"on":""}" style=${this._cv(h)} @click=${()=>this._setForm({target:h.id})}><span class="dot"></span><span>${_(h.name,22)}</span></button>`)}
            </div>
          </div>`:d;if(t.step==="text")return c`
        ${this._sheetHead("Colar mensagem",r)}
        <label class="field">
          <span class="flabel">Mensagem</span>
          <textarea rows="7" .value=${t.text} placeholder="Cole aqui a mensagem do WhatsApp, e-mail ou anotação…" @input=${h=>this._setForm({text:h.target.value,error:null})}></textarea>
        </label>
        ${o} ${l}
        <div class="sheet-actions">
          <button class="btn outline" @click=${()=>this._pasteClipboard()}>${u("clipboard-paste")}Colar</button>
          ${e.ready?c`<button class="btn outline" ?disabled=${!(t.text||"").trim()} @click=${()=>this._readText(!1)}>Como está</button>`:d}
          <button class="btn primary" ?disabled=${!(t.text||"").trim()} @click=${()=>this._readText(!0)}>${e.ready?c`${u("sparkles")}Organizar`:"Criar folha"}</button>
        </div>
        <p class="sheet-note">${e.ready?`${e.using.name} limpa a mensagem e deixa como uma anota\xE7\xE3o. Voc\xEA revisa antes de salvar.`:"Sem IA configurada: a mensagem vira uma folha do jeito que est\xE1."}</p>
      `;if(t.step==="loading")return c`
        ${this._sheetHead("Lendo\u2026")}
        ${n}
        <div class="imp-loading"><span class="spin">${u("loader-circle")}</span><span>${t.loadingText||"Lendo\u2026"}</span></div>
        <div class="sheet-actions">
          <button class="btn outline" @click=${()=>{this._importToken=0,this._setForm({step:t.prevStep||"pick"})}}>Cancelar</button>
        </div>
      `;if(t.step==="review"){let h=t.provider==="local"?"texto original":t.provider?`lido por ${t.provider}`:"";return c`
        ${this._sheetHead("Revisar folha",r)}
        ${n}
        <p class="sheet-note top">${h?`${h[0].toUpperCase()}${h.slice(1)}. `:""}Corrija o que precisar antes de salvar.</p>
        ${t.note?c`<div class="imp-error soft">${u("sparkles")}<span>${t.note}</span></div>`:d}
        <textarea class="review-text" .value=${t.result} aria-label="Texto da folha" @input=${f=>this._setForm({result:f.target.value})}></textarea>
        ${e.images?c`<div class="more-row">
              <button class="pick" @click=${()=>this._pickFiles("photos")}>${u("images")}<span>Mais fotos</span></button>
              <button class="pick" @click=${()=>this._openCamera()}>${u("scan-text")}<span>Digitalizar mais</span></button>
            </div>`:d}
        ${l}
        <div class="sheet-actions">
          <button class="btn primary" ?disabled=${!(t.result||"").trim()} @click=${()=>this._createFromText(t.result)}>Criar folha${a?` em ${_(a.name,18)}`:""}</button>
        </div>
      `}return c`
      ${this._sheetHead("Nova folha")}
      ${l}
      <div class="new-strip">
        <button class="main" @click=${()=>this._write()}>${u("pen-line")}<span>Escrever${a&&i.length<=1?` em ${_(a.name,20)}`:""}</span></button>
      </div>
      <div class="imp-options">
        <button class="imp-opt" @click=${()=>(this._setForm({step:"text",error:null}),this._focusSheetText())}>
          <span class="imp-ic">${u("message-square-text")}</span>
          <span class="imp-tx"><b>Colar mensagem</b><small>WhatsApp, e-mail, anotação</small></span>
          ${u("chevron-right")}
        </button>
        <button class="imp-opt" ?disabled=${!e.images} @click=${()=>this._pickFiles("photos")}>
          <span class="imp-ic">${u("images")}</span>
          <span class="imp-tx"><b>Escolher fotos</b><small>${this._isHaAndroid()?"Prints e fotos da galeria, uma por vez":"Prints e fotos da galeria (at\xE9 6)"}</small></span>
          ${u("chevron-right")}
        </button>
        <button class="imp-opt" ?disabled=${!e.images} @click=${()=>this._openCamera()}>
          <span class="imp-ic">${u("scan-text")}</span>
          <span class="imp-tx"><b>Digitalizar com IA</b><small>Fotografe uma anotação em papel</small></span>
          ${u("chevron-right")}
        </button>
      </div>
      ${e.images?d:c`<div class="imp-error soft">${u("sparkles")}<span>${e.reason||"Para ler fotos, o Home Assistant precisa de uma integra\xE7\xE3o de IA com tarefa de IA que entenda imagens."}
            <button class="text-btn inline" @click=${()=>this._openAiSettings()}>Ver Leitura por IA</button></span></div>`}
      ${o}
    `}_renderConfirm(){let t=this._form;return c`
      <div class="sheet-head"><h3 class="display">${t.title}</h3></div>
      <p class="confirm-text">${t.text}</p>
      <div class="sheet-actions">
        <button class="btn outline" @click=${()=>this._closeSheet()}>Cancelar</button>
        <button class="btn ${t.danger?"danger-fill":"primary"}" @click=${()=>t.run()}>${t.label}</button>
      </div>
    `}_renderCamera(){let t=this._cam;if(!t)return d;let e=t.shots.length;return c`
      <div class="cam" role="dialog" aria-label="Digitalizar com IA">
        <video playsinline muted autoplay></video>
        ${t.flash?c`<div class="cam-flash" .key=${t.flash}></div>`:d}
        <div class="cam-top">
          <button class="cam-btn" aria-label="Fechar" @click=${()=>this._closeCamera()}>${u("x")}</button>
          <span class="cam-title">Digitalizar com IA</span>
          ${t.torchOk?c`<button class="cam-btn ${t.torch?"on":""}" aria-label="Lanterna" @click=${()=>this._toggleTorch()}>${u("zap")}</button>`:c`<span class="cam-btn ghost"></span>`}
        </div>
        ${t.status==="error"?c`<div class="cam-msg">
              ${u("camera")}
              <p>${t.error}</p>
              <button class="btn primary" @click=${()=>this._cameraFallback()}>${u("images")}Escolher foto</button>
            </div>`:c`<div class="cam-frame"><i></i><i></i><i></i><i></i></div>
              <p class="cam-hint">${t.status==="starting"?"Abrindo a c\xE2mera\u2026":e?`${$(e,"p\xE1gina","p\xE1ginas")}. Fotografe outra ou toque em Pronto.`:"Enquadre a anota\xE7\xE3o e toque no bot\xE3o"}</p>`}
        <div class="cam-bottom">
          <div class="cam-shots">${t.shots.slice(-3).map(i=>c`<img src=${i.url} alt="" />`)}${e>3?c`<span>+${e-3}</span>`:d}</div>
          <button class="cam-shutter" aria-label="Fotografar" ?disabled=${t.status!=="live"||e>=6} @click=${()=>this._shoot()}><span></span></button>
          <button class="cam-done" ?disabled=${!e} @click=${()=>this._useShots()}>Pronto${e?` (${e})`:""}</button>
        </div>
      </div>
    `}_renderToast(){if(!this._toast)return d;let t=this._toast;return c`<div class="toast ${this._sheet?"has-sheet":""}" role="status">
      <span>${t.text}</span>
      ${t.action?c`<button @click=${()=>{this._toast=null,t.action.run()}}>${t.action.label}</button>`:d}
    </div>`}};customElements.get("memoria-app")||customElements.define("memoria-app",Ut);var Bi=document.getElementById("app"),qt=document.createElement("memoria-app");qt.env=qe();qt.api=new gt;Bi.replaceChildren(qt);})();
