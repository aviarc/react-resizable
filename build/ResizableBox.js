'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _Resizable = require('./Resizable.js');

var _Resizable2 = _interopRequireDefault(_Resizable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ResizableBox = function (_React$Component) {
    _inherits(ResizableBox, _React$Component);

    function ResizableBox() {
        var _ref;

        var _temp, _this, _ret;

        _classCallCheck(this, ResizableBox);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = ResizableBox.__proto__ || Object.getPrototypeOf(ResizableBox)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
            width: _this.props.width,
            height: _this.props.height
        }, _this.render = function () {
            return React.createElement(
                _Resizable2.default,
                {
                    handleSize: _this.props.handleSize,
                    width: _this.state.width,
                    height: _this.state.height,
                    onResizeStart: _this.props.onResizeStart,
                    onResize: _this.onResize,
                    onResizeStop: _this.props.onResizeStop,
                    draggableOpts: _this.props.draggableOpts,
                    minConstraints: _this.props.minConstraints,
                    maxConstraints: _this.props.maxConstraints,
                    lockAspectRatio: _this.props.lockAspectRatio,
                    axis: _this.props.axis },
                React.createElement('div', _extends({ style: {
                        width: _this.state.width + 'px',
                        height: _this.state.height + 'px'
                    }
                }, _this.props))
            );
        }, _this.onResize = function (event, data) {
            var size = data.size;

            _this.persistEventIfFunction(event);
            _this.setState(size, _this.resizeCallback(event, data));
        }, _this.resizeCallback = function (event, dimension) {
            return _this.props.onResize(event, dimension);
        }, _this.persistEventIfFunction = function (event) {
            if (typeof event.persist === 'function') {
                event.persist();
            }
        }, _temp), _possibleConstructorReturn(_this, _ret);
    }

    _createClass(ResizableBox, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(nextProps) {
            if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
                this.setState({
                    width: nextProps.width,
                    height: nextProps.height
                });
            }
        }
    }]);

    return ResizableBox;
}(React.Component);

ResizableBox.propTypes = {
    width: _propTypes2.default.number.isRequired,
    height: _propTypes2.default.number.isRequired,
    handleSize: _propTypes2.default.array,
    lockAspectRatio: _propTypes2.default.bool,
    axis: _propTypes2.default.oneOf(['both', 'x', 'y', 'none']),
    minConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),
    maxConstraints: _propTypes2.default.arrayOf(_propTypes2.default.number),
    onResizeStop: _propTypes2.default.func,
    onResizeStart: _propTypes2.default.func,
    onResize: _propTypes2.default.func,
    draggableOpts: _propTypes2.default.object
};
ResizableBox.defaultProps = {
    handleSize: [10, 10],
    lockAspectRatio: false,
    axis: 'both',
    minConstraints: [20, 20],
    maxConstraints: [Infinity, Infinity],
    allResizeHandle: false,
    isActive: false,
    onResizeStop: function onResizeStop() {},
    onResizeStart: function onResizeStart() {},
    onResize: function onResize() {},
    draggableOpts: {}
};
exports.default = ResizableBox;