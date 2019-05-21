<template>
    <el-submenu v-if="menu.children != null && menu.children.length>0 " :index="'menu-index-'+menu.url" > 
        <template slot="title" > 
            <i :class="menu.icon">&nbsp;&nbsp;</i> 
            <span slot="title">{{menu.name}}</span>
        </template>
        <NavMenu :menu="item" v-for="(item,key) in menu.children" :key="key"  @addTab="addTab" ></NavMenu>
    </el-submenu>
    <el-menu-item v-else-if="menu.children == null || menu.children.length==0" :id="'menuItem:'+menu.url" :index="menu.url" @click="addTab(menu)" >
        <i :class="menu.icon" v-if="menu.icon">&nbsp;&nbsp;</i>
        <span slot="title">{{menu.name}}</span>
    </el-menu-item>
</template>

<script>
    export default {
        name: 'NavMenu',
        props: ['menu'],
        data() {
        return {}
        },
        methods: {
            addTab(item){
                this.$emit('addTab', item)
            }
        }
    }
</script>

