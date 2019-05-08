<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.beanName" placeholder="bean名称"></el-input>
				</el-form-item>
                <el-form-item>
					<el-input v-model="filters.methodName" placeholder="方法"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getPages">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleScheduleLog">日志列表</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" :disabled="this.sels.length===0" @click="batchPause">暂停</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" :disabled="this.sels.length===0" @click="batchResume">恢复</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" :disabled="this.sels.length===0" @click="batchRun">执行</el-button>
				</el-form-item>
                <el-form-item>
					<el-button type="danger" :disabled="this.sels.length===0" @click="batchRemove">批量删除</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="pageObjects" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="beanName" header-align="center" align="center" label="bean名称" width="200">
			</el-table-column>
            <el-table-column prop="methodName" header-align="center" align="center" label="方法名称" width="200">
			</el-table-column>
            <el-table-column prop="param" header-align="center" align="center" label="参数" width="200">
			</el-table-column>
            <el-table-column prop="cronExpression" header-align="center" align="center" label="corn表达式" width="200">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150" align="center" :filters="[{ text: '运行', value: 0 }, { text: '暂停', value: 1 }]" :filter-method="filterTag">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status === 1 ? 'danger' : 'success'" disable-transitions ><div v-if="scope.row.status === 1">暂停</div><div v-else-if="scope.row.status === 0">运行</div></el-tag>
				</template>
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
			
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible"  width="30%" :before-close="handleDialogClose">
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="120px" class="demo-ruleForm">
				<el-form-item label="bean名称" prop="beanName">
					<el-input v-model="addForm.beanName"></el-input>
				</el-form-item>
                <el-form-item label="方法名称" prop="methodName">
					<el-input v-model="addForm.methodName"></el-input>
				</el-form-item>
                <el-form-item label="corn表达式" prop="cronExpression">
					<el-input v-model="addForm.cronExpression"></el-input>
				</el-form-item>
                <el-form-item label="参数" prop="params">
					<el-input v-model="addForm.params"></el-input>
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
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" width="30%" :before-close="handleDialogClose" >
			<el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
				<el-form-item label="bean名称" prop="beanName">
					<el-input v-model="editForm.beanName"></el-input>
				</el-form-item>
                <el-form-item label="方法名称" prop="methodName">
					<el-input v-model="editForm.methodName"></el-input>
				</el-form-item>
                <el-form-item label="corn表达式" prop="cronExpression">
					<el-input v-model="editForm.cronExpression"></el-input>
				</el-form-item>
                <el-form-item label="参数" prop="params">
					<el-input v-model="editForm.params"></el-input>
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
		<!--任务日志页面-->
		<el-dialog title="日志列表" v-model="scheduleLogVisible" :visible.sync="scheduleLogVisible" width="80%" close-on-click-modal  >
			<template><ScheduleLog></ScheduleLog></template>
		</el-dialog>
	</section>
</template>

<script>
	import { getSchedulePage, addSchedule, editSchedule, batchRemoveSchedule, pauseSchedule, resumeSchedule, runSchedule } from '../../api/api';
	import ScheduleLog from "./ScheduleLog.vue";

	export default {
		components: {
			ScheduleLog: ScheduleLog
		},
		data() {
			return {
                //-------查询部分-------
				filters: {
                    beanName: '',
                    methodName: ''
				},
				pageObjects: [],
				total: 0,
				page: 1,
				size: 10,
                listLoading: false,
                //列表选中列
				sels: [],
				//日志列部分
				scheduleLogVisible: false,
                //-------新增部分-------
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					beanName: [
						{ required: true, message: '请输入bean名称', trigger: 'blur' }
                    ],
                    methodName: [
						{ required: true, message: '请输入方法名称', trigger: 'blur' }
                    ],
                    cronExpression: [
						{ required: true, message: '请输入corn表达式', trigger: 'blur' }
                    ],
				},
				//新增界面数据
				addForm: {
					beanName: '',
                    methodName: '',
                    cronExpression: '',
                    params: '',
					remark: ''
                },
                //-------修改部分-------
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					beanName: [
						{ required: true, message: '请输入bean名称', trigger: 'blur' }
                    ],
                    methodName: [
						{ required: true, message: '请输入方法名称', trigger: 'blur' }
                    ],
                    cronExpression: [
						{ required: true, message: '请输入corn表达式', trigger: 'blur' }
                    ],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					beanName: '',
                    methodName: '',
                    cronExpression: '',
                    params: '',
                    remark: '',
                    status: 0
				}
            }
		},
		methods: {
			filterTag(value, row) {
				return row.status === value;
			},
            //获取page页列表
			getPages() {
				let para = {
                    size: this.size,
					current: this.page,
                    beanName: this.filters.beanName,
                    methodName: this.filters.methodName,
				};
				this.listLoading = true;
				getSchedulePage(para).then((res) => {
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
					beanName: '',
                    methodName: '',
                    cronExpression: '',
                    params: '',
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
							addSchedule(para).then((res,error) => {
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
			//显示日志列表页面
			handleScheduleLog: function () {
                this.scheduleLogVisible = true;
            },
            //显示编辑界面
			handleEdit: function (index, row) {
                this.editFormVisible = true;
				this.editForm = {
					id: row.id,
					beanName: row.beanName,
                    methodName: row.methodName,
                    cronExpression: row.cronExpression,
                    params: row.params,
                    remark: row.remark,
                    status: row.status,
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
							editSchedule(para).then((res,error) => {
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
            selsChange: function (sels) {
				this.sels = sels;
            },
			//--------删除部分--------
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchRemoveSchedule(row.id).then((res) => {
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
            //批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					batchRemoveSchedule(ids).then((res) => {
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
            //--------暂停部分--------
			handlePause: function (index, row) {
				this.$confirm('确认暂停该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					pauseSchedule(row.id).then((res) => {
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
            //批量暂停
			batchPause: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认暂停选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					pauseSchedule(ids).then((res) => {
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
            //--------恢复部分--------
			handleResume: function (index, row) {
				this.$confirm('确认恢复该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					resumeSchedule(row.id).then((res) => {
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
            //批量恢复
			batchResume: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认恢复选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					resumeSchedule(ids).then((res) => {
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
			//--------执行部分--------
			handleRun: function (index, row) {
				this.$confirm('确认恢复该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					runSchedule(row.id).then((res) => {
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
            //批量执行
			batchRun: function () {
				var ids = this.sels.map(item => item.id);
				this.$confirm('确认恢复选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					runSchedule(ids).then((res) => {
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