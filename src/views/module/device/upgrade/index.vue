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
            <!--:showUploadList="false"-->
            <div class="table-operator">
                <a-upload
                        style="display: inline-block;"
                        :data="handleUploadData"
                        :action="$apis.device.threeUpload"
                        :headers="header"
                        :showUploadList="false"
                        name="file"
                        :beforeUpload="beforeUpload"
                        @change="handleChange"
                        :disabled="uploadLoad"
                >
                    <a-button
                            :loading="uploadLoad"
                            type="primary">
                        <jihao-icon style="color:white;" v-show="uploadLoad?false:true" title="文件上传"
                                    type="iconwenjianshangchuan"></jihao-icon>
                        文件上传
                    </a-button>
                </a-upload>
                <a-button type="primary" @mousedown="handleBatchUpgrade" :disabled="selectedRowKeys.length > 0?false:true">
                    <jihao-icon title="批量升级" type="icon_fota_batch_upgrade_white"></jihao-icon>
                    批量升级
                </a-button>
            </div>
            <a-alert
                    message="说明：上传文件版本如xxx-xxx-xxx_V.1.0.1.5，_V或者_v后面到文件后缀名是版本信息"
                    type="info"
                    show-icon
            />
            <s-table
                    ref="table1"
                    size="default"
                    rowKey="fileId"
                    :columns="columns1"
                    :data="loadData1"
                    :showPagination="false"
                    :rowSelection="{ selectedRowKeys: selectedRadioRowKeys, onChange: onSelectRadioChange, type: 'radio' }"
            >
                <span slot="alarmType" slot-scope="text">
                  <span>{{text | alarmTypeFilter}}</span>
                </span>
                <span slot="alatmStaus" slot-scope="text">
                  <a-badge :status="text | alarmStatusFilter" :text="text | statusFilter" />
                </span>
                <span slot="action" slot-scope="text, record">
              <template>
                <span>
                     <a-button @mousedown="handleRemove($event,record)" style="padding: 0 6px;font-size: 12px;height: 26px;">
                      <jihao-icon style="font-size: 13px;" title="删除" type="icon_delete_device"></jihao-icon>
                      <span style="font-size: 12px;">删除</span>
                    </a-button>
                </span>
              </template>
            </span>
            </s-table>
        </a-card>
        <div>&nbsp;</div>
        <a-card :bordered="false">
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
               <a-tag :color="text | statusTypeFilter">{{text | statusFilter}}</a-tag>
            </span>

            <span slot="action" slot-scope="text, record">
              <template>
                <span>
                    <a-button v-if="record.upgradeStatus===1" :disabled="record.online===1?false:true" @mousedown="handleUpgrde($event,record)" type="primary" style="padding: 0 6px;font-size: 12px;margin-right: 3px;height: 26px;">
                    <jihao-icon style="font-size: 13px;" title="升级" type="icon_upgrade_dark"></jihao-icon>
                    <span style="font-size: 12px;">升级</span>
                    </a-button>
                  <a-progress v-if="record.upgradeStatus===0" type="circle" :percent="record.upgradeProgress" :width="45">
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
            :title="modalTitle"
            :visible="visible"
            :confirm-loading="confirmLoading"
            :maskClosable="false"
            @ok="handleUpgradeSubmit"
            @cancel="handleCancel"
        >
            <p>您确定对以下设备编号进行升级？</p>
            <p v-for="(item, index) in deviceList">{{item.deviceSn}}</p>
        </a-modal>
    </page-view>
</template>

<script>
  import {PageView} from '@/layouts'
  import {STable} from '@/components'
  import {getRoleList, getServiceList} from '@/api/manage'
  import {ACCESS_TOKEN} from '@/store/mutation-types'
  import RoleModal from './modal'
  import Vue from 'vue'

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
    name: 'UpgradeIndex',
    components: {
      PageView,
      STable,
      RoleModal
    },
    data() {
      return {
        submitType: 0,
        deviceList: [],
        visible:false,
        confirmLoading:false,
        modalTitle:'设备升级',
        asyncArray: [],
        itenValMap: {},
        percent: 35,
        header: {
          'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
        },
        uploadLoad: false,
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
            title: '设备版本',
            dataIndex: 'softwareVersion'
          },
          {
            title: '创建时间',
            dataIndex: 'createTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '90px',
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
        columns1: [
          {
            title: '文件名称',
            dataIndex: 'fileName'
          },
          {
            title: '版本',
            dataIndex: 'fileVersion'
          },
          {
            title: '文件大小',
            dataIndex: 'fileSize',
            width: '148px',
            scopedSlots: {customRender: 'fileSize'}
          },
          {
            title: '更新时间',
            dataIndex: 'updateTime'
          },
          {
            title: '操作',
            dataIndex: 'action',
            width: '60px',
            scopedSlots: {customRender: 'action'}
          }
        ],
        // 加载数据方法 必须为 Promise 对象
        loadData1: parameter => {
          parameter.pageSize = 3
          parameter.fileFlag = '1'
          return this.$http.get(this.$apis.disk.page, Object.assign(parameter, this.queryParam), this).then(res => {
            res.data.current = parseInt(res.data.current)
            res.data.total = parseInt(res.data.total)
            res.data.size = parseInt(res.data.size)
            res.data.pages = parseInt(res.data.pages)
            return res
          })
        },
        selectedRowKeys: [],
        selectedRows: [],
        selectedRadioRowKeys: [],
        selectedRadioRow:[],
        optionAlertShow: false,
        setTimeStatus:''
      }
    },
    filters: {
      statusFilter (type) {
        return statusMap[type].text
      },
      statusTypeFilter (type) {
        return statusMap[type].status
      },
      fileSizeTypeFilter (val){
        if(val===0) return '0 B'
        const k = 1024;
        const size = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(val) / Math.log(k));
        return (val/Math.pow(k,i)).toPrecision(3)+' '+size[i]
      }
    },
    computed: {
      title() {
        return this.$route.meta.title
      }
    },
    created() {
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
    mounted() {
      this.$nextTick(function () {
        this.handleLoadTime()
      })
    },
    methods: {
      beforeUpload(file) {
        const fileName = file.name
        if(fileName.indexOf("_v")>=0||fileName.indexOf("_V")>=0){
          return true
        }else{
          this.$message.error('文件名称不规范，请检查在上传!');
          return false
        }
      },
      handleCancel(e) {
        this.visible = false;
        this.deviceList = []
      },
      handleUpgrde(event,record) {
        if(this.selectedRadioRowKeys&&this.selectedRadioRowKeys.length>0){
          console.log("d")
        }else{
          this.$notification.warning({
            message: '提示',
            description:'请选择升级文件！'
          });
          return
        }
        this.deviceList.push({
          deviceId: record.deviceId,
          deviceSn: record.deviceSn
        })
        this.visible = true;
        this.submitType = 0
        event.preventDefault()
      },
      handleUploadData() {
        const data = {
          username: this.$store.getters.username,
          tenantId: this.$store.getters.tenantId,
          serverName: 'device_manage',
          groupName: '',
          fileFlag:'1'
        }
        return data
      },
      handleUpgradeSubmit() {
        const that = this
        if(this.submitType==0) {
          const deviceId = this.deviceList[0].deviceId
          const deviceSn = this.deviceList[0].deviceSn
          return new Promise((resolve, reject) => {
            this.$http.post(this.$apis.device.upgrade, {
                deviceId: deviceId,
                deviceSn: deviceSn,
                filesId: this.selectedRadioRowKeys[0]
              }, this
            ).then(res => {
              that.handleLoadEvent(that)
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          })
        }else if(this.submitType==1){
          return new Promise((resolve, reject) => {
            this.$http.post(this.$apis.device.upgradeBatch, {
                deviceList:JSON.stringify(this.deviceList),
                filesId: this.selectedRadioRowKeys[0]
              }, this
            ).then(res => {
              that.handleLoadEvent(that)
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          })
        }
      },
      handleLoadEvent (that){
        if (that.deviceList && that.deviceList.length > 0) {
          that.deviceList.map(item => {
            if (that.itenValMap[item.deviceId]) {
              const tt = that.itenValMap[item.deviceId]
              clearInterval(tt)
            }

            if (that.$refs.table.localDataSource) {
              that.$refs.table.localDataSource.map(itemData => {
                if (itemData.deviceId === item.deviceId) {
                  const setInter = setInterval(that.getElevatorList, 5000, itemData)
                  that.itenValMap[item.deviceId] = setInter
                  itemData.upgradeStatus = 0
                }
              })
            }
          })
        }
        that.visible = false
        that.deviceList = []
      },
      handleLoadTime() {
        this.setTimeStatus = setTimeout(this.handleLoadInit, 20000)
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
        if(deviceList&&deviceList.length>0) {
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
        }
      },
      handleLoadInit() {
        this.deviceStatus = setInterval(this.handleSysey, 10000)
        if (this.$refs.table.localDataSource) {
          this.$refs.table.localDataSource.map(item => {
            if (item.upgradeStatus === 0) {
              if (this.itenValMap[item.deviceId]) {
                const tt = this.itenValMap[item.deviceId]
                clearInterval(tt)
              }
              const setInter = setInterval(this.getElevatorList, 5000, item)
              this.itenValMap[item.deviceId] = setInter
            }
          })
        }
      },
      getElevatorList: function (record) {
        const that = this
        this.$http.get(this.$apis.device.progress, {
          deviceId: record.deviceId,
          deviceType: 1,
          deviceSn: record.deviceSn
        }, this).then(res1=> {
          if (res1.data.deviceId === record.deviceId) {
            if(res1.code===0) {
              if(typeof(res1.data)==='undefined'){
                record.upgradeStatus = 1
                return
              }
              if (res1.data.upgradeStatus === 1) {
                var start = 0
                start = record.upgradeProgress
                let timer = setInterval(() => {
                  if (start >= 100) {
                    clearInterval(timer)
                    record.upgradeProgress = 100
                  } else {
                    start = start + 1
                    record.upgradeProgress = start
                  }
                }, 45);
                setTimeout(function () {
                  const setInter = that.itenValMap[record.deviceId]
                  clearInterval(setInter)
                  record.upgradeStatus = res1.data.upgradeStatus
                  that.handleOk()
                  clearInterval(timer)
                }, 5000)
              } else {
                var start = 0
                start = record.upgradeProgress
                let timer = setInterval(() => {
                  if (start >= res1.data.upgradeProgress) {
                    clearInterval(timer)
                    start = res1.data.upgradeProgress
                    record.upgradeProgress = start
                  } else {
                    start = start + 1
                    record.upgradeProgress = start
                  }
                }, 45);
                record.upgradeStatus = res1.data.upgradeStatus
                if (record.upgradeProgress === 100) {
                  setTimeout(function () {
                    const setInter = that.itenValMap[record.deviceId]
                    clearInterval(setInter)
                    record.upgradeStatus = res1.data.upgradeStatus
                    that.handleOk()
                    clearInterval(timer)
                  }, 5000)
                }
              }
            }else{
              const setInter = that.itenValMap[record.deviceId]
              clearInterval(setInter)
              record.upgradeStatus = 1
            }
          }
        })
      },
      handleChange(info) {
        if (info.file.status === 'uploading') {
          this.uploadLoad = true
          console.log(info.file, info.fileList);
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
          this.$refs.table1.refresh()
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 文件上传失败！`);
          this.uploadLoad = false
        }
      },

      handleBatchUpgrade(event) {
        if(this.selectedRadioRowKeys&&this.selectedRadioRowKeys.length>0){
            console.log("d")
        }else{
          this.$notification.warning({
            message: '提示',
            description:'请选择升级文件！'
          });
          return
        }
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
        this.submitType = 1
        event.preventDefault()
      },
      handleRemove(event,record) {
        const that = this
        this.$http.delete(this.$apis.disk.remove, {
          fileId: record.fileId
        }, this).then(res => {
          that.$refs.table1.refresh()
        })
        event.preventDefault()
      },
      handleOk() {
        this.$refs.table.refresh()
      },
      handleRestQuery() {
        this.queryParam = {}
        this.handleTableQuery()
      },
      handleTableQuery() {
        this.selectedRowKeys = []
        this.selectedRows = []
        this.$refs.table.refresh(true)
        if(this.setTimeStatus){
          clearTimeout(this.setTimeStatus)
        }
        this.setTimeStatus = setTimeout(this.handleLoadInit, 10000)
      },
      onSelectChange(selectedRowKeys, selectedRows) {
        this.selectedRowKeys = selectedRowKeys
        this.selectedRows = selectedRows
      },
      onSelectRadioChange(selectedRowKeys, selectedRows) {
        this.selectedRadioRowKeys = selectedRowKeys
        this.selectedRadioRow = selectedRows
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
        if(vm.itenValMap&&vm.itenValMap.map) {
          vm.itenValMap.map((k, v) => {
            clearInterval(v)
          })
        }
      })
    }
  }
</script>
