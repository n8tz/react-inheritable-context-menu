/*
 * The MIT License (MIT)
 * Copyright (c) 2022-2023. Nathan Braun
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
import React          from "react";
import useContextMenu from "./hooks/useContextMenu";

const ContextMenu = ( props ) => {
	const node           = React.useRef(),
	      { portalNode } = useContextMenu(node, props, ContextMenu);
	
	// render a flagged dom node to be found when recurring on the dom tree
	return <div className={"inContextMenuComp"} style={{ display: "none" }} ref={node}>
		{
			portalNode
		}
	</div>;
}

ContextMenu.DefaultZIndex        = 1000;
ContextMenu.DefaultAnimDuration  = 250;
ContextMenu.DefaultMenuComp      = 'div';
ContextMenu.DefaultSubMenuComp   = 'div';
ContextMenu.DefaultShowAnim      = false;
ContextMenu.DefaultHideAnim      = false;
ContextMenu.DefaultMenuEvent     = "contextmenu";
ContextMenu.shouldUseContextMenu = e => (e.button === 2 && e.buttons !== 4);

export {ContextMenu};
export default ContextMenu;
