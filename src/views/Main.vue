<template>
    <el-card>
        <section class="chart-container">
            <el-row>
                <el-col :span="12">
                    <div id="basicAreaChart" style="width:600px; height:400px;"></div>
                </el-col>
                <el-col :span="12">
                    <div id="pieChart" style="width:600px; height:400px;"></div>
                </el-col>
            </el-row>
        </section>
    </el-card>
    
	<!-- <el-row>
		<el-col :span="12">
			<div id="chartColumn" style="width:100%; height:400px;"></div>
		</el-col>
		<el-col :span="12">
			<div id="chartBar" style="width:100%; height:400px;"></div>
		</el-col>
		<el-col :span="12">
			<div id="chartLine" style="width:100%; height:400px;"></div>
		</el-col>
		<el-col :span="12">
			<div id="chartPie" style="width:100%; height:400px;"></div>
		</el-col>
		<el-col :span="24">
			<a href="http://echarts.baidu.com/examples.html" target="_blank" style="float: right;">more>></a>
		</el-col>
	</el-row> -->
</template>

<script>
    import { mainDashboardData } from '../api/api';
    import echarts from 'echarts'

    export default {
        data() {
            return {
                basicAreaChart: null,
                basicAreaChartData: {},
                pieChart: null,
                pieChartData: {},
            }
        },

        methods: {
            drawBasicAreaChart() {
                this.basicAreaChart = echarts.init(document.getElementById('basicAreaChart'));
                let _this = this;
                this.basicAreaChart.setOption({
                    title: { text: this.basicAreaChartData.title},
                    xAxis: {
                        type: 'category',
                        boundaryGap: false,
                        data: this.basicAreaChartData.itemNames
                    },
                    yAxis: {
                        type: 'value'
                    },
                    series: [{
                        data: this.basicAreaChartData.items,
                        type: 'line',
                        areaStyle: {}
                    }]
                });
            },
            drawPieChart() {
                this.pieChart = echarts.init(document.getElementById('pieChart'));
                this.pieChart.setOption({
                    title : {
                        text: '店铺收入',
                        subtext: '',
                        x:'center'
                    },
                    tooltip : {
                        trigger: 'item',
                        formatter: "{a} <br/>{b} : {c} ({d}%)"
                    },
                    legend: {
                        orient: 'vertical',
                        left: 'left', 
                        right: 'right',
                        data: ['零售收入','会员收入']
                    },
                    series : [
                        {
                            name: '访问来源',
                            type: 'pie',
                            radius : '60%',
                            center: ['60%', '60%'],
                            data:[
                                {value:335, name:'零售收入'},
                                {value:310, name:'会员收入'},
                            ],
                            itemStyle: {
                                emphasis: {
                                    shadowBlur: 10,
                                    shadowOffsetX: 0,
                                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                                }
                            }
                        }
                    ]
                });
            },
            drawCharts() {
                this.drawBasicAreaChart()
                this.drawPieChart()
            },
            getDashboardData(){
                mainDashboardData().then((res) => {
                    this.basicAreaChartData = res.data.basicAreaChartData;
                    this.pieChartData = res.data.pieChartData;
                    this.drawCharts();
				}).catch(() => {

			    });
            }
        },
        mounted: function () {
            this.getDashboardData();
            
        },
        updated: function () {
            //this.drawCharts()
        }
    }
</script>

<style scoped>
    .chart-container {
        width: 100%;
        float: left;
    }
    /*.chart div {
        height: 400px;
        float: left;
    }*/

    .el-col {
        padding: 30px 20px;
    }
</style>
