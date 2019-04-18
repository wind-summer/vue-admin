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
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible"  width="30%" :before-close="handleDialogClose">
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="addForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" ></el-input>
				</el-form-item>
				<el-form-item label="菜单授权">
					<el-tree ref="addTree" :data="menusTree" show-checkbox node-key="id" :default-checked-keys="[]" :props="defaultProps" default-expand-all>
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleDialogClose">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :before-close="handleDialogClose" >
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名称" prop="roleName">
					<el-input v-model="editForm.roleName"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" ></el-input>
				</el-form-item>
				<el-form-item label="菜单授权">
					<el-tree ref="editTree" :data="menusTree" show-checkbox node-key="id" :default-checked-keys="editForm.menuIds" :props="defaultProps" default-expand-all>
					</el-tree>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleDialogClose">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	// , removeUser, batchRemoveUser, editUser, addUser
	import { getRoleListPage, getParentTrees, addRole, getRoleAndMenusInfo, editRole, batchRemoveRole } from '../../api/api';

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
					roleName: '',
					remark: '',
					menuIds: []
				}
			}
		},
		methods: {
			//表单取消按钮
			handleDialogClose(){
				this.menusTree = [];

				this.editForm.menuIds = [];
				this.editFormVisible = false;

				this.addForm.menuIds = [];
				this.addFormVisible = false;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getRoles();
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
					//如果请求页数大于当前最高页数，这把页数请求定位到最后一页
					if(res.data.current>res.data.pages){
						this.page = res.data.pages;
						this.getRoles();
					}else{
						this.page = res.data.current;
					}
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
					batchRemoveRole(row.id).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						let {msg, code, data} = res;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getRoles();
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
				this.editForm.menuIds = [];
				this.editFormVisible = true;
				this.getParentTrees();
				getRoleAndMenusInfo(row.id).then((res) => {
					this.editForm = res.data;
				});
			},
			getParentTrees(){
				getParentTrees().then((res) => {
					this.menusTree = res.data;
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
			// 获取选中的树节点
			getTreeNodes (childNodes, ids, tree) {
				// 将所有选中的子节点保存
				for (var i = 0; i < childNodes.length; i++) {
				ids.push(childNodes[i])
				// 获取父级节点
				this.getTreeParentNode(childNodes[i], ids, tree)
				}
			},
			// 递归查询所有上级数据
			getTreeParentNode (id, ids, tree) {
				// 获取当前节点的上级节点id
				var parentId = tree.getNode(id).parent.data.id;
				if (parentId && parentId !== null) {
					ids.push(parentId)
					this.getTreeParentNode(parentId, ids, tree);
				}
			},
			//去重复
			distinct (array) {
				var temp = []; //一个新的临时数组
				for(var i = 0; i < array.length; i++){
					if(temp.indexOf(array[i]) == -1){
						temp.push(array[i]);
					}
				}
				return temp;
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					let _this = this;
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;

							//处理选中treeid，包括父类id也给添加上
							// 获取完全选中的节点
							var treeKeys = this.$refs.addTree.getCheckedKeys()
							// 最终选中的包括半选中的节点数组
							var ids = [];
							var tree = this.$refs.addTree;
							this.getTreeNodes(treeKeys, ids, tree);
							//去重复
							this.addForm.menuIds = this.distinct(ids);
							//this.addForm.menuIds = this.$refs.addTree.getCheckedKeys();
							let para = this.addForm;
							addRole(para).then((res,error) => {
								this.addLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									//NProgress.done();
									this.$message({
										message: msg,
										type: 'success'
									});
									_this.handleDialogClose();
									_this.getRoles();
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
				let _this = this;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//this.editForm.menuIds = this.$refs.editTree.getCheckedKeys();
							//处理选中treeid，包括父类id也给添加上
							// 获取完全选中的节点
							var treeKeys = this.$refs.editTree.getCheckedKeys()
							// 最终选中的包括半选中的节点数组
							var ids = [];
							var tree = this.$refs.editTree;
							this.getTreeNodes(treeKeys, ids, tree);
							//去重复
							let para = this.editForm;
							para.menuIds = this.distinct(ids);

							editRole(para).then((res,error) => {
								this.editLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									this.$message({
										message: msg,
										type: 'success'
									});
									_this.handleDialogClose();
									_this.getRoles();
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
					batchRemoveRole(ids).then((res) => {
						this.listLoading = false;
						let {msg, code, data} = res;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getRoles();
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
