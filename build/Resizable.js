'use strict';

exports.__esModule = true;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /*eslint-disable */


var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactDraggable = require('react-draggable');

var _reactDraggable2 = _interopRequireDefault(_reactDraggable);

var _reactDom = require('react-dom');

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function cloneElement(element, props) {
    if (props.style && element.props.style) {
        props.style = _extends({}, element.props.style, props.style);
    }
    if (props.className && element.props.className) {
        props.className = element.props.className + ' ' + props.className;
    }
    return _react2.default.cloneElement(element, props);
}

var Resizable = function (_React$Component) {
    _inherits(Resizable, _React$Component);

    function Resizable() {
        var _temp, _this, _ret;

        _classCallCheck(this, Resizable);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, _React$Component.call.apply(_React$Component, [this].concat(args))), _this), _this.state = {
            resizing: false,
            width: _this.props.width, height: _this.props.height,
            slackW: 0, slackH: 0
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    Resizable.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
        // If parent changes height/width, set that in our state.
        if (!this.state.resizing && (nextProps.width !== this.props.width || nextProps.height !== this.props.height)) {
            this.setState({
                width: nextProps.width,
                height: nextProps.height
            });
        }
    };

    Resizable.prototype.componentDidMount = function componentDidMount() {
        var width = this.domElement.clientWidth;
        var height = this.domElement.clientHeight;
        this.props.onInitialSizeCalculated(width, height);
        this.setState({ width: width, height: height });
    };

    // If you do this, be careful of constraints


    Resizable.prototype.runConstraints = function runConstraints(width, height) {
        var _ref = [this.props.minConstraints, this.props.maxConstraints],
            min = _ref[0],
            max = _ref[1];


        if (this.props.lockAspectRatio) {
            var ratio = this.state.width / this.state.height;
            height = width / ratio;
            width = height * ratio;
        }

        if (!min && !max) {
            return [width, height];
        }

        var oldW = width,
            oldH = height;

        // Add slack to the values used to calculate bound position. This will ensure that if
        // we start removing slack, the element won't react to it right away until it's been
        // completely removed.

        var _state = this.state,
            slackW = _state.slackW,
            slackH = _state.slackH;

        width += slackW;
        height += slackH;

        if (min) {
            width = Math.max(min[0], width);
            height = Math.max(min[1], height);
        }
        if (max) {
            width = Math.min(max[0], width);
            height = Math.min(max[1], height);
        }

        // If the numbers changed, we must have introduced some slack. Record it for the next iteration.
        slackW += oldW - width;
        slackH += oldH - height;
        if (slackW !== this.state.slackW || slackH !== this.state.slackH) {
            this.setState({ slackW: slackW, slackH: slackH });
        }

        return [width, height];
    };

    /**
     * Wrapper around drag events to provide more useful data.
     *
     * @param  {String} handlerName Handler name to wrap.
     * @return {Function}           Handler function.
     */


    Resizable.prototype.resizeHandler = function resizeHandler(handlerName) {
        var _this2 = this;

        return function (e, _ref2) {
            var node = _ref2.node,
                deltaX = _ref2.deltaX,
                deltaY = _ref2.deltaY;


            // Axis restrictions
            var canDragX = _this2.props.axis === 'both' || _this2.props.axis === 'x';
            var canDragY = _this2.props.axis === 'both' || _this2.props.axis === 'y';

            // Update w/h
            var width = _this2.state.width + (canDragX ? deltaX : 0);
            var height = _this2.state.height + (canDragY ? deltaY : 0);

            // Early return if no change
            var widthChanged = width !== _this2.state.width,
                heightChanged = height !== _this2.state.height;
            if (handlerName === 'onResize' && !widthChanged && !heightChanged) {
                return;
            }

            // Set the appropriate state for this handler.
            var _runConstraints = _this2.runConstraints(width, height);

            width = _runConstraints[0];
            height = _runConstraints[1];
            var newState = {};
            if (handlerName === 'onResizeStart') {
                newState.resizing = true;
            } else if (handlerName === 'onResizeStop') {
                newState.resizing = false;
                newState.slackW = newState.slackH = 0;
            } else {
                // Early return if no change after constraints
                if (width === _this2.state.width && height === _this2.state.height) {
                    return;
                }
                newState.width = width;
                newState.height = height;
            }
            _this2.updateState(handlerName, e, newState, node, width, height);
        };
    };

    Resizable.prototype.updateState = function updateState(handlerName, e, newState, node, width, height) {
        var _this3 = this;

        var hasCb = typeof this.props[handlerName] === 'function';
        if (hasCb) {
            if (typeof e.persist === 'function') {
                e.persist();
            }
            this.setState(newState, function () {
                return _this3.props[handlerName](e, { node: node, size: { width: width, height: height } });
            });
            return;
        }
        this.setState(newState);
    };

    Resizable.prototype.assignDomElement = function assignDomElement(element) {
        this.domElement = _reactDom2.default.findDOMNode(element);
    };

    Resizable.prototype.render = function render() {
        var _props = this.props,
            children = _props.children,
            draggableOpts = _props.draggableOpts,
            onInitialSizeCalculated = _props.onInitialSizeCalculated,
            p = _objectWithoutProperties(_props, ['children', 'draggableOpts', 'onInitialSizeCalculated']);

        var className = p.className ? p.className + ' react-resizable' : 'react-resizable';

        // What we're doing here is getting the child of this element, and cloning it with this element's props.
        // We are then defining its children as:
        // Its original children (resizable's child's children), and
        // A draggable handle.
        return cloneElement(children, _extends({}, p, {
            className: className,
            ref: this.assignDomElement.bind(this),
            children: [children.props.children, _react2.default.createElement(
                _reactDraggable2.default,
                _extends({}, draggableOpts, {
                    style: { transform: 'none' },
                    key: 'resizableHandle',
                    onStop: this.resizeHandler('onResizeStop'),
                    onStart: this.resizeHandler('onResizeStart'),
                    onDrag: this.resizeHandler('onResize') }),
                _react2.default.createElement('span', { className: 'react-resizable-handle' })
            )]
        }));
    };

    return Resizable;
}(_react2.default.Component);

Resizable.propTypes = {
    //
    // Required Props
    //

    // Require that one and only one child be present.
    children: _propTypes2.default.element.isRequired,

    // Initial w/h
    height: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),
    width: _propTypes2.default.oneOfType([_propTypes2.default.string, _propTypes2.default.number]),

    //
    // Optional props
    //

    // If you change this, be sure to update your css
    handleSize: _propTypes2.default.array,

    // If true, will only allow width/height to move in lockstep
    lockAspectRatio: _propTypes2.default.bool,

    // Restricts resizing to a particular axis (default: 'both')
    // 'both' - allows resizing by width or height
    // 'x' - only allows the width to be changed
    // 'y' - only allows the height to be changed
    // 'none' - disables resizing altogether
    axis: _propTypes2.default.oneOf(['both', 'x', 'y', 'none']),

    // Min/max size
    minConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),
    maxConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),

    // Callbacks
    onResizeStop: _propTypes2.default.func,
    onResizeStart: _propTypes2.default.func,
    onResize: _propTypes2.default.func,
    onInitialSizeCalculated: _propTypes2.default.func,

    // These will be passed wholesale to react-draggable's DraggableCore
    draggableOpts: _propTypes2.default.object
};
Resizable.defaultProps = {
    handleSize: [20, 20],
    lockAspectRatio: false,
    axis: 'both',
    minConstraints: [20, 20],
    maxConstraints: [Infinity, Infinity],
    onInitialSizeCalculated: function onInitialSizeCalculated() {}
};
exports.default = Resizable;