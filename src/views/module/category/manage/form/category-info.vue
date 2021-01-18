<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <!--<a-form-item-->
      <!--label="上级分类"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14}}">-->
      <!--<a-tree-select-->
      <!--:disabled=categoryCheck-->
      <!--v-decorator="[-->
      <!--'parentId',-->
      <!--{rules: [{ required: true, message: '请选择上级菜单' }]}-->
      <!--]"-->
      <!--replaceFields="{children:'children', title:'name', key:'categoryId', value: 'categoryId' }"-->
      <!--tree-default-expand-all-->
      <!--:tree-data="categoryParentList"-->
      <!--placeholder="请选择上级菜单"-->
      <!--allow-clear-->
      <!--/>-->
      <!--</a-form-item>-->

      <a-form-item
        help="分类名称支持数字，字母，汉字，下划线及破折号，4到30位"
        label="分类名称"
        :labelCol="{lg: {span: 7}, sm: {span: 7}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'name',
            {rules: [{ required: true, message: '请输入分类名称' },$rules.name]}
          ]"
          placeholder="请输入内容" />
      </a-form-item>
      <!--<a-form-item-->
      <!--label="分类排序"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
      <!--<a-input-->
      <!--v-decorator="[-->
      <!--'sort',-->
      <!--{rules: [{ required: true, message: '请填写分类排序' }]}-->
      <!--]"-->
      <!--placeholder="请输入内容" />-->
      <!--</a-form-item>-->
      <!--<a-form-item-->
      <!--label="状态"-->
      <!--:labelCol="{lg: {span: 7}, sm: {span: 7}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
      <!--<div>-->
      <!--<a-radio-group buttonStyle="solid"-->
      <!--v-decorator="[-->
      <!--'status',-->
      <!--{rules: [{ required: true, message: '请选择状态' }]}-->
      <!--]"-->
      <!--&gt;-->
      <!--<a-radio-button value="0">禁用</a-radio-button>-->
      <!--<a-radio-button value="1">正常</a-radio-button>-->
      <!--</a-radio-group>-->
      <!--</div>-->
      <!--</a-form-item>-->
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'CategoryInfo',
  components: {
  },
  data () {
    return {
      categoryParentList: [],
      isAdd: true,
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        categoryId: undefined,
        name: '',
        sort: '1',
        status: 1,
        parentId: '0'
      }
    },
    setData (data) {
      this.isAdd = true
      if (data && data.categoryId) {
        console.log(data)
        Object.assign(this.formItem, {
          categoryId: data.categoryId,
          name: data.name,
          sort: data.sort,
          status: data.status + '',
          parentId: data.parentId
        })
        this.isAdd = false
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['name']))
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit (event) {
      if (event.type === 'submit') {
        event.preventDefault()
        return
      }
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            Object.assign(this.formItem, {
              name: values.name
            })
            this.$http.post(this.$apis.category.save, this.formItem, this).then(res => {
              if (res.code === 0) {
                this.$notification.open({
                  message: '操作',
                  description: '操作成功！'
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
            // this.$emit('ok')
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
