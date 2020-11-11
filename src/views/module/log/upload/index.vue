<template>
    <page-view :title="title">
        <a-card :bordered="false">
            <div class="table-page-search-wrapper">
                <a-form layout="inline">
                    <a-row :gutter="48" style="margin: 0;">
                        <a-col :md="6" :sm="24" style="padding: 0 3px 0 0;">
                            <a-input v-model="queryParam.deviceName" placeholder="请输入设备名称/设备编号" allowClear/>
                        </a-col>
                        <a-col :md="6" :sm="24" style="padding: 0 3px;">
                            <a-select v-model="queryParam.online" placeholder="请选择设备状态" allowClear>
                                <a-select-option value="1">在线</a-select-option>
                                <a-select-option value="0">离线</a-select-option>
                            </a-select>
                        </a-col>
                        <a-col :md="6" :sm="24" style="padding: 0 3px;">
                          <span class="table-page-search-submitButtons">
                            <a-button @click="handleTableQuery">
                                <jihao-icon title="查询" type="icon_search"></jihao-icon>
                                查询</a-button>
                            <a-button style="margin-left: 8px" @click="handleRestQuery">
                                <jihao-icon style="color:rgba(0, 0, 0, 0.65);" title="查询" type="icon_clear_query"></jihao-icon>
                                重置</a-button>
                          </span>
                        </a-col>
                    </a-row>
                </a-form>
            </div>

            <div class="table-operator">
                <a-button type="primary" @mousedown="handleUploadLogBatch"
                          :disabled="selectedRowKeys.length > 0?false:true">
                    <jihao-icon title="导出" type="icon_bulk_upload_white"></jihao-icon>
                    批量上传
                </a-button>
            </div>

            <s-table
                ref="table"
                size="default"
                rowKey="deviceId"
                :columns="columns"
                :data="loadData"
                :rowSelection="{ selectedRowKeys: selectedRowKeys , onChange: onSelectChange,getCheckboxProps:handleGetSelect}"
                bordered
            >
                <span slot="online" slot-scope="text">
                  <a-tag :color="text | statusTypeFilter" @click="handleView(record,record.ethernet)">{{text | statusFilter}}</a-tag>
                </span>

                <span slot="action" slot-scope="text, record">
                  <template>
                      <span>
                      <a-button v-if="record.uploadStatus===1" :disabled="record.online===1?false:true" @mousedown="handleUploadLogShow($event,record)" type="primary" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
                        <jihao-icon style="font-size: 13px;" title="日志上传" type="icon_log_upload_gray"></jihao-icon>
                        <span style="font-size: 12px;">日志上传</span>
                      </a-button>
                      <a-progress v-if="record.uploadStatus===0" type="circle" :percent="record.uploadProgress" :width="45">
                        <template #format="percent">
                          <span style="font-size: 12px;transform: scale(0.80);">{{ percent }}%</span>
                        </template>
                      </a-progress>
                    </span>
                  </template>
                </span>
            </s-table>
            <role-modal ref="modal" @ok="handleOk"/>
        </a-card>
        <a-modal
                :centered="true"
                title="日志上传"
                :visible="visible"
                :confirm-loading="confirmLoading"
                :maskClosable="false"
                @ok="handleUploadLog"
                @cancel="handleCancel"
        >
            <p>您确定对以下设备编号进行日志上传？</p>
            <p v-for="(item, index) in deviceList">{{item.deviceSn}}</p>
        </a-modal>
    </page-view>
</template>

<script>
  import {PageView} from '@/layouts'
  import {STable} from '@/components'
  import {getRoleList, getServiceList} from '@/api/manage'
  import RoleModal from './modal'

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
    name: 'SystemRole',
    components: {
      PageView,
      STable,
      RoleModal
    },
    data() {
      return {
        deviceList: [],
        itenValMap: {},
        visible: false,
        confirmLoading: false,
        deviceId: '',
        deviceSn: '',
        mdl: {},
        // 高级搜索 展开/关闭
        advanced: false,
        // 查询参数
        queryParam: {},
        // 表头
        columns: [
          {
            title: '设备编号',
            dataIndex: 'deviceSn'
          },
          {
            title: '设备名称',
            dataIndex: 'deviceName'
          },
          {
            title: '设备状态',
            dataIndex: 'online',
            scopedSlots: {customRender: 'online'}
          },
          {
            title: '设备IP',
            dataIndex: 'deviceIp'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '150px',
            scopedSlots: {customRender: 'action'}
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
        selectedRowKeys: [],
        selectedRows: [],
        setTimeStatus:''
      }
    },
    filters: {
      statusFilter(type) {
        return statusMap[type].text
      },
      statusTypeFilter(type) {
        return statusMap[type].status
      }
    },
    computed: {
      title() {
        return this.$route.meta.title
      }
    },
    created() {
      this.handleLoadTime()
    },
    destroyed (){
      clearInterval(this.deviceStatus)
      clearTimeout(this.setTimeStatus)
      if(this.itenValMap&&this.itenValMap.map) {
        this.itenValMap.map((k, v) => {
          clearInterval(v)
        })
      }
    },
    methods: {
      handleUploadLogShow(event,record) {
        this.visible = true;
        this.deviceList.push({
          deviceId:record.deviceId,
          deviceSn:record.deviceSn
        })
        event.preventDefault()
      },
      handleUploadLog() {
        if(this.deviceList&&this.deviceList.length>0){
          if(this.deviceList.length===1){
            this.$http.get(this.$apis.log.upload, {
              deviceSn: this.deviceList[0].deviceSn,
              deviceId: this.deviceList[0].deviceId
            },this)
          }else{
            this.$http.post(this.$apis.log.uploadBatch, {
              deviceList:JSON.stringify(this.deviceList),
            },this)
          }
          this.deviceList.map(item => {
            if (this.itenValMap[item.deviceId]) {
              const tt = this.itenValMap[item.deviceId]
              clearInterval(tt)
            }
            this.$refs.table.localDataSource.map(itemDev => {
                if(item.deviceId === itemDev.deviceId){
                  const setInter = setInterval(this.getElevatorList, 3000, itemDev)
                  this.itenValMap[itemDev.deviceId] = setInter
                  if (this.$refs.table.localDataSource) {
                    this.$refs.table.localDataSource.map(itemData => {
                      if (itemData.deviceId === item.deviceId) {
                        itemData.uploadStatus = 0
                      }
                    })
                  }
                }
            })

          })
          this.deviceList = []
        }
        this.visible = false;
      },
      handleCancel(e) {
        this.visible = false;
        this.deviceList = []
      },
      handleUploadLogBatch(event) {
        if (this.selectedRows) {
          this.selectedRows.map(item => {
            const deviceItem = {
              deviceId: item.deviceId,
              deviceSn: item.deviceSn
            }
            this.deviceList.push(deviceItem)
          })
        }
        this.visible = true
        event.preventDefault()
      },
      handleLoadTime() {
        this.setTimeStatus = setTimeout(this.handleLoadInit, 5000)
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
      handleLoadInit() {
        this.deviceStatus = setInterval(this.handleSysey, 10000)
        if (this.$refs.table.localDataSource) {
          this.$refs.table.localDataSource.map(item => {
            if (item.uploadStatus === 0) {
              if (this.itenValMap[item.deviceId]) {
                const tt = this.itenValMap[item.deviceId]
                clearInterval(tt)
              }
              const setInter = setInterval(this.getElevatorList, 3000, item)
              this.itenValMap[item.deviceId] = setInter
            }
          })
        }
      },

      getElevatorList: function (record) {
        const that = this
        this.$http.get(this.$apis.log.progress, {
          deviceId: record.deviceId,
          deviceSn: record.deviceSn
        }, this).then(res1 => {
          if(res1.code===0) {
            console.log(res1.data)
            if(typeof(res1.data)==='undefined'){
              console.log(res1.data)
              const setInter = that.itenValMap[record.deviceId]
              clearInterval(setInter)
              record.uploadStatus = 1
              return
            }
          debugger
            if (res1.data.deviceId === record.deviceId) {
              if (res1.data.uploadStatus === 1) {
                var start = 0
                start = record.uploadProgress
                let timer = setInterval(() => {
                  if (start >= 100) {
                    clearInterval(timer)
                    record.uploadProgress = 100
                  } else {
                    start = start + 1
                    record.uploadProgress = start
                  }
                }, 25);

                setTimeout(function () {
                  const setInter = that.itenValMap[record.deviceId]
                  clearInterval(setInter)
                  record.uploadStatus = res1.data.uploadStatus
                  that.$refs.table.refresh()
                  clearInterval(timer)
                }, 3000)
              } else {
                var start = 0
                start = record.uploadProgress?record.uploadProgress:0
                let timer = setInterval(() => {
                  if (start >= res1.data.uploadProgress) {
                    clearInterval(timer)
                    start = res1.data.uploadProgress
                    record.uploadProgress = start
                  } else {
                    start = start + 1
                    record.uploadProgress = start
                  }
                }, 25);
                record.uploadStatus = res1.data.uploadStatus
                if (record.uploadProgress === 100) {
                  setTimeout(function () {
                    const setInter = that.itenValMap[record.deviceId]
                    clearInterval(setInter)
                    record.uploadStatus = res1.data.uploadStatus
                    that.$refs.table.refresh()
                    clearInterval(timer)
                  }, 3000)
                }
              }
            }
          }else{
            const setInter = that.itenValMap[record.deviceId]
            clearInterval(setInter)
            record.uploadStatus = 1
          }
        })
      },
      handleOk() {
        this.$refs.table.refresh()
      },
      handleRestQuery (){
        this.queryParam = {}
        this.handleTableQuery()
      },
      handleTableQuery (){
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.table.refresh(true)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      toggleAdvanced() {
        this.advanced = !this.advanced
      },
      resetSearchForm() {
      },
      handleGetSelect (record){
        return ({
          props: {
            disabled: record.online===0?true:false
          }
        })
      }
    },
    beforeRouteLeave (to, from, next){
      next(vm => {
        clearInterval(vm.deviceStatus)
        clearTimeout(vm.setTimeStatus)
        if(vm.itenValMap) {
          vm.itenValMap.map((k, v) => {
            clearInterval(v)
          })
        }
      })
    }
  }
</script>
