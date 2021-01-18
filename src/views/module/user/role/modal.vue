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
          <role-info ref="form1" :parent-visable.sync="visible"></role-info>
        </a-tab-pane>
        <a-tab-pane :disabled="!isEdit" tab="功能授权" key="form2" forceRender name="form2">
          <role-auth ref="form2"></role-auth>
        </a-tab-pane>
        <!--<a-tab-pane :disabled="!isEdit" tab="成员列表" key="form4" forceRender name="form4">-->
        <!--<role-user ref="form4"></role-user>-->
        <!--</a-tab-pane>-->
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import RoleInfo from './form/role-info'
import RoleAuth from './form/role-auth'
export default {
  name: 'RoleModal',
  components: { RoleInfo, RoleAuth },
  props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      saving: false,
      isEdit: false,
      modalTitle: '',
      current: 'form1',
      roleName: '',
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
      this.roleName = ''
      if (data && data.roleId) {
        this.isEdit = true
        this.roleName = data.roleName
        this.formData = data
      } else {
        this.formData = {}
      }
      if (current) {
        this.handleTabInit(current, 0)
      } else {
        this.handleTabInit('form1', 0)
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
          this.visible = false
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
    handleTabInit (name, type) {
      this.handleTabRuter(name, type)
    },
    handleTabClick (name) {
      this.handleTabRuter(name, 1)
    },
    handleTabRuter (name, type) {
      this.$nextTick(() => {
        if (name === this.current && type === 1) {
          return
        }
        this.current = name
        this.modalTitle = this.isEdit ? `编辑角色 - ${this.roleName}` : '新增角色'
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
