/**
 * React Router 扩展
 * @author Junjie.Bai
 *
 * router  返回一个 router 的对象，具有以下方法与属性。
 *
 * 方法：
 * - initRoutes  初始化路由配置对象，返回一个 React Router 可用的 routes 配置对象
 * - getRoute    根据 key、value 获取在 routes 中对应的配置对象
 * - findRoute   根据 key、value 获取传入的 routes 中对应的配置对象（用于权限控制的修改，只有在创建 <Route> 组件之前修改才有效）
 * - deleteRoute 根据 key、value 删除传入的 routes 中对应的配置对象（用于权限控制的删除，只有在创建 <Route> 组件之前删除才有效）
 * - matchRoutes 传入一个 route 路由对象，返回一个路由数组，表示从根路由开始到该路由结束，所经过的所有路由组成的数组（用于生成面包屑）
 *
 * 属性：
 * - routes      包含所有路由对象的数组，子父级都在同一数组内（主要用于创建 <Route> 组件）
 * - routeTree   路由树，表示源路由数组，包含子父级关系（主要用于创建 <Menu> 组件）
 *
 */
import pathToRegexp from 'path-to-regexp';

const slashStartReg = new RegExp('^/+');
const slashEndReg = new RegExp('/+$');

const router = {
    initRoutes(routes) {
        router.routeTree = initRoutes(routes);
        return router.routes = toReactRoutes(router.routeTree);
    },

    getRoute(key, value) {
        return findRoute(router.routeTree, key, value);
    },

    findRoute,
    deleteRoute,
    matchRoutes
};

function initRoutes(routes, parentRoute) {
    return routes.map(function(route) {
        route.parent = parentRoute;

        if (!route.component) {
            route.empty = true;
        }

        if (typeof route.path === 'undefined' && route.name) {
            route.path = route.name;
        }

        if (typeof route.path === 'string') {
            if (parentRoute && !slashStartReg.test(route.path)) {
                // 处理相对路径
                route.path = parentRoute.path.replace(slashEndReg, '') + '/' + route.path.replace(slashStartReg, '');
            } else {
                route.path = '/' + route.path.replace(slashStartReg, '');
            }
        }

        if (route.routes && route.routes.length) {
            route.routes = initRoutes(route.routes, route);
        }

        return route;
    });
}

function toReactRoutes(routes) {
    let reactRoutes = [];

    routes.forEach(function(route) {
        if (route.routes && route.routes.length) {
            reactRoutes = reactRoutes.concat(toReactRoutes(route.routes));
        }
        reactRoutes.push(route);
    });

    return reactRoutes;
}

function findRoute(routes, key, value) {
    let targetRoute;
    routes.some(route => {
        if (route[key] === value ||
            key === 'path' &&
            pathToRegexp(route[key]).exec(value)) {
            return targetRoute = route;
        } else if (route.routes && route.routes.length) {
            return targetRoute = findRoute(route.routes, key, value);
        }
    });
    return targetRoute;
}

function deleteRoute(routes, key, value) {
    let targetRoute;
    routes.some((route, i) => {
        if (route[key] === value ||
            key === 'path' &&
            pathToRegexp(route[key]).exec(value)) {
            routes.splice(i, 1);
            return targetRoute = route;
        } else if (route.routes && route.routes.length) {
            return targetRoute = deleteRoute(route.routes, key, value);
        }
    });
    return targetRoute;
}

function matchRoutes(route) {
    let matched = [route];

    while (route.parent) {
        route = route.parent;
        matched.push(route);
    }

    return matched.reverse();
}

export default router;
