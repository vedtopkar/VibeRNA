parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"XB+3":[function(require,module,exports) {
var define;
var global = arguments[3];
var t,e=arguments[3];function n(t){return(n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}window.FontAwesomeKitConfig={asyncLoading:{enabled:!1},autoA11y:{enabled:!0},baseUrl:"https://ka-f.fontawesome.com",baseUrlKit:"https://kit.fontawesome.com",detectConflictsUntil:null,iconUploads:{},id:103710338,license:"free",method:"css",minify:{enabled:!0},token:"71d1138635",v4FontFaceShim:{enabled:!0},v4shim:{enabled:!0},version:"5.15.2"},function(e){"function"==typeof t&&t.amd?t("kit-loader",e):e()}(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==n(Symbol.iterator)?function(t){return n(t)}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":n(t)})(e)}function o(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function r(t,e){var n=Object.keys(t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);e&&(o=o.filter(function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable})),n.push.apply(n,o)}return n}function i(t){for(var e=1;e<arguments.length;e++){var n=null!=arguments[e]?arguments[e]:{};e%2?r(Object(n),!0).forEach(function(e){o(t,e,n[e])}):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(n)):r(Object(n)).forEach(function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(n,e))})}return t}function c(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if("undefined"!=typeof Symbol&&Symbol.iterator in Object(t)){var n=[],o=!0,r=!1,i=void 0;try{for(var c,a=t[Symbol.iterator]();!(o=(c=a.next()).done)&&(n.push(c.value),!e||n.length!==e);o=!0);}catch(t){r=!0,i=t}finally{try{o||null==a.return||a.return()}finally{if(r)throw i}}return n}}(t,e)||function(t,e){if(t){if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,o=new Array(e);n<e;n++)o[n]=t[n];return o}function u(t,e){var n=e&&e.addOn||"",o=e&&e.baseFilename||t.license+n,r=e&&e.minify?".min":"",i=e&&e.fileSuffix||t.method,c=e&&e.subdir||t.method;return t.baseUrl+"/releases/"+("latest"===t.version?"latest":"v".concat(t.version))+"/"+c+"/"+o+r+"."+i}function s(t,e){var n=e||["fa"],o="."+Array.prototype.join.call(n,",."),r=t.querySelectorAll(o);Array.prototype.forEach.call(r,function(e){var n=e.getAttribute("title");e.setAttribute("aria-hidden","true");var o=!e.nextElementSibling||!e.nextElementSibling.classList.contains("sr-only");if(n&&o){var r=t.createElement("span");r.innerHTML=n,r.classList.add("sr-only"),e.parentNode.insertBefore(r,e.nextSibling)}})}var f,d=function(){},l=void 0!==e&&void 0!==e.process&&"function"==typeof e.process.emit,m="undefined"==typeof setImmediate?setTimeout:setImmediate,h=[];function p(){for(var t=0;t<h.length;t++)h[t][0](h[t][1]);h=[],f=!1}function y(t,e){h.push([t,e]),f||(f=!0,m(p,0))}function b(t){var e=t.owner,n=e._state,o=e._data,r=t[n],i=t.then;if("function"==typeof r){n="fulfilled";try{o=r(o)}catch(t){A(i,t)}}v(i,o)||("fulfilled"===n&&w(i,o),"rejected"===n&&A(i,o))}function v(e,n){var o;try{if(e===n)throw new TypeError("A promises callback cannot return that same promise.");if(n&&("function"==typeof n||"object"===t(n))){var r=n.then;if("function"==typeof r)return r.call(n,function(t){o||(o=!0,n===t?g(e,t):w(e,t))},function(t){o||(o=!0,A(e,t))}),!0}}catch(t){return o||A(e,t),!0}return!1}function w(t,e){t!==e&&v(t,e)||g(t,e)}function g(t,e){"pending"===t._state&&(t._state="settled",t._data=e,y(O,t))}function A(t,e){"pending"===t._state&&(t._state="settled",t._data=e,y(j,t))}function S(t){t._then=t._then.forEach(b)}function O(t){t._state="fulfilled",S(t)}function j(t){t._state="rejected",S(t),!t._handled&&l&&e.process.emit("unhandledRejection",t._data,t)}function E(t){e.process.emit("rejectionHandled",t)}function _(t){if("function"!=typeof t)throw new TypeError("Promise resolver "+t+" is not a function");if(this instanceof _==0)throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");this._then=[],function(t,e){function n(t){A(e,t)}try{t(function(t){w(e,t)},n)}catch(t){n(t)}}(t,this)}_.prototype={constructor:_,_state:"pending",_then:null,_data:void 0,_handled:!1,then:function(t,e){var n={owner:this,then:new this.constructor(d),fulfilled:t,rejected:e};return!e&&!t||this._handled||(this._handled=!0,"rejected"===this._state&&l&&y(E,this)),"fulfilled"===this._state||"rejected"===this._state?y(b,n):this._then.push(n),n.then},catch:function(t){return this.then(null,t)}},_.all=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.all().");return new _(function(e,n){var o=[],r=0;function i(t){return r++,function(n){o[t]=n,--r||e(o)}}for(var c,a=0;a<t.length;a++)(c=t[a])&&"function"==typeof c.then?c.then(i(a),n):o[a]=c;r||e(o)})},_.race=function(t){if(!Array.isArray(t))throw new TypeError("You must pass an array to Promise.race().");return new _(function(e,n){for(var o,r=0;r<t.length;r++)(o=t[r])&&"function"==typeof o.then?o.then(e,n):e(o)})},_.resolve=function(e){return e&&"object"===t(e)&&e.constructor===_?e:new _(function(t){t(e)})},_.reject=function(t){return new _(function(e,n){n(t)})};var C="function"==typeof Promise?Promise:_;function F(t,e){var n=e.fetch,o=e.XMLHttpRequest,r=e.token,i=t;return"URLSearchParams"in window?(i=new URL(t)).searchParams.set("token",r):i=i+"?token="+encodeURIComponent(r),i=i.toString(),new C(function(t,e){if("function"==typeof n)n(i,{mode:"cors",cache:"default"}).then(function(t){if(t.ok)return t.text();throw new Error("")}).then(function(e){t(e)}).catch(e);else if("function"==typeof o){var r=new o;r.addEventListener("loadend",function(){this.responseText?t(this.responseText):e(new Error(""))}),["abort","error","timeout"].map(function(t){r.addEventListener(t,function(){e(new Error(""))})}),r.open("GET",i),r.send()}else e(new Error(""))})}function P(t,e,n){var o=t;return[[/(url\("?)\.\.\/\.\.\/\.\./g,function(t,n){return"".concat(n).concat(e)}],[/(url\("?)\.\.\/webfonts/g,function(t,o){return"".concat(o).concat(e,"/releases/v").concat(n,"/webfonts")}],[/(url\("?)https:\/\/kit-free([^.])*\.fontawesome\.com/g,function(t,n){return"".concat(n).concat(e)}]].forEach(function(t){var e=c(t,2),n=e[0],r=e[1];o=o.replace(n,r)}),o}function U(t,e){var n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:function(){},o=e.document||o,r=s.bind(s,o,["fa","fab","fas","far","fal","fad","fak"]),c=Object.keys(t.iconUploads||{}).length>0;t.autoA11y.enabled&&n(r);var a=[{id:"fa-main",addOn:void 0}];t.v4shim.enabled&&a.push({id:"fa-v4-shims",addOn:"-v4-shims"}),t.v4FontFaceShim.enabled&&a.push({id:"fa-v4-font-face",addOn:"-v4-font-face"}),c&&a.push({id:"fa-kit-upload",customCss:!0});var f=a.map(function(n){return new C(function(o,r){F(n.customCss?function(t){return t.baseUrlKit+"/"+t.token+"/"+t.id+"/kit-upload.css"}(t):u(t,{addOn:n.addOn,minify:t.minify.enabled}),e).then(function(r){o(function(t,e){var n=e.contentFilter||function(t,e){return t},o=document.createElement("style"),r=document.createTextNode(n(t,e));return o.appendChild(r),o.media="all",e.id&&o.setAttribute("id",e.id),e&&e.detectingConflicts&&e.detectionIgnoreAttr&&o.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),o}(r,i(i({},e),{},{baseUrl:t.baseUrl,version:t.version,id:n.id,contentFilter:function(t,e){return P(t,e.baseUrl,e.version)}})))}).catch(r)})});return C.all(f)}function k(t,e){var n=document.createElement("SCRIPT"),o=document.createTextNode(t);return n.appendChild(o),n.referrerPolicy="strict-origin",e.id&&n.setAttribute("id",e.id),e&&e.detectingConflicts&&e.detectionIgnoreAttr&&n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),n}function L(t){var e,n=[],o=document,r=(o.documentElement.doScroll?/^loaded|^c/:/^loaded|^i|^c/).test(o.readyState);r||o.addEventListener("DOMContentLoaded",e=function(){for(o.removeEventListener("DOMContentLoaded",e),r=1;e=n.shift();)e()}),r?setTimeout(t,0):n.push(t)}try{if(window.FontAwesomeKitConfig){var I=window.FontAwesomeKitConfig,T={detectingConflicts:I.detectConflictsUntil&&new Date<=new Date(I.detectConflictsUntil),detectionIgnoreAttr:"data-fa-detection-ignore",fetch:window.fetch,token:I.token,XMLHttpRequest:window.XMLHttpRequest,document:document},x=document.currentScript,M=x?x.parentElement:document.head;(function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},e=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return"js"===t.method?function(t,e){e.autoA11y=t.autoA11y.enabled,"pro"===t.license&&(e.autoFetchSvg=!0,e.fetchSvgFrom=t.baseUrl+"/releases/"+("latest"===t.version?"latest":"v".concat(t.version))+"/svgs",e.fetchUploadedSvgFrom=t.uploadsUrl);var n=[];return t.v4shim.enabled&&n.push(new C(function(n,o){F(u(t,{addOn:"-v4-shims",minify:t.minify.enabled}),e).then(function(t){n(k(t,i(i({},e),{},{id:"fa-v4-shims"})))}).catch(o)})),n.push(new C(function(n,o){F(u(t,{minify:t.minify.enabled}),e).then(function(t){var o=k(t,i(i({},e),{},{id:"fa-main"}));n(function(t,e){var n=e&&void 0!==e.autoFetchSvg?e.autoFetchSvg:void 0,o=e&&void 0!==e.autoA11y?e.autoA11y:void 0;return void 0!==o&&t.setAttribute("data-auto-a11y",o?"true":"false"),n&&(t.setAttributeNode(document.createAttribute("data-auto-fetch-svg")),t.setAttribute("data-fetch-svg-from",e.fetchSvgFrom),t.setAttribute("data-fetch-uploaded-svg-from",e.fetchUploadedSvgFrom)),t}(o,e))}).catch(o)})),C.all(n)}(t,e):"css"===t.method?U(t,e,function(t){L(t),function(t){"undefined"!=typeof MutationObserver&&new MutationObserver(t).observe(document,{childList:!0,subtree:!0})}(t)}):void 0})(I,T).then(function(t){t.map(function(t){try{M.insertBefore(t,x?x.nextSibling:null)}catch(o){M.appendChild(t)}}),T.detectingConflicts&&x&&L(function(){x.setAttributeNode(document.createAttribute(T.detectionIgnoreAttr));var t=function(t,e){var n=document.createElement("script");return e&&e.detectionIgnoreAttr&&n.setAttributeNode(document.createAttribute(e.detectionIgnoreAttr)),n.src=u(t,{baseFilename:"conflict-detection",fileSuffix:"js",subdir:"js",minify:t.minify.enabled}),n}(I,T);document.body.appendChild(t)})}).catch(function(t){console.error("".concat("Font Awesome Kit:"," ").concat(t))})}}catch(t){console.error("".concat("Font Awesome Kit:"," ").concat(t))}});
},{}]},{},["XB+3"], null)
//# sourceMappingURL=/VibeRNA/font-awesome.aa282124.js.map