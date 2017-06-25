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
            iam: 'I am',
            name: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // input change
    handleChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value
        }, () => {
            // debug
            console.log(this.state);
        });
    }

    // submit
    handleSubmit(event) {
        event.preventDefault();
        this.props.history.push('/view');
    }

    // 数据渲染前
    componentWillMount() {
        // 修改 state 数据
        this.setState({
            iam: 'I am'
        }, function() {
            // 数据渲染完成后的回调
        });
    }

    // 数据渲染完成后
    componentDidMount() {
        // 基于原先 state 数据进行修改
        this.setState((prevState, props) => ({
            iam: prevState.iam + ' => '
        }));
    }

    // 组件被卸载前
    componentWillUnmount() {

    }

    render() {
        // html 模板
        return (
            <div id="Demo" style={styles.main}>
                <h2>{this.state.iam + ' ' + (this.state.name || this.title)}</h2>
                <input type="text"
                       name="name"
                       value={this.state.name}
                       onChange={this.handleChange}
                       placeholder="输入名字" />
            </div>
        )
    }
}
