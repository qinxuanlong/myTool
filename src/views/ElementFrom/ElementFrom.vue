<template>
  <div class="page">
    <div class="header">
      <el-button type="primary" @click="copyText()">复制</el-button>
      <el-button type="success" @click="test">转化</el-button>
    </div>
    <div class="box">
      <div class="item ">
        <textarea v-model="text" class="textarea "></textarea>
      </div>
      <div class="item ">
        <div class="pre">
          <highlightjs
            language="xml"
            :autodetect="false"
            :code="code"
          ></highlightjs>
        </div>
      </div>
    </div>
    <div class="row2">
      <div class="htmlbox">
        <highlightjs
          language="xml"
          :autodetect="false"
          :code="html"
        ></highlightjs>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'

let text = ref(
  `
input:名字:name | input:名字:name
input:名字:name | input:名字:name
input:名字:name  
`
)
var code = ref('')
var html = ref('')
function test () {
  // console.log('txt', txt.value)
  let list = txtdecode(text.value)
  const rows = []

  for (let index = 0; index < list.length; index++) {
    const row = list[index]
    if (row.length == 0) {
      continue
    }
    rows.push(rowTxt(row))
  }

  let content = ''
  for (let i = 0; i < rows.length; i++) {
    const element = rows[i]
    content += element + '\n'
  }
  let from = `
            <el-form :model="productInfo" ref="productInfo" label-width="110px" :rules="rules" label-position="left">
                ${content}
            </el-form>
            `
  let shuchu = from
  code.value = shuchu
}

// 格式化行
function txtdecode (txt) {
  //
  const fromlist = []
  let list = txt.split('\n')
  for (let i = 0; i < list.length; i++) {
    const element = list[i]
    if (!element) {
      continue
    }
    let rows = element.split('|')
    if (rows.length == 0) {
      continue
    }
    let hang = []
    for (let j = 0; j < rows.length; j++) {
      const row = rows[j]
      if (row.split(':').length > 0) {
        hang.push(row.split(':'))
      }
    }
    fromlist.push(hang)
  }

  return fromlist
}
function rowTxt (row) {
  console.log(row)
  if (row.length == 2) {
    let hanglist = [] // 收集拼接一行内部的内容
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      let content1,
        type = item[0].trim(),
        title = item[1].trim(),
        key = item[2].trim()
      if (type == 'input') {
        content1 = `<el-form-item label="${title}:" prop="${key}">
                                <el-input placeholder="请输入${title}" clearable v-model="formData.${key}"></el-input>
                            </el-form-item>`
      } else if (type == 'select') {
        content1 = ` <el-form-item label="${title}:" prop="${key}">
                            <el-select v-model="formData.${key}" clearable placeholder="请选择${title}"  style="width: 100%">
                                <el-option label="item.label" value="item.value"></el-option>
                            </el-select>
                        </el-form-item>`
      } else if (type == 'txt') {
        content1 = `<el-form-item label="${title}:" prop="${key}">
                                <el-input type="textarea" :rows="2" placeholder="请输入${title}" v-model="formData.${key}"> </el-input>
                            </el-form-item>`
      } else {
        content1 = `<el-form-item label="${title}:" prop="${key}">
                                \{\{formData.${key}"\}\}
                            </el-form-item>`
      }
      hanglist.push(content1)
    }
    console.log('hanglist', hanglist)
    let hang = `<el-row type="flex" justify="space-between">
                            <el-col :span="11">
                                ${hanglist[0]}
                            </el-col>
                            <el-col :span="11">
                                ${hanglist[1]}
                            </el-col>
                        </el-row>`

    return hang
  }
  if (row.length == 1) {
    let hanglist = [] // 收集拼接一行内部的内容
    for (let i = 0; i < row.length; i++) {
      const item = row[i]
      let content1,
        type = item[0],
        title = item[1],
        key = item[2]
      if (type == 'input') {
        content1 = `<el-form-item label="${title}:" prop="${key}">
                                <el-input placeholder="请输入${title}" clearable v-model="formData.${key}"></el-input>
                            </el-form-item>`
      } else if (type == 'select') {
        content1 = ` <el-form-item label="${title}:" prop="${key}">
                            <el-select v-model="formData.${key}" clearable placeholder="请选择${title}"  style="width: 100%">
                                <el-option label="item.label" value="item.value"></el-option>
                            </el-select>
                        </el-form-item>`
      } else if (type == 'txt') {
        content1 = `<el-form-item label="${title}:" prop="${key}">
                                <el-input type="textarea" :rows="2" placeholder="请输入${title}" v-model="formData.${key}"> </el-input>
                            </el-form-item>`
      } else {
        ;`<el-form-item label="${title}:" prop="${key}">
                                \{\{formData.${key}"\}\}
                            </el-form-item>`
      }
      hanglist.push(content1)
    }
    let hang = `<el-row type="flex" justify="space-between">
                            <el-col :span="24">
                                ${hanglist[0]}
                            </el-col>
                        </el-row>`

    return hang
  }
}

function copyText () {
  var text = document.getElementById('pre').innerText
  var input = document.getElementById('copy')
  input.value = text // 修改文本框的内容
  input.select() // 选中文本
  document.execCommand('copy') // 执行浏览器复制命令
  alert('复制成功')
}
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
    overflow: auto;
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
