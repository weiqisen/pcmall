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
        <a-tab-pane tab="基本信息" key="form1" name="form1">
          <genertor-info ref="form1" :parent-visable.sync="visible" forceRender></genertor-info>
        </a-tab-pane>
        <!--<a-tab-pane tab="选择表" key="form2" name="form2">-->
        <!--<table-info ref="form2" :parent-visable.sync="visible" forceRender></table-info>-->
        <!--</a-tab-pane>-->
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button v-show="current=='form1'" key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button v-show="current=='form1'" key="primary" :loading="confirmLoading" type="primary" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import GenertorInfo from './form/genertor-info'
import TableInfo from './form/table-info'
export default {
  name: 'GenertorModal',
  components: { GenertorInfo, TableInfo },
  props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      saving: false,
      isEdit: false,
      disable: false,
      modalTitle: '',
      current: 'form1',
      lineName: '',
      formData: {},
      forms: [
        'form1',
        'form2'
      ]
    }
  },
  methods: {
    edit (data) {
      this.visible = true
      this.isEdit = false
      this.lineName = ''
      if (data && data.genertorId) {
        this.isEdit = true
        this.lineName = data.lineName
        this.formData = data
      } else {
        this.formData = {}
      }
      // if(current){
      //   this.handleTabClick(current)
      // }else{
      this.handleTabClick('form1')
      // }
      this.visible = true
      this.disable = this.handleDisable()
    },
    handleModalChange (visible) {
      if (!visible) {
        this.$refs[this.current].handleReset()
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
    handleSubmit () {
      this.saving = true
      this.$refs[this.current].handleSubmit().then(res => {
        if (res) {
          if (res.code === 0) {
            this.handleModalChange(false)
          }
        }
      }).finally(() => {
        this.saving = false
      })
    },
    handleCancel (visible) {
      if (!visible) {
        this.$refs[this.current].handleReset()
        this.visible = false
        // this.$emit('reloadTable')
      }
    },
    handleTabClick (name) {
      this.$nextTick(() => {
        this.current = name
        this.modalTitle = this.isEdit ? `编辑连接 - ${this.lineName}` : '新增连接'
        if (name == 'form1') {
          this.$refs.form1.setData(this.formData)
        } else if (name == 'form2') {
          this.$refs.form2.setData(this.formData)
        }
      })
    }
  },
  created () {

  }
}
</script>
