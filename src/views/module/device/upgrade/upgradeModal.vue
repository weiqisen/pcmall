<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
  >
    <div>
      <upgrade-index ref="form1" :parent-visable.sync="visible" forceRender></upgrade-index>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">关闭</a-button>
      <a-button key="primary" :loading="confirmLoading" @click="handleSubmit">升级</a-button>
    </template>
  </a-modal>
</template>

<script>
import UpgradeIndex from './form/upgrade-index'
export default {
  name: 'UpgradeModal',
  components: { UpgradeIndex },
  // props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      modalTitle: '',
      current: 'form1',
      deviceName: '',
      status: '',
      formData: [],
      forms: [
        'form1'
      ]
    }
  },
  methods: {
    edit (data, status) {
      this.visible = true
      this.deviceName = ''
      this.status = status
      if (data && data.length > 0) {
        this.deviceName = data.deviceName
        this.formData = data
      } else {
        this.formData = []
      }
      this.handleTabClick(this.current)
      // this.modalTitle = `设备升级`
      // this.$nextTick(() => {
      //   this.$refs.form1.handleSend(this.formData)
      // })
    },
    handleModalChange (visible, res) {
      if (!visible) {
        this.visible = false
        this.$emit('ok', res)
      }
    },
    handleSubmit () {
      this.saving = true
      this.$refs[this.current].handleSubmit().then(res => {
        if (res) {
          this.handleModalChange(false, res)
        }
      }).finally(() => {
        this.saving = false
      })
    },
    handleCancel (visible) {
      // clear form & currentStep
      // this.visible = false
      // this.currentStep = 0
      if (!visible) {
        // this.$refs[this.current].handleReset()
        this.visible = false
        // this.$emit('reloadTable')
      }
    },
    handleTabClick (name) {
      this.$nextTick(() => {
        this.current = name
        this.modalTitle = `设备升级`
        if (name == 'form1') {
          this.$refs.form1.handleSend(this.formData)
        }
      })
    }
  },
  created () {

  }
}
</script>
