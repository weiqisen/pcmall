<template>
  <page-view style="margin-bottom: 50px;">
    <a-card :bordered="false">
      <a-form @submit="handleSubmit" :form="form">
        <a-form-item
          help="分布地址名称支持数字，字母，汉字，下划线及破折号，2到30位"
          label="分布地址名称"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
          <a-input
            v-decorator="[
              'distributionName',
              {rules: [{ required: true, message: '请输入分布地址名称' },{validator: validateToDistributionName}]}
            ]"
            name="distributionName"
            placeholder="请输入分布地址名称" />
        </a-form-item>
        <a-form-item
          label="经度"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
          <span slot="help">
            经度范围是0-180°，保留4为小数。<a target="_blank" href="http://api.map.baidu.com/lbsapi/getpoint/index.html">去百度获取</a>
          </span>
          <a-input
            v-decorator="[
              'lon',
              {rules: [{ required: true, message: '请输入经度' },{validator: validateToLon}]}
            ]"
            name="lat"
            placeholder="请输入经度" />
        </a-form-item>
        <a-form-item
          label="纬度"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
          <span slot="help">
            纬度范围是0-90°，保留4为小数。<a target="_blank" href="http://api.map.baidu.com/lbsapi/getpoint/index.html">去百度获取</a>
          </span>
          <a-input
            v-decorator="[
              'lat',
              {rules: [{ required: true, message: '请输入纬度' },{validator: validateToLat}]}
            ]"
            name="lon"
            placeholder="请输入纬度" />
        </a-form-item>
        <a-form-item
          label="设备分布图"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">

          <a-upload
            :showUploadList="false"
            :data="handleUploadData"
            :action="$apis.device.upload"
            :before-upload="beforeUpload"
            :headers="header"
            name="file"
            @change="handleChange"
          >
            <a-button
              :loading="uploadLoad"
              :disabled="uploadLoad"
              type="primary" >
              <tc-icon v-show="uploadLoad?false:true" title="导出" type="iconwenjianshangchuan1"></tc-icon>
              上传文件 </a-button>

          </a-upload>
          <span style="color: rgba(0, 0, 0, 0.45);">
            分布地图地址格式为图片png,jpep
          </span>
          <br/>
          <img id="preview" style="width:100%;height: auto;" :src="formItem.imgPath">
        </a-form-item>
      </a-form>
    </a-card>
    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 220 : 80}px)` : '100%'}">
      <a-button @click="handleBack" :loading="loading" style="margin-right: 5px;">返回</a-button>
      <a-button @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
  </page-view>
</template>

<script>
import { PageView } from '@/layouts'
import pick from 'lodash.pick'
import FooterToolBar from '@/components/FooterToolbar'
import { mixin, mixinDevice } from '@/utils/mixin'
import AFormItem from 'ant-design-vue/es/form/FormItem'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  name: 'DistribuAdd',
  mixins: [mixin, mixinDevice],
  components: {
    AFormItem,
    PageView,
    FooterToolBar
  },
  data () {
    return {
      header: {
        'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
      },
      uploadLoad: false,
      confirmLoading: false,
      isAdd: true,
      formData: {},
      formItem: this.getFormItem(),
      form: this.$form.createForm(this),
      loading: false,
      errors: []
    }
  },
  methods: {
    validateToDistributionName (rule, value, callback) {
      const reg = this.$rules.cnEnNumSpace2to30
      if (!reg.test(value)) {
        callback(new Error(this.$rules.cnEnNumSpace2to30Msg))
      } else {
        callback()
      }
    },
    validateToLon (rule, value, callback) {
      // 经度
      const reg = this.$rules.numForDotFour
      if (reg.test(value)) {
        if (parseInt(value) > 0 && parseInt(value) <= 180) {
          callback()
        } else {
          callback('经度范围是0-180°，请输入正确的值！')
        }
      } else {
        callback('经度' + this.$rules.numForDotFourMsg)
      }
    },
    validateToLat (rule, value, callback) {
      // 纬度
      const reg = this.$rules.numForDotFour
      if (reg.test(value)) {
        if (parseInt(value) > 0 && parseInt(value) <= 90) {
          callback()
        } else {
          callback('纬度范围是0-90°，请输入正确的值！')
        }
      } else {
        callback('纬度' + this.$rules.numForDotFourMsg)
      }
    },
    getFormItem () {
      return {
        distributionId: '',
        distributionName: '',
        lat: '',
        lon: '',
        imgPath: ''
      }
    },
    beforeUpload (file) {
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
      if (!isJpgOrPng) {
        this.$message.error('图片格式不正确，请重新选择!')
      }
      return isJpgOrPng
    },
    handleChange (info) {
      // this.uploadLoad = true
      if (info.file.status !== 'uploading') {
        console.log(info.file, info.fileList)
      } else if (info.file.status === 'uploading') {
        this.uploadLoad = true
        return
      }
      if (info.file.status === 'done') {
        this.uploadLoad = false
        if (info.file.response.code === 0) {
          this.$message.success(`${info.file.name} 文件上传成功！`)
          this.formItem.imgPath = info.file.response.data.fileUrl
        } else {
          this.$message.error(`${info.file.name}` + info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败！`)
        this.uploadLoad = false
      }
    },
    handleUploadData () {
      const data = {
        username: this.$store.getters.username,
        tenantId: this.$store.getters.tenantId,
        serverName: 'device_manage',
        groupName: '',
        fileFlag: '2'
      }
      return data
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit (e) {
      e.preventDefault()
      const that = this
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              distributionName: values.distributionName,
              lat: values.lat,
              lon: values.lon
            })
            this.$http.post(this.$apis.distribu.save, this.formItem, this).then(res => {
              if (res.code === 0) {
                this.$notification.success({
                  message: '提示',
                  description: '分布地址操作成功',
                  duration: 8
                })
                that.handleBack()
              } else {
                this.$notification.error({
                  message: '提示',
                  description: res.data.message,
                  duration: 8
                })
              }
            }).catch(function (err) {
              reject(err)
            })
          } else {
            for (const item in err) {
              this.$notification.error({
                message: '提示',
                description: err[item].errors[0].message
              })
            }
            resolve(false)
          }
        })
      })
    },

    handleInit () {
      const that = this
      if (this.$route.params.distributionId) {
        this.formItem.distributionId = this.$route.params.distributionId
      } else if (this.formItem.distributionId) {
        this.formItem.distributionId = this.formItem.distributionId
      } else {
        return
      }
      this.$http.get(this.$apis.distribu.info, { distributionId: this.formItem.distributionId }, this).then(res => {
        that.formItem = res.data
        const { form: { setFieldsValue } } = that
        this.$nextTick(() => {
          setFieldsValue(pick(that.formItem, ['distributionId', 'distributionName', 'lat', 'lon', 'imgPath']))
        })
      })
    },
    // 最终全页面提交
    validate (e) {
      this.handleSubmit(e)
      // const { $refs: { repository, task }, $notification } = this
      // const repositoryForm = new Promise((resolve, reject) => {
      //   repository.form.validateFields((err, values) => {
      //     if (err) {
      //       reject(err)
      //       return
      //     }
      //     resolve(values)
      //   })
      // })
      // const taskForm = new Promise((resolve, reject) => {
      //   task.form.validateFields((err, values) => {
      //     if (err) {
      //       reject(err)
      //       return
      //     }
      //     resolve(values)
      //   })
      // })
      //
      // // clean this.errors
      // this.errors = []
      // Promise.all([repositoryForm, taskForm]).then(values => {
      //   $notification['error']({
      //     message: 'Received values of form:',
      //     description: JSON.stringify(values)
      //   })
      // }).catch(() => {
      //   const errors = Object.assign({}, repository.form.getFieldsError(), task.form.getFieldsError())
      //   const tmp = { ...errors }
      //   this.errorList(tmp)
      //   console.log(tmp)
      // })
    },
    errorList (errors) {
      if (!errors || errors.length === 0) {
        return null
      }
      this.errors = Object.keys(errors).map(key => {
        if (!errors[key]) {
          return null
        }

        return {
          key: key,
          message: errors[key][0],
          fieldLabel: fieldLabels[key]
        }
      })
    },
    handleBack () {
      this.$router.go(-1)// 返回上一层
    }
  },
  mounted: function () {
  },
  create () {
    this.handleInit()
  },
  beforeRouteEnter (to, from, next) {
    debugger
    if (to.params && typeof (to.params.option) !== 'undefined') {
      if (to.params.option === 1) {
        to.meta.title = '分布地址编辑'
      } else {
        to.meta.title = '分布地址添加'
      }
    }
    if (from.name === 'distribuIndex') {
      next(vm => {
        vm.handleInit()
      })
    } else if (from.name === 'deviceIndex') {
      next(vm => {
        vm.handleInit()
      })
    } else {
      next()
    }
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当钩子执行前，组件实例还没被创建
  }
}
</script>
