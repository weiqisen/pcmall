<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="分布地址名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'distributionName',
            {rules: [{ required: true, message: '请输入分布地址名称' }]}
          ]"
          name="distributionName"
          placeholder="请输入分布地址名称" />
      </a-form-item>
      <a-form-item
              label="经度"
              :labelCol="{lg: {span: 7}, sm: {span: 7}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'lat',
            {rules: [{ required: true, message: '请输入经度' }]}
          ]"
          name="lat"
          placeholder="请输入经度" />
      </a-form-item>
      <a-form-item
        label="纬度"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'lon',
            {rules: [{ required: true, message: '请输入纬度' }]}
          ]"
          name="lon"
          placeholder="请输入纬度" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'DistribuInfo',
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
        distributionId: '',
        distributionName: '',
        lat: '',
        lon: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.distributionId) {
        Object.assign(this.formItem, {
          distributionId: data.distributionId,
          distributionName: data.distributionName,
          lat: data.lat,
          lon: data.lon
        })
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['distributionName','lat','lon']))
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
              distributionName: values.distributionName,
              lat: values.lat,
              lon: values.lon
            })
            this.$http.post(this.$apis.distribu.save, this.formItem, this).then(res => {
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
