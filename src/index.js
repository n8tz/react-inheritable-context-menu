/*
 * Copyright (c) 2018. Wise Wild Web
 *
 * This File is part of Caipi and under the Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International Public License
 * Full license at https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode
 *
 *  @author : Nathanael Braun
 *  @contact : caipilabs@gmail.com
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
			ReactDOM.unmountComponentAtNode(layer)
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
				    .reduceRight(
					    ( list, cmp ) => {
						    if ( !cmp || rootExclusive ) return list;
						    list.push(cmp);
						    if ( cmp.props.hasOwnProperty("root") )
							    rootExclusive = cmp;
						    return list
					    },
					    []
				    );
			
			layer.style.display = 'block';
			
			currentMenu = renderMenu(
				layer,
				menuComps,
				() => {
					return menuComps.map(cmp => cmp.renderWithContext(menuComps, e));
				}
			)
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
				me.renderWithContext_ex(this.refs.node.parentNode, menus, e);
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