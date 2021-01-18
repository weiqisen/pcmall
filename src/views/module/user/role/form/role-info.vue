<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        help="支持数字，字母，汉字，下划线及破折号，4到30位"
        label="角色名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'roleName',
            {rules: [{ required: true, message: '请输入角色名称' },$rules.name]}
          ]"
          name="roleName"
          placeholder="请输入角色名称" />
      </a-form-item>
      <a-form-item
        help="角色编码支持数字，字母，4到20位"
        label="角色编码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'roleCode',
            {rules: [{ required: true, message: '请输入角色编码' },{validator: validateToRoleCode}]}
          ]"
          name="roleCode"
          placeholder="请输入角色编码" />
      </a-form-item>
      <a-form-item
        label="状态"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <div>
          <a-radio-group buttonStyle="solid" v-decorator="['status' , { initialValue: '1' }]">
            <a-radio-button value="0">禁用</a-radio-button>
            <a-radio-button value="1">正常</a-radio-button>
          </a-radio-group>
        </div>
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-textarea
          rows="4"
          placeholder="请输入描述内容"
          v-decorator="[
            'roleDesc',
            {rules: [{ required: true, message: '请输入内容' },$rules.char0to100Desc]}
          ]" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'RoleInfo',
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
    validateToRoleCode (rule, value, callback) {
      const reg = this.$rules.enNum4to20
      if (!reg.test(value)) {
        callback(new Error(this.$rules.enNum4to20Msg))
      } else {
        callback()
      }
    },
    getFormItem () {
      return {
        roleId: '',
        roleCode: '',
        roleName: '',
        status: 1,
        roleDesc: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.roleId) {
        if (this.formItem.roleId) {
          Object.assign(this.formItem, this.form.getFieldsValue())
        } else {
          Object.assign(this.formItem, {
            roleId: data.roleId,
            roleCode: data.roleCode,
            roleName: data.roleName,
            roleType: data.roleType,
            status: data.status + '',
            roleDesc: data.roleDesc
          })
        }
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
        Object.assign(this.formItem, this.form.getFieldsValue())
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['roleCode', 'roleName', 'status', 'roleDesc']))
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      const that = this
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              roleCode: values.roleCode,
              roleName: values.roleName,
              status: values.status,
              roleDesc: values.roleDesc
            })
            values.roleId = this.formItem.roleId
            this.$http.post(this.$apis.role.save, this.formItem, this).then(res => {
              if (res.code === 0) {
                that.formItem.userId = res.data
                that.isAdd = false
                this.$notification.success({
                  message: '提示',
                  description: '操作成功',
                  duration: 8
                })
              } else {
                this.$notification.error({
                  message: '提示',
                  description: res.data.message
                })
              }
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
