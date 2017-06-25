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
    component: require('@/views/Home').default
};

const Login = {
    label: '登陆',
    name: 'login',
    component: require('@/views/Login').default
};

const Demo = {
    label: 'Demo1',
    name: 'demo1',
    component: require('@/views/Demo').default
};

const Demo2 = {
    label: 'Demo2',
    name: 'demo2',
    component: require('@/views/Demo').default
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
