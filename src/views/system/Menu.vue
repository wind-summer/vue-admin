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
			<el-form :model="addForm" status-icon :rules="addFormRules" ref="addForm" label-width="80px" class="demo-ruleForm">
                <el-form-item label="类型">
					<el-radio-group v-model="addForm.type">
						<el-radio label="MENU">菜单</el-radio>
						<el-radio label="BUTTON">按钮</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name"></el-input>
				</el-form-item>
				<el-form-item label="上级菜单" prop="parentId">
					<el-input v-model="addForm.parentId"></el-input>
				</el-form-item>
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
				<!-- <el-form-item label="性别">
					<el-radio-group v-model="addForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="addForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="addForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="addForm.addr"></el-input>
				</el-form-item> -->
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
    </section>
</template>

<script>
    import { getMenuList } from '../../api/api';
    export default {
        data() {
            return {
                listLoading: false,
                menus: [],
                addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					// name: [
					// 	{ required: true, message: '请输入姓名', trigger: 'blur' }
					// ],
					// username: [
					// 	{ required: true, message: '请输入账号', trigger: 'blur' }
					// ],
					// password: [
					// 	{ required: true, message: '请输入密码', trigger: 'blur' }
					// ],
					// password2: [
					// 	{ validator: checkPassword, trigger: ['blur','change'] }
					// ],
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
					orderNum: 0,
					password: '',
					password2: '',
					mobile: '',
					email: '',
					status: 'ENABLE'
				}
            }
        },
		methods: {
            getMenus(){
                this.listLoading = true;
				getMenuList().then((res) => {
                    this.listLoading = false;
                    this.menus = res.data;
				});
            },
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					type: 'MENU',
					orderNum: 0,
					password: '',
					password2: '',
					mobile: '',
					email: '',
					status: "ENABLE"
				};
			},
			addSubmit: function(){
				alert(1);
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
        },
		mounted() {
			this.getMenus();
		}
    }
</script>
