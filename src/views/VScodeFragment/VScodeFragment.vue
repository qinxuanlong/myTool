<template>
  <div class="page">
    <div class="header">
      <el-button type="primary" @click="copyText()">复制</el-button>
      <el-button type="success" @click="conversionCode">转化</el-button>
      
    </div>
    <div class="box">
      <div class="item ">
        <textarea v-model="text" class="textarea "></textarea>
      </div>
      <div class="item ">
        <div class="pre" ref="copy">
          <highlightjs
            language="JavaScript"
            :autodetect="false"
            :code="code"
          ></highlightjs>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
// import conversion from './index.js'
let text = ref(`
const app =  createApp(App)
app.use(store)
app.use(router)
app.use(elementPlus)
app.use(hljsVuePlugin)
app.mount('#app')
`)
var code = ref('')
let copy = ref(null)
function conversionCode () {
  // console.log('txt', txt.value)
  code.value = JSON.stringify(text.value)
}

function copyText () {
  console.log(copy.value);
  console.log(this.$ref);
  // var text = document.getElementById('pre').innerText
  // var input = document.getElementById('copy')
  // input.value = text.value // 修改文本框的内容
  // copy.value.select() // 选中文本
  navigator.clipboard.writeText(code.value)
  // document.execCommand('copy') // 执行浏览器复制命令
  alert('复制成功')
}

onMounted(()=>{
  console.log('onMounted',this);
})
</script>

<style scoped>
.page {
  background: #fff;
  min-width: 1000px;
}
.header {
  height: 60px;
  line-height: 60px;
  background: #0066b8;
  padding: 0 20px;
  box-shadow: 0 2px 4px #00000014;
}
.box {
  display: flex;
  justify-content: space-between;
  height: 800px;
}
.bg {
  /* background: pink; */
  box-shadow: inset 11px 10px 30px pink;
}
.box .item {
  flex: 1;
  box-sizing: content-box;
  padding: 15px;
  overflow: hidden;
}
.htmlbox {
  padding: 20px 20px 20px 20px;
}

.htmlbox >>> code {
  min-height: 100vh;
  border: 1px solid #535353;
}

.textarea {
  margin: 0;
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  padding: 8px;
  color: #606266;
  resize: none;
  outline: none;
  width: calc(100% - 16px);
  height: calc(100% - 16px);
  box-sizing: content-box;
}
.pre {
  width: 100%;
  height: 100%;
  /* padding: 1rem; */
  border: 1px solid #535353;
  box-sizing: content-box;
  overflow: auto;
  /* background-color: rgba(51, 51, 51, 0.079); */
}

.pre >>> code {
  min-height: 100vh;
}
</style>
