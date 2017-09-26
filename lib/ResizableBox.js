/* eslint-disable react/jsx-filename-extension */
import * as React from 'react'
import PropTypes from 'prop-types'
import Resizable from './Resizable.js'

export default class ResizableBox extends React.Component {

    static propTypes = {
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        handleSize: PropTypes.array,
        lockAspectRatio: PropTypes.bool,
        axis: PropTypes.oneOf(['both', 'x', 'y', 'none']),
        minConstraints: PropTypes.arrayOf(PropTypes.number),
        maxConstraints: PropTypes.arrayOf(PropTypes.number),
        onResizeStop: PropTypes.func,
        onResizeStart: PropTypes.func,
        onResize: PropTypes.func,
        draggableOpts: PropTypes.object
    }

    static defaultProps = {
        handleSize: [10, 10],
        lockAspectRatio: false,
        axis: 'both',
        minConstraints: [20, 20],
        maxConstraints: [Infinity, Infinity],
        allResizeHandle: false,
        isActive: false,
        onResizeStop: () => {
        },
        onResizeStart: () => {
        },
        onResize: () => {
        },
        draggableOpts: {}
    }

    state = {
        width: this.props.width,
        height: this.props.height
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.width !== this.props.width || nextProps.height !== this.props.height) {
            this.setState({
                width: nextProps.width,
                height: nextProps.height
            })
        }
    }

    render = () =>
        <Resizable
            handleSize={this.props.handleSize}
            width={this.state.width}
            height={this.state.height}
            onResizeStart={this.props.onResizeStart}
            onResize={this.onResize}
            onResizeStop={this.props.onResizeStop}
            draggableOpts={this.props.draggableOpts}
            minConstraints={this.props.minConstraints}
            maxConstraints={this.props.maxConstraints}
            lockAspectRatio={this.props.lockAspectRatio}
            axis={this.props.axis}>
            <div style={{
                width: this.state.width + 'px',
                height: this.state.height + 'px'
            }}
                 {...this.props}/>
        </Resizable>

    onResize = (event, data) => {
        const {size} = data
        this.persistEventIfFunction(event)
        this.setState(size, this.resizeCallback(event, data))
    }

    resizeCallback = (event, dimension) =>
        this.props.onResize(event, dimension)

    persistEventIfFunction = (event) => {
        if (typeof event.persist === 'function') {
            event.persist()
        }
    }

}
