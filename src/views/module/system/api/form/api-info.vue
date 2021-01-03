<template>
  <div>
    <a-form :model="formItem" @submit="handleSubmit" :form="form">
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="编码"
        prop="apiCode">
        <a-input
          :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
          v-model="formItem.apiCode"
          placeholder="请输入内容"></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="名称"
        prop="apiName">
        <a-input
          :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
          v-model="formItem.apiName"
          placeholder="请输入内容"></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="访问地址"
        prop="path">
        <a-input
          :disabled="formItem.apiId && formItem.isPersist === 1?true:false"
          v-model="formItem.path"
          placeholder="请输入内容"></a-input>
      </a-form-item>
      <!--      <a-form-item-->
      <!--        :labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"-->
      <!--        label="服务名称"-->
      <!--        prop="apiType">-->
      <!--        <a-select-->
      <!--          v-model="formItem.apiType"-->
      <!--          allowClear-->
      <!--          name="apiType"-->
      <!--          placeholder="请选择服务！"-->
      <!--          @change="handleOnSelectService"-->
      <!--        >-->
      <!--          <a-select-option v-for="d in selectServiceList" :key="d.value">-->
      <!--            {{ d.text }}-->
      <!--          </a-select-option>-->
      <!--        </a-select>-->
      <!--        &lt;!&ndash;<a-input v-model="formItem.serviceId" placeholder="spring.application.name"></a-input>&ndash;&gt;-->
      <!--      </a-form-item>-->
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="分类"
        prop="apiCategory">
        <a-input v-model="formItem.apiCategory" placeholder="请输入内容"></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="优先级">
        <a-input v-model="formItem.priority"></a-input>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="请求方式">
        <a-radio-group buttonStyle="solid" v-model="formItem.requestMethod">
          <a-radio-button value="POST">POST</a-radio-button>
          <a-radio-button value="GET">GET</a-radio-button>
          <a-radio-button value="PUT">PUT</a-radio-button>
          <a-radio-button value="DELETE">DELETE</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="身份认证">
        <a-radio-group buttonStyle="solid" v-model="formItem.isAuth">
          <a-radio-button :disabled="formItem.apiId?true:false" value="0">关闭</a-radio-button>
          <a-radio-button :disabled="formItem.apiId && formItem.isPersist === 1?true:false" value="1">开启</a-radio-button>
        </a-radio-group>
        <p style="margin-bottom: 0;"><code>开启：未认证登录,提示"认证失败,请重新登录!";<br/>
          关闭: 不需要认证登录。</code></p>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="状态">
        <a-radio-group buttonStyle="solid" v-model="formItem.status">
          <a-radio-button value="0">禁用</a-radio-button>
          <a-radio-button value="1">正常</a-radio-button>
          <a-radio-button value="2">维护中</a-radio-button>
        </a-radio-group>
        <p style="margin-bottom: 0;"><code>禁用：提示"请求地址,禁止访问!";<br/>
          维护中：提示"正在升级维护中,请稍后再试!";</code></p>
      </a-form-item>
      <a-form-item
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }"
        label="描述">
        <a-input v-model="formItem.apiDesc" type="textarea" placeholder="请输入内容"></a-input>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'ApiInfo',
  data () {
    const validateEn = (rule, value, callback) => {
      const reg = /^[_.a-zA-Z0-9]+$/
      if (value === '') {
        callback(new Error('接口编码不能为空'))
      } else if (value !== '' && !reg.test(value)) {
        callback(new Error('只允许字母、数字、点、下划线'))
      } else {
        callback()
      }
    }

    return {
      isAdd: true,
      formItemRules: {
        serviceId: [
          { required: true, message: '所属服务不能为空', trigger: 'blur' }
        ],
        apiCategory: [
          { required: true, message: '接口分类不能为空', trigger: 'blur' }
        ],
        path: [
          { required: true, message: '接口地址不能为空', trigger: 'blur' }
        ],
        apiCode: [
          { required: true, validator: validateEn, trigger: 'blur' }
        ],
        apiName: [
          { required: true, message: '接口名称不能为空', trigger: 'blur' }
        ]
      },
      formItem: this.getFormItem(),
      form: this.$form.createForm(this),
      selectServiceList: []
    }
  },
  methods: {
    getFormItem () {
      return {
        apiId: '',
        apiType: undefined,
        apiCode: '',
        apiName: '',
        apiCategory: 'default',
        path: '',
        status: 1,
        isAuth: 1,
        openSwatch: false,
        authSwatch: true,
        serviceId: '',
        priority: 0,
        apiDesc: '',
        requestMethod: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.apiId) {
        Object.assign(this.formItem, {
          apiId: data.apiId,
          apiType: data.apiType + '',
          apiCode: data.apiCode,
          apiName: data.apiName,
          apiCategory: data.apiCategory,
          path: data.path,
          status: data.status + '',
          isAuth: data.isAuth + '',
          serviceId: data.serviceId,
          requestMethod: data.requestMethod,
          priority: data.priority,
          apiDesc: data.apiDesc
        })
        this.isAdd = false
      } else {
        this.handleReset()
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http.post(this.$apis.api.save, this.formItem, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    handleOnSelectService (value) {
      this.formItem.apiType = value
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
