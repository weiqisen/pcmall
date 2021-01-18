<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="设备名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'deviceName',
            {rules: [{ required: true, message: '请输入设备名称' }]}
          ]"
          name="deviceName"
          placeholder="请输入设备名称" />
      </a-form-item>
      <a-form-item
        label="设备编号"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'deviceSn',
            {rules: [{ required: true, message: '请输入设备编号' }]}
          ]"
          name="deviceSn"
          placeholder="请输入设备编号" />
        <span>设备编号信息格式为(CP335C_IMEI)号</span>
      </a-form-item>
      <a-form-item
        label="设备分布"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-select
          v-decorator="[
            'distribuId',
            {rules: [{ required: true, message: '请选择设备分布' }]}
          ]"
          placeholder="请选择设备分布">
          <a-select-option value="1">系统管理</a-select-option>
          <a-select-option value="10">设备管理</a-select-option>
        </a-select>
      </a-form-item>
      <!--<a-form-item-->
      <!--label="状态"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
      <!--<div>-->
      <!--<a-radio-group buttonStyle="solid" v-decorator="['status' , { initialValue: '1' }]">-->
      <!--<a-radio-button value="0">禁用</a-radio-button>-->
      <!--<a-radio-button value="1">正常</a-radio-button>-->
      <!--</a-radio-group>-->
      <!--</div>-->
      <!--</a-form-item>-->
      <!--<a-form-item-->
      <!--label="描述"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
      <!--<a-textarea-->
      <!--rows="4"-->
      <!--placeholder="请输入描述内容"-->
      <!--v-decorator="[-->
      <!--'roleDesc',-->
      <!--{rules: [{ required: true, message: '请输入内容' }]}-->
      <!--]" />-->
      <!--</a-form-item>-->
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'DeviceInfo',
  data () {
    const validateEn = (rule, value, callback) => {
      const reg = /^[_a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('角色编码不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、下划线'))
      } else {
        callback()
      }
    }
    return {
      isAdd: true,
      formItemRules: {
        roleCode: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ]
      },
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        deviceId: '',
        deviceName: '',
        deviceSn: 'CP335C_',
        distribuId: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.deviceId) {
        Object.assign(this.formItem, {
          deviceId: data.deviceId,
          deviceName: data.deviceName,
          deviceSn: data.deviceSn,
          distribuId: data.distribuId
        })
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['deviceName', 'deviceSn', 'distribuId']))
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              deviceName: values.deviceName,
              deviceSn: values.deviceSn,
              distribuId: values.distribuId
            })
            values.deviceId = this.formItem.deviceId
            this.$http.post(this.$apis.device.save, this.formItem, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          } else {
            resolve(false)
          }
        })
      })
    }
  },
  mounted: function () {
  }
}
</script>
