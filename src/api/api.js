import axios from 'axios';


var token = sessionStorage.getItem("token");
//var qs=require('qs');
var instance = axios.create({
    headers: {'Content-Type': 'application/json','token':token}
});

let base = 'http://localhost:8090/admin';
let base1 = '';

//登录
export const requestLogin = params => { return instance.post(`${base}/sys/login/sign_in`, params).then(res => res.data); };
export const requestLogin1 = params => { return axios.post(`${base1}/login`, params).then(res => res.data); };

//用户列表
export const getUserList = params => { return instance.get(`${base}/sys/user/users`, { params: params }); };

export const getUserListPage = params => { return axios.get(`${base}/user/listpage`, { params: params }); };

export const removeUser = params => { return axios.get(`${base}/user/remove`, { params: params }); };

export const batchRemoveUser = params => { return axios.get(`${base}/user/batchremove`, { params: params }); };

export const editUser = params => { return axios.get(`${base}/user/edit`, { params: params }); };

export const addUser = params => { return axios.get(`${base}/user/add`, { params: params }); };
