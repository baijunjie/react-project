import React from 'react'
import { loginValidate, titleChange } from '@/assets/js/decorator'

const styles = {};

styles.main = {
    marginTop: 40,
    textAlign: 'center'
};

@titleChange
@loginValidate
export default class extends React.Component {
    // 构造器函数
    constructor(props) {
        super(props);

        // 定义组件内使用的 state 数据
        this.state = {
            value: 1
        };
    }

    // 数据渲染完成后
    componentDidMount() {
        this.timeout = setTimeout(this.handleTimeoutEvent.bind(this), 1000);
    }

    // 组件被卸载前
    componentWillUnmount() {
        this.timeout && clearTimeout(this.timeout);
    }

    handleTimeoutEvent() {
        this.setState((prevState, props) => ({
            value: prevState.value + 1
        }), () => {
            this.timeout = setTimeout(this.handleTimeoutEvent.bind(this), 1000);
        });
    }

    render() {
        return (
            <div style={styles.main}>
                <h2>{this.title} : {this.state.value}</h2>
            </div>
        )
    }
}
