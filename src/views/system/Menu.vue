<template>
    <section>
        <!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" >
				<!-- <el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item> -->
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

        <!--列表-->
        <!-- @selection-change="selsChange" -->
		<el-table :data="menus" highlight-current-row v-loading="listLoading"  style="width: 100%;">
			<!-- <el-table-column type="selection" width="55">
			</el-table-column> -->
			<!-- <el-table-column type="index" width="60">
			</el-table-column> -->
			<el-table-column prop="name" label="名称" width="150" sortable>
			</el-table-column>
			<el-table-column prop="icon" label="图标" width="100" sortable>
                <template slot-scope="scope">
                    <i :class="scope.row.icon"></i>
                </template>
			</el-table-column>
            <!-- :filters="[{ text: '启用', value: 1 }, { text: '禁用', value: 0 }]" :filter-method="filterTag" -->
			<el-table-column prop="type" label="类型" width="100" sortable>
				<template slot-scope="scope">
                    <div v-if="scope.row.type === 0"><el-tag type="" disable-transitions >菜单</el-tag></div>
                    <div v-else-if="scope.row.type === 1"><el-tag type="success" disable-transitions >按钮</el-tag></div>
				</template>
			</el-table-column>
			<el-table-column prop="orderNum" label="排序" width="100" sortable>
			</el-table-column>
            <el-table-column prop="url" label="路由" width="200" sortable>
			</el-table-column>
            <el-table-column prop="perms" label="授权标识" sortable>
			</el-table-column>
            <el-table-column label="操作" width="150" >
				<template slot-scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

        <!--新增界面-->
		<el-dialog title="新增" v-model="addFormVisible" :visible.sync="addFormVisible"  width="40%">
			<el-form :model="addForm" :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="类型">
					<el-radio-group v-model="addForm.type">
						<el-radio label="MENU">菜单</el-radio>
						<el-radio label="BUTTON">按钮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称" prop="name" placement="top" >
					<el-input v-model="addForm.name" ></el-input>
				</el-form-item>
				<el-form-item label="名称11" prop="parentId" placement="top" >
					<treeselect v-model="addForm.parentId" :multiple="false" :options="parentMenus" placeholder="一级菜单"></treeselect>
				</el-form-item>
				<!-- <el-form-item label="上级菜单" prop="parentId" placement="top" >
					<el-cascader v-model="addForm.parentId" :options="parentMenus" change-on-select clearable expand-trigger="hover" placeholder="一级菜单"></el-cascader>
				</el-form-item> -->
				<!-- <el-form-item label="上级菜单">
					<el-select v-model="addForm.parentId" placeholder="请选择活动区域" inline="true">
					<el-option label="区域一" value="1"></el-option>
					<el-option label="区域二" value="2"></el-option>
					</el-select>
				</el-form-item> -->
				<!-- <el-input v-model="addForm.parentId" type="hidden"></el-input>
				<el-form-item label="上级菜单" prop="parentName">
					<el-input v-model="addForm.parentName" @click.native="selectParentMenu" clearable @clear="clearParentMenu"></el-input>
				</el-form-item> -->
				<el-form-item label="路由" prop="url">
					<el-input v-model="addForm.url"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="orderNum">
					<el-input-number v-model="addForm.orderNum" controls-position="right" :min="0" :max="1000"></el-input-number>
				</el-form-item>
				<el-form-item label="授权表示" prop="perms">
					<el-input v-model="addForm.perms" ></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon">
					<el-input v-model="addForm.icon" ></el-input>
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
				<el-form-item label="类型">
					<el-radio-group v-model="editForm.type">
						<el-radio label="MENU">菜单</el-radio>
						<el-radio label="BUTTON">按钮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称" prop="name">
					<el-input v-model="editForm.name"></el-input>
				</el-form-item>
				<el-form-item label="上级菜单" prop="parentId">
					<el-input v-model="editForm.parentId"></el-input>
				</el-form-item>
				<el-form-item label="路由" prop="url">
					<el-input v-model="editForm.url"></el-input>
				</el-form-item>
				<el-form-item label="排序" prop="orderNum">
					<el-input-number v-model="editForm.orderNum" controls-position="right" :min="0" :max="1000"></el-input-number>
				</el-form-item>
				<el-form-item label="授权表示" prop="perms">
					<el-input v-model="editForm.perms" ></el-input>
				</el-form-item>
				<el-form-item label="图标" prop="icon">
					<el-input v-model="editForm.icon" ></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<!-- <el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button> -->
			</div>
		</el-dialog>
    </section>
</template>

<script>
	import { getMenuList, addMenu, getParentTrees } from '../../api/api';
	// import the component
	import Treeselect from '@riophae/vue-treeselect'
	// import the styles
	import '@riophae/vue-treeselect/dist/vue-treeselect.css'

    export default {
		components: { Treeselect },
        data() {
            return {
                listLoading: false,
				menus: [],
				parentMenus:[],
                addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入菜单名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '类型不能为空', trigger: 'blur' }
					],
					parentId: [
						{ required: true, message: '上级菜单不能为空', trigger: 'blur' }
					],
					orderNum: [
						{ required: true, message: '排序不能为空', trigger: 'blur' }
					],
					// mobile: [
					// 	{ validator: checkMobile, trigger: 'blur' }
					// ],
					// email: [
					// 	{ validator: checkEmail, trigger: 'blur' }
					// ]
				},
				//新增界面数据
				addForm: {
					type: 'MENU',
					name: '',
					orderNum: 0,
					parentId: 0,
					parentName: '',
					url: '',
					perms: '',
					icon: '',
				},
				editFormVisible: false,//新增界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入菜单名称', trigger: 'blur' }
					],
					type: [
						{ required: true, message: '类型不能为空', trigger: 'blur' }
					],
					parentId: [
						{ required: true, message: '上级菜单不能为空', trigger: 'blur' }
					],
					orderNum: [
						{ required: true, message: '排序不能为空', trigger: 'blur' }
					],
					// mobile: [
					// 	{ validator: checkMobile, trigger: 'blur' }
					// ],
					// email: [
					// 	{ validator: checkEmail, trigger: 'blur' }
					// ]
				},
				//新增界面数据
				editForm: {
					type: 'MENU',
					name: '',
					orderNum: 0,
					parentId: 0,
					parentName: '一级菜单',
					parent: '一级菜单',
					url: '',
					perms: '',
					icon: '',
				}
            }
        },
		methods: {
			selectParentMenu(){
				//alert(1);
			},
			clearParentMenu(){
				this.addForm.parentId=0;
				this.addForm.parentName="一级菜单";
			},
            getMenus(){
                this.listLoading = true;
				getMenuList().then((res) => {
                    this.listLoading = false;
                    this.menus = res.data;
				});
			},
			getParentTrees(){
				getParentTrees().then((res) => {
                    this.parentMenus = res.data;
				});
            },
			//显示新增界面
			handleAdd: function () {
				this.getParentTrees();
				this.addFormVisible = true;
				this.addForm = {
					type: 'MENU',
					name: '',
					orderNum: 0,
					//parentId: 0,
					url: '',
					perms: '',
					icon: '',
				};
			},
			addSubmit: function(){
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							//var addParams = { name: this.addForm.name, username: this.addForm.username, password: this.addForm.password, mobile: this.addForm.mobile, email: this.addForm.email };
							let para = this.addForm;
							debugger;
							// var newParentId;
							// if(this.addForm.parentId == ''){
							// 	newParentId = 0;
							// }else if(this.addForm.parentId != 0){
							// 	newParentId = this.addForm.parentId[this.addForm.parentId.length-1];
							// }else{
							// 	newParentId = 0;
							// }

							// para.parentId=newParentId;
							//para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							addMenu(para).then((res,error) => {
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
									this.getMenus();
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
            //显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
				if(row.type === 0){
					this.editForm.type = 'MENU';
				}else if(row.type === 1){
					this.editForm.type = 'BUTTON';
				}
			},
        },
		mounted() {
			this.getMenus();
		}
    }
</script>
