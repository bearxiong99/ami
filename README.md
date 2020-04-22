## web

web 

致敬 saber，基于此二次开发


1. 获取左侧树点击事件

```
watch: {
      '$store.state.common.treeNode': function (data) {
        console.log(data)
        /**
        data: {
          deviceType: "tmnl", // org 供电区域 tmnl 终端 meter 电表
          deviceNo: "HLY1111111100002",// org时 orgNo tmnl 终端地址 meter 电表id
          deviceName: "HLY1111111100002"// org时 orgName tmnl 终端地址 meter 电表id
        }**/
      }
    }
```

2. table导出xls、csv、doc、pdf、xml
（参考http://localhost:1888/#/test/index页面）
```
api接口
import {exportAll, exportCurrent} from '@/api/system/exportTable'
参数如下
{
	url: '',// 请求后台api 例如 http://127.0.0.1/api/ami-system/org/queryDevice
	params: {}, // 查询表格的参数
	columns: [], // 导出列(列的key，列的name，列的数据转换规则)
	fileType: '', // 导出表格文件类型 1.csv 2.xls 3.doc 4.pdf 5.xml
	fileName： '', // 文件名
	sheetName: '',// 导出excel的sheet名称/表格名称
}
导出当前页要在查询表格的参数params里面加上limit page属性
```
