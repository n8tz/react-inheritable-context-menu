import React          from "react";
import {createPortal} from 'react-dom';

const isBrowserSide = (new Function("try {return this===window;}catch(e){ return false;}"))(),
      utils         = isBrowserSide && require('../utils');


let initialized = 0,
    lastId      = 0,
    menuById    = [];
export default function useContextMenu( ref, props, options ) {
	const [portalNode, setPortalNode] = React.useState(),
	      menuIdRef                   = React.useRef(0);
	
	if ( !menuIdRef.current  && isBrowserSide) {
		if ( !initialized )
			utils.initContextListeners(options, menuById);
		initialized++;
		lastId++;
		menuIdRef.current = lastId;
		if ( ref.current )
			ref.current.menuId = menuIdRef.current;
		
	}
	
	React.useEffect(
		() => {
			menuById[menuIdRef.current] = {
				menuId       : menuIdRef.current,
				props,
				triggerRender: ( node, menuList, event ) => {
					setPortalNode({ node, menuList, event });
					return () => setPortalNode(undefined)
				}
			};
			return () => {
				menuById[menuIdRef.current] = undefined;
				if ( !--initialized )
					utils.clearContextListeners(options);
			}
		}, []
	)
	React.useEffect(
		() => {
			if ( ref.current && menuIdRef.current ) {
				ref.current.menuId = menuIdRef.current;
			}
		}, [ref.current]
	)
	React.useLayoutEffect(
		() => {
			if ( portalNode && menuById[menuIdRef.current].onMenuItemRendered ) {
				menuById[menuIdRef.current].onMenuItemRendered()
				delete menuById[menuIdRef.current].onMenuItemRendered;
			}
		}, [portalNode]
	)
	if ( portalNode ) {
		let DefaultSubMenuComp = options.DefaultSubMenuComp;
		return {
			portalNode: createPortal(
				<DefaultSubMenuComp>
					{
						props.renderMenu
						? props.renderMenu(portalNode.event, portalNode.menuList, props.children)
						: props.children
					}
				</DefaultSubMenuComp>, portalNode.node
			)
		}
	}
	return {};
}
