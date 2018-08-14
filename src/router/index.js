import App from '../pages/App'
import Login from '../pages/infra/login/Login'
import AdminIndexPage from '../pages/dashboard/AdminIndexPage'
import SystemManagePage from './system.route'
import ChannelManagePage from './channel.route'
import BillManagePage from './bill.route'
import InquirePage from './inquire.route'
export default [{
    path: '/',
    redirect: '/index/home'
}, {
    path: '/login',
    name: 'login',
    component: Login
}, {
    path: '/index',
    component: App,
    children: [{
        path: '/index/home',
        name: 'home',
        meta: {
            menuCode: 'HOME'
        },
        component: AdminIndexPage
    },
    ...SystemManagePage,
    ...ChannelManagePage,
    ...BillManagePage,
    ...InquirePage]
}]
