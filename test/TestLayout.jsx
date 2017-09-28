import * as React from 'react'
import Resizable from '../lib/Resizable.js'
import 'style-loader!css-loader!../css/styles.css'

export default class TestLayout extends React.Component {

    state = {
        width: 150,
        height: 150,
        left: 200,
        top: 300
    };

    render() {
        return (
            <div>
                <button onClick={this.resetState}
                        style={style.button}>
                    Reset width and height
                </button>

                <div className="layoutRoot">clear
                    <Resizable className="box"
                               // height={this.state.height}
                               // width={this.state.width}
                               // left={this.state.left}
                               // top={this.state.top}
                               onResize={this.onResize}
                               allResizeHandle
                               isActive>
                        <div style={{
                            position: 'absolute',
                             left: this.state.left + 'px',
                             top: this.state.top + 'px',
                             width: this.state.width + 'px',
                             height: this.state.height + 'px',
                            border: '1px solid red',
                            backgroundColor: 'green'
                        }}>
                            My cool resizable component
                        </div>
                    </Resizable>
                </div>
            </div>
        )
    }

    onResize = (event, {size}) => {
        this.setState(
            {
                width: size.width,
                height: size.height,
                left: size.left,
                top: size.top
            }
        )
    }

    resetState = () => {
        this.setState({
            width: 150, height: 150,
            left: 200, top: 300
        })
    };

}

const style = {
    button: {
        marginBottom: '10px'
    }
}
