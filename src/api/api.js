import axios from 'axios';

var instance = axios.create({
    headers: {'Content-Type': 'application/json'}
});

let base = 'http://localhost:8090/admin';

//登录
export const requestLogin = params => { return instance.post(`${base}/sys/login/sign_in`, params).then(res => res.data); };

//用户管理接口
export const getUserList = params => { return instance.get(`${base}/sys/user/users`, { params: params }); };
export const getUserListPage = params => { return instance.get(`${base}/sys/user/users`, { params: params }); };
export const addUser = params => { return instance.post(`${base}/sys/user/user`, params).then(res => res.data); };
export const editUser = params => { return instance.put(`${base}/sys/user/user`,  params).then(res => res.data); };
export const batchRemoveUser = params => { return instance.delete(`${base}/sys/user/user/${params}`, params).then(res => res.data); };

//菜单管理接口
export const getMenuList = params => { return instance.get(`${base}/sys/menus`, {}); };
export const getParentTrees = params => { return instance.get(`${base}/sys/menu/parentTrees`, {}); };
export const addMenu = params => { return instance.post(`${base}/sys/menu`, params).then(res => res.data); };
export const editMenu = params => { return instance.put(`${base}/sys/menu`, params).then(res => res.data); };
export const deleteMenu = params => { return instance.delete(`${base}/sys/menu/${params}`, params).then(res => res.data); };


// http request 请求拦截器，有token值则配置上token值
instance.interceptors.request.use((request, _this) => {
    var token = sessionStorage.getItem("token");
    if (token) {
        // 每次发送请求之前判断是否存在token，如果存在，则统一在http请求的header都加上token，不用每次请求都手动添加了
        request.headers.common['token'] =token;
        //config.headers.Authorization = token;
    }
    return request;
});
// http response 服务器响应拦截器，这里拦截401错误，并重新跳入登页重新获取token
instance.interceptors.response.use(response => {
  var code = response.data.code;
  if(code && code == 401) {
    window.location.href = '/#/login' ;
    console.log('请从新登陆');
  }
  return response;
});


//原始网上代码
// axios.interceptors.response.use(
//     response => {
//         return response;
//     },
//     error => {
//         if (error.response) {
//             switch (error.response.status) {
//                 case 401:
//                     // 这里写清除token的代码
//                     router.replace({
//                         path: 'login',
//                         query: {redirect: router.currentRoute.fullPath}//登录成功后跳入浏览的当前页面
//                     })
//             }
//         }
//         return Promise.reject(error.response.data)
//     });
