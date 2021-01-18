<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        label="连接类型"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">
        <a-select
          @change="handleTypeSelect"
          v-decorator="[
            'type',
            {rules: [{ required: true, message: '请选择连接类型' }]}
          ]"
          placeholder="请输入连接类型"
        >
          <a-select-option value="MySQL">MySQL</a-select-option>
          <a-select-option value="Oracle">Oracle</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item
        label="连接名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'lineName',
            {rules: [{ required: true, message: '请填写连接名称' }]}
          ]"
          placeholder="请输入连接名称" />
      </a-form-item>
      <!--<a-form-item-->
      <!--label="数据库驱动"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
      <!--<a-input-->
      <!--v-decorator="[-->
      <!--'driverName',-->
      <!--{rules: [{ required: true, message: '请填写驱动名称' }]}-->
      <!--]"-->
      <!--placeholder="请填写驱动名称" />-->
      <!--</a-form-item>-->
      <a-form-item
        label="数据库连接"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">
        <a-input
          v-decorator="[
            'url',
            {rules: [{ required: true, message: '请填写数据库连接' }]}
          ]"
          placeholder="请填写数据库连接" />
      </a-form-item>
      <a-form-item
        label="端口"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">
        <a-input
          v-decorator="[
            'port',
            {rules: [{ required: true, message: '请填写数据库连接' }]}
          ]"
          placeholder="请填写数据库连接" />
      </a-form-item>
      <a-form-item
        label="项目"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">
        <a-input
          v-decorator="[
            'schemas',
            {rules: [{ required: true, message: '请填写项目' }]}
          ]"
          placeholder="请填写项目" />
      </a-form-item>
      <a-form-item
        label="用户名"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'username',
            {rules: [{ required: true, message: '请填写用户名' }]}
          ]"
          placeholder="请填写用户名" />
      </a-form-item>
      <a-form-item
        label="密码"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          type="password"
          v-decorator="[
            'password',
            {rules: [{ required: true, message: '请填写密码' }]}
          ]"
          placeholder="请填写密码" />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
const driverMap = {
  'MySQL': {
    value: 'com.mysql.cj.jdbc.Driver',
    text: 'MySQL'
  },
  'Oracle': {
    value: 'oracle.jdbc.driver.OracleDriver',
    text: 'jdbc:oracle:thin:@IP地址:端口号:数据库名'
  },
  'SQLserver': {
    value: 'com.microsoft.sqlserver.jdbc.SQLServerDriver',
    text: 'jdbc:microsoft:sqlserver://IP地址:端口号;DatabaseName=数据库名'
  },
  3: {
    value: 'oracle.jdbc.driver.OracleDriver',
    text: 'jdbc:microsoft:sqlserver://IP地址:端口号;DatabaseName=数据库名'
  }
}
export default {
  name: 'GenertorInfo',
  components: {
  },
  data () {
    return {
      menuParentList: [],
      menuCheck: false,
      isAdd: true,
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        genertorId: '',
        type: undefined,
        lineName: '',
        driverName: '',
        port: '',
        schemas: '',
        url: '',
        username: '',
        password: ''
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.genertorId) {
        Object.assign(this.formItem, {
          genertorId: data.genertorId,
          type: data.type,
          lineName: data.lineName,
          driverName: data.driverName,
          port: data.port,
          schemas: data.schemas,
          url: data.url,
          username: data.username,
          password: data.password
        })
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['type', 'lineName', 'url', 'port', 'schemas', 'username', 'password']))
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
            const paramer = {
              lineName: values.lineName,
              driverName: that.formItem.driverName,
              port: values.port,
              url: values.url,
              schemas: values.schemas,
              username: values.username,
              password: values.password,
              genertorId: this.formItem.genertorId,
              type: values.type
            }
            this.$http.post(this.$apis.developer.code.genertor.save, paramer, this).then(res => {
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
    handleTypeSelect (value) {
      this.formItem.driverName = driverMap[value].value
    }
  },
  mounted: function () {
  }
}
</script>
