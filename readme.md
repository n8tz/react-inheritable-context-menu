<h1 align="center">react-inheritable-contextmenu</h1>

<p align="center"><img src="assets/demo.gif" alt="Samples" /></p>

<a href="https://www.npmjs.com/package/react-inheritable-contextmenu">
<img src="https://img.shields.io/npm/v/react-inheritable-contextmenu.svg" alt="Build Status" /></a>

Simple Context menu component for react showing all inherited parents menu with SSR compatibility.

Check the sample [here](http://htmlpreview.github.io/?https://github.com/n8tz/react-inheritable-context-menu/blob/master/dist.samples/index.html) ( [sources](samples/index.js) )

```
 npm i react-inheritable-contextmenu -s
```

## Why another context menu ?

Because none of the existing ones have met my requirements :
 - Ability to inherit & include parents context menus
 - Possibility to render menu items basing the browser event
 - Render menus just in time
 - Simple to use
 - Simple to animate with css
 - Do not break SSR

## Note

Version ^2.0.0 only work with React ^18<br>
Use V1.x.x for previous React versions 

## Usage

```jsx

import { ContextMenu } from "react-inheritable-contextmenu";

// override default rendered comps
// * there is no css builtin, but there is classNames .inContextMenuLayer > .inContextMenu .inContextSubMenu
ContextMenu.DefaultMenuComp = Paper
//ContextMenu.DefaultMenuComp     = ( { children } ) =>
//	                                                   <div className={"contextMenu"}>
//		                                                   <div>Da menu:</div>
//		                                                   <hr/>
//		                                                   {children || ''}
//	                                                   </div>;
//ContextMenu.DefaultSubMenuComp     = ( { children } ) =>
//	<>
//		<hr/>
//		{children || ''}
//		<hr/>
//	</>;

// add optional cool anims ( choose & add in css any anims in http://animista.net/ )
ContextMenu.DefaultShowAnim = 'slide-in-blurred-left';
ContextMenu.DefaultHideAnim = 'slide-out-blurred-right';

// set show/hide anims duration (default to 250)
ContextMenu.DefaultAnimDuration = 200;

// Some trigering options ( defaults )
// ContextMenu.DefaultMenuEvent     = "contextmenu";
// ContextMenu.shouldUseContextMenu = e => (e.button === 2 && e.buttons !== 4); // Default: don't trigger if right click + middle click   

render(){
    return <div className={ "root" }>
        <ContextMenu>
            <div>Menu root</div>
        </ContextMenu>
        Root contextual menu available here
        <br/>
        <br/>
        <br/>
        <div className={ "block" }>
            another one which inherit the 1st<br/>
            <ContextMenu>
                <div>Menu 2</div>
            </ContextMenu>
        </div>

        <div className={ "block" }>
            same using some contextual render fn<br/>
            <ContextMenu  // show Menu root & menu 2
                renderMenu={
                    ( e, allMenuComps ) => <div>Menu 2 <i>x:{ e.x } x:{ e.y }</i></div>
                }/>
        </div>
        <div className={ "block" }>
            Without parent's menu<br/>
            <ContextMenu
                root         // don't show parent's menu
                renderMenu={
                    ( e, allMenuComps ) => <div>Menu <i>x:{ e.x } x:{ e.y }</i></div>
                }/>
        </div>
        <div className={ "block" }>
            native menu<br/>
            <ContextMenu
                native         // use natve menu
            />
        </div>
        <br/>
        <br/>
        <br/>
    </div>;
}

//...


```

## You... like it / it saved your day / you stole all the code / you want more?

[![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](#)

BTC     : bc1qh43j8jh6dr8v3f675jwqq3nqymtsj8pyq0kh5a<br/>
Paypal  : <span class="badge-paypal"><a href="https://www.paypal.com/donate/?hosted_button_id=ECHYGKY3GR7CN" title="Donate to this project using Paypal"><img src="https://img.shields.io/badge/paypal-donate-yellow.svg" alt="PayPal donate button" /></a></span>

### License ?

MIT license

