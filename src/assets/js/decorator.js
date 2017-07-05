import router from '@/assets/js/router'
import { storage } from 'G'

// 登陆验证修饰器
export function loginValidate(target) {
    let componentWillMount = target.prototype.componentWillMount;
    target.prototype.componentWillMount = function() {
        if (!storage.userData) {
            this.props.history.replace('/login');
            return;
        }
        componentWillMount && this::componentWillMount();
    }
}

// title替换修饰器
export function titleChange(target) {
    let componentWillMount = target.prototype.componentWillMount;
    target.prototype.componentWillMount = function() {
        componentWillMount && this::componentWillMount();
        if (!this.props || !this.props.location) return;
        const curRoute = router.getRoute('path', this.props.location.pathname);
        document.title = this.title = curRoute.label;
    }
}

