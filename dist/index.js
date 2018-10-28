'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

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
var is = require('is'),
    React = require('react'),
    ReactDOM = require('react-dom'),
    caipiDom = require('caipi-dom'),
    findAllMenuFrom = function findAllMenuFrom(el) {
	var menus = [];
	do {
		menus.push.apply(menus, _toConsumableArray([].concat(_toConsumableArray(el.children)).filter(function (node) {
			return node.classList.contains("caipiContextMenuComp");
		})));
		el = el.parentNode;
	} while (el && el !== document);
	return menus;
},
    findReactComponent = function findReactComponent(el) {
	var fiberNode = void 0;
	for (var key in el) {
		if (key.startsWith('__reactInternalInstance$')) {
			fiberNode = el[key];

			return fiberNode && fiberNode.return && fiberNode.return.stateNode;
		}
	}
	return null;
},
    renderMenu = function renderMenu(target, menus, renderChilds) {
	var RComp = ContextMenu.DefaultMenuComp,
	    Renderer = React.cloneElement(React.createElement(
		RComp,
		null,
		renderChilds()
	));

	var menu = document.createElement("div");
	target.appendChild(menu);

	renderSubtreeIntoContainer(menus[0], Renderer, menu);
	return menu;
},
    layer,
    currentMenu,
    openPortals = [],
    initialized;

var ContextMenu = function (_React$Component) {
	_inherits(ContextMenu, _React$Component);

	_createClass(ContextMenu, null, [{
		key: 'initContextListeners',
		value: function initContextListeners() {
			initialized = true;

			layer = document.createElement("div");
			caipiDom.applyCss(layer, {
				position: "absolute",
				width: "100%",
				height: "100%",
				top: "0",
				left: "0",
				display: 'none'
			});
			caipiDom.addEvent(layer, 'click', function (e) {

				layer.style.display = 'none';
				setTimeout(function (tm) {
					currentMenu = null;
					openPortals.forEach(function (node) {
						return ReactDOM.unmountComponentAtNode(node);
					});
					layer.innerHTML = '';
				});
			});
			document.body.appendChild(layer);
			document.addEventListener("contextmenu", function (e) {
				if (currentMenu) return;
				var rootExclusive = void 0,
				    menuComps = findAllMenuFrom(e.target).map(findReactComponent).reduce(function (list, cmp) {
					if (!cmp || rootExclusive) return list;
					list.push(cmp);
					if (cmp.props.hasOwnProperty("root")) rootExclusive = cmp;
					return list;
				}, []);
				if (!menuComps.length || menuComps[0].props.hasOwnProperty('native')) return;
				layer.style.display = 'block';

				currentMenu = renderMenu(layer, menuComps, function () {
					return menuComps.map(function (cmp) {
						return cmp.renderWithContext(menuComps, e);
					});
				});
				openPortals.push(currentMenu);
				caipiDom.applyCss(currentMenu, {
					position: "absolute",
					display: "flex",
					visibility: 'hidden'
				});
				caipiDom.addCls(currentMenu, "caipiContextMenu");

				requestAnimationFrame(function () {
					var x = e.x,
					    y = e.y;
					if (x + currentMenu.offsetWidth > document.body.offsetWidth) x -= currentMenu.offsetWidth;
					if (y + currentMenu.offsetHeight > document.body.offsetHeight) y -= currentMenu.offsetHeight;

					caipiDom.applyCss(currentMenu, {
						top: y,
						left: x,
						visibility: 'visible'
					});
				});
				e.preventDefault();
				e.stopPropagation();
				return false;
			});
		}
	}]);

	function ContextMenu() {
		_classCallCheck(this, ContextMenu);

		var _this = _possibleConstructorReturn(this, (ContextMenu.__proto__ || Object.getPrototypeOf(ContextMenu)).apply(this, arguments));

		!initialized && ContextMenu.initContextListeners(_this);
		return _this;
	}

	_createClass(ContextMenu, [{
		key: 'renderWithContext',
		value: function renderWithContext(menus, e) {
			var RComp = ContextMenu.DefaultSubMenuComp,
			    me = this;

			var RCComp = function (_React$Component2) {
				_inherits(RCComp, _React$Component2);

				function RCComp() {
					_classCallCheck(this, RCComp);

					return _possibleConstructorReturn(this, (RCComp.__proto__ || Object.getPrototypeOf(RCComp)).apply(this, arguments));
				}

				_createClass(RCComp, [{
					key: 'componentDidMount',
					value: function componentDidMount() {
						// ...
						openPortals.push(me.renderWithContext_ex(this.refs.node.parentNode, menus, e));
					}
				}, {
					key: 'render',
					value: function render() {
						return React.createElement(
							RComp,
							null,
							React.createElement('span', { ref: "node", style: { display: "none" } })
						);
					}
				}]);

				return RCComp;
			}(React.Component);

			return React.createElement(RCComp, null);
		}
	}, {
		key: 'renderWithContext_ex',
		value: function renderWithContext_ex(target, menus, e) {
			var RComp = ContextMenu.DefaultSubMenuComp,
			    Renderer = React.cloneElement(React.createElement(
				RComp,
				null,
				this.renderMenu(e, menus)
			), {
				//children: [this.renderMenu()]
				//ref: r => (obj.reactElement = r)
			});

			var menu = document.createElement("div");
			target.appendChild(menu);
			renderSubtreeIntoContainer(this, Renderer, menu);
			return menu;
		}
	}, {
		key: 'renderMenu',
		value: function renderMenu(e, menus) {
			return this.props.renderMenu ? this.props.renderMenu(e, menus) : React.createElement(
				'div',
				null,
				this.props.children || ''
			);
		}
	}, {
		key: 'render',
		value: function render() {
			return React.createElement('div', { className: "caipiContextMenuComp", style: { display: "none" } });
		}
	}]);

	return ContextMenu;
}(React.Component);

ContextMenu.DefaultMenuComp = 'div';
ContextMenu.DefaultSubMenuComp = 'div';
exports.default = { ContextMenu: ContextMenu };
module.exports = exports['default'];