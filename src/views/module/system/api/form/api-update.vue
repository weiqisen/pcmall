<template>
  <div>
    <a-form :model="formItem" @submit="handleSubmit" :form="form">
      <a-form-item
        :wrapperCol="{lg: {span: 24}, sm: {span: 24} }">
        <a-form-item
          label="过期时间"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 20}, sm: {span: 20} }">
        </a-form-item>
        <a-form-item
          :labelCol="{lg: {span: 0}, sm: {span: 0}}"
          :wrapperCol="{lg: {span: 24}, sm: {span: 24} }">
          <a-transfer
            showSearch
            :dataSource="selectUpdateServiceList"
            :listStyle="{
              width: '46%',
              height: '350px',
            }"
            :targetKeys="formItem.serviceList"
            @change="handleTransferChange"
            :render="item=>`${item.title}-${item.apiName}`">
            <span slot="notFoundContent">
              没数据
            </span>
          </a-transfer>
        </a-form-item>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>

export default {
  name: 'ApiUpdate',
  data () {
    return {
      selectUpdateServiceList: [],
      formItem: this.getFormItem(),
      formItemRules: {
        serviceList: [
          { required: true, type: 'array', min: 1, message: '服务名称不能为空', trigger: 'blur' }
        ]
      },
      form: this.$form.createForm(this),
      selectServiceList: []
    }
  },
  methods: {
    getFormItem () {
      return {
        serviceList: []
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
            const serviceApiList = []
            if (this.formItem.serviceList && this.formItem.serviceList.length > 0) {
              this.formItem.serviceList.forEach(item => {
                this.selectUpdateServiceList.filter(f => {
                  if (item === f.apiCode) {
                    serviceApiList.push(f)
                  }
                })
              })
            }
            this.$http.postJson(this.$apis.api.batchAddService, { systemApiList: serviceApiList }, this).then(res => {
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
    setData (data) {
      this.isAdd = true
      // this.handleLoadServiceList()
      this.handleReset()
    },
    handleLoadUpdateServiceList (serviceId) {
      this.$http.get(this.$apis.api.batchUpdateServiceList, { serviceId: serviceId }, this).then(res => {
        if (res.data) {
          res.data.map(item => {
            item.key = item.apiCode
            item.title = item.schemas + item.path
            item.path = item.schemas + item.path
          })
          this.selectUpdateServiceList = res.data
        }
      })
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      this.formItem.serviceList = newTargetKeys
    },
    // transferRender (item) {
    //   return `<span  title="${item.label}">${item.label}(${item.size})</span>`
    // },
    // handleLoadServiceList () {
    //   this.$http.get(this.$apis.dict.list, this).then(res => {
    //     const data = res.data.map(item => ({
    //       text: item.dictName,
    //       value: item.dictValue,
    //       code: item.dictCode
    //     }))
    //     this.selectServiceList = data
    //     const { form: { setFieldsValue } } = this
    //     this.$nextTick(() => {
    //       setFieldsValue({ 'apiType': data[0].value })
    //     })
    //     this.handleLoadUpdateServiceList(data[0].code)
    //   })
    // },
    handleSelect (value, option) {
      this.handleLoadUpdateServiceList(option.componentOptions.propsData.label)
    }
  },
  mounted () {
    // this.handleLoadUpdateServiceList()
  }
}
</script>
