'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDraggable = require('react-draggable');

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; } /* eslint-disable react/jsx-filename-extension */


var Resizable = function (_React$Component) {
    _inherits(Resizable, _React$Component);

    function Resizable() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, Resizable);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Resizable.__proto__ || Object.getPrototypeOf(Resizable)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            resizing: false,
            width: _this.props.width,
            height: _this.props.height,
            left: _this.props.left,
            top: _this.props.top
        }, _this.renderResizeHandle = function () {
            return _this.props.allResizeHandle ? _this.renderAllResizeHandles() : _this.renderOneResizeHandle();
        }, _this.renderOneResizeHandle = function () {
            return _react2.default.createElement('span', { style: _this.getHandleStyle(style.sEResizableHandle),
                className: 'react-resizable-handle' });
        }, _this.renderAllResizeHandles = function () {
            return _react2.default.createElement(
                'div',
                { className: 'react-resizable-handle-dont-drag-me' },
                _react2.default.createElement('span', { style: _this.getHandleStyle(style.sWResizableHandle),
                    className: 'react-sw-resizable-handle' }),
                _react2.default.createElement('span', { style: _this.getHandleStyle(style.sEResizableHandle),
                    className: 'react-resizable-handle' }),
                _react2.default.createElement('span', { style: _this.getHandleStyle(style.nWResizableHandle),
                    className: 'react-nw-resizable-handle' }),
                _react2.default.createElement('span', { style: _this.getHandleStyle(style.nEResizableHandle),
                    className: 'react-ne-resizable-handle' })
            );
        }, _this.onResize = function (event, _ref2) {
            var node = _ref2.node,
                deltaX = _ref2.deltaX,
                deltaY = _ref2.deltaY,
                x = _ref2.x,
                y = _ref2.y;

            if (!_this.isResizeHandle(_this.state.resizableHandle)) {
                return;
            }
            var dimension = _this.getDimension(x, y, deltaX, deltaY);

            var _this$runConstraints = _this.runConstraints(dimension.width, dimension.height),
                width = _this$runConstraints.width,
                height = _this$runConstraints.height;

            dimension.width = width;
            dimension.height = height;

            if (!_this.hasDimensionChanged(dimension)) {
                return;
            }

            _this.persistEventIfFunction(event);
            _this.setState(dimension, function () {
                return _this.resizeCallback(event, node, dimension);
            });
        }, _this.onResizeStart = function (event, _ref3) {
            var node = _ref3.node,
                x = _ref3.x,
                y = _ref3.y;

            if (_this.isResizeHandle(event.target.className)) {
                _this.setState({ resizableHandle: event.target.className });
            }
            var resizeStartState = _this.onResizeStartState(x, y);
            _this.persistEventIfFunction(event);
            _this.setState(resizeStartState, function () {
                return _this.resizeStartCallback(event, node, _this.toDimension(_this.state));
            });
        }, _this.onResizeStop = function (event, _ref4) {
            var node = _ref4.node;

            _this.persistEventIfFunction(event);
            _this.setState(_this.onResizeStopState(), function () {
                return _this.resizeStopCallback(event, node, _this.toDimension(_this.state));
            });
        }, _this.getDimension = function (x, y, deltaX, deltaY) {
            switch (_this.state.resizableHandle) {
                case 'react-nw-resizable-handle':
                    return _this.resizeFromTopLeftCorner(x, y, deltaX, deltaY);
                case 'react-ne-resizable-handle':
                    return _this.resizeFromTopRightCorner(x, y, deltaX, deltaY);
                case 'react-sw-resizable-handle':
                    return _this.resizeFromBottomLeftCorner(x, y, deltaY, deltaX);
                case 'react-resizable-handle':
                case 'react-se-resizable-handle':
                    return _this.resizeFromBottomRightCorner(deltaX, deltaY);
                default:
                    return null;
            }
        }, _this.resizeFromTopLeftCorner = function (x, y, deltaX, deltaY) {
            return {
                left: _this.calculateLeft(deltaX, x),
                top: _this.calculateTop(deltaY, y),
                width: _this.calculateWidth(deltaX, x),
                height: _this.calculateHeight(deltaY, y)
            };
        }, _this.resizeFromTopRightCorner = function (x, y, deltaX, deltaY) {
            return {
                left: _this.state.left,
                top: _this.calculateTop(deltaY, y),
                width: _this.state.width + (_this.canDragX() ? deltaX : 0),
                height: _this.calculateHeight(deltaY, y)
            };
        }, _this.resizeFromBottomRightCorner = function (deltaX, deltaY) {
            return {
                left: _this.state.left,
                top: _this.state.top,
                width: _this.state.width + (_this.canDragX() ? deltaX : 0),
                height: _this.state.height + (_this.canDragY() ? deltaY : 0)
            };
        }, _this.resizeFromBottomLeftCorner = function (x, y, deltaY, deltaX) {
            return {
                left: _this.calculateLeft(deltaX, x),
                top: _this.state.top,
                width: _this.calculateWidth(deltaX, x),
                height: _this.state.height + (_this.canDragY() ? deltaY : 0)
            };
        }, _this.calculateTop = function (deltaY, y) {
            if (_this.isMouseMovingUp(deltaY, y)) {
                var heightToAdd = _this.getHeightToAdd(deltaY);
                return _this.moveUp(heightToAdd);
            }

            if (_this.isMouseMovingDown(deltaY, y)) {
                var heightToRemove = _this.getHeightToRemove(deltaY);
                return _this.moveDown(heightToRemove);
            }

            return _this.state.top;
        }, _this.calculateHeight = function (deltaY, y) {
            if (_this.canDragY() && _this.isMouseMovingUp(deltaY, y)) {
                var heightToAdd = _this.getHeightToAdd(deltaY);
                return _this.increaseHeight(heightToAdd);
            }
            if (_this.canDragY() && _this.isMouseMovingDown(deltaY, y)) {
                var heightToRemove = _this.getHeightToRemove(deltaY);
                return _this.reduceHeight(heightToRemove);
            }
            return _this.state.height;
        }, _this.calculateLeft = function (deltaX, x) {
            if (_this.isMouseMovingLeft(deltaX, x)) {
                var widthToAdd = _this.getWidthToAdd(deltaX);
                return _this.moveLeft(widthToAdd);
            }

            if (_this.isMouseMovingRight(deltaX, x)) {
                var widthToRemove = _this.getWidthToRemove(deltaX);
                return _this.moveRight(widthToRemove);
            }
            return _this.state.left;
        }, _this.calculateWidth = function (deltaX, x) {
            if (_this.canDragX() && _this.isMouseMovingLeft(deltaX, x)) {
                var widthToAdd = _this.getWidthToAdd(deltaX);
                return _this.increaseWidth(widthToAdd);
            }

            if (_this.canDragX() && _this.isMouseMovingRight(deltaX, x)) {
                var widthToRemove = _this.getWidthToRemove(deltaX);
                return _this.reduceWidth(widthToRemove);
            }

            return _this.state.width;
        }, _this.getHeightToAdd = function (deltaY) {
            var heightToAdd = Math.abs(deltaY);
            if (_this.props.maxConstraints[1] && heightToAdd + _this.state.height > _this.props.maxConstraints[1]) {
                heightToAdd = _this.props.maxConstraints[1] - _this.state.height;
            }
            return heightToAdd;
        }, _this.getHeightToRemove = function (deltaY) {
            var heightToRemove = deltaY;
            if (_this.props.minConstraints[1] && _this.state.height - heightToRemove < _this.props.minConstraints[1]) {
                heightToRemove = 0;
            }
            return heightToRemove;
        }, _this.getWidthToAdd = function (deltaX) {
            var widthToAdd = Math.abs(deltaX);
            if (_this.props.maxConstraints[0] && widthToAdd + _this.state.width > _this.props.maxConstraints[0]) {
                widthToAdd = _this.props.maxConstraints[0] - _this.state.width;
            }
            return widthToAdd;
        }, _this.getWidthToRemove = function (deltaX) {
            var widthToRemove = deltaX;
            if (_this.props.minConstraints[1] && _this.state.width - widthToRemove < _this.props.minConstraints[1]) {
                widthToRemove = 0;
            }
            return widthToRemove;
        }, _this.increaseHeight = function (heightToAdd) {
            return _this.state.height + heightToAdd;
        }, _this.reduceHeight = function (heightToRemove) {
            return _this.state.height - heightToRemove;
        }, _this.moveUp = function (heightToAdd) {
            return _this.state.top - heightToAdd;
        }, _this.moveDown = function (downBy) {
            return _this.state.top + downBy;
        }, _this.increaseWidth = function (width) {
            return _this.state.width + width;
        }, _this.reduceWidth = function (width) {
            return _this.state.width - width;
        }, _this.moveLeft = function (left) {
            return _this.state.left - left;
        }, _this.moveRight = function (left) {
            return _this.state.left + left;
        }, _this.getParameters = function (node, dimension) {
            return { node: node, size: dimension };
        }, _this.toDimension = function (state) {
            return {
                width: state.width, height: state.height, left: state.left, top: state.top
            };
        }, _this.onResizeStopState = function () {
            return { resizableHandle: '', resizing: false };
        }, _this.onResizeStartState = function (startX, startY) {
            return { resizing: true, startX: startX, startY: startY };
        }, _this.persistEventIfFunction = function (event) {
            if (typeof event.persist === 'function') {
                event.persist();
            }
        }, _this.hasDimensionChanged = function (_ref5) {
            var width = _ref5.width,
                height = _ref5.height,
                left = _ref5.left,
                top = _ref5.top;

            return width !== _this.state.width || height !== _this.state.height || left !== _this.state.left || top !== _this.state.top;
        }, _this.canDragX = function () {
            return _this.props.axis === 'both' || _this.props.axis === 'x';
        }, _this.canDragY = function () {
            return _this.props.axis === 'both' || _this.props.axis === 'y';
        }, _this.isMouseMovingUp = function (deltaY, y) {
            return deltaY < 0 && y < _this.state.startY;
        }, _this.isMouseMovingDown = function (deltaY, y) {
            return deltaY > 0 && y > _this.state.startY;
        }, _this.isMouseMovingLeft = function (deltaX, x) {
            return deltaX < 0 && x < _this.state.startX;
        }, _this.isMouseMovingRight = function (deltaX, x) {
            return deltaX > 0 && x > _this.state.startX;
        }, _this.resizeStartCallback = function (event, node, dimension) {
            return _this.props.onResizeStart(event, _this.getParameters(node, dimension));
        }, _this.resizeCallback = function (event, node, dimension) {
            return _this.props.onResize(event, _this.getParameters(node, dimension));
        }, _this.resizeStopCallback = function (event, node, dimension) {
            return _this.props.onResizeStop(event, _this.getParameters(node, dimension));
        }, _this.getHandleStyle = function (handleStyle) {
            return _this.props.isActive ? _extends({}, style.resizableHandle, handleStyle) : null;
        }, _this.isResizeHandle = function (handleName) {
            return handleName ? handleName.indexOf('-resizable-handle') !== -1 && handleName.indexOf('react-') !== -1 : false;
        }, _this.assignDomElement = function (element) {
            return _this.domElement = _reactDom2.default.findDOMNode(element);
        }, _this.getRatio = function () {
            return _this.state.width / _this.state.height;
        }, _this.getHeightRatio = function (width, height) {
            return _this.props.lockAspectRatio ? width / _this.getRatio() : height;
        }, _this.runConstraints = function (width, height) {
            return {
                width: _this.getWidthConstraint(width, height),
                height: _this.getHeightConstraint(width, height)
            };
        }, _this.getWidthConstraint = function (width, height) {
            var widthRatio = _this.getWidthRatio(width, height);
            return _this.getWidthSizeConstraints(widthRatio);
        }, _this.getWidthRatio = function (width, height) {
            return _this.props.lockAspectRatio ? height * _this.getRatio() : width;
        }, _this.getHeightConstraint = function (width, height) {
            var heightRatio = _this.getHeightRatio(width, height);
            return _this.getHeightSizeConstraints(heightRatio);
        }, _this.getHeightSizeConstraints = function (height) {
            return Math.min(_this.props.maxConstraints[1], Math.max(_this.props.minConstraints[1], height));
        }, _this.getWidthSizeConstraints = function (width) {
            return Math.max(_this.props.minConstraints[0], Math.min(_this.props.maxConstraints[0], width));
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(Resizable, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.setSizeFromParent();
            this.setPositionFromParent();
        }
    }, {
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (this.state.resizing) {
                return;
            }
            if (nextProps.width !== this.props.width) {
                this.setState({ width: nextProps.width });
            }
            if (nextProps.height !== this.props.height) {
                this.setState({ height: nextProps.height });
            }
            if (nextProps.left !== this.props.left) {
                this.setState({ left: nextProps.left });
            }
            if (nextProps.top !== this.props.top) {
                this.setState({ top: nextProps.top });
            }
        }
    }, {
        key: 'render',
        value: function render() {
            var _props = this.props,
                children = _props.children,
                draggableOpts = _props.draggableOpts,
                p = _objectWithoutProperties(_props, ['children', 'draggableOpts']);

            var className = p.className ? p.className + ' react-resizable' : 'react-resizable';

            return cloneElement(children, _extends({}, p, {
                className: className,
                ref: this.assignDomElement.bind(this),
                children: [children.props.children, _react2.default.createElement(
                    _reactDraggable.DraggableCore,
                    _extends({}, draggableOpts, {
                        key: 'resizableHandle',
                        onStop: this.onResizeStop,
                        onStart: this.onResizeStart,
                        onDrag: this.onResize }),
                    this.renderResizeHandle()
                )]
            }));
        }
    }, {
        key: 'setSizeFromParent',
        value: function setSizeFromParent() {
            if (!this.state.width) {
                this.setState({ width: this.domElement.clientWidth });
            }
            if (!this.state.height) {
                this.setState({ height: this.domElement.clientHeight });
            }
        }
    }, {
        key: 'setPositionFromParent',
        value: function setPositionFromParent() {
            if (!this.state.left) {
                this.setState({ left: this.domElement.offsetLeft });
            }
            if (!this.state.top) {
                this.setState({ top: this.domElement.offsetTop });
            }
        }
    }]);

    return Resizable;
}(_react2.default.Component);

Resizable.propTypes = {
    children: _propTypes2.default.element.isRequired,
    width: _propTypes2.default.number,
    height: _propTypes2.default.number,
    left: _propTypes2.default.number,
    top: _propTypes2.default.number,
    handleSize: _propTypes2.default.array,
    lockAspectRatio: _propTypes2.default.bool,
    axis: _propTypes2.default.oneOf(['both', 'x', 'y', 'none']),
    minConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),
    maxConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),
    onResizeStop: _propTypes2.default.func,
    onResizeStart: _propTypes2.default.func,
    onResize: _propTypes2.default.func,
    draggableOpts: _propTypes2.default.object,
    allResizeHandle: _propTypes2.default.bool,
    isActive: _propTypes2.default.bool
};
Resizable.defaultProps = {
    handleSize: [10, 10],
    lockAspectRatio: false,
    axis: 'both',
    minConstraints: [20, 20],
    maxConstraints: [Infinity, Infinity],
    allResizeHandle: false,
    isActive: false,
    width: 100,
    height: 100,
    left: 0,
    top: 0,
    onResizeStop: function onResizeStop() {},
    onResizeStart: function onResizeStart() {},
    onResize: function onResize() {},
    draggableOpts: {}
};
exports.default = Resizable;


var style = {
    resizableHandle: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        padding: '0px',
        cursor: 'crosshair',
        backgroundColor: 'rgb(25, 172, 218)',
        borderRadius: '50px',
        opacity: 0.7
    },
    sEResizableHandle: {
        bottom: '0',
        right: '0',
        marginBottom: '-5px',
        marginRight: '-5px',
        cursor: 'nwse-resize'
    },
    nWResizableHandle: {
        top: '0',
        left: '0',
        marginTop: '-5px',
        marginLeft: '-5px',
        cursor: 'nwse-resize'
    },
    sWResizableHandle: {
        marginBottom: '-5px',
        marginLeft: '-5px',
        bottom: '0',
        left: '0',
        cursor: 'nesw-resize'
    },
    nEResizableHandle: {
        marginTop: '-5px',
        marginRight: '-5px',
        top: '0',
        right: '0',
        cursor: 'nesw-resize'
    }
};

function cloneElement(element, props) {
    if (props.style && element.props.style) {
        props.style = _extends({}, element.props.style, props.style);
    }
    if (props.className && element.props.className) {
        props.className = element.props.className + ' ' + props.className;
    }
    return _react2.default.cloneElement(element, props);
}