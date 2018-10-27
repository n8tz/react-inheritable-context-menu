# react-inheritable-contextmenu

Simple Context menu component for react showing all inherited parents menu in theirs contexts.

<a href="https://www.npmjs.com/package/react-inheritable-contextmenu">
<img src="https://img.shields.io/npm/v/react-inheritable-contextmenu.svg" alt="Build Status" /></a>

```
 npm i react-inheritable-contextmenu -s
```

# Usage

```es6

import {ContextMenu] from "react-inheritable-contextmenu";

// override default rendered comps
ContextMenu.DefaultMenuComp = Paper
ContextMenu.DefaultSubMenuComp = 'ul'

//...

render(){
    return <div>
               <ContextMenu>
                   <ul><li>Menu root</li></ul>
               </ContextMenu>
               a word<br/>
               <div>
                   another word<br/>
                   <ContextMenu>
                       <ul><li>Menu 2</li></ul>
                   </ContextMenu>
               </div>

               <div>
                   another word<br/>
                   <ContextMenu
                      renderMenu={
                         (e, allMenuComps) => <ul><li>Menu 2</li></ul>
                      }/>
               </div>

               <div>
                   root word<br/>
                   <ContextMenu
                      root         // don't show parent's menu
                      renderMenu={
                         (e, allMenuComps) => <ul><li>Menu 2</li></ul>
                      }/>
               </div>
           </div>;
}

//...


```

### License ?

MIT license

