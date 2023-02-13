let map = new Map()

let select = {
    attrs: {
        dataName: 'formData',
        title: '',
        key: 'key',
        options: []
    },
    render() {
        const { title, key, dataName, options } = this.attrs

        let template =
            `
            <el-form-item label="${title}:" prop="${key}">
                <el-select v-model="${dataName}.${key}" clearable placeholder="请选择${title}"  style="width: 100%">
                    <el-option label="item.label" value="item.value" v-for="(item, index) in listData"  :key="index" ></el-option>
                </el-select>
            </el-form-item>
`
        return template
    }
}

let input = {
    attrs: {
        dataName: 'formData',
        title: '',
        key: 'key',
         
    },
    render() {
        const { title, key, dataName } = this.attrs

        let template =
            `
            <el-form-item label="${title}:" prop="${key}">
                <el-input placeholder="请输入${title}" clearable v-model="${dataName}.${key}"></el-input>
            </el-form-item>
`
        return template
    }
}

map.set('select',select)
map.set('input',input)

export default map