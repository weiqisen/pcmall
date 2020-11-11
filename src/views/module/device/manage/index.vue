<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
              <a-input v-model="queryParam.deviceName" placeholder="请输入设备名称/设备编号" allowClear />
            </a-col>
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-select v-model="queryParam.online" placeholder="请选择设备种类" allowClear>
                <a-select-option value="1">surface3</a-select-option>
                <a-select-option value="0">surfacePro5</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="4" :sm="24" style="padding: 0 3px;">
              <span class="table-page-search-submitButtons">
                <a-button @click="handleTableQuery">
                  <jihao-icon type="icon_search"></jihao-icon>
                  查询</a-button>
                <a-button style="margin-left: 8px" @click="handleRestQuery">
                  <jihao-icon type="icon_clear_query"></jihao-icon>
                  重置</a-button>
              </span>
            </a-col>
          </a-row>
        </a-form>
      </div>

      <div class="table-operator">
        <a-button @click="handleEdit()">
          <jihao-icon type="icon_add"></jihao-icon>
          设备</a-button>
        <a-button @mousedown="handleDeleteInfo" :disabled="selectedRowKeys.length > 0?false:true">
          <jihao-icon title="批量删除" type="icon_delete"></jihao-icon>
          批量删除</a-button>
        <!--<a-button @click="handleDistribu">-->
          <!--<jihao-icon type="icon_tiaozheng"></jihao-icon>-->
          <!--分布地调整</a-button>-->
        <download-excel
                style="display: inline-block"
                class="export-excel-wrapper"
                :beforeGenerate="handleExcel"
                :data="exportData"
                :fields="loadfields"
                :name="exportName">
          <!-- 上面可以自定义自己的样式，还可以引用其他组件button -->
          <a-button>
            <jihao-icon type="icon_batch_export"></jihao-icon>
            导出excel</a-button>
        </download-excel>
        <a-upload
                :showUploadList="false"
                :data="handleUploadData"
                :action="$apis.device.template.export"
                name="file"
                :beforeUpload="beforeUpload"
                @change="handleChange"
                :disabled="uploadLoad"
        >
          <a-button :loading="uploadLoad">
            <jihao-icon v-show="uploadLoad?false:true" title="导入模版"
                        type="icon_piliangdaoru"></jihao-icon>
            导入模版
          </a-button>
        </a-upload>

        <download-excel
                style="display: inline-block"
                class="export-excel-wrapper"
                :data="exportData"
                :fields="exportfields"
                :fetch="handleTempleDown"
                :name="exportName">
          <a style="margin-right: 8px;">下载模版</a>
        </download-excel>
      </div>
      <a-alert
              message="说明：这是一条说明"
              type="info"
              show-icon
      />
      <s-table
        ref="table"
        size="default"
        rowKey="deviceId"
        :columns="columns"
        :data="loadData"
        bordered
        :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange}"
      >
         <span slot="deviceBug" slot-scope="text">
          <a-tag >{{text}}</a-tag>
        </span>
        <span slot="online" slot-scope="text">
          <a-tag :color="text | statusTypeFilter" @click="handleView(record,record.ethernet)">{{text | statusFilter}}</a-tag>
        </span>
        <span slot="action" slot-scope="text, record">
          <template>
            <a-button @mousedown="handleEdit($event,record)" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="编辑" type="icon_edit_dark"></jihao-icon>
              <span style="font-size: 12px;">编辑</span>
            </a-button>
            <a-button @mousedown="handleRemove($event,record)" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></jihao-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
      </s-table>
      <role-modal ref="modal" @ok="handleOk"/>
      <a-modal
              :centered="true"
              title="批量删除"
              :visible="visible"
              :confirm-loading="confirmLoading"
              @ok="handleBatchDelete"
              @cancel="handleCancel(false)"
      >
        <p>{{modalContent}}</p>
      </a-modal>
      <a-modal
        :width="1060"
        :centered="true"
        title="导入模版-确认"
        :visible="importVisible"
        :confirm-loading="confirmLoading"
        @ok="handleBatchImportData"
        @cancel="handleImportCancel(false)"
      >
        <a-table
          ref="table1"
          rowKey="categoryId"
          :columns="columns1"
          :dataSource="data"
          :pagination="false"
          bordered
        >
          <template
            v-for="col in ['categoryName', 'distribuName']"
            :slot="col"
            slot-scope="text, record, index">
            <div :key="col">
              <a-select
                v-if="col==='distribuName'"
                v-model="record.distribuId"
                @change="handleDistribuChange"
                placeholder="请选择设备分布地"
              >
                <a-select-option v-for="(item, index) in distribuList" :key="index" :value="item.distributionId">
                  {{ item.distributionName }}</a-select-option>
              </a-select>
              <a-select
                v-if="col==='categoryName'"
                v-model="record.categoryId"
                placeholder="请选择设备分类"
                @change="handleChangeSelect"
              >
                <a-select-option v-for="(item, index) in categoryList" :key="index" :value="item.categoryId">
                  {{ item.name }}</a-select-option>
              </a-select>
            </div>
          </template>
          <span slot="action" slot-scope="text, record, index">
          <template>
            <a-button @click="handleTableDeleteRow(index)" style="padding: 0 6px;font-size: 12px;height: 26px;">
              <jihao-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></jihao-icon>
              <span style="font-size: 12px;">删除</span>
            </a-button>
          </template>
        </span>
        </a-table>
      </a-modal>
    </a-card>
  </page-view>
</template>

<script>
  import { PageView } from '@/layouts'
  import { STable } from '@/components'
  import { getRoleList, getServiceList } from '@/api/manage'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import RoleModal from './modal'
  import Vue from 'vue'
  import XLSX from 'xlsx'
  const statusMap = {
    0: {
      status: '',
      text: '离线'
    },
    1: {
      status: 'green',
      text: '在线'
    }
  }

  export default {
    name: 'DeviceIndex',
    components: {
      PageView,
      STable,
      RoleModal,
      XLSX
    },
    data () {
      return {
        importVisible: false,
        visible: false,
        confirmLoading: false,
        modalContent: '',
        header: {
          'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
        },
        uploadLoad: false,
        exportName: '导出表格',
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '设备Sn',
            dataIndex: 'deviceSn'
          },
          {
            title: '型号',
            dataIndex: 'deviceName',
          },
          {
            title: '规格',
            dataIndex: 'deviceRom',
          },
          {
            title: '外观',
            dataIndex: 'deviceNew',
          },
          {
            title: '缺陷',
            dataIndex: 'deviceBug',
            scopedSlots: { customRender: 'deviceBug' }

          },
          {
            title: '分类',
            dataIndex: 'categoryName'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '50px',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData: parameter => {
          this.queryParam.deviceSn = this.queryParam.deviceName
          return this.$http.get(this.$apis.device.page, Object.assign(parameter, this.queryParam), this).then(res => {
            res.data.current = parseInt(res.data.current)
            res.data.total = parseInt(res.data.total)
            res.data.size = parseInt(res.data.size)
            res.data.pages = parseInt(res.data.pages)
            return res
          })
        },
        loadfields:{
          '设备编号':'deviceSn',    //常规字段
          '设备名称': 'deviceName', //支持嵌套属性
          '设备状态': {
            field: "online",
            //自定义回调函数
            callback: value => {
              return statusMap[value].text;
            }
          },
          '设备分类':'categoryName',
          '设备IP':'deviceIp',
          '创建时间':'createTime'
        },
        exportData:[],
        deviceStatus: '',
        setTimeStatus: '',
        exportfields:{
          '设备名称': 'deviceName', //支持嵌套属性
          '设备编号':'deviceSn',    //常规字段
          '设备分布地ID': 'distribuId', //支持嵌套属性
          '设备分布地':'distribuName',    //常规字段
          '设备分类ID': 'categoryId', //支持嵌套属性
          '设备分类':'categoryName',    //常规字段
          '设备分布式标注x轴':'distribuImgX',    //常规字段
          '设备分布式标注y轴': 'distribuImgY' //支持嵌套属性
        },
        selectedRowKeys: [],
        selectedRows: [],
        data:[],
        distribuList:[],
        categoryList:[],
        columns1:[
          {
            title: '设备名称',
            dataIndex: 'deviceName',
          },
          {
            title: '设备编号',
            dataIndex: 'deviceSn',
            width:220
          },
          {
            title: '设备分类',
            dataIndex: 'categoryName',
            scopedSlots: { customRender: 'categoryName' },
            width:220
          },
          {
            title: '设备分布地',
            dataIndex: 'distribuName',
            scopedSlots: { customRender: 'distribuName' },
            width:220
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '70px',
            fixed: 'right',
            scopedSlots: { customRender: 'action' }
          }
        ]
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      }
    },
    computed: {
      title () {
        return this.$route.meta.title
      }
    },
    created () {
      this.handleInitRefresh()
    },
    destroyed (){
      clearInterval(this.deviceStatus)
      clearTimeout(this.setTimeStatus)
    },
    methods: {
      beforeUpload(file) {
        let result = ''
        const fileArray = file.name.split(".")
        const suffix = fileArray[fileArray.length-1]
        if(!suffix){
          result = false
          return result
        }
        const xlslist = ['xls','xlsx']
        result = xlslist.some(function(item){
          return item === suffix
        })
        if(!result){
          return "请选择xls，或者xlsx文件导入！"
        }
        this.readExcel(file).then(tabJson => {
          debugger
          if (tabJson && tabJson.length > 0) {
            this.data = tabJson[0].sheet
            this.importVisible = true
            console.log('数据', this.data)
          }
        })
        this.handleLoadCategoryList()
        this.handleLoadDistribuList()
        return false
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoad = true
          this.$message.success('文件上传中，请勿刷新或关闭页面');
          return
        }
        if (info.file.status === 'done') {
          this.uploadLoad = false
          if (info.file.response.code === 0) {
            this.$message.success(`${info.file.name} 文件上传成功！`);
          } else {
            this.$message.error(`${info.file.name}` + info.file.response.message)
          }
          this.$refs.table.refresh()
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 文件上传失败！`);
          this.uploadLoad = false
        }
      },
      handleLoadCategoryList (){
        const that = this
        this.$http.get(this.$apis.category.list, {parentId : 0 }, this).then(res => {
          that.categoryList = res.data
        })
      },
      handleLoadDistribuList (){
        const that = this
        this.$http.get(this.$apis.distribu.list, {}, this).then(res => {
          that.distribuList = res.data
        })
      },
      handleChangeSelect (value, option){
        value = value.key
        this.formItem.categoryName = option.componentOptions.children[0].elm.data.trim()
      },
      handleDistribuChange (value){
        this.handleLoadImage(value,this.distribuList,this)
      },
      readExcel(file) {// 解析Excel
        let _this = this;
        return new Promise(function(resolve, reject){// 返回Promise对象
          const reader = new FileReader();
          reader.onload = (e) => {// 异步执行
            try {
              debugger
              // 以二进制流方式读取得到整份excel表格对象
              let data = e.target.result,workbook = XLSX.read(data, {type: 'binary'});
              const result = [];
              for (let item in workbook.SheetNames){
                let SheetName = workbook.SheetNames[item]
                let sheetInfos = workbook.Sheets[SheetName];
                let arr = []
                let outdata = XLSX.utils.sheet_to_json(sheetInfos);
                outdata.map(v => {
                  let obj = {}
                  obj.deviceSn = v.设备编号
                  obj.deviceName = v.设备名称
                  obj.categoryName = v.设备分类
                  obj.distribuName = v.设备分布地
                  obj.categoryId = v.设备分类ID
                  obj.distribuId = v.设备分布地ID
                  arr.push(obj)
                })
                result.push({
                  sheetName: SheetName,
                  sheet: arr
                });
              }
              resolve(result);
            } catch (e) {
              reject(e.message);
            }
          };
          reader.readAsBinaryString(file);
        });
      },
      handleTableDeleteRow(key) {
        const dataSource = [...this.data];
        this.data = dataSource.filter((item,index) => index !== key);
      },
      handleUploadData() {
        const data = {
          username: this.$store.getters.username,
          tenantId: this.$store.getters.tenantId,
          serverName: 'device_manage',
          groupName: '',
          fileFlag:'3'
        }
        return data
      },
      statusFilter (type) {
        return statusMap[type].text
      },
      handleSysey () {
        let deviceList = []
        if(this.$refs.table.localDataSource){
          this.$refs.table.localDataSource.map(item => {
            deviceList.push({
              deviceId:item.deviceId,
              deviceSn:item.deviceSn
            })
          })
        }
        this.$http.get(this.$apis.device.interval, {
          deviceList: JSON.stringify(deviceList)
        }, this).then(res => {
          let deviceList = res.data
          if(this.$refs.table.localDataSource){
            if(deviceList){
              deviceList.map(dev => {
                this.$refs.table.localDataSource.map(item => {
                  if(item.deviceId===dev.deviceId){
                    if(typeof(dev.online)!='undefined'&&item.online!=dev.online){
                      item.online = dev.online
                    }
                  }
                })
              })
            }
          }
        })
      },
      handleEdit (event,record) {
        let option = 0
        if(record&&record.deviceId){
          option = 1
        }
        this.$router.push({
          name: 'deviceAdd',
          params: {deviceId:record?record.deviceId:'',option:option}
        })
        clearInterval(this.deviceInterval)
        event.preventDefault()
      },
      // handleDistribu (){
      //   this.$router.push({
      //     name: 'deviceAdjust',
      //     meta:{
      //       title:'设备调整'
      //     }
      //   })
      //   clearInterval(this.deviceInterval)
      // },
      async handleExcel (){
        if(this.selectedRows&&this.selectedRows.length>0){
          this.exportData = this.selectedRows
          this.exportName = '导出excel'+new Date().getTime()+'.xls'
          return
        }
        const parameter = {
          pageNo:1,
          pageSize: this.$refs.table.localPagination.total
        }
        let p1 = await this.$http.get(this.$apis.device.page, Object.assign(parameter, this.queryParam), this)
        this.exportData = p1.data.records
        this.exportName = new Date().getTime()+'.xls'
      },
      handleRemove (event,record) {
        this.$http.delete(this.$apis.device.remove, {
          deviceId: record.deviceId
        }, this).then(res => {
          this.handleOk()
        })
        event.preventDefault()
      },
      handleOk () {
        this.$refs.table.refresh()
      },
      handleInitRefresh (){
        this.setTimeStatus = setTimeout(this.handleLoadInit, 5000)
      },
      handleLoadInit (){
        this.deviceStatus = setInterval(this.handleSysey, 9000)
      },
      onSelectChange (selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      handleRestQuery (){
        this.queryParam = {}
        this.handleTableQuery()
      },
      handleTableQuery (){
        this.$refs.table.refresh(true)
        this.selectedRowKeys = []
        this.selectedRows = []
      },
      handleDeleteInfo (event){
        this.visible = true
        if(this.selectedRows&&this.selectedRows.length>0){
          this.modalContent = '确定删除选中设备!'
        }else{
          this.modalContent = '确定删除查询的设备!'
        }
        event.preventDefault()
      },
      handleBatchDelete (){
        let param = {}
        if(this.selectedRows&&this.selectedRows.length>0){
          param.deviceIds = this.selectedRowKeys.join(',')
        }else{
          this.queryParam.deviceSn = this.queryParam.deviceName
          Object.assign(param, this.queryParam)
        }
        const that = this
        this.$http.post(this.$apis.device.batchRemove,param,this).then(res=>{
          if (res.code === 0) {
            that.$notification.success({
              message: '提示',
              description: '操作成功',
              duration: null
            })
            that.selectedRowKeys= []
            that.selectedRows= []
            that.handleOk()
          }else{
            that.$notification.warning({
              message: '提示',
              description: res.data.message,
              duration: null
            })
          }
          that.handleTableQuery()
        }).finally(() => {
          that.visible = false
        })
      },
      handleCancel (visible) {
        if (!visible) {
          this.visible = false
        }
      },
      handleImportCancel (visible) {
        if (!visible) {
          this.importVisible = false
        }
      },
      handleBatchImportData (){
        debugger
        let arr = this.$refs.table1.dataSource
        var index = this.displayDate(arr)
        if(index.start) {
          this.$notification.warning({
            message: '提示',
            description: '第' + index.start + '行名称' + index.startName + '，编号' + index.startDeviceSn + '与第' + index.end + '行名称' + index.endName + '，编号' + index.endDeviceSn + '相同',
            duration: 8
          })
          return
        }
        const that = this
        if(arr.length>0) {
          this.$http.post(this.$apis.device.template.export, {
            deviceList: JSON.stringify(arr)
          }, this).then(res => {
            if (res.code === 0) {
              that.$notification.success({
                message: '提示',
                description: '操作成功',
                duration: 8
              })
              that.selectedRowKeys = []
              that.selectedRows = []
              that.handleOk()
              that.importVisible=false
            } else {
              that.$notification.warning({
                message: '提示',
                description: res.data.message,
                duration: 8
              })
            }
            that.handleTableQuery()
          }).finally(() => {
            that.visible = false
          })
        }
      },
      displayDate(arr) {
        var index = {}
        var find = false;
        for (var i = 0; i < arr.length; i++) {
          for (var j = i + 1; j < arr.length; j++) {
            if (arr[i].deviceName == arr[j].deviceName || arr[i].deviceSn == arr[j].deviceSn) {
              find = true
              index.start = i
              index.end = j
              index.startName = arr[i].deviceName
              index.endName = arr[j].deviceName
              index.startDeviceSn = arr[i].deviceSn
              index.endDeviceSn = arr[j].deviceSn
              break
            }
          }
          if (find) break
        }
        return index
      },
      async handleTempleDown () {
        debugger
        this.exportName = new Date().getTime() + '.xlsx'
        return this.$http.getDown(this.$apis.device.template.download, {}, "arraybuffer").then(res => {
          const blob = new Blob([res.data]);
          const fileName = '导入模版'+new Date().getTime()+".xlsx"
          const downloadElement = document.createElement('a');
          const href = window.URL.createObjectURL(blob);
          downloadElement.href = href;
          downloadElement.download = decodeURIComponent(fileName);
          document.body.appendChild(downloadElement);
          downloadElement.click();
          document.body.removeChild(downloadElement);
          window.URL.revokeObjectURL(href);
        })
      }
    },
    beforeRouteLeave (to, from, next){
      next(vm => {
        clearInterval(vm.deviceStatus)
        clearTimeout(vm.setTimeStatus)
      })
    }
  }
</script>
<style>
  .ant-table-row .ant-select{
    width:220px;
  }
</style>
