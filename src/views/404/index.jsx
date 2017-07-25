import React from 'react'
import { loginValidate, titleChange } from '@/assets/js/decorator'
import './styles.less'

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
            name: '404',
            msg: '你访问的页面未找到！'
        };
    }

    render() {
        // html 模板
        return (
            <div id="p404" style={styles.main}>
                <h2>{this.state.name}</h2>
                <h4>{this.state.msg}</h4>
            </div>
        )
    }
}
