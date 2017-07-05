import createComponent from '@/assets/js/createComponent';

/**
 * 配置路由
 * label: string  该页面在 menu 中的名称
 * name: string  页面的唯一 name，能与其它页面重复
 * path: string  页面的路径，默认等于 name
 * component: React.Component  页面组件
 */
const Home = {
    label: 'React frame',
    name: 'home',
    path: '/',
    component: createComponent(require('bundle-loader?lazy!@/views/Home'))
};

const Login = {
    label: '登陆',
    name: 'login',
    component: createComponent(require('bundle-loader?lazy!@/views/Login'))
};

const Demo = {
    label: 'Demo1',
    name: 'demo1',
    component: createComponent(require('bundle-loader?lazy!@/views/Demo'))
};

const Demo2 = {
    label: 'Demo2',
    name: 'demo2',
    component: createComponent(require('bundle-loader?lazy!@/views/Demo'))
};

export default [
    {
        ...Home,
        routes: [
            Demo,
            Demo2
        ]
    },
    Login
]
