import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Form from './views/nav1/Form.vue'
import Users from './views/nav1/User.vue'
import User from './views/system/User.vue'
import Role from './views/system/Role.vue'
import Menu from './views/system/Menu.vue'
import Config from './views/system/Config.vue'
import Dictionary from './views/system/Dictionary.vue'
import Schedule from './views/system/Schedule.vue'
import ApiManage from './views/system/ApiManage.vue'
import SqlManage from './views/system/SqlManage.vue'

import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import Page6 from './views/nav3/Page6.vue'
import echarts from './views/charts/echarts.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/0',
        component: Home,
        name: '系统管理',
        iconCls: 'el-icon-setting',//图标样式class
        children: [
            //, hidden: true
            { path: '/user', components: { user : User}, name: '用户管理', iconCls: 'el-icon-menu' },
            { path: '/role', components: { role : Role}, name: '角色管理', iconCls: 'el-icon-menu' },
            { path: '/menu', components: { navmenu : Menu}, name: '菜单管理', iconCls: 'el-icon-menu' },
            { path: '/config', components: { config : Config}, name: '配置管理', iconCls: 'el-icon-menu' },
            { path: '/dictionary', components: { dictionary : Dictionary}, name: '字典管理', iconCls: 'el-icon-menu' },
            { path: '/schedule', components: { schedule : Schedule}, name: '定时任务', iconCls: 'el-icon-menu' },
            { path: '/echarts', components: {echarts:echarts}, name: 'echarts' },
            { path: '/api', components: {apiManage : ApiManage}, name: '接口管理' },
            { path: '/sql', components: {sqlManage : SqlManage}, name: 'SQL监控' }
            
        ]
    },
    {
        path: '/1',
        component: Home,
        name: '导航一',
        iconCls: 'el-icon-mobile-phone',//图标样式class
        children: [
            //, hidden: true
            { path: '/main', components: { main : Main}, name: '主页' },
            { path: '/table', components: { table : Table}, name: 'Table' },
            { path: '/form', components: { form : Form}, name: 'Form' },
            { path: '/users', components: { user : Users}, name: '用户' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '流程管理',
        iconCls: '',//图标样式class
        children: [
            //, hidden: true
            { path: '/flowInstance', components: { main : Form}, name: '流程实例' },
            { path: '/taskHistory', components: { table : Form}, name: '历史任务' },
            { path: '/flowHistory', components: { form : echarts}, name: '历史流程' },
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '导航二',
    //     iconCls: 'fa fa-id-card-o',
    //     children: [
    //         { path: '/page4', component: Page4, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'fa fa-address-card',
    //     leaf: true,//只有一个节点
    //     children: [
    //         { path: '/page6', component: Page6, name: '导航三' }
    //     ]
    // },
    // {
    //     path: '/2',
    //     components: {
    //         home : Home
    //     },
    //     name: 'Charts',
    //     iconCls: 'fa fa-bar-chart',
    //     children: [
    //         //{ path: '/echarts', components: {echarts:echarts}, name: 'echarts' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
