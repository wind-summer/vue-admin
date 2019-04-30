<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.code" placeholder="名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getPages">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="pageObjects" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" width="60">
			</el-table-column>
			<el-table-column prop="code" header-align="center" align="center" label="编码" width="300">
			</el-table-column>
            <el-table-column prop="value" header-align="center" align="center" label="值" width="300">
			</el-table-column>
			<el-table-column prop="remark" header-align="center" align="center" label="备注">
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="190" header-align="center" align="center" sortable>
			</el-table-column>
			<el-table-column label="操作" width="150" header-align="center" align="center" >
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
				<el-form-item label="编码" prop="code">
					<el-input v-model="addForm.code"></el-input>
				</el-form-item>
                <el-form-item label="值" prop="value">
					<el-input v-model="addForm.value"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" ></el-input>
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
				<el-form-item label="编码" prop="code">
					<el-input v-model="editForm.code" disabled=""></el-input>
				</el-form-item>
                <el-form-item label="值" prop="value">
					<el-input v-model="editForm.value"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" ></el-input>
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
	import { getConfigPage, addConfig, editConfig, batchRemoveConfig } from '../../api/api';

	export default {
		data() {
			return {
                //-------查询部分-------
				filters: {
					code: ''
				},
				pageObjects: [],
				total: 0,
				page: 1,
				size: 10,
                listLoading: false,
                //列表选中列
                sels: [],
                //-------新增部分-------
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					code: [
						{ required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    value: [
						{ required: true, message: '请输入值', trigger: 'blur' }
                    ],
				},
				//新增界面数据
				addForm: {
					code: '',
					value: '',
					remark: ''
                },
                //-------修改部分-------
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					code: [
						{ required: true, message: '请输入编码', trigger: 'blur' }
                    ],
                    value: [
						{ required: true, message: '请输入值', trigger: 'blur' }
                    ],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					code: '',
					value: '',
					remark: ''
				}
            }
		},
		methods: {
            //获取page页列表
			getPages() {
				let para = {
                    size: this.size,
					current: this.page,
					code: this.filters.code
				};
				this.listLoading = true;
				getConfigPage(para).then((res) => {
					this.total = res.data.total;
					this.size = res.data.size;
					//如果请求页数大于当前最高页数，这把页数请求定位到最后一页
					if(res.data.current>res.data.pages){
						this.page = res.data.pages;
						this.getPages();
					}else{
						this.page = res.data.current;
					}
					this.pageObjects = res.data.records;
					this.listLoading = false;
					//NProgress.done();
				});
            },
            //显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					code: '',
					value: '',
					remark: ''
				};
			},
			//表单取消按钮
			handleDialogClose(){
				this.editFormVisible = false;
				this.addFormVisible = false;
            },
            //新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					let _this = this;
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
                            let para = this.addForm;
							addConfig(para).then((res,error) => {
								this.addLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									this.$message({
										message: msg,
										type: 'success'
									});
									_this.handleDialogClose();
									_this.getPages();
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
            //显示编辑界面
			handleEdit: function (index, row) {
                this.editFormVisible = true;
				this.editForm = {
					id: row.id,
					code: row.code,
					value: row.value,
					remark: row.remark
				};
            },
            //编辑
			editSubmit: function () {
				let _this = this;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = this.editForm;
							editConfig(para).then((res,error) => {
								this.editLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									this.$message({
										message: msg,
										type: 'success'
									});
									_this.handleDialogClose();
									_this.getPages();
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
			handleCurrentChange(val) {
				this.page = val;
				this.getPages();
			},
			//--------删除部分--------
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchRemoveConfig(row.id).then((res) => {
						this.listLoading = false;
						let {msg, code, data} = res;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getPages();
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
					batchRemoveConfig(ids).then((res) => {
						this.listLoading = false;
						let {msg, code, data} = res;
						if(code == 0){
							this.$message({
								message: msg,
								type: 'success'
							});
							this.getPages();
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
			this.getPages();
		}
	}
</script>