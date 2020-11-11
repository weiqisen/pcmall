<template>
  <a-modal
    :title="modalTitle"
    :width="800"
    :visible="visible"
    :confirmLoading="confirmLoading"
    :maskClosable="false"
    @cancel="handleCancel(false)"
  >
    <div>
        <detail-index ref="form1" :parent-visable.sync="visible"></detail-index>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">关闭</a-button>
    </template>
  </a-modal>
</template>

<script>
  import DetailIndex from './form/detail_index'
  export default {
    name: 'DetailModal',
    components: { DetailIndex },
    // props: {},
    data () {
      return {
        visible: false,
        confirmLoading: false,
        modalTitle: '',
        current: 'form1',
        deviceName: '',
        status: '',
        formData: {},
        forms: [
          'form1'
        ]
      }
    },
    methods: {
      edit (data,status) {
        this.visible = true
        this.deviceName = ''
        this.status = status
        if (data && data.deviceId) {
          this.deviceName = data.deviceName
          this.formData = data
        } else {
          this.formData = {}
        }
        this.modalTitle = `告警详情 - ${this.deviceName}`
        this.$nextTick(() => {
          this.$refs.form1.handleOk(this.formData,this.status)
        })
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
        // clear form & currentStep
        // this.visible = false
        // this.currentStep = 0
        if (!visible) {
          // this.$refs[this.current].handleReset()
          this.visible = false
          // this.$emit('reloadTable')
        }
      },
      // handleTabClick (name) {
      //   this.$nextTick(() => {
      //     this.current = name
      //     this.modalTitle = `告警详情 - ${this.deviceName}`
      //     if (name == 'form1') {
      //       this.$refs.form1.handleOk(this.formData,this.status)
      //     }
      //     // else if (name == 'form2') {
      //     //   this.$refs.form2.setData(this.formData)
      //     // } else if (name == 'form3') {
      //     //   this.$refs.form3.setData(this.formData)
      //     // } else if (name == 'form4') {
      //     //   this.$refs.form4.setData(this.formData)
      //     // }
      //   })
      // }
    },
    created () {

    }
  }
</script>
