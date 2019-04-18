<template>
    <el-submenu v-if="menu.children != null && menu.children.length>0 " :index="'menu-index-'+menu.id" > 
        <template slot="title" > 
            <i :class="menu.icon"></i> 
            <span slot="title"> {{menu.name}}</span>
        </template>
        <NavMenu :menu="item" v-for="(item,key) in menu.children" :key="key" ></NavMenu>
    </el-submenu>
    <el-menu-item v-else-if="menu.children == null || menu.children.length==0" :index="'menu-index-'+menu.id" @click="$router.push(menu.url)">{{menu.name}}</el-menu-item>
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

