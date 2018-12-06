<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getRoles">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="roleName" label="角色名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="remark" label="备注" width="200" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="190" sortable>
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
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible"  width="30%">
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" ></el-input>
				</el-form-item>
				<el-form-item label="菜单授权">
					<el-tree ref="addTree" :data="menusTree" show-checkbox node-key="id" :default-checked-keys="[2]" :props="defaultProps">
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

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
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	// , removeUser, batchRemoveUser, editUser, addUser
	import { getRoleListPage, getParentTrees, addRole } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				roles: [],
				total: 0,
				page: 1,
				size: 10,
				listLoading: false,
				sels: [],//列表选中列
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				menusTree: [],
				addFormRules: {
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur' }
					]
				},
				defaultProps: {
					children: 'children',
					label: 'label'
				},
				//新增界面数据
				addForm: {
					roleName: '',
					remark: '',
					menuIds: []
				},
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				}
			}
		},
		methods: {
			filterTag(value, row) {
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
			getRoles() {
				let para = {
                    size: this.size,
					current: this.page,
					roleName: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getRoleListPage(para).then((res) => {
					this.total = res.data.total;
          			this.size = res.data.size;
          			this.current = res.data.current;
					this.roles = res.data.records;
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
				this.editForm = Object.assign({}, row);
				if(row.status===1){
					this.editForm.status = 'ENABLE';
				}else{
					this.editForm.status = 'DISABLE';
				}
			},
			getParentTrees(){
				getParentTrees().then((res) => {
					this.menusTree = res.data;
					debugger;
				});
            },
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					roleName: '',
					remark: '',
					menuIds: []
				};
				this.getParentTrees();
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							this.addForm.menuIds = this.$refs.addTree.getCheckedKeys();
							//var addParams = { name: this.addForm.name, username: this.addForm.username, password: this.addForm.password, mobile: this.addForm.mobile, email: this.addForm.email };
							let para = this.addForm;
							debugger;
							//return;
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addRole(para).then((res,error) => {
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
									this.getRoles();
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
			this.getRoles();
		}
	}

</script>

<style scoped>

</style>
