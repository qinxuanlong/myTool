function test (text) {
    // console.log('txt', txt.value)
    let list = txtdecode(text)
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
  