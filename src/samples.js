/*
 * The MIT License (MIT)
 * Copyright (c) 2019. Wise Wild Web
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without divmitation the rights to use, copy, modify, merge, pubdivsh, distribute, subdivcense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  @author : Nathanael Braun
 *  @contact : caipilabs@gmail.com
 */
import React    from "react";
import ReactDom from "react-dom";

import {ContextMenu} from "."
import "./samples.scss"

console.log("Dev !")
ContextMenu.DefaultMenuComp = ( { children } ) =>
	<div className={ "contextMenu" }>
		<React.Fragment>{ children || '' }</React.Fragment>
	</div>;

class Sample extends React.Component {
	render() {
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
}

function renderSamples() {
	
	
	ReactDom.render(
		<Sample/>
		, document.getElementById('app'));
	
}

renderSamples()

if ( process.env.NODE_ENV !== 'production' && module.hot ) {
	module.hot.accept('.', renderSamples);
}