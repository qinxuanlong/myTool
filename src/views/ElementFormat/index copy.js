function conversion(text) {
    // console.log('txt', txt.value)
    let rowslist = text.value.split('\n')
    let tr = [],
        checkList = [],
        htmlText = ''
    for (let index = 0; index < rowslist.length; index++) {
        const element = rowslist[index]
        // console.log(element)
        let obj = setRow(element)
        if (!obj) {
            continue
        }
        let data = {
            id: index,
            label: obj.label,
            prop: obj.prop
            // propValue:obj.prop
        }
        if (obj.propValue) {
            data.show = 'template'
            htmlText = htmlText + '\n' + obj.propValue.template
        }

        checkList.push(obj.label)
        tr.push(data)
    }

    let table = JSON.stringify(checkList, null, 2) + '\n' + JSON.stringify(tr, null, 2)

    let data = {
        table: table,
        html:htmlText
    }
     
    

    return data
}

function setRow(rowStr) {
    // 分割符号
    let separator = rowStr.match(/string/i)
    if (separator) {
        let list = rowStr.split(separator[0])
        if (list.length > 1) {
            list[0] = list[0].replace(/[是|否]/g, '')

            let prop = list[1].match(/\((.+?)\)/g)
            list[1] = list[1].replace(prop, '')
            // console.log( list[1]);
            // console.log( list[1].match( /\((.+?)\)/g));
            // console.log('prop', prop);
            let propValue = false
            if (prop !== null) {
                propValue = setProp(prop[0], list[0].replace(/\s*/g, ''))
            }
            return {
                prop: list[0].replace(/\s*/g, ''),
                label: list[1].replace(/\s*/g, ''),
                propValue: propValue
            }
        }
    }

    return false
}

function setProp(propstr, propName) {
    propstr = propstr.replace(/[\(|\)]/g, '')
    console.log('propstr', propstr)
    let propsList = propstr.match(/\d[\u4e00-\u9fa5]+/g)

    // console.log('propsList',propsList);
    let arr = [],
        template = ''

    if (propsList) {
        for (let index = 0; index < propsList.length; index++) {
            const element = propsList[index]
            let key, value
            key = element.match(/\d/g)
            if (key) {
                value = element.replace(key[0], '')
                const obj = {
                    key: key[0],
                    value: value
                }
                let temp = setTemplate(propName, key, value)
                template = template + temp + '\n'
                arr.push(obj)
            }
        }
        template = `
      <template slot="${propName}" slot-scope="current">
      ${template}
      </template>
      `
        return {
            template: template,
            list: arr
        }
    }

    return false
}

function setTemplate(propName, key, value) {
    let template = `\t<span v-if="current.row.${propName} == '${key}'">${value}</span>`
    return template
}

export default conversion
