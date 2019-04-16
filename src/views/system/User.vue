<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="姓名"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="username" label="账号" width="150" sortable>
			</el-table-column>
			<el-table-column prop="name" label="姓名" width="200" sortable>
			</el-table-column>
			<el-table-column prop="mobile" label="手机号" width="190" sortable>
			</el-table-column>
			<el-table-column prop="email" label="邮箱" sortable>
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150" :filters="[{ text: '启用', value: 1 }, { text: '禁用', value: 0 }]" :filter-method="filterTag"  sortable>
				<template slot-scope="scope">
					<el-tag :type="scope.row.status === 1 ? 'success' : 'danger'" disable-transitions ><div v-if="scope.row.status === 1">启用</div><div v-else-if="scope.row.status === 0">禁用</div></el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150" >
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="姓名" prop="name" label-width="80px">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="账号" prop="username">
					<el-input v-model="editForm.username" auto-complete="off" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="editForm.mobile" auto-complete="off" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="editForm.email" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch active-value="ENABLE" inactive-value="DISABLE" v-model="editForm.status"></el-switch>
				</el-form-item>
				<el-form-item label="角色" prop="roleIds">
					<el-select v-model="editForm.roleIds" multiple placeholder="请选择" size="medium">
						<el-option v-for="item in roleDropList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible"  width="30%">
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="姓名" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="账号" prop="username">
					<el-input v-model="addForm.username" ></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password">
					<el-input v-model="addForm.password" type="password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input v-model="addForm.password2" type="password"></el-input>
				</el-form-item>
				<el-form-item label="手机" prop="mobile">
					<el-input v-model="addForm.mobile" maxlength="11"></el-input>
				</el-form-item>
				<el-form-item label="邮箱" prop="email">
					<el-input v-model="addForm.email" ></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="status">
					<el-switch active-value="ENABLE" inactive-value="DISABLE" v-model="addForm.status"></el-switch>
				</el-form-item>
				<el-form-item label="角色" prop="roleIds">
					<el-select v-model="addForm.roleIds" multiple aria-readonly="false" placeholder="请选择">
						<el-option v-for="item in roleDropList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	import { getUserListPage, removeUser, batchRemoveUser, editUser, addUser, getRoleDropList, getUserInfo } from '../../api/api';

	export default {
		data() {
			var checkPassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.addForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			var checkEmail = (rule, value, callback) => {
				const mailReg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
				if (value === '' || value == null) {
					callback();
				} else if (!mailReg.test(value)) {
					callback(new Error('邮箱格式不正确!'));
				} else {
					callback();
				}
			};
			var checkMobile = (rule, value, callback) => {
				const phoneReg = /^1[3|4|5|7|8][0-9]{9}$/;
				if (value === '') {
					callback(new Error('请输入手机号'));
				} else if (!phoneReg.test(value)) {
					callback(new Error('手机格式不正确'));
				} else {
					callback();
				}
			};
			return {
				filters: {
					name: ''
				},
				users: [],
				roleDropList: [],
				total: 0,
				page: 1,
				size: 10,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					mobile: [
						{ validator: checkMobile, trigger: 'blur' }
					],
					email: [
						{ validator: checkEmail, trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					mobile: '',
					email: '',
					status: 'ENABLE',
					roleIds: []
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
					username: [
						{ required: true, message: '请输入账号', trigger: 'blur' }
					],
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					password2: [
						{ validator: checkPassword, trigger: ['blur','change'] }
					],
					mobile: [
						{ validator: checkMobile, trigger: 'blur' }
					],
					email: [
						{ validator: checkEmail, trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					username: '',
					password: '',
					password2: '',
					mobile: '',
					email: '',
					status: 'ENABLE',
					roleIds: []
				}

			}
		},
		methods: {
			filterTag(value, row) {
				debugger;
				return row.status === value;
			},
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			//获取用户列表
			getUsers() {
				let para = {
                    size: this.size,
					current: this.page,
					usernameOrName: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getUserListPage(para).then((res) => {
					this.total = res.data.total;
          			this.size = res.data.size;
          			//如果请求页数大于当前最高页数，这把页数请求定位到最后一页
					if(res.data.current>res.data.pages){
						this.page = res.data.pages;
						this.getUsers();
					}else{
						this.page = res.data.current;
					}
					this.users = res.data.records;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					batchRemoveUser(row.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						let {msg, code, data} = res;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$message({
								message: msg,
								type: 'error'
							});
						}
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;

				//回显数据
				this.editForm.id = row.id;
				this.editForm.name = row.name;
				this.editForm.email = row.email;
				this.editForm.mobile = row.mobile;
				if(row.status===1){
					this.editForm.status = 'ENABLE';
				}else{
					this.editForm.status = 'DISABLE';
				}
				let _this = this;
				getRoleDropList().then((res) => {
					_this.roleDropList=res.data;
				});
				
				getUserInfo(row.id).then((res) => {
					_this.editForm.roleIds=res.data.roleIdList;
				});
				
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					username: '',
					password: '',
					password2: '',
					mobile: '',
					email: '',
					status: "ENABLE"
				};
				getRoleDropList().then((res) => {
					this.roleDropList=res.data;
				});
			},
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = this.editForm;
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editUser(para).then((res) => {
								this.editLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									//NProgress.done();
									this.$message({
										message: msg,
										type: 'success'
									});
									this.$refs['editForm'].resetFields();
									this.editFormVisible = false;
									this.getUsers();
								}else{
									this.$message({
										message: msg,
										type: 'error'
									});
								}
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							//var addParams = { name: this.addForm.name, username: this.addForm.username, password: this.addForm.password, mobile: this.addForm.mobile, email: this.addForm.email };
							let para = this.addForm;
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addUser(para).then((res,error) => {
								this.addLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									//NProgress.done();
									this.$message({
										message: msg,
										type: 'success'
									});
									this.$refs['addForm'].resetFields();
									this.addFormVisible = false;
									this.getUsers();
								}else{
									this.$message({
										message: msg,
										type: 'error'
									});
									//this.$refs['addForm'].resetFields();
									//this.addFormVisible = false;
									//this.getUsers();
								}
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(ids).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						let {msg, code, data} = res;
						debugger;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getUsers();
						}else{
							this.$message({
								message: msg,
								type: 'error'
							});
						}
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
		}
	}

</script>

<style scoped>

</style>
