<template>
    <el-submenu v-if="menu.children != null && menu.children.length>0 && !menu.hidden" > 
        <template slot="title" > 
            <i :class="menu.iconCls"></i> 
            <span slot="title"> {{menu.name}}</span>
        </template>
        <NavMenu :menu="item" v-for="item in menu.children"></NavMenu>
    </el-submenu>
    <el-menu-item :index="menu.path" v-else-if="(menu.children == null || menu.children.length==0) && !menu.hidden" @click="$router.push(menu.path)">{{menu.name}}</el-menu-item>
</template>

<script>
    export default {
        name: 'NavMenu',
        props: ['menu'],
        data() {
        return {}
        },
        methods: {}
    }
</script>

