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
			menus.push(...[...el.children].filter(node => node.classList.contains("inContextMenuComp")))
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
	initialized,
	airRender                  = ( render, menus, e ) => {
		return ( Comp ) => {
			
			return class RCComp extends React.Component {
				
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


class ContextMenu extends React.Component {
	static DefaultZIndex      = 1000;
	static DefaultMenuComp    = 'div';
	static DefaultSubMenuComp = 'div';
	
	static initContextListeners() {
		initialized = true;
		
		layer = document.createElement("div");
		caipiDom.applyCss(
			layer,
			{
				pointerEvents: "none",
				position     : "absolute",
				width        : "100%",
				height       : "100%",
				top          : "0",
				left         : "0",
				zIndex       : ContextMenu.DefaultZIndex,
				display      : 'none'
			}
		)
		let destroy = ( e, now ) => {
			let clear           = tm => {
				currentMenu = null;
				openPortals.forEach(node => ReactDOM.unmountComponentAtNode(node))
				layer.innerHTML = '';
			};
			layer.style.display = 'none';
			!now && setTimeout(
				clear,
				500
			) || clear()
			caipiDom.removeEvent(window, 'resize', resize);
			caipiDom.removeEvent(document.body, 'click', destroy)
			
		}, resize
		document.body.appendChild(layer);
		document.addEventListener("contextmenu", function ( e ) {
			if ( currentMenu )
				destroy(null, true);
			
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
				    ), x, y,
			    mw        = document.body.offsetWidth,
			    mh        = document.body.offsetHeight;
			if ( !menuComps.length || menuComps[0].props.hasOwnProperty('native') )
				return;
			caipiDom.addEvent(document.body, 'click', destroy)
			layer.style.display = 'block';
			
			caipiDom.addEvent(window, 'resize', resize = function () {
				x  = (x / mw) * document.body.offsetWidth;
				//y  = (y / mh) * document.body.offsetHeight;
				mw = document.body.offsetWidth;
				mh = document.body.offsetHeight;
				caipiDom.applyCss(
					currentMenu,
					{
						top : y,
						left: x,
					}
				)
				console.log('ahaha', x, y)
			});
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
					pointerEvents: "all",
					position     : "absolute",
					display      : "flex",
					visibility   : 'hidden'
				}
			)
			caipiDom.addCls(currentMenu, "inContextMenu")
			
			requestAnimationFrame(
				function () {
					x = e.x, y = e.y + document.body.scrollTop;
					if ( (x + currentMenu.offsetWidth) > mw )
						x -= currentMenu.offsetWidth;
					if ( (y + currentMenu.offsetHeight) > mh )
						y -= currentMenu.offsetHeight;
					
					caipiDom.applyCss(
						currentMenu,
						{
							top       : y,
							left      : x,
							width     : currentMenu.offsetWidth + 'px',
							height    : currentMenu.offsetHeight + 'px',
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
	
	constructor( props ) {
		super(...arguments)
		!initialized && ContextMenu.initContextListeners(this);
	}
	
	renderWithContext( menus, e ) {
		let RCComp = airRender(this.renderWithContext_ex.bind(this), menus, e)(ContextMenu.DefaultSubMenuComp);
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
		let menu     = document.createElement("div");
		target.appendChild(menu)
		renderSubtreeIntoContainer(this, Renderer, menu)
		
		return menu
	}
	
	shouldComponentUpdate( props, ns ) {
		this.renderableChilds = React.Children.toArray(props.children) || [];
		return false;
	}
	
	renderMenu( e, menus ) {
		let childs = is.array(this.renderableChilds) ? this.renderableChilds : [this.renderableChilds]
		return this.props.renderMenu ? this.props.renderMenu(e, menus, childs) :
		       <React.Fragment>{ childs.map(( c, i ) => React.cloneElement(c, { key: i })) || '' }</React.Fragment>
	}
	
	render() {
		this.renderableChilds = React.Children.toArray(this.props.children) || [];
		return <div className={ "inContextMenuComp" } style={ { display: "none" } }></div>;
	}
}


export default { ContextMenu };