import React from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import router from '@/assets/js/router'
import routes from '@/routes'

router.setRoutes(routes);

export default class extends React.Component {
    render() {
        return (
            <Switch>
                { router.routes.map((route, i) => (
                    route.from && <Redirect key={i} from={route.from} to={route.path} exact />
                )) }
                { router.routes.map((route, i) => (
                    <Route key={i} {...route} exact />
                )) }
            </Switch>
        )
    }
}
