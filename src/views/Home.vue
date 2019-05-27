<style scoped lang="scss">
	@import '~scss_vars';
	.el-menu-vertical-demo:not(.el-menu--collapse) {
		width: 230px;
		min-height: 400px;
	}

	.container {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}
	.header {
		height: 60px;
		line-height: 60px;
		background: $color-primary;
		color:#fff;
		//padding-right:20px;
	}
	.logo {
		width:230px;
		font-size: 22px;
		padding-left:20px;
		border-color: rgba(238,241,146,0.3);
		border-right-width: 1px;
		border-right-style: solid;
		img {
			width: 40px;
			float: left;
			margin: 10px 10px 10px 18px;
		}
		.txt {
			color:#fff;
		}
	}
	.userInfo {
		width: calc(100% - 280px);
		text-align: right;
		float: right;
		padding-right:20px;
		
	}
	.userInfo-inner {
		cursor: pointer;
		color:#fff;
		img {
			width: 40px;
			height: 40px;
			border-radius: 20px;	
			//margin: 10px 0px 10px 10px;
			margin-top: 10px;
			float: right;
		}
	}
	.message {
		cursor: pointer;
		padding-right:20px;
		.message-badge {
			margin-top: -30px;
  			margin-right: 20px;
		}
	}
	.main {
		display: flex;
		// // background: #324057;
		position: absolute;
		top: 60px;
		bottom: 0px;
		overflow: hidden;
		width: 100%;
		height: 100%;
	}
	.aside-menu {
		width: 230px;
		height: 100%;
	}

	.logo-width{
		width:210px;
	}
	.logo-collapse-width{
		width:44px;
		padding-left:0px;
	}

	.tools{
		padding: 0px 23px;
		width:14px;
		height: 60px;
		line-height: 60px;
		cursor: pointer;
	}

	.main-content {
		// background: #f1f2f7;
		flex:1;
		// position: absolute;
		border-right: 0px;
		// top: 0px;
		// bottom: 0px;
		// left: 230px;
		//overflow-y: scroll;
		padding: 20px;
		width: 100%;
	}
</style>
<template>
	<el-row class="container">
		<el-row  class="header">
			<el-col class="logo" :span="2">
				{{sysName}}
			</el-col>
			<el-col class="tools" :span="2" >
				<div>
					<i class="fa fa-align-justify"  @click.prevent="collapse"></i>
				</div>
			</el-col>
			<el-col class="userInfo" :span="2">
				<!-- <el-popover placement="top-start" title="标题" width="200" trigger="hover" content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
					<i class="myfontfamily myicon-message" style="margin-right: -10px; margin-top: 15px;"></i>
				</el-popover>
				<span class="message">
					<i class="myfontfamily myicon-message" style="margin-right: -10px; margin-top: 15px;"></i>
					<el-badge :value="3" class="message-badge">
					</el-badge>
				</span> -->
				<el-dropdown trigger="hover">
					<span class="el-dropdown-link userInfo-inner">欢迎您，{{sysUserName}}&nbsp;<img :src="this.sysUserAvatar" /></span>
					<el-dropdown-menu slot="dropdown">
						<el-dropdown-item>我的消息</el-dropdown-item>
						<el-dropdown-item>设置</el-dropdown-item>
						<el-dropdown-item @click.native="showEditPassword">修改密码</el-dropdown-item>
						<el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					</el-dropdown-menu>
				</el-dropdown>
			</el-col>
		</el-row>
		<!--修改密码界面-->
		<el-dialog title="新增" :visible.sync="editPwdFormVisible"  width="30%">
			<el-form :model="editPwdForm" status-icon :rules="editPwdFormRules" ref="editPwdForm" label-width="80px" class="demo-ruleForm">
				<el-form-item label="旧密码" prop="oldPassword">
					<el-input v-model="editPwdForm.oldPassword" type="password"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="password">
					<el-input v-model="editPwdForm.password" type="password"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="password2">
					<el-input v-model="editPwdForm.password2" type="password"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editPwdFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editPassword" :loading="editPwdLoading">提交</el-button>
			</div>
		</el-dialog>
		<el-row :span="24" class="main" >
				<!--导航菜单-->
				<el-menu class="el-menu-vertical-demo" :class="collapsed?'':'aside-menu'"  background-color="#212121" text-color="#fff" active-text-color="#00F5FF" :default-active="defaultActive" ref="navmenu"  unique-opened :collapse="collapsed">
					<template v-for="(item) in menus">
						<NavMenu :menu="item" :key="'key'+item.id" @addTab="addTab"></NavMenu>
					</template>
				</el-menu>
			<section class="main-content">
				<template>
					<el-tabs :value="currentTabValue" type="card"  @tab-click="onTabClick" @tab-remove="removeTab">
						<el-tab-pane v-for="option in editableTabs" :closable="option.isDelete" :label="option.title" :name="option.url" :key="'key-'+option.url" >
							<keep-alive><router-view :name="option.component"></router-view></keep-alive>	
						</el-tab-pane>
					</el-tabs>
				</template>
			</section >
		</el-row>
	</el-row>
	
</template>

<script>
	import NavMenu from "./NavMenu.vue";
	import { getLoginInfo, ipAddress, editPassword } from '../api/api';
	export default {
		components: {
			NavMenu: NavMenu
		},
		data() {
			var checkPassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请再次输入密码'));
				} else if (value !== this.editPwdForm.password) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				ipAddress: ipAddress,
				defaultActive: '',
				currentTabValue: '0',
				editableTabs: [{
					title: '主页',
					component: 'main',
					url: '/main',
					isDelete: false
				}],
				sysName:'ADMIN',
				collapsed:false,
				menus: [],
				sysUserName: '',
				sysUserAvatar: '',
				form: {
					name: '',
					region: '',
					date1: '',
					date2: '',
					delivery: false,
					type: [],
					resource: '',
					desc: ''
				},
				//修改密码页面参数
				editPwdFormVisible: false,
				editPwdLoading: false,
				editPwdForm:{
					oldPassword: '',
					password: '',
					password2: ''
				},
				editPwdFormRules:{
					password: [
						{ required: true, message: '请输入密码', trigger: 'blur' }
					],
					password2: [
						{ validator: checkPassword, trigger: ['blur','change'] }
					],
					oldPassword: [
						{ required: true, message: '请输入旧密码', trigger: 'blur' }
					],
				}
			}
		},
		methods: {
			//添加tab
			addTab(menu){
				//判断tab数量是否超过阈值：暂设12
				let newTabName = menu.name;
				let tabUrl = menu.url;
				let tab = this.editableTabs.filter((tab) => {
						return tab.url === tabUrl;
					})[0];
				//要添加的tabs 当前的tab数组里面有没有
				if(!!tab){
					this.currentTabValue = tabUrl;
					this.$router.push(menu.url);
					return;
				}

				var max = 12;
				if(this.editableTabs.length >= max){
					this.$message({
						message: 'tab页面超过'+max+',请关闭没用tab页面',
						type: 'error'
					});
					return;
				}

				this.editableTabs.push({
					title: newTabName,
					component: menu.component,
					url: menu.url,
					isDelete : true
				});
				this.currentTabValue = tabUrl;
				this.$router.push(menu.url);
			},
			//点击tab事件
			onTabClick(tab){
				let checkTab = this.editableTabs.filter((t) => {
						return t.url === tab.name;
					})[0];
				this.defaultActive = checkTab.url;
				this.$router.push(checkTab.url);
			},
			//移除tab
			removeTab(targetName){
				let tabs = this.editableTabs;
				let activeName = this.currentTabValue;
				if (activeName === targetName) {
					tabs.forEach((tab, index) => {
						if (tab.url === targetName) {
							let nextTab = tabs[index + 1] || tabs[index - 1];
							if (nextTab) {
								activeName = nextTab.url;
							}
						}
					});
				}
				let tabObject = {name: activeName};
				this.onTabClick(tabObject);
				this.editableTabs = tabs.filter(tab => tab.url !== targetName);
			},
			onSubmit() {
				console.log('submit!');
			},
			handleselect: function (a, b) {
			},
			//显示修改密码页面
			showEditPassword(){
				this.editPwdFormVisible = true;
				this.$refs.editPwdForm.resetFields();
			},
			//修改密码
			editPassword(){
				this.$refs.editPwdForm.validate((valid) => {
					var _this = this;
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editPwdLoading = true;
							let para = this.editPwdForm;
							editPassword(para).then((res) => {
								this.editPwdLoading = false;
								let { msg, code, data } = res;
								if(code == 0){
									this.$message({
										message: msg,
										type: 'success'
									});
									this.$refs['editPwdForm'].resetFields();
									this.editPwdFormVisible = false;
									sessionStorage.removeItem('user');
									_this.$router.push('/login');
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
			//退出登录
			logout: function () {
				var _this = this;
				this.$confirm('确认退出吗?', '提示', {
					//type: 'warning'
				}).then(() => {
					sessionStorage.removeItem('user');
					_this.$router.push('/login');
				}).catch(() => {

				});


			},
			//折叠导航栏
			collapse:function(){
				this.collapsed=!this.collapsed;
			},
			showMenu(i,status){
				this.$refs.menuCollapsed.getElementsByClassName('submenu-hook-'+i)[0].style.display=status?'block':'none';
			}
		},
		mounted() {
			var user = sessionStorage.getItem('user');
			if (user) {
				user = JSON.parse(user);
				this.sysUserName = user.name || '';
				this.sysUserAvatar = this.ipAddress+user.avatar || '';
			}
			let _this = this;
			//加载用户登录信息
			getLoginInfo().then((res) => {
					sessionStorage.setItem('menus', JSON.stringify(res.menus));
					_this.menus = res.menus;
				}).catch(() => {

			});
			//设置菜单选中高亮
			this.defaultActive = this.$router.currentRoute.path;
		},
		updated(name){
			//加载完成之后触发点击操作
			//TODO 判断tab里面是否已经有了
			let selectMenu = document.getElementById("menuItem:"+this.$router.currentRoute.path);
			if(selectMenu !== null){
				selectMenu.click();
			}
		}
	}

</script>


