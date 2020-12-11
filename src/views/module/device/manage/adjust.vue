<template>
  <page-view :title="title">
    <a-card :bordered="false">
      <div class="table-page-search-wrapper">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="6" :sm="24" style="padding: 0 3px;">
              <a-select @change="handleDistribuChange" v-model="distribuId" placeholder="请选择设备分布地">
                <a-select-option v-for="(item, index) in distribuList" :key="index" :value="item.distributionId">
                  {{ item.distributionName }}</a-select-option>
              </a-select>
            </a-col>
            <a-col :md="24" :sm="24" style="padding: 0 3px;margin-top:10px;">
              <a-alert
                style="margin-bottom: 0 !important;"
                message="说明：先点击移动的目标，再点击选取到指定的位置"
                type="info"
                show-icon
              />
            </a-col>
          </a-row>
        </a-form>
      </div>
      <div style="position: relative;min-height: 300px;margin: 10px 3px;">
        <img @click="handleGetXY" ref="deviceImage" id="preview" style="width:100%;height: auto;" :src="imgPath" >
        <span
          v-if="deviceList"
          v-for="(item, index) in deviceList"
          :key="index"
          :value="item.deviceId"
          @click="handleClickChange(item)"
          :style="{'cursor': 'pointer','top':item.distribuImgY+ 'px','left':item.distribuImgX+ 'px','position':position,'text-align': 'center'}">
          <span :style="{'color':item.online===0?'#000':'green'}">{{ item.deviceName }}</span><br/>
          <span><tc-icon :style="{'color':item.online===0?'#000':'green'}" type="icon_device_center_dark" /></span>
        </span>
      </div>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 220 : 80}px)` : '100%'}">
      <a-button @click="handleBack" :loading="loading">返回</a-button>
    </footer-tool-bar>
  </page-view>
</template>

<script>
import { mixin, mixinDevice } from '@/utils/mixin'
import FooterToolBar from '@/components/FooterToolbar'
import { PageView } from '@/layouts'
export default {
  name: 'DeviceAdjust',
  mixins: [mixin, mixinDevice],
  components: {
    PageView,
    FooterToolBar
  },
  data () {
    return {
      clicked: false,
      loading: false,
      distribuImgH: '',
      distribuImgW: '',
      imgPath: '',
      distribuId: undefined,
      distribuName: '',
      distribuList: [],
      deviceList: [],
      position: 'absolute',
      deviceAdjust: {}
    }
  },
  computed: {
    title () {
      return this.$route.meta.title
    }
  },
  created () {
  },
  filters: {
    deviceStatusFilter (status) {
      if (status === '0') {
        return '#000'
      } else if (status === '1') {
        return 'green'
      }
    }
  },
  methods: {
    handleInit () {
      const that = this
      if (this.$route.query.distribuId) {
        this.distribuId = this.$route.query.distribuId
      } else {
        this.$http.get(this.$apis.distribu.list, {}, this).then(res => {
          if (res.code === 0) {
            res.data.map(item => {
              that.distribuList.push(item)
            })
          }
        })
        return
      }
      const p1 = this.$http.get(this.$apis.distribu.list, {}, this)
      const p2 = this.$http.get(this.$apis.device.list, { distribuId: this.distribuId }, this)
      Promise.all([p1, p2]).then(function (values) {
        const res1 = values[0]
        const res2 = values[1]
        if (res1.code === 0) {
          that.distribuList = []
          res1.data.map(item => {
            if (item.distributionId === that.distribuId) {
              that.imgPath = item.imgPath
              that.distribuName = item.distributionName
              that.$nextTick(() => {
                const rect = that.$refs.deviceImage.getBoundingClientRect()
                that.distribuImgH = rect.height
                that.distribuImgW = rect.width
                if (res2.code === 0) {
                  that.deviceList = []
                  res2.data.map(item1 => {
                    if (item1.distribuImgW && that.distribuImgW && that.distribuImgW > 0) {
                      const widthRatio = item1.distribuImgW / that.distribuImgW
                      item1.distribuImgX = item1.distribuImgX / widthRatio
                      item1.distribuImgY = item1.distribuImgY / widthRatio
                      console.log(item1.distribuImgX)
                      console.log(item1.distribuImgY)
                    }
                    that.deviceList.push(item1)
                  })
                }
              })
            }
            that.distribuList.push(item)
          })
        }
      })
    },
    handleLoadImage (distribuId, distribuList, that) {
      distribuList.map(item => {
        if (item.distributionId === distribuId) {
          that.imgPath = item.imgPath
          that.$nextTick(() => {
            that.distribuName = item.distributionName
            const rect = that.$refs.deviceImage.getBoundingClientRect()
            that.distribuImgH = rect.height
            that.distribuImgW = rect.width
          })
        }
      })
    },
    handleDistribuChange (value) {
      const rect = this.$refs.deviceImage.getBoundingClientRect()
      console.log(rect)
      this.distribuImgH = rect.height
      this.distribuImgW = rect.width
      const that = this
      this.handleLoadImage(value, this.distribuList, this)
      this.handleDeviceIcon(that)
    },
    handleDeviceIcon (that) {
      const rect = that.$refs.deviceImage.getBoundingClientRect()
      that.distribuImgH = rect.height
      that.distribuImgW = rect.width
      this.$http.get(this.$apis.device.list, { distribuId: this.distribuId }, this).then(res => {
        that.deviceList = []
        res.data.map(item => {
          if (item.distribuImgW && that.distribuImgW && that.distribuImgW > 0) {
            const widthRatio = item.distribuImgW / that.distribuImgW
            item.distribuImgX = item.distribuImgX / widthRatio
            item.distribuImgY = item.distribuImgY / widthRatio
            console.log(item.distribuImgX)
            console.log(item.distribuImgY)
          }
          that.deviceList.push(item)
        })
      })
    },
    handleBack () {
      this.$router.go(-1)// 返回上一层
    },
    handleClickChange (item) {
      this.deviceAdjust = item
    },
    handleGetXY (e) {
      const rect = this.$refs.deviceImage.getBoundingClientRect()
      this.deviceAdjust.distribuImgH = rect.height
      this.deviceAdjust.distribuImgW = rect.width
      this.deviceAdjust.distribuImgX = e.clientX - rect.left
      this.deviceAdjust.distribuImgY = e.clientY - rect.top
      this.$http.post(this.$apis.device.adjustSave, {
        deviceId: this.deviceAdjust.deviceId,
        distribuImgH: this.deviceAdjust.distribuImgH,
        distribuImgW: this.deviceAdjust.distribuImgW,
        distribuImgX: this.deviceAdjust.distribuImgX,
        distribuImgY: this.deviceAdjust.distribuImgY
      }, this)
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm => {
      vm.handleInit()
    })
  }
}
</script>
<style lang="less" scoped>
  /deep/ .ant-card{
    margin-bottom: 50px;
  }
</style>
