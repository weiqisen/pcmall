<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="昵称"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          v-decorator="[
            'nickName',
            {rules: [{ required: true, message: '请输入昵称' },$rules.nickName]}
          ]"
          name="nickName"
          placeholder="请输入昵称" />
      </a-form-item>
      <a-form-item
        label="手机"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          v-decorator="[
            'mobile',
            {rules: $rules.mobile}
          ]"
          name="lat"
          placeholder="请输入手机"/>
      </a-form-item>
      <a-form-item
        label="邮箱"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          v-decorator="[
            'email',
            {rules: [{ required: false,message: '邮箱格式不正确'},{validator: validateEmail}]}
          ]"
          name="email"
          placeholder="请输入邮箱" />
      </a-form-item>
      <a-form-item
        label="居住地"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-input
          v-decorator="[
            'city',
            {rules: [{ required: false, message: '请输入居住地' },{validator: validateCity}]}
          ]"
          name="city"
          placeholder="请输入居住地" />
      </a-form-item>
      <a-form-item
        label="个人简介"
        :labelCol="{lg: {span: 5}, sm: {span: 5}}"
        :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
        <a-textarea
          rows="4"
          placeholder="请输入个人简介"
          v-decorator="[
          'userDesc',
            {rules: [{ required: false, message: '请输入个人简介' },{validator: valiDescCity}]}
          ]" />
      </a-form-item>
      <a-form-item
              label=" "
              :labelCol="{lg: {span: 5}, sm: {span: 5}}"
              :wrapperCol="{lg: {span: 16}, sm: {span: 16} }">
      <a-button @click="handleSubmit">保存</a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'Profile',
  data () {
    return {
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    validateCity (rule,value,callback) {
      if(value.length>150){
        callback('居住地长度超过150个字符！')
      }else {
        callback()
      }
    },
    valiDescCity (rule,value,callback) {
      if(value.length>100){
        callback('个人简介长度超过100个字符！')
      }else {
        callback()
      }
    },
    validateEmail (rule, value, callback) {
      const reg = this.$rules.emailRule
      // 邮箱
      if(value) {
        if (!reg.test(value)) {
          callback(this.$rules.emailRuleMsg)
        } else {
          if(value.length>70){
            callback('邮箱长度超过70个字符！')
          }else {
            callback()
          }
        }
      }else{
        callback()
      }
    },
    getFormItem () {
      return {
        userId: '',
        nickName: '',
        mobile: '',
        email: '',
        city: '',
        userDesc: ''
      }
    },
    setData (data) {
      if (data && data.userId) {
        Object.assign(this.formItem, {
          userId: data.userId,
          nickName: data.nickName,
          mobile: data.mobile,
          email: data.email,
          city: data.city,
          userDesc: data.userDesc
        })
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['nickName','mobile','email','city','userDesc']))
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit (e) {
      e.preventDefault()
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              nickName: values.nickName,
              mobile: values.mobile,
              email: values.email,
              city: values.city,
              userDesc: values.userDesc,
            })
            this.$http.post(this.$apis.user.updateCurrent, this.formItem, this).then(res => {
              if (res.code===0){
                this.$store.commit('SET_NAME', {name:this.formItem.nickName,welcome:'修改个人资料成功！'})
                this.$notification.open({
                  message: '操作',
                  description: '修改个人资料成功！'
                })
              }
              this.$emit('ok')
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
<style>
  .ant-form .ant-form-item:last-child .ant-form-item-label label::after{
    content: '';
  }
</style>
