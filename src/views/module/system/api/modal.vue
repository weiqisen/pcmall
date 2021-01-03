<template>
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
  >
    <div>
      <a-tabs :activeKey="current" @tabClick="handleTabClick">
        <a-tab-pane :disabled="current==='form2'" tab="基本信息" key="form1" forceRender name="form1">
          <api-info ref="form1" :parent-visable.sync="visible"></api-info>
        </a-tab-pane>
        <a-tab-pane :disabled="current!=='form2'" tab="接口更新" key="form2" forceRender name="form2">
          <api-update ref="form2"></api-update>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" type="primary" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import ApiInfo from './form/api-info'
import ApiUpdate from './form/api-update'

export default {
  name: 'ApiModal',
  components: { ApiInfo, ApiUpdate },
  props: {},
  data () {
    return {
      confirmLoading: false,
      saving: false,
      visible: false,
      isEdit: false,
      modalTitle: '',
      current: 'form1',
      apiName: '',
      formData: {},
      forms: [
        'form1',
        'form2'
      ]
    }
  },
  methods: {
    edit (data, current) {
      this.isEdit = false
      this.apiId = ''
      if (data && data.apiId) {
        this.isEdit = true
        this.apiName = data.apiName
        this.formData = data
      } else {
        this.formData = {}
      }
      if (current) {
        this.handleTabClick(current)
      } else {
        this.handleTabClick('form1')
      }
      this.visible = true
    },
    handleModalChange (visible) {
      if (!visible) {
        this.$refs[this.current].handleReset()
        this.visible = false
        this.$emit('ok')
      }
    },
    handleSubmit () {
      this.saving = true
      this.$refs[this.current].handleSubmit().then(res => {
        if (res) {
          this.handleModalChange(false)
        }
      }).finally(() => {
        this.saving = false
      })
    },
    handleCancel (visible) {
      if (!visible) {
        this.$refs[this.current].handleReset()
        this.visible = false
      }
    },
    handleTabClick (name) {
      this.$nextTick(() => {
        this.current = name
        this.modalTitle = this.isEdit ? `编辑 - ${this.apiName}` : '新增'
        setTimeout(() => {
          if (name === 'form1') {
            this.$refs.form1.setData(this.formData)
          } else if (name === 'form2') {
            this.$refs.form2.setData(this.formData)
          }
        }, 10)
      })
    }
  },
  created () {
  }
}
</script>

<style scoped lang="less" rel="stylesheet/less">

</style>
