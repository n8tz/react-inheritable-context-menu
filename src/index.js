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
import React    from "react";
import ReactDom from "react-dom";

const renderSubtreeIntoContainer = ReactDom.unstable_renderSubtreeIntoContainer,
      isBrowserSide              = (new Function("try {return this===window;}catch(e){ return false;}"))(),
      utils                      = isBrowserSide && require('./utils');

let initialized = 0;

class ContextMenu extends React.Component {
	
	static DefaultZIndex       = 1000;
	static DefaultAnimDuration = 250;
	static DefaultMenuComp     = 'div';
	static DefaultSubMenuComp  = 'div';
	static DefaultShowAnim     = false;
	static DefaultHideAnim     = false;
	
	
	constructor( props ) {
		super(...arguments)
		if ( !initialized && isBrowserSide )
			utils.initContextListeners(ContextMenu);
		initialized++;
	}
	
	componentWillUnmount() {
		if ( !--initialized )
			utils.clearContextListeners(ContextMenu);
	}
	
	/**
	 * Return a rendered React component with the menu
	 * @param menus
	 * @param e
	 * @param current
	 * @returns {*}
	 */
	renderWithContext( menus, e, current ) {
		let CRCComp = utils.airRender(this.renderWithContext_ex.bind(this), menus, e)(React.Fragment);
		return <CRCComp key={ current }/>;
	}
	
	/**
	 * Return a dom node with the menu rendered inside
	 * @param target
	 * @param menus
	 * @param e
	 * @returns {HTMLElement}
	 */
	renderWithContext_ex( target, menus, e ) {
		let RComp    = ContextMenu.DefaultSubMenuComp,
		    Renderer = <RComp>
			    { this.renderMenu(e, menus) }
		    </RComp>,
		    menu     = document.createElement("div");
		
		menu.className = "inContextSubMenu";
		target.appendChild(menu);
		
		renderSubtreeIntoContainer(this, Renderer, menu);
		
		return menu
	}
	
	/**
	 * Return / render the real menu
	 * @param e
	 * @param menus
	 * @returns {*}
	 */
	renderMenu( e, menus ) {
		let childs = this.renderableChilds;
		return this.props.renderMenu ? this.props.renderMenu(e, menus, childs) :
		       <React.Fragment>{ childs || '' }</React.Fragment>
	}
	
	render() {
		// keep the renderable so we can render them when asked
		this.renderableChilds = React.Children.toArray(this.props.children) || [];
		
		// render a flagged dom node to be found when recurring on the dom tree
		return <div className={ "inContextMenuComp" } style={ { display: "none" } }></div>;
	}
}

export {ContextMenu};
export default ContextMenu;