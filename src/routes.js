import lazyComponent from '@/assets/js/lazyComponent';

/**
 * 配置路由
 * title: string  该页面的标题
 * name: string  页面的唯一 name，能与其它页面重复
 * path: string  页面的路径，默认等于 name
 * component: React.Component  页面组件
 */
const Home = {
    title: 'React frame',
    name: 'home',
    path: '/',
    component: lazyComponent(require('bundle-loader?lazy!@/views/Home'))
};

const Login = {
    title: '登陆',
    name: 'login',
    component: lazyComponent(require('bundle-loader?lazy!@/views/Login'))
};

const p404 = {
    title: '404',
    name: '404',
    path: '*',
    component: lazyComponent(require('bundle-loader?lazy!@/views/404'))
};

const Demo = {
    title: 'Demo1',
    name: 'demo1',
    component: lazyComponent(require('bundle-loader?lazy!@/views/Demo'))
};

const Demo2 = {
    title: 'Demo2',
    name: 'demo2',
    component: lazyComponent(require('bundle-loader?lazy!@/views/Demo'))
};

export default [
    {
        ...Home,
        routes: [
            Demo,
            Demo2
        ]
    },
    Login,
    p404
]
