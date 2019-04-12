<template>
    <div>
        <template v-for="item in navMenus">
            <!-- 最后一级菜单 --> 
            <el-menu-item v-if="(item.children == null || item.children.length==0) && !item.hidden"  :key="item.path" :data="item" :index="item.name"  @click="$router.push(item.path)"> 
                <i :class="item.iconCls"></i> 
                <span slot="title">{{item.name}}</span> 
            </el-menu-item> 
            <!-- 此菜单下还有子菜单 --> 
            <el-submenu v-if="item.children != null && item.children.length>0" :key="item.path" :data="item" :index="item.name"> 
                <template slot="title" v-if="!item.hidden"> 
                    <i :class="item.iconCls"></i> 
                    <span> {{item.name}}</span> 
                </template> 
                <!-- 递归 -->
                <NavMenu :navMenus="item.children"></NavMenu>
            </el-submenu> 
        </template>
    </div>
</template>


<script>
    // import the component
	// import Treeselect from '@riophae/vue-treeselect'
	// // import the styles
	// import '@riophae/vue-treeselect/dist/vue-treeselect.css'
	// import transfer from "@/common/js/tree-data-transfer";
	// import '@/assets/icon/iconfont.css'
    export default {
        name: 'NavMenu',
        props: ['navMenus'],
        data() {
        return {}
        },
        methods: {}
    }
</script>

