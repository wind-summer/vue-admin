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
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="pageObjects" border highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column prop="beanName" header-align="center" align="center" label="bean名称" width="150">
			</el-table-column>
            <el-table-column prop="methodName" header-align="center" align="center" label="方法名称" width="150">
			</el-table-column>
            <el-table-column prop="param" header-align="center" align="center" label="参数" width="150">
			</el-table-column>
            <el-table-column prop="error" header-align="center" align="center" label="错误信息">
			</el-table-column>
            <el-table-column prop="times" header-align="center" align="center" label="执行时间(毫秒)" width="120">
			</el-table-column>
			<el-table-column prop="status" label="状态" width="150" align="center" :filters="[{ text: '成功', value: 0 }, { text: '失败', value: 1 }]" :filter-method="filterTag">
				<template slot-scope="scope">
					<el-tag :type="scope.row.status === 1 ? 'danger' : 'success'" disable-transitions ><div v-if="scope.row.status === 1">失败</div><div v-else-if="scope.row.status === 0">成功</div></el-tag>
				</template>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="190" header-align="center" align="center" sortable>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-row :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="size" :total="total" style="float:right;">
			</el-pagination>
		</el-row>
	</section>
</template>

<script>
    import { getScheduleLogPage } from '../../api/api';
    export default {
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
            }
        },
        methods: {
            addTab(item){
                this.$emit('addTab', item)
            },
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
				getScheduleLogPage(para).then((res) => {
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
            handleCurrentChange(val) {
				this.page = val;
				this.getPages();
            },
            selsChange: function (sels) {
				this.sels = sels;
            },
        },
		mounted() {
			this.getPages();
		}
    }
</script>

