import Mock from 'mockjs';
const LoginUsers = [
  {
    id: 1,
    username: 'admin',
    password: '123456',
    avatar: 'https://raw.githubusercontent.com/taylorchen709/markdown-images/master/vueadmin/user.png',
    name: '张某某'
  }
];

const Users = [];

for (let i = 0; i < 86; i++) {
  Users.push(Mock.mock({
    id: Mock.Random.guid(),
    name: Mock.Random.cname(),
    addr: Mock.mock('@county(true)'),
    'age|18-60': 1,
    birth: Mock.Random.date(),
    sex: Mock.Random.integer(0, 1)
  }));
}

// const Menus = [
//   {
//     id: 1,
//     path: '/',
//     component: Home,
//     name: '系统管理',
//     iconCls: 'el-icon-setting',//图标样式class
//     children: [
//         //, hidden: true
//         { path: '/user', component: User, name: '用户管理', iconCls: 'el-icon-menu' },
//         { path: '/role', component: Role, name: '角色管理', iconCls: 'el-icon-menu' },
//         { path: '/menu', component: Menu, name: '菜单管理', iconCls: 'el-icon-menu' },
//     ]
//   },
//   {
//     id: 2,
//     path: '/',
//     component: Home,
//     name: '导航一',
//     iconCls: 'el-icon-mobile-phone',//图标样式class
//     children: [
//         //, hidden: true
//         { path: '/main', component: Main, name: '主页' },
//         { path: '/table', component: Table, name: 'Table' },
//         { path: '/form', component: Form, name: 'Form' },
//         { path: '/users', component: Users, name: '用户' },
//     ]
//   },
//   {
//     id: 3,
//     path: '/',
//     component: Home,
//     name: 'Charts',
//     iconCls: 'fa fa-bar-chart',
//     children: [
//         { path: '/echarts', component: echarts, name: 'echarts' }
//     ]
//   }
// ];

export { LoginUsers, Users };
