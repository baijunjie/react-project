import React from 'react'
import { Route, Link } from 'react-router-dom'
import router from '@/assets/js/router'
import { utils } from 'G'
import './styles.less'

const HashLink = ({ path, title, exact, className }) => (
    <Route path={path} exact={exact} children={({ match }) => (
        <li className={match ? 'active' : ''}>
            {
                match && match.isExact ?
                <a className={className} href="javascript:;">{title}</a> :
                <Link className={className} to={path}>{title}</Link>
            }
        </li>
    )}/>
);

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.home = router.routeTree[0];
        this.menus = this.home.routes;
    }

    render() {
        return (
            <nav className="navbar navbar-inverse">
                <div className="container">
                    {
                        utils.getStorage('userData') &&
                        <a id="logout"
                           className="logout glyphicon glyphicon-off"
                           onClick={utils.logout}></a>
                    }

                    <div className="navbar-header">
                        <button type="button"
                                className="navbar-toggle collapsed"
                                data-toggle="collapse"
                                data-target="#navbar"
                                aria-expanded="false"
                                aria-controls="navbar">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                            <span className="icon-bar"></span>
                        </button>
                        <HashLink className="navbar-brand" path={this.home.path} title={this.home.title} />
                    </div>
                    <div id="navbar" className="collapse navbar-collapse">
                        <ul className="nav navbar-nav">
                            {
                                utils.getStorage('userData') &&
                                this.menus.map((item, i) => (
                                    <HashLink key={i} {...item} />
                                ))
                            }
                        </ul>
                    </div>
                </div>
            </nav>
        )
    }
}
