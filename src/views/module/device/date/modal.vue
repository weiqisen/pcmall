<template>
  <a-modal
    :title="modalTitle"
    :width="640"
    :visible="visible"
    :maskClosable="false"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
  >
    <div>
      <a-tabs :activeKey="current" @tabClick="handleTabClick">
        <a-tab-pane tab="基本信息" key="form1" name="form1">
          <distribu-info ref="form1" :parent-visable.sync="visible"></distribu-info>
        </a-tab-pane>
        <!--<a-tab-pane :disabled="!isEdit" tab="地图位置" key="form2" forceRender name="form2">-->
        <!--<role-auth ref="form2"></role-auth>-->
        <!--</a-tab-pane>-->
        <!--<a-tab-pane :disabled="!isEdit" tab="访问授权" key="form3" forceRender name="form3">-->
        <!--<role-api ref="form3"></role-api>-->
        <!--</a-tab-pane>-->
        <!--<a-tab-pane :disabled="!isEdit" tab="成员列表" key="form4" forceRender name="form4">-->
        <!--<role-user ref="form4"></role-user>-->
        <!--</a-tab-pane>-->
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" type="primary" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import DistribuInfo from './form/distribu-info'
export default {
  name: 'DistribuModal',
  components: { DistribuInfo },
  props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      saving: false,
      isEdit: false,
      modalTitle: '',
      current: 'form1',
      distributionName: '',
      formData: {},
      forms: [
        'form1'
      ]
    }
  },
  methods: {
    edit (data, current) {
      this.visible = true
      this.isEdit = false
      this.distributionName = ''
      if (data && data.distributionId) {
        this.isEdit = true
        this.distributionName = data.distributionName
        this.formData = data
      } else {
        this.formData = {}
      }
      if (current) {
        this.handleTabClick(current)
      } else {
        this.handleTabClick('form1')
      }
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
        this.modalTitle = this.isEdit ? `编辑分布地 - ${this.distributionName}` : '新增分布地'
        if (name == 'form1') {
          this.$refs.form1.setData(this.formData)
        }
        // else if (name == 'form2') {
        //   this.$refs.form2.setData(this.formData)
        // }
        // else if (name == 'form3') {
        //   this.$refs.form3.setData(this.formData)
        // } else if (name == 'form4') {
        //   this.$refs.form4.setData(this.formData)
        // }
      })
    }
  },
  created () {

  }
}
</script>
