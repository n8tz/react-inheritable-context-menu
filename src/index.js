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

/**
 * This code need nome smart refactoring
 */

var renderSubtreeIntoContainer = require("react-dom").unstable_renderSubtreeIntoContainer,
    utils                      = require('./utils'),
    React                      = require('react'),
    initialized                = 0;


class ContextMenu extends React.Component {
	static DefaultZIndex       = 1000;
	static DefaultAnimDuration = 250;
	static DefaultMenuComp     = 'div';
	static DefaultSubMenuComp  = 'div';
	static DefaultShowAnim     = false;
	static DefaultHideAnim     = false;
	
	
	constructor( props ) {
		super(...arguments)
		if ( !initialized )
			utils.initContextListeners(ContextMenu);
		initialized++;
	}
	
	componentWillUnmount() {
		if ( !--initialized )
			utils.clearContextListeners(ContextMenu);
	}
	
	renderWithContext( menus, e, current ) {
		let CRCComp = utils.airRender(this.renderWithContext_ex.bind(this), menus, e)(ContextMenu.DefaultSubMenuComp);
		return <CRCComp key={ current }/>;
	}
	
	renderWithContext_ex( target, menus, e ) {
		let RComp    = ContextMenu.DefaultSubMenuComp,
		    Renderer = React.cloneElement(
			    <RComp>
				    <React.Fragment>{ this.renderMenu(e, menus) }</React.Fragment>
			    </RComp>,
			    {}),
		    menu     = document.createElement("div");
		
		target.appendChild(menu);
		
		renderSubtreeIntoContainer(this, Renderer, menu);
		
		return menu
	}
	
	shouldComponentUpdate( props, ns ) {
		this.renderableChilds = React.Children.toArray(props.children) || [];
		return false;
	}
	
	renderMenu( e, menus ) {
		let childs = this.renderableChilds;
		return this.props.renderMenu ? this.props.renderMenu(e, menus, childs) :
		       <React.Fragment>{ childs || '' }</React.Fragment>
	}
	
	render() {
		this.renderableChilds = React.Children.toArray(this.props.children) || [];
		return <div className={ "inContextMenuComp" } style={ { display: "none" } }></div>;
	}
}


export {ContextMenu};
export default ContextMenu;