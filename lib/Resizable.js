import React from 'react'
import PropTypes from 'prop-types'
import {DraggableCore} from 'react-draggable'
import ReactDOM from 'react-dom'

export default class Resizable extends React.Component {

    static propTypes = {
        children: PropTypes.element.isRequired,
        width: PropTypes.number.isRequired,
        height: PropTypes.number.isRequired,
        left: PropTypes.number,
        top: PropTypes.number,
        handleSize: PropTypes.array,
        lockAspectRatio: PropTypes.bool,
        axis: PropTypes.oneOf(['both', 'x', 'y', 'none']),
        minConstraints: PropTypes.arrayOf(PropTypes.number),
        maxConstraints: PropTypes.arrayOf(PropTypes.number),
        onResizeStop: PropTypes.func,
        onResizeStart: PropTypes.func,
        onResize: PropTypes.func,
        draggableOpts: PropTypes.object,
        allResizeHandle: PropTypes.bool,
        isActive: PropTypes.bool
    }

    static defaultProps = {
        handleSize: [10, 10],
        lockAspectRatio: false,
        axis: 'both',
        minConstraints: [20, 20],
        maxConstraints: [Infinity, Infinity],
        allResizeHandle: false,
        isActive: false,
        left:0,
        top:0,
        onResizeStop: () => {
        },
        onResizeStart: () => {
        },
        onResize: () => {
        },
        draggableOpts: {}
    }

    state = {
        resizing: false,
        width: this.props.width,
        height: this.props.height,
        left: this.props.left,
        top: this.props.top
    }

    componentDidMount() {
        const width = this.domElement.clientWidth
        const height = this.domElement.clientHeight
        // eslint-disable-next-line react/no-did-mount-set-state
        this.setState({width, height})
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.resizing) {
            return
        }
        if (nextProps.width !== this.props.width) {
            this.setState({width: nextProps.width})
        }
        if (nextProps.height !== this.props.height) {
            this.setState({height: nextProps.height})
        }
        if (nextProps.left !== this.props.left) {
            this.setState({left: nextProps.left})
        }
        if (nextProps.top !== this.props.top) {
            this.setState({top: nextProps.top})
        }
    }

    render() {
        const {children, draggableOpts, ...p} = this.props
        const className = p.className ?
            `${p.className} react-resizable` :
            'react-resizable'

        return cloneElement(children, {
            ...p,
            className,
            ref: this.assignDomElement.bind(this),
            children: [
                children.props.children,
                <DraggableCore {...draggableOpts}
                               key="resizableHandle"
                               onStop={this.onResizeStop}
                               onStart={this.onResizeStart}
                               onDrag={this.onResize}>
                    {this.renderResizeHandle()}
                </DraggableCore>
            ]
        })
    }

    renderResizeHandle = () =>
        this.props.allResizeHandle ? this.renderAllResizeHandles() : this.renderOneResizeHandle()

    renderOneResizeHandle = () => (
        <span style={this.getHandleStyle(style.sEResizableHandle)}
              className="react-resizable-handle"/>
    )

    renderAllResizeHandles = () => (
        <div className="react-resizable-handle-dont-drag-me">
           <span style={this.getHandleStyle(style.sWResizableHandle)}
                 className="react-sw-resizable-handle"/>
            <span style={this.getHandleStyle(style.sEResizableHandle)}
                  className="react-resizable-handle"/>
            <span style={this.getHandleStyle(style.nWResizableHandle)}
                  className="react-nw-resizable-handle"/>
            <span style={this.getHandleStyle(style.nEResizableHandle)}
                  className="react-ne-resizable-handle"/>
        </div>
    )

    onResize = (event, {node, deltaX, deltaY, x, y}) => {
        if (!this.isResizeHandle(this.state.resizableHandle)) {
            return
        }
        const dimension = this.getDimension(x, y, deltaX, deltaY)
        const {width, height} = this.runConstraints(dimension.width, dimension.height)

        dimension.width = width
        dimension.height = height

        if (!this.hasDimensionChanged(dimension)) {
            return
        }

        this.persistEventIfFunction(event)
        this.setState(dimension, this.resizeCallback(event, node, dimension))
    }

    onResizeStart = (event, {node, x, y}) => {
        if (this.isResizeHandle(event.target.className)) {
            this.setState({resizableHandle: event.target.className})
        }
        const resizeStartState = this.onResizeStartState(x, y)
        this.persistEventIfFunction(event)
        this.setState(resizeStartState, this.resizeStartCallback(event, node, this.toDimension(this.state)))
    }

    onResizeStop = (event, {node}) => {
        this.persistEventIfFunction(event)
        this.setState(this.onResizeStopState(), this.resizeStopCallback(event, node, this.toDimension(this.state)))
    }

    getDimension = (x, y, deltaX, deltaY) => {
        switch (this.state.resizableHandle) {
            case 'react-nw-resizable-handle':
                return this.resizeFromTopLeftCorner(x, y, deltaX, deltaY)
            case 'react-ne-resizable-handle':
                return this.resizeFromTopRightCorner(x, y, deltaX, deltaY)
            case 'react-sw-resizable-handle':
                return this.resizeFromBottomLeftCorner(x, y, deltaY, deltaX)
            case 'react-resizable-handle':
            case 'react-se-resizable-handle':
                return this.resizeFromBottomRightCorner(deltaX, deltaY)
            default :
                return null
        }
    }

    resizeFromTopLeftCorner = (x, y, deltaX, deltaY) => ({
        left: this.calculateLeft(deltaX, x),
        top: this.calculateTop(deltaY, y),
        width: this.calculateWidth(deltaX, x),
        height: this.calculateHeight(deltaY, y)
    })

    resizeFromTopRightCorner = (x, y, deltaX, deltaY) => ({
        left: this.state.left,
        top: this.calculateTop(deltaY, y),
        width: this.state.width + (this.canDragX() ? deltaX : 0),
        height: this.calculateHeight(deltaY, y)
    })

    resizeFromBottomRightCorner = (deltaX, deltaY) => ({
        left: this.state.left,
        top: this.state.top,
        width: this.state.width + (this.canDragX() ? deltaX : 0),
        height: this.state.height + (this.canDragY() ? deltaY : 0)
    })

    resizeFromBottomLeftCorner = (x, y, deltaY, deltaX) => ({
        left: this.calculateLeft(deltaX, x),
        top: this.state.top,
        width: this.calculateWidth(deltaX, x),
        height: this.state.height + (this.canDragY() ? deltaY : 0)
    })

    calculateTop = (deltaY, y) => {
        if (this.isMouseMovingUp(deltaY, y)) {
            const heightToAdd = this.getHeightToAdd(deltaY)
            return this.moveUp(heightToAdd)
        }

        if (this.isMouseMovingDown(deltaY, y)) {
            const heightToRemove = this.getHeightToRemove(deltaY)
            return this.moveDown(heightToRemove)
        }

        return this.state.top
    }

    calculateHeight = (deltaY, y) => {
        if (this.canDragY() && this.isMouseMovingUp(deltaY, y)) {
            const heightToAdd = this.getHeightToAdd(deltaY)
            return this.increaseHeight(heightToAdd)

        }
        if (this.canDragY() && this.isMouseMovingDown(deltaY, y)) {
            const heightToRemove = this.getHeightToRemove(deltaY)
            return this.reduceHeight(heightToRemove)
        }
        return this.state.height
    }

    calculateLeft = (deltaX, x) => {
        if (this.isMouseMovingLeft(deltaX, x)) {
            const widthToAdd = this.getWidthToAdd(deltaX)
            return this.moveLeft(widthToAdd)
        }

        if (this.isMouseMovingRight(deltaX, x)) {
            const widthToRemove = this.getWidthToRemove(deltaX)
            return this.moveRight(widthToRemove)
        }
        return this.state.left
    }

    calculateWidth = (deltaX, x) => {
        if (this.canDragX() && this.isMouseMovingLeft(deltaX, x)) {
            const widthToAdd = this.getWidthToAdd(deltaX)
            return this.increaseWidth(widthToAdd)
        }

        if (this.canDragX() && this.isMouseMovingRight(deltaX, x)) {
            const widthToRemove = this.getWidthToRemove(deltaX)
            return this.reduceWidth(widthToRemove)
        }

        return this.state.width
    }

    getHeightToAdd = (deltaY) => {
        let heightToAdd = Math.abs(deltaY)
        if (this.props.maxConstraints[1] && heightToAdd + this.state.height > this.props.maxConstraints[1]) {
            heightToAdd = this.props.maxConstraints[1] - this.state.height
        }
        return heightToAdd
    }

    getHeightToRemove = (deltaY) => {
        let heightToRemove = deltaY
        if (this.props.minConstraints[1] &&
            this.state.height - heightToRemove < this.props.minConstraints[1]) {
            heightToRemove = 0
        }
        return heightToRemove
    }

    getWidthToAdd = (deltaX) => {
        let widthToAdd = Math.abs(deltaX)
        if (this.props.maxConstraints[0] &&
            widthToAdd + this.state.width > this.props.maxConstraints[0]) {
            widthToAdd = this.props.maxConstraints[0] - this.state.width
        }
        return widthToAdd
    }

    getWidthToRemove = (deltaX) => {
        let widthToRemove = deltaX
        if (this.props.minConstraints[1] &&
            this.state.width - widthToRemove < this.props.minConstraints[1]) {
            widthToRemove = 0
        }
        return widthToRemove
    }

    increaseHeight = (heightToAdd) =>
        this.state.height + heightToAdd

    reduceHeight = (heightToRemove) =>
        this.state.height - heightToRemove

    moveUp = (heightToAdd) =>
        this.state.top - heightToAdd

    moveDown = (downBy) =>
        this.state.top + downBy

    increaseWidth = (width) =>
        this.state.width + width

    reduceWidth = (width) =>
        this.state.width - width

    moveLeft = (left) =>
        this.state.left - left

    moveRight = (left) =>
        this.state.left + left

    getParameters = (node, dimension) =>
        ({node, size: dimension})

    toDimension = (state) =>({
        width: state.width, height: state.height, left: state.left, top: state.top
    })

    onResizeStopState = () =>
        ({resizableHandle: '', resizing: false})

    onResizeStartState = (startX, startY) =>
        ({resizing: true, startX, startY})

    persistEventIfFunction = (event) => {
        if (typeof event.persist === 'function') {
            event.persist()
        }
    }

    hasDimensionChanged = ({width, height, left, top}) => {
        return width !== this.state.width ||
            height !== this.state.height ||
            left !== this.state.left ||
            top !== this.state.top
    }

    canDragX = () =>
        this.props.axis === 'both' || this.props.axis === 'x'

    canDragY = () =>
        this.props.axis === 'both' || this.props.axis === 'y'

    isMouseMovingUp = (deltaY, y) =>
        deltaY < 0 && y < this.state.startY

    isMouseMovingDown = (deltaY, y) =>
        deltaY > 0 && y > this.state.startY

    isMouseMovingLeft = (deltaX, x) =>
        deltaX < 0 && x < this.state.startX

    isMouseMovingRight = (deltaX, x) =>
        deltaX > 0 && x > this.state.startX

    resizeStartCallback = (event, node, dimension) =>
        this.props.onResizeStart(event, this.getParameters(node, dimension))

    resizeCallback = (event, node, dimension) =>
        this.props.onResize(event, this.getParameters(node, dimension))

    resizeStopCallback = (event, node, dimension) =>
        this.props.onResizeStop(event, this.getParameters(node, dimension))

    getHandleStyle = (handleStyle) =>
        this.props.isActive ? {...style.resizableHandle, ...handleStyle} : null

    isResizeHandle = (handleName) =>
        handleName ? handleName.indexOf('-resizable-handle') !== -1 && handleName.indexOf('react-') !== -1 : false

    assignDomElement = (element) =>
        this.domElement = ReactDOM.findDOMNode(element)

    getRatio = () =>
        this.state.width / this.state.height

    getHeightRatio = (width, height) =>
        this.props.lockAspectRatio ? width / this.getRatio() : height

    runConstraints = (width, height) => ({
        width: this.getWidthConstraint(width, height),
        height: this.getHeightConstraint(width, height)
    })

    getWidthConstraint = (width, height) => {
        const widthRatio = this.getWidthRatio(width, height)
        return this.getWidthSizeConstraints(widthRatio)
    }

    getWidthRatio = (width, height) =>
        this.props.lockAspectRatio ? height * this.getRatio() : width

    getHeightConstraint = (width, height) => {
        const heightRatio = this.getHeightRatio(width, height)
        return this.getHeightSizeConstraints(heightRatio)
    }

    getHeightSizeConstraints = (height) =>
        Math.min(this.props.maxConstraints[1], Math.max(this.props.minConstraints[1], height))

    getWidthSizeConstraints = (width) =>
        Math.max(this.props.minConstraints[0], Math.min(this.props.maxConstraints[0], width))

}

const style = {
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
}

function cloneElement(element, props: Object) {
    if (props.style && element.props.style) {
        props.style = {...element.props.style, ...props.style}
    }
    if (props.className && element.props.className) {
        props.className = `${element.props.className} ${props.className}`
    }
    return React.cloneElement(element, props)
}
