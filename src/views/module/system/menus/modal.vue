<template>
  <a-modal
    :title="modalTitle"
    :width="740"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel(false)"
  >
    <div>
      <a-tabs :activeKey="current" @tabClick="handleTabClick">
        <a-tab-pane tab="基本信息" key="form1" name="form1">
          <menu-info ref="form1" :parent-visable.sync="visible"></menu-info>
        </a-tab-pane>
        <a-tab-pane :disabled="!isEdit" tab="操作权限" key="form2" forceRender name="form2">
          <menu-auth ref="form2"></menu-auth>
        </a-tab-pane>
        <a-tab-pane :disabled="!isEdit" tab="菜单接口权限" key="form3" forceRender name="form3">
          <menu-autha ref="form3"></menu-autha>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button v-show="current!='form2'" key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button v-show="current!='form2'" key="primary" :loading="confirmLoading" type="primary" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import MenuInfo from './form/menu-info'
import MenuAuth from './form/menu-auth'
import MenuAutha from './form/menu-autha'
export default {
  name: 'MenuModal',
  components: { MenuInfo, MenuAuth, MenuAutha },
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
      roleName: '',
      formData: {},
      forms: [
        'form1',
        'form2',
        'form3'
      ]
    }
  },
  methods: {
    edit (data, current) {
      this.visible = true
      this.isEdit = false
      this.menuName = ''
      if (data && data.menuId) {
        this.isEdit = true
        this.menuName = data.menuName
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
        this.$refs[this.current].handleReset()
        this.visible = false
        // this.$emit('reloadTable')
      }
    },
    handleTabClick (name) {
      this.$nextTick(() => {
        this.current = name
        this.modalTitle = this.isEdit ? `编辑菜单 - ${this.menuName}` : '新增菜单'
        if (name == 'form1') {
          this.$refs.form1.setData(this.formData)
        } else if (name == 'form2') {
          this.$refs.form2.setData(this.formData)
        } else if (name == 'form3') {
          this.$refs.form3.setData(this.formData)
        }
      })
    }
  },
  created () {

  }
}
</script>
