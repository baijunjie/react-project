import React from 'react'
import { HashRouter as Router } from 'react-router-dom'
import Menu from '@/components/index/Menu'
import Routes from '@/components/index/Routes'
import { utils } from 'G'

// 读取本地缓存的用户数据
if (!utils.sessionTimeoutValidate('userData')) {
    utils.removeStorage('userData');
}

export default class extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Menu/>
                    <Routes/>
                </div>
            </Router>
        )
    }
}
