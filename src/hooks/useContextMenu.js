import React          from "react";
import {createPortal} from 'react-dom';

const isBrowserSide = (new Function("try {return this===window;}catch(e){ return false;}"))(),
      utils         = isBrowserSide && require('../utils');


let initialized = 0,
    menuById    = [];
export default function useContextMenu( ref, props, options ) {
	const [portalNode, setPortalNode] = React.useState(),
	      menuIdRef                   = React.useRef(0);
	
	if ( !menuIdRef.current ) {
		if ( !initialized && isBrowserSide )
			utils.initContextListeners(options, menuById);
		initialized++;
		menuIdRef.current = initialized;
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
			if ( portalNode && menuById[menuIdRef.current].doReDim ) {
				menuById[menuIdRef.current].doReDim()
				delete menuById[menuIdRef.current].doReDim;
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
