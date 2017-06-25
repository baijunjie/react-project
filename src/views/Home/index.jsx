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

        };
    }

    // 数据渲染完成后
    componentDidMount() {

    }

    // 组件被卸载前
    componentWillUnmount() {

    }

    render() {
        return (
            <div style={styles.main}>
                <h2>{this.title}</h2>
            </div>
        )
    }
}
