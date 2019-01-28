/*
 * The MIT License (MIT)
 * Copyright (c) 2019. Wise Wild Web
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @author : Nathanael Braun
 *  @contact : n8tz.js@gmail.com
 */

var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer,
    React                      = require('react'),
    ReactDOM                   = require('react-dom');

let
	findAllMenuFrom    = function ( el ) {
		let menus = [];
		do {
			menus.push(...[...el.children].filter(node => node.classList.contains("inContextMenuComp")))
			el = el.parentNode;
		} while ( el && el !== document );
		return menus;
	},
	findReactComponent = function ( el ) {
		let fiberNode;
		for ( const key in el ) {
			if ( key.startsWith('__reactInternalInstance$') ) {
				fiberNode = el[key];
				
				return fiberNode && fiberNode.return && fiberNode.return.stateNode;
			}
		}
		return null;
	},
	renderMenu         = ( target, menus, renderChilds, DefaultMenuComp ) => {
		let RComp    = DefaultMenuComp,
		    Renderer = React.cloneElement(
			    <RComp>
				    <React.Fragment>
					    { renderChilds() }
				    </React.Fragment>
			    </RComp>);
		
		let menu = document.createElement("div");
		target.appendChild(menu)
		
		renderSubtreeIntoContainer(menus[0], Renderer, menu);
		return menu
	},
	layer,
	currentMenu,
	contextmenuListener,
	openPortals        = [];

export function airRender( render, menus, e ) {
	return ( Comp ) => {
		
		return class AirRCComp extends React.Component {
			
			componentDidMount() {
				// ...
				openPortals.push(render(this.refs.node.parentNode, menus, e));
			}
			
			render() {
				return <Comp>
					<span ref={ "node" } style={ { display: "none" } }/>
				</Comp>
			}
		}
	}
}
;

export function applyCssAnim( node, id, tm, cb ) {
	tm      = tm || 500;
	let stm,
	    evt = ( e ) => {
		    if ( e && e.target !== node ) {
			    return;
		    }
		    clearTimeout(stm);
		    Object.assign(node.style, { animation: null });
		
		    node.removeEventListener('animationend', evt);
		    cb && cb(node);
	    };
	node.addEventListener('animationend', evt);
	
	Object.assign(node.style, { animation: id + " " + (tm / 1000) + "s forwards" });
	
	stm = setTimeout(evt, tm * 1.1);
};


export function clearContextListeners() {
	
	document.body.removeChild(layer);
	layer = null;
}

export function initContextListeners( ContextMenu ) {
	
	// init overlay
	layer = document.createElement("div");
	Object.assign(layer.style, {
		pointerEvents: "none",
		position     : "absolute",
		overflow     : "hidden",
		width        : "100%",
		height       : "100%",
		top          : "0",
		left         : "0",
		zIndex       : ContextMenu.DefaultZIndex,
		display      : 'none'
	});
	document.body.appendChild(layer);
	
	let destroy = ( e, now ) => {
		
		let clear = tm => {
			layer.style.display = 'none';
			currentMenu         = null;
			openPortals.forEach(node => ReactDOM.unmountComponentAtNode(node))
			layer.innerHTML = '';
		};
		if ( !now ) {
			ContextMenu.DefaultHideAnim &&
			applyCssAnim(currentMenu, ContextMenu.DefaultHideAnim, ContextMenu.DefaultAnimDuration, clear)
		}
		else clear();
		window.removeEventListener('resize', resize);
		document.body.removeEventListener('click', destroy)
		
	}, resize;
	
	// on right click
	document.addEventListener(
		"contextmenu",
		contextmenuListener = function ( e ) {
			if ( currentMenu )
				destroy(null, true);
			
			//
			let rootExclusive,
			    menuComps = findAllMenuFrom(e.target)
				    .map(findReactComponent)
				    .reduce(
					    ( list, cmp ) => {
						    if ( !cmp || rootExclusive ) return list;
						    list.push(cmp);
						    if ( cmp.props.hasOwnProperty("root") )
							    rootExclusive = cmp;
						    return list
					    },
					    []
				    ),
			    x, y,
			    mw        = document.body.offsetWidth,
			    mh        = document.body.offsetHeight;
			
			if ( !menuComps.length || menuComps[0].props.hasOwnProperty('native') )
				return;
			
			
			document.body.addEventListener('click', destroy)
			
			layer.style.display = 'block';
			
			window.addEventListener(
				'resize',
				resize = () => {
					x  = (x / mw) * document.body.offsetWidth;
					//y  = (y / mh) * document.body.offsetHeight;
					mw = document.body.offsetWidth;
					mh = document.body.offsetHeight;
					Object.assign(
						currentMenu.style,
						{
							top : y + 'px',
							left: x + 'px',
						}
					)
				});
			
			currentMenu = renderMenu(
				layer,
				menuComps,
				() => {
					return <React.Fragment>{ menuComps.map(( cmp, i ) => cmp.renderWithContext(menuComps, e, i)) }</React.Fragment>;
				}
				, ContextMenu.DefaultMenuComp
			);
			
			openPortals.push(currentMenu);
			
			Object.assign(
				currentMenu.style,
				{
					pointerEvents: "all",
					position     : "absolute",
					display      : "flex",
					visibility   : 'hidden'
				}
			);
			
			currentMenu.className = "inContextMenu";
			
			// show on next animaton frame
			requestAnimationFrame(
				function () {
					x = e.x;
					y = e.y + document.body.scrollTop;
					
					if ( (x + currentMenu.offsetWidth) > mw )
						x -= currentMenu.offsetWidth;
					if ( (y + currentMenu.offsetHeight) > mh )
						y -= currentMenu.offsetHeight;
					
					Object.assign(
						currentMenu.style,
						{
							top       : y + 'px',
							left      : x + 'px',
							width     : currentMenu.offsetWidth + 'px',
							height    : currentMenu.offsetHeight + 'px',
							visibility: 'visible'
						}
					);
					ContextMenu.DefaultShowAnim &&
					applyCssAnim(currentMenu, 'slide-in-blurred-left', ContextMenu.DefaultAnimDuration)
				}
			);
			
			e.preventDefault();
			e.stopPropagation();
			return false;
		});
};
