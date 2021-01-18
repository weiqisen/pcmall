<template>
  <a-modal
    :title="modalTitle"
    :width="780"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
  >
    <div>
      <category-info ref="form1" :parent-visable.sync="visible" forceRender></category-info>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import CategoryInfo from './form/category-info'

export default {
  name: 'CategoryModal',
  components: { CategoryInfo },
  props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      saving: false,
      isEdit: false,
      disable: false,
      modalTitle: '',
      roleName: '',
      formData: {}
    }
  },
  methods: {
    edit (data) {
      this.visible = true
      this.isEdit = false
      this.name = ''
      if (data && data.categoryId) {
        this.isEdit = true
        this.name = data.name
        this.formData = data
      } else {
        this.formData = {}
      }
      this.$nextTick(() => {
        this.modalTitle = this.isEdit ? `编辑分类 - ${this.name}` : '新增分类'
        this.$refs.form1.setData(this.formData)
      })
      this.visible = true
      this.disable = this.handleDisable()
    },
    handleModalChange (visible) {
      if (!visible) {
        this.$refs.form1.handleReset()
        this.visible = false
        this.$emit('ok')
      }
    },
    handleDisable () {
      if (!this.isEdit || (this.formData.parentId === '0' || this.formData.path)) {
        return false
      } else {
        return true
      }
    },
    handleSubmit (e) {
      this.saving = true
      this.$refs.form1.handleSubmit(e).then(res => {
        debugger
        if (res) {
          this.handleModalChange(false)
          this.visible = false
        }
      }).finally(() => {
        this.saving = false
      })
    },
    handleCancel (visible) {
      if (!visible) {
        this.$refs.form1.handleReset()
        this.visible = false
        // this.$emit('reloadTable')
      }
    }
    // handleTabClick (name) {
    //   this.$nextTick(() => {
    //     this.current = name
    //     this.modalTitle = this.isEdit ? `编辑分类 - ${this.name}` : '新增分类'
    //     if (name == 'form1') {
    //       this.$refs.form1.setData(this.formData)
    //     }
    //   })
    // }
  },
  created () {

  }
}
</script>
