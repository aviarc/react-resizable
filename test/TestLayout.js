import * as React from 'react';
import Resizable from '../lib/Resizable';
import 'style-loader!css-loader!../css/styles.css';

export default class TestLayout extends React.Component<{}, { width: number, height: number }> {
    state = {
        width: 150,
        height: 150,
        left: 200,
        top: 300
    };


    onClick = () => {
        this.setState({width: 150, height: 150});
    };

    onResize = (event, {element, size}) => {
        this.setState(
            {
                width: size.width,
                height: size.height,
                left: size.left,
                top: size.top
            }
        );
    };

    render() {
        return (
            <div>
                <button onClick={this.onClick} style={{'marginBottom': '10px'}}>Reset first element's width/height
                </button>

                <div className="layoutRoot">
                    <Resizable className="box"
                               // minConstraints={[150, 150]}
                               // maxConstraints={[300, 300]}
                               height={this.state.height}
                               width={this.state.width}
                               left={this.state.left}
                               top={this.state.top}
                               onResize={this.onResize}
                               allResizeHandle={true}>
                        <div style={{
                            position: 'absolute',
                            left: this.state.left + 'px',
                            top: this.state.top + 'px',
                            width: this.state.width + 'px',
                            height: this.state.height + 'px',
                            border: '1px solid red',
                            backgroundColor:'green'
                        }}>XXXXXXXXXX
                            XXasdasdasdasdassdddddddddddd
                            asffffffffffffffffff
                            fffffffffffffffffffffasfasdfsdf
                            asdfsdgfsdgfsdg
                        </div>
                    </Resizable>
                </div>
            </div>
        );
    }
}
