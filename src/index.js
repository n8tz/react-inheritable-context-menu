/*
 * Copyright (c)  2018 Wise Wild Web .
 *
 *  MIT License
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *  SOFTWARE.
 *
 * @author : Nathanael Braun
 * @contact : caipilabs@gmail.com
 */

var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer;
var
    is                         = require('is'),
    React                      = require('react'),
    ReactDOM                   = require('react-dom'),
    caipiDom                   = require('caipi-dom'),
    findAllMenuFrom            = function ( el ) {
	    let menus = [];
	    do {
		    menus.push(...[...el.children].filter(node => node.classList.contains("caipiContextMenuComp")))
		    el = el.parentNode;
	    } while ( el && el !== document );
	    return menus;
    },
    findReactComponent         = function ( el ) {
	    let fiberNode;
	    for ( const key in el ) {
		    if ( key.startsWith('__reactInternalInstance$') ) {
			    fiberNode = el[key];
			
			    return fiberNode && fiberNode.return && fiberNode.return.stateNode;
		    }
	    }
	    return null;
    },
    renderMenu                 = ( target, menus, renderChilds ) => {
	    let RComp    = ContextMenu.DefaultMenuComp,
	        Renderer = React.cloneElement(
		        <RComp>
			        { renderChilds() }
		        </RComp>);
	
	    let menu = document.createElement("div");
	    target.appendChild(menu)
	
	    renderSubtreeIntoContainer(menus[0], Renderer, menu);
	    return menu
    },
    layer,
    currentMenu,
    openPortals                = [],
    initialized;


class ContextMenu extends React.Component {
	static DefaultMenuComp    = 'div'
	static DefaultSubMenuComp = 'div'
	
	static initContextListeners() {
		initialized = true;
		
		layer = document.createElement("div");
		caipiDom.applyCss(
			layer,
			{
				position: "absolute",
				width   : "100%",
				height  : "100%",
				top     : "0",
				left    : "0",
				display : 'none'
			}
		)
		caipiDom.addEvent(layer, 'click', ( e ) => {
			layer.style.display = 'none';
			openPortals.forEach(node => ReactDOM.unmountComponentAtNode(node))
			layer.innerHTML = '';
			currentMenu     = null;
		})
		document.body.appendChild(layer);
		document.addEventListener("contextmenu", function ( e ) {
			if ( currentMenu )
				return;
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
				    );
			if ( !menuComps.length || menuComps[0].props.hasOwnProperty('native') )
				return;
			layer.style.display = 'block';
			
			currentMenu = renderMenu(
				layer,
				menuComps,
				() => {
					return menuComps.map(cmp => cmp.renderWithContext(menuComps, e));
				}
			)
			openPortals.push(currentMenu);
			caipiDom.applyCss(
				currentMenu,
				{
					position  : "absolute",
					display   : "flex",
					visibility: 'hidden'
				}
			)
			caipiDom.addCls(currentMenu, "caipiContextMenu")
			
			requestAnimationFrame(
				() => {
					let x = e.x, y = e.y;
					if ( (x + currentMenu.offsetWidth) > document.body.offsetWidth )
						x -= currentMenu.offsetWidth;
					if ( (y + currentMenu.offsetHeight) > document.body.offsetHeight )
						y -= currentMenu.offsetHeight;
					
					caipiDom.applyCss(
						currentMenu,
						{
							top       : y,
							left      : x,
							visibility: 'visible'
						}
					)
				}
			)
			e.preventDefault()
			e.stopPropagation()
			return false;
		});
	}
	
	constructor() {
		super(...arguments)
		!initialized && ContextMenu.initContextListeners(this);
	}
	
	renderWithContext( menus, e ) {
		let RComp = ContextMenu.DefaultSubMenuComp, me = this;
		
		class RCComp extends React.Component {
			
			componentDidMount() {
				// ...
				openPortals.push(me.renderWithContext_ex(this.refs.node.parentNode, menus, e));
			}
			
			render() {
				return <RComp>
					<span ref={ "node" } style={ { display: "none" } }/>
				</RComp>
			}
		}
		
		return <RCComp/>;
	}
	
	renderWithContext_ex( target, menus, e ) {
		let RComp    = ContextMenu.DefaultSubMenuComp,
		    Renderer = React.cloneElement(
			    <RComp>
				    { this.renderMenu(e, menus) }
			    </RComp>,
			    {
				    //children: [this.renderMenu()]
				    //ref: r => (obj.reactElement = r)
			    });
		
		let menu = document.createElement("div");
		target.appendChild(menu)
		renderSubtreeIntoContainer(this, Renderer, menu);
		return menu
	}
	
	renderMenu( e, menus ) {
		return this.props.renderMenu ? this.props.renderMenu(e, menus) : <div>{ this.props.children || '' }</div>
	}
	
	render() {
		return <div className={ "caipiContextMenuComp" } style={ { display: "none" } }></div>;
	}
}


export default { ContextMenu };