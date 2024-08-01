/*! For license information please see ContextMenu.js.LICENSE.txt */
(()=>{"use strict";var e={944:(e,n,t)=>{t.r(n),t.d(n,{applyCssAnim:()=>c,clearContextListeners:()=>f,findAllMenuFrom:()=>l,initContextListeners:()=>p});const r=require("@babel/runtime/helpers/toConsumableArray");var o=t.n(r);const i=require("react-dom/client");var u,a,s,d=t(15);function l(e){var n=[];do{n.push.apply(n,o()(Array.from(e.children).filter((function(e){return e.classList.contains("inContextMenuComp")})))),e=e.parentNode}while(e&&e!==document);return n}function c(e,n,t,r){t=t||500;var o,i=function n(t){t&&t.target!==e||(clearTimeout(o),Object.assign(e.style,{animation:null}),e.removeEventListener("animationend",n),r&&r(e))};e.addEventListener("animationend",i),Object.assign(e.style,{animation:n+" "+t/1e3+"s forwards"}),o=setTimeout(i,1.5*t)}function f(e){try{document.body.removeChild(u),document.removeEventListener(e.DefaultMenuEvent,s),s=u=null}catch(e){}}var m=function(e){var n=e.menuComps,t=e.onMenuItemRendered,r=e.setMenusToClean,o=e.DefaultMenuComp,i=e.clickEvent,u=d.useRef();return d.useEffect((function(){r(n.map((function(e){var r,o=document.createElement("div");return o.className="inContextSubMenu",e.onMenuItemRendered=t,null!==(r=u.current)&&void 0!==r&&r.parentNode&&u.current.parentNode.appendChild(o),e.triggerRender(o,n,i)})))})),d.createElement(o,null,d.createElement("div",{ref:u,style:{display:"none"}}))};function p(e,n){u=document.createElement("div"),Object.assign(u.style,{pointerEvents:"none",position:"fixed",width:"100%",height:"100%",top:"0",left:"0",zIndex:e.DefaultZIndex,display:"none"}),u.className="inContextMenuLayer",document.body.appendChild(u);var t,r,o,f,p=function n(i,s){var d=function(e){var n=f;for(u.style.display="none",a=null;null!==(t=o)&&void 0!==t&&t.length;){var t;o.pop()()}u.innerHTML="",setTimeout((function(){n.unmount()}),200)};window.removeEventListener("resize",t),window.removeEventListener("scroll",r),document.body.removeEventListener("click",n),s?d():e.DefaultHideAnim?c(a,e.DefaultHideAnim,e.DefaultAnimDuration,d):setTimeout(d,10)};document.addEventListener(e.DefaultMenuEvent,s=function(s){if(e.shouldUseContextMenu(s)){a&&p(0,!0);var v,h,y,M=l(s.target).reduce((function(e,t){var r,o=t.menuId&&n[t.menuId];return!o||v||(e.push(o),null!==(r=o.props)&&void 0!==r&&r.hasOwnProperty("root")&&(v=o)),e}),[]),b=window.innerWidth,C=window.innerHeight;if(M.length&&!M[0].props.hasOwnProperty("native")){s.preventDefault(),s.stopPropagation(),document.body.addEventListener("click",p),u.style.display="block",window.addEventListener("resize",t=function(){p(0,!1)}),window.addEventListener("scroll",r=function(){p(0,!1)});var x=e.DefaultMenuComp;(a=document.createElement("div")).className="inContextMenu",u.appendChild(a),f=(0,i.createRoot)(a);var E=M.length;return f.render(d.createElement(m,{menuComps:M,onMenuItemRendered:function(){--E||requestAnimationFrame((function(){var n=["Bottom","Left"];h=s.x,y=s.y,h+a.offsetWidth>b&&(h-=a.offsetWidth,n[1]="Right"),y+a.offsetHeight>C&&(y-=a.offsetHeight,n[0]="Top"),a.classList.add("inContextMenuDir_"+n.join("")),Object.assign(a.style,{top:y+"px",left:h+"px",width:a.offsetWidth+"px",height:a.offsetHeight+"px",visibility:"visible"}),e.DefaultShowAnim&&c(a,e.DefaultShowAnim,e.DefaultAnimDuration)}))},setMenusToClean:function(e){return o=e},DefaultMenuComp:x,clickEvent:s})),Object.assign(a.style,{pointerEvents:"all",position:"absolute",display:"flex",visibility:"hidden"}),!1}}})}},15:e=>{e.exports=require("react")}},n={};function t(r){var o=n[r];if(void 0!==o)return o.exports;var i=n[r]={exports:{}};return e[r](i,i.exports,t),i.exports}t.n=e=>{var n=e&&e.__esModule?()=>e.default:()=>e;return t.d(n,{a:n}),n},t.d=(e,n)=>{for(var r in n)t.o(n,r)&&!t.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:n[r]})},t.o=(e,n)=>Object.prototype.hasOwnProperty.call(e,n),t.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};t.r(r),t.d(r,{ContextMenu:()=>p,default:()=>v});var o=t(15),i=t.n(o);const u=require("@babel/runtime/helpers/slicedToArray");var a=t.n(u);const s=require("react-dom");var d=new Function("try {return this===window;}catch(e){ return false;}")(),l=d&&t(944),c=0,f=0,m=[],p=function e(n){var t=i().useRef(),r=function(e,n,t){var r=i().useState(),o=a()(r,2),u=o[0],p=o[1],v=i().useRef(0);if(!v.current&&d&&(c||l.initContextListeners(t,m),c++,f++,v.current=f,e.current&&(e.current.menuId=v.current)),i().useEffect((function(){return m[v.current]={menuId:v.current,props:n,triggerRender:function(e,n,t){return p({node:e,menuList:n,event:t}),function(){return p(void 0)}}},function(){m[v.current]=void 0,--c||l.clearContextListeners(t)}}),[]),i().useEffect((function(){e.current&&v.current&&(e.current.menuId=v.current)}),[e.current]),i().useLayoutEffect((function(){u&&m[v.current].onMenuItemRendered&&(m[v.current].onMenuItemRendered(),delete m[v.current].onMenuItemRendered)}),[u]),u){var h=t.DefaultSubMenuComp;return{portalNode:(0,s.createPortal)(i().createElement(h,null,n.renderMenu?n.renderMenu(u.event,u.menuList,n.children):n.children),u.node)}}return{}}(t,n,e),o=r.portalNode;return i().createElement("div",{className:"inContextMenuComp",style:{display:"none"},ref:t},o)};p.DefaultZIndex=1e3,p.DefaultAnimDuration=250,p.DefaultMenuComp="div",p.DefaultSubMenuComp="div",p.DefaultShowAnim=!1,p.DefaultHideAnim=!1,p.DefaultMenuEvent="contextmenu",p.shouldUseContextMenu=function(e){return 2===e.button&&4!==e.buttons};const v=p;module.exports=r})();
//# sourceMappingURL=ContextMenu.js.map