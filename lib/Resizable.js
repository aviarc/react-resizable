// @flow
import * as React from 'react';
import PropTypes from 'prop-types';
import {DraggableCore} from 'react-draggable';
import cloneElement from './cloneElement';


type Axis = 'both' | 'x' | 'y' | 'none';
type State = {
    resizing: boolean,
    width: number,
    height: number,
    left: number,
    top: number,
    slackW: number,
    slackH: number,
    clientXStart: number,
    clientYStart: number
};
type DragCallbackData = {
    node: HTMLElement,
    x: number,
    y: number,
    deltaX: number,
    deltaY: number,
    lastX: number,
    lastY: number
};
export type ResizeCallbackData = {
    node: HTMLElement,
    size: { width: number, height: number }
};
export type Props = {
    children: React.Element<any>,
    width: number,
    height: number,
    handleSize: [number, number],
    lockAspectRatio: boolean,
    allResizeHandle: boolean,
    axis: Axis,
    minConstraints: [number, number],
    maxConstraints: [number, number],
    onResizeStop?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
    onResizeStart?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
    onResize?: ?(e: SyntheticEvent<>, data: ResizeCallbackData) => any,
    draggableOpts?: ?Object
};

export default class Resizable extends React.Component<Props, State> {
    static propTypes = {
        children: PropTypes.element.isRequired,
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
        draggableOpts: PropTypes.object,
        allResizeHandle: PropTypes.bool,

    };

    static defaultProps = {
        handleSize: [10, 10],
        lockAspectRatio: false,
        axis: 'both',
        minConstraints: [20, 20],
        maxConstraints: [Infinity, Infinity],
        allResizeHandle: false
    };

    state: State = {
        resizing: false,
        width: this.props.width,
        height: this.props.height,
        left: this.props.left,
        top: this.props.top,
        slackW: 0, slackH: 0,
        isActive: true,
        //userStyle: {...this.props.children.props.style},
        extra: 20
    };


    componentWillReceiveProps(nextProps: Object) {
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

    lockAspectRatio(width: number, height: number, aspectRatio: number): [number, number] {
        height = width / aspectRatio;
        width = height * aspectRatio;
        return [width, height];
    }

    runConstraints(width: number, height: number): [number, number] {
        const [min, max] = [this.props.minConstraints, this.props.maxConstraints];

        if (this.props.lockAspectRatio) {
            const ratio = this.state.width / this.state.height;
            height = width / ratio;
            width = height * ratio;
        }

        if (!min && !max) return [width, height];

        const [oldW, oldH] = [width, height];

        // Add slack to the values used to calculate bound position. This will ensure that if
        // we start removing slack, the element won't react to it right away until it's been
        // completely removed.
        let {slackW, slackH} = this.state;
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
        slackW += (oldW - width);
        slackH += (oldH - height);
        if (slackW !== this.state.slackW || slackH !== this.state.slackH) {
            this.setState({slackW, slackH});
        }

        return [width, height];
    }

    getCurrentDimension = (domComponent) => (
        {
            width: this.state.width,
            height: this.state.height,
            left: this.state.left, //parseInt(domComponent.parentElement.style.left),
            top: this.state.top //parseInt(domComponent.parentElement.style.top)
        }
    )

    increaseHeightMoveUp = (currentTop, clientY, y, dimension) => {
        if (y < this.state.startY) {
            let heightToAdd = (currentTop - clientY) + this.state.extra
            if (this.props.maxConstraints[1] &&
                heightToAdd + dimension.height > this.props.maxConstraints[1]) {
                heightToAdd = this.props.maxConstraints[1] - dimension.height
            }
            dimension.height = this.state.height + heightToAdd
            dimension.top = currentTop - heightToAdd
        }
        return dimension
    }

    reduceHeightMoveDown = (currentTop, clientY, y, dimension) => {
        if (y > this.state.startY) {
            let heightToRemove = (clientY - currentTop) - this.state.extra
            if (this.props.minConstraints[1] &&
                dimension.height - heightToRemove < this.props.minConstraints[1]) {
                heightToRemove = 0
            }
            dimension.height = this.state.height - heightToRemove
            dimension.top = currentTop + heightToRemove

        }
        return dimension
    }

    increaseWidthMoveLeft = (currentLeft, clientX, x, dimension) => {
        if (x < this.state.startX) {
            let widthToAdd = (currentLeft - clientX) + this.state.extra
            if (this.props.maxConstraints[0] &&
                widthToAdd + dimension.width > this.props.maxConstraints[0]) {
                widthToAdd = this.props.maxConstraints[0] - dimension.width
            }
            dimension.width = this.state.width + widthToAdd
            dimension.left = currentLeft - widthToAdd
        }
        return dimension
    }

    reduceWidthMoveRight = (currentLeft, clientX, x, dimension) => {
        if (x > this.state.startX) {
            let widthToRemove = (clientX - currentLeft) - this.state.extra
            if (this.props.minConstraints[1] &&
                dimension.width - widthToRemove < this.props.minConstraints[1]) {
                widthToRemove = 0
            }
            dimension.width = this.state.width - widthToRemove
            dimension.left = currentLeft + widthToRemove
        }
        return dimension
    }

    isMouseMovingUp = (clientY, currentTop) => (
        clientY <= currentTop + this.state.extra)

    isMouseMovingLeft = (clientX, currentLeft) => (
        clientX <= currentLeft + this.state.extra)

    getComponentPosition = (node) => (
        [this.state.left, this.state.top]

    )
    getComponentTopPosition = (node) => (
        this.state.top
    )

    getComponentLeftPosition = (node) => (
        this.state.left
    )

    resizeNW = (node, x, y, clientX, clientY) => {
        const [currentLeft, currentTop] = this.getComponentPosition(node)
        let dimension = this.getCurrentDimension(node)

        dimension = (this.isMouseMovingUp(clientY, currentTop) ) ?
            this.increaseHeightMoveUp(currentTop, clientY, y, dimension) :
            this.reduceHeightMoveDown(currentTop, clientY, y, dimension)

        return this.isMouseMovingLeft(clientX, currentLeft) ?
            this.increaseWidthMoveLeft(currentLeft, clientX, x, dimension) :
            this.reduceWidthMoveRight(currentLeft, clientX, x, dimension)
    }

    resizeNE = (node, x, y, clientX, clientY, canDragX, deltaX) => {
        const currentTop = this.getComponentTopPosition(node)
        let dimension = this.getCurrentDimension(node)
        dimension.width = this.state.width + (canDragX ? deltaX : 0);

        return (this.isMouseMovingUp(clientY, currentTop) ) ?
            this.increaseHeightMoveUp(currentTop, clientY, y, dimension) :
            this.reduceHeightMoveDown(currentTop, clientY, y, dimension)
    }

    resizeSW = (node, x, y, clientX, clientY, canDragY, deltaY) => {
        let dimension = this.getCurrentDimension(node)
        const currentLeft = this.getComponentLeftPosition(node)
        dimension.height = this.state.height + (canDragY ? deltaY : 0);

        return this.isMouseMovingLeft(clientX, currentLeft) ?
            this.increaseWidthMoveLeft(currentLeft, clientX, x, dimension) :
            this.reduceWidthMoveRight(currentLeft, clientX, x, dimension)
    }

    resizeSE = (node, deltaY, deltaX, canDragY, canDragX) => {
        let dimension = this.getCurrentDimension(node)
        dimension.height = this.state.height + (canDragY ? deltaY : 0);
        dimension.width = this.state.width + (canDragX ? deltaX : 0);
        return dimension
    }

    isResizeHandle = (handleName) => {
        if (handleName) {
            return handleName.indexOf('-resizable-handle') != -1 && handleName.indexOf('react-') != -1
        } else {
            return false
        }
    }

    getDimensionAcordingToMousePosition = (handleName, node, x, y, clientX, clientY, canDragX, canDragY, deltaX, deltaY) => {
        switch (handleName) {
            case 'react-nw-resizable-handle':
                return this.resizeNW(node, x, y, clientX, clientY)
            case 'react-ne-resizable-handle':
                return this.resizeNE(node, x, y, clientX, clientY, canDragX, deltaX)
            case 'react-sw-resizable-handle':
                return this.resizeSW(node, x, y, clientX, clientY, canDragY, deltaY)
            case 'react-resizable-handle':
            case 'react-se-resizable-handle':
                return this.resizeSE(node, deltaY, deltaX, canDragY, canDragX)
            default :
                return null
        }

    }

    onResize = (event, {node, deltaX, deltaY, x, y}) => {
        const canDragX = this.props.axis === 'both' || this.props.axis === 'x';
        const canDragY = this.props.axis === 'both' || this.props.axis === 'y';

        let width = this.state.width
        let height = this.state.height
        let left = this.state.left
        let top = this.state.top

        if (this.isResizeHandle(this.state.resizableHandle)) {
            const dimension = this.getDimensionAcordingToMousePosition(this.state.resizableHandle,
                node, x, y, event.clientX, event.clientY,
                canDragX, canDragY, deltaX, deltaY)

            width = dimension.width
            height = dimension.height
            top = dimension.top
            left = dimension.left
        }

        [width, height] = this.runConstraints(width, height)

        if (!this.hasDimensionChanged(width, height, left, top)) {
            return;
        }

        const resizeState = this.onResizeState(width,height,left,top)

        if (!this.onResize) {
            this.setState(resizeState);
            return
        }

        this.persistEventIfFunction(event)

        this.setState(resizeState, () =>
            this.props.onResize(event,
                {
                    node,
                    size: this.getDimension(resizeState)
                }));

    }

    onResizeStop = (event, {node, deltaX, deltaY, x, y}) => {
        if (!this.props.onResizeStop) {
            this.setState(this.onResizeStopState());
            return
        }

        this.persistEventIfFunction(event)

        this.setState(this.onResizeStopState(), () =>
            this.props.onResizeStop(event,
                {
                    node,
                    size: this.getDimension(this.state)
                })
        );
    }

    onResizeStart = (event, {node, deltaX, deltaY, x, y}) => {

        if (this.isResizeHandle(event.target.className)) {
            this.setState({resizableHandle: event.target.className})
        }

        const resizeStartState = this.onResizeStartState(x, y)

        if (!this.props.onResizeStart) {
            this.setState(resizeStartState);
            return
        }

        this.persistEventIfFunction(event)

        this.setState(resizeStartState, () =>
            this.props.onResizeStart(event,
                {
                    node,
                    size: this.getDimension(this.state)
                }
            ));
    }

    getDimension = (state) => (
        {width: state.width, height: state.height, left: state.left, top: state.top}
    )


    onResizeState = (width, height, left, top) => (
        {width, height, left, top}
    )

    onResizeStopState = () => (
        {resizableHandle: '', resizing: false, slackW: 0, slackH: 0}
    )

    onResizeStartState = (startX, startY) => (
        {resizing: true, startX: startX, startY: startY}
    )

    persistEventIfFunction = (event) => {
        if (typeof event.persist === 'function') {
            event.persist();
        }
    }

    hasCallback = (callbackFunctionName) => (
        typeof this.props[callbackFunctionName] === 'function'
    )

    hasDimensionChanged = (width, height, left, top) => {
        return width !== this.state.width ||
            height !== this.state.height ||
            left !== this.state.left ||
            top !== this.state.top
    }


    render(): React.Node {
        // eslint-disable-next-line no-unused-vars
        const {
            children, draggableOpts, width, height, handleSize,
            lockAspectRatio, axis, minConstraints, maxConstraints, onResize,
            onResizeStop, onResizeStart, ...p
        } = this.props;

        const className = p.className ?
            `${p.className} react-resizable` :
            'react-resizable';


        // What we're doing here is getting the child of this element, and cloning it with this element's props.
        // We are then defining its children as:
        // Its original children (resizable's child's children), and
        // A draggable handle.
        return cloneElement(children, {
            ...p,
            //className,
            //style: {...style , ...this.getStyle()},
            //onClick: this.toggleActive,
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
        });
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

// toggleActive = () => {
//     this.setState({isActive: !this.state.isActive})
// }

    getStyle = () => (
        this.state.isActive ? style.selectedStyle : null

    )

    getHandleStyle = (handleStyle) =>
        this.state.isActive ? {...style.resizableHandle, ...handleStyle} : null
}

const style = {
    selectedStyle: {
        position: 'absolute',
        border: '1px blue solid',
        overflow: 'hidden' //change to visible to allow resize handles to show outside of parent box
    },
    resizableHandle: {
        position: 'absolute',
        width: '10px',
        height: '10px',
        padding: '0px',
        cursor: 'crosshair',
        backgroundColor: 'blue',
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
