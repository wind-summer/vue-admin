<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.dictName" placeholder="名称"></el-input>
				</el-form-item>
                <el-form-item>
					<el-input v-model="filters.dictType" placeholder="类型"></el-input>
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
		<el-table :data="pageObjects" highlight-current-row border  v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="60">
			</el-table-column>
			<el-table-column prop="dictName" header-align="center" align="center" label="名称" width="250" >
			</el-table-column>
            <el-table-column prop="dictType" label="类型" header-align="center" align="center" width="250" >
			</el-table-column>
			<el-table-column prop="remark" label="备注" header-align="center" align="center" >
			</el-table-column>
            <el-table-column prop="sortNo" label="排序" width="150" header-align="center" align="center" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="190" header-align="center" align="center" sortable>
			</el-table-column>
			<el-table-column label="操作" width="350" header-align="center" align="center" >
				<template slot-scope="scope">
                    <el-button-group>
                        <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                        <el-button type="info" icon="el-icon-share" @click="openSonDicts(scope.row)">字典配置</el-button>
                        <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                    </el-button-group>
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button type="small" size="small" @click="openSonDicts(scope.row)">字典配置</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination background layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-col>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible"  width="30%" :before-close="handleDialogClose">
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="名称" prop="dictName">
					<el-input v-model="addForm.dictName"></el-input>
				</el-form-item>
                <el-form-item label="类型" prop="dictType">
					<el-input v-model="addForm.dictType"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="addForm.remark" ></el-input>
				</el-form-item>
                <el-form-item label="排序" prop="sortNo">
					<el-input-number v-model="addForm.sortNo" controls-position="right" :min="0" :max="1000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleDialogClose">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :visible.sync="editFormVisible" :before-close="handleDialogClose"  >
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                <el-form-item label="名称" prop="dictName">
					<el-input v-model="editForm.dictName"></el-input>
				</el-form-item>
                <el-form-item label="类型" prop="dictType">
					<el-input v-model="editForm.dictType"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="editForm.remark" ></el-input>
				</el-form-item>
                <el-form-item label="排序" prop="sortNo">
					<el-input-number v-model="editForm.sortNo" controls-position="right" :min="0" :max="1000"></el-input-number>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="handleDialogClose">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
        
        <!--字典列表-->
        <el-dialog title="字典列表" :visible.sync="sonDictListVisible" :before-close="handleDialogClose" close-on-click-modal width="80%" top="15vh"  >
			<!--工具条-->
            <el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
                <el-form :inline="true" :model="sonFilters">
                    <el-form-item>
                        <el-input v-model="sonFilters.dictName" placeholder="名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input v-model="sonFilters.dictValue" placeholder="值"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" v-on:click="getSonPages">查询</el-button>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleSonAdd">新增</el-button>
                    </el-form-item>
                </el-form>
            </el-col>

            <!--列表-->
            <el-table :data="pageSonObjects" highlight-current-row border  v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column type="index" label="序号" width="60">
                </el-table-column>
                <el-table-column prop="dictName" header-align="center" align="center" label="名称" width="250" >
                </el-table-column>
                <el-table-column prop="dictType" label="类型" header-align="center" align="center" width="250" >
                </el-table-column>
                <el-table-column prop="remark" label="备注" header-align="center" align="center" >
                </el-table-column>
                <el-table-column prop="sortNo" label="排序" width="150" header-align="center" align="center" sortable>
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="190" header-align="center" align="center" sortable>
                </el-table-column>
                <el-table-column label="操作" width="350" header-align="center" align="center" >
                    <template slot-scope="scope">
                        <el-button-group>
                            <el-button type="primary" icon="el-icon-edit" @click="handleEdit(scope.$index, scope.row)">修改</el-button>
                            <el-button type="danger" icon="el-icon-delete" @click="handleDel(scope.$index, scope.row)">删除</el-button>
                        </el-button-group>
                        <!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button type="small" size="small" @click="openSonDicts(scope.row)">字典配置</el-button>
                        <el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button> -->
                    </template>
                </el-table-column>
            </el-table>

            <!--工具条-->
            <el-row :span="24" class="toolbar">
                <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
                <el-pagination background layout="prev, pager, next" @current-change="handleSonCurrentChange" :page-size="sonSize" :total="sonTotal" style="float:right;">
                </el-pagination>
            </el-row>
            
		</el-dialog>
        <!--新增字典项界面-->
        <el-dialog title="新增字典项" :visible.sync="addFormSonVisible" close-on-click-modal width="30%" >
            <el-form :model="sonAddForm" status-icon :rules="sonAddFormRules" ref="sonAddForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="名称" prop="dictName">
                    <el-input v-model="sonAddForm.dictName"></el-input>
                </el-form-item>
                <el-form-item label="值" prop="dictValue">
                    <el-input v-model="sonAddForm.dictValue"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="remark">
                    <el-input v-model="sonAddForm.remark" ></el-input>
                </el-form-item>
                <el-form-item label="排序" prop="sortNo">
                    <el-input-number v-model="sonAddForm.sortNo" controls-position="right" :min="0" :max="1000"></el-input-number>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click.native="addFormSonVisible = false">取消</el-button>
                <el-button type="primary" @click.native="addSonSubmit" :loading="addLoading">提交</el-button>
            </div>
        </el-dialog>
	</section>
</template>
<script>
	import { getDictionaryPage, addDictionary, editDictionary } from '../../api/api';

	export default {
		data() {
			return {
                
                //-------查询部分-------
				filters: {
                    dictName: '',
                    dictType: ''
				},
				pageObjects: [],
				total: 0,
				page: 1,
				size: 10,
                listLoading: false,
                //列表选中列
                sels: [],
                //-------子dialog查询部分-------
                sonFilters: {
                    pid: 0,
                    dictName: '',
                    dictValue: '',
                    dictType:''
				},
				sonDictListVisible: false,
                pageSonObjects: [],
                sonTotal: 0,
				sonPage: 1,
                sonSize: 2,
                sonSels: [],
				// total: 0,
				// page: 1,
                // size: 10,
                addFormSonVisible: false,
                sonListLoading: false,
                sonAddFormRules: {
					dictValue: [
						{ required: true, message: '请输入值', trigger: 'blur' }
                    ],
                    dictName: [
						{ required: true, message: '请输名称', trigger: 'blur' }
                    ],
				},
				//新增界面数据
				sonAddForm: {
					dictName: '',
					dictValue: '',
                    remark: '',
                    sortNo: 0
                },
                //列表选中列
                //sels: [],
                //-------新增部分-------
				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					dictType: [
						{ required: true, message: '请输入类型', trigger: 'blur' }
                    ],
                    dictName: [
						{ required: true, message: '请输名称', trigger: 'blur' }
                    ],
				},
				//新增界面数据
				addForm: {
					dictName: '',
					dictType: '',
                    remark: '',
                    sortNo: 0
                },
                //-------修改部分-------
				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					dictType: [
						{ required: true, message: '请输入类型', trigger: 'blur' }
                    ],
                    dictName: [
						{ required: true, message: '请输名称', trigger: 'blur' }
                    ],
				},
				//编辑界面数据
				editForm: {
					id: 0,
					dictName: '',
					dictType: '',
                    remark: '',
                    sortNo: 0
				}
            }
		},
		methods: {
            //获取page页列表
			getPages() {
				let para = {
                    size: this.size,
                    current: this.page,
                    dictName: this.filters.dictName,
                    dictType: this.filters.dictType
				};
				this.listLoading = true;
				getDictionaryPage(para).then((res) => {
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
					dictName: '',
					dictType: '',
                    remark: '',
                    sortNo: 0
				};
			},
			//表单取消按钮
			handleDialogClose(){
				this.editFormVisible = false;
                this.addFormVisible = false;
                this.sonDictListVisible = false;
                //this.addFormSonVisible = false;
            },
            //新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					let _this = this;
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
                            let para = this.addForm;
                            para.dictValue = para.dictType;
							addDictionary(para).then((res,error) => {
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
					dictName: row.dictName,
					dictType: row.dictType,
                    remark: row.remark,
                    sortNo: row.sortNo
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
							editDictionary(para).then((res,error) => {
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
            handleSonCurrentChange(val) {
				this.sonPage = val;
				this.getSonPages();
            },
            //--------子项配置--------
            getSonPages(){
                let para = {
                    size: this.sonSize,
                    current: this.sonPage,
                    pid: this.sonFilters.pid,
                    dictName: this.sonFilters.dictName,
                    dictValue: this.sonFilters.dictValue
                };
                getDictionaryPage(para).then((res) => {
                    this.listLoading = false;
                    this.sonTotal = res.data.total;
					this.sonSize = res.data.size;
					//如果请求页数大于当前最高页数，这把页数请求定位到最后一页
					if(res.data.current>res.data.pages){
						this.sonPage = res.data.pages;
						this.getPages();
					}else{
						this.sonPage = res.data.current;
					}
					this.pageSonObjects = res.data.records;
					this.listLoading = false;
                });
            },
            openSonDicts: function (row) {
                this.sonDictListVisible = true;
                this.sonListLoading = true;
                this.sonFilters.pid = row.id;
                this.sonFilters.dictType = row.dictType;
                this.getSonPages();
            },
            handleSonAdd(){
                this.addFormSonVisible = true;
                this.sonAddForm = {
					dictName: '',
					dictValue: '',
                    remark: '',
                    sortNo: 0
				};
            },
            addSonSubmit(){
                this.$refs.sonAddForm.validate((valid) => {
					let _this = this;
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            debugger;
							this.addLoading = true;
                            let para = _this.sonAddForm;
                            para.dictType = _this.sonFilters.dictType;
                            para.pid = _this.sonFilters.pid;
							addDictionary(para).then((res,error) => {
								this.addLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									this.$message({
										message: msg,
										type: 'success'
									});
									_this.addFormSonVisible=false;
									_this.getSonPages();
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
