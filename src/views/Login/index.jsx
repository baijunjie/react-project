import React from 'react'
import { titleChange } from '@/assets/js/decorator'
import { utils, popup } from 'G'

@titleChange
export default class extends React.Component {
    // 构造器函数
    constructor(props) {
        super(props);

        // 定义组件内使用的 state 数据
        this.state = {
            inputAccount: '',
            inputPassword: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    // input change
    handleChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    // submit
    handleSubmit(event) {
        event.preventDefault();

        var error = false;
        var messages = [];

        if (!this.state.inputAccount) {
            error = true;
            messages.push('账号不能为空');
        }

        if (!this.state.inputPassword) {
             error = true;
             messages.push('密码不能为空');
        }

        if (error) {
            popup.message(messages.join('<br/>'));
            return;
        }

        let btn = event.target;
        btn.disabled = true;
        this.login().then(() => {
            btn.disabled = false;
        }).catch(() => {
            btn.disabled = false;
        });
    }

    // login
    login() {
        // 模拟登录
        popup.loading();
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                let userData = {
                    createDate: Date.now()
                }; // 模拟用户数据
                utils.setStorage('userData', userData);
                resolve();
                alert('login success!');
                this.props.history.push('/');
                popup.loaded();
            }, 500);
        });

        // ajax 登陆
        // utils.ajax({
        //     method: 'POST',
        //     url: 'https://z95nykind4.execute-api.ap-northeast-1.amazonaws.com/dev1/login',
        //     headers: {
        //         'x-api-key': 'O04VyKN6Sp3E5feACSIm92S43J89PLdX3rQOohJ8',
        //         'Content-Type': 'application/json'
        //     },
        //     data: {
        //         'id': this.state.exampleInputEmail1,
        //         'password': this.state.exampleInputPassword1
        //     }
        // }, (res) => {
        //     res.createDate = Date.now(); // 设置创建时间
        //     utils.setStorage('userData', res); // 存入本地
        //     this.props.history.push('/'); // 跳转到首页
        // });
    }

    render() {
        // html 模板
        return (
            <div className="container">
                <div className="row">
                    <div className="col-md-12">
                        <h1 className="page-header">登录</h1>
                        <div className="jumbotron">
                            <p />
                            <form role="form" onSubmit={this.handleSubmit}>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="inputAccount">用户名</label>
                                    <input type="text"
                                           className="form-control"
                                           name="inputAccount"
                                           placeholder="Enter User name"
                                           value={this.state.inputAccount}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                    <label className="control-label" htmlFor="inputPassword">密码</label>
                                    <input type="password"
                                           className="form-control"
                                           name="inputPassword"
                                           placeholder="Enter Password"
                                           value={this.state.inputPassword}
                                           onChange={this.handleChange}/>
                                </div>
                                <div className="form-group">
                                </div>
                                <div className="form-group text-center">
                                    <button className="btn btn-lg btn-success"
                                            name="submit"
                                            role="button"
                                            onClick={this.handleSubmit}>
                                            登录
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
