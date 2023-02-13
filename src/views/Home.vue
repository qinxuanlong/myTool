<template>
  <div class="home">
    <div class="nav">
      <img alt="Vue logo" src="../assets/tips.gif" />
    </div>
    
    <div class="content">
      <el-row class="row-bg" justify="space-between"  >
        <el-col :span="6">
          <el-card class="box-card">
            <router-link to="/">Home</router-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <router-link to="/about">About</router-link>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card class="box-card">
            <router-link to="/ElementFormat">table 表格格式化数据</router-link>
          </el-card>
        </el-col>
        <el-col :span="6">
            <el-card  class="box-card">
               <router-link to="/VScodeFragment">VScode 代码片段格式化</router-link>
            </el-card>
        </el-col>
        <el-col :span="6">
            <el-card  class="box-card">
               <router-link to="/ElementFrom">element from格式化</router-link>
            </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'

export default {
  name: 'Home',
  // components: {
  //   HelloWorld
  // }
  setup (props) {}
}
</script>

<style scoped>
.home {
  width: 1000px;
  margin: 0 auto;
}

.nav{
  text-align: center;
  padding: 20px;
}

.content{
  padding: 20px;
}

.box-card{
  margin: 20px;
}
</style>
