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
          <user-info ref="form1" :parent-visable.sync="visible"></user-info>
        </a-tab-pane>

        <a-tab-pane :disabled="!isEdit" tab="角色授权" key="form2" forceRender name="form2">
          <user-role ref="form2"></user-role>
        </a-tab-pane>
        <a-tab-pane :disabled="!isEdit" tab="修改密码" key="form4" forceRender name="form4">
          <update-password ref="form4"></update-password>
        </a-tab-pane>
      </a-tabs>
    </div>
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import UserInfo from './form/user-info'
import UserRole from './form/user-role'
import UpdatePassword from './form/update-password'

export default {
  name: 'UserModal',
  components: { UpdatePassword, UserRole, UserInfo },
  props: {},
  data () {
    return {
      visible: false,
      confirmLoading: false,
      saving: false,
      isEdit: false,
      modalTitle: '',
      current: 'form1',
      userName: '',
      formData: {},
      forms: [
        'form1',
        'form2',
        'form3',
        'form4'
      ]
    }
  },
  methods: {
    edit (data, current) {
      this.visible = true
      this.isEdit = false
      this.userName = ''
      if (data && data.userId) {
        this.isEdit = true
        this.userName = data.userName
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
      const that = this
      this.$refs[this.current].handleSubmit().then(res => {
        if (res) {
          this.handleModalChange(false)
          this.visible = false
          if (res.code === 0) {
            if (that.current === 'form1') {
              that.formData.userId = res.data
              this.isEdit = true
            }
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
        this.$emit('ok')
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
        this.modalTitle = this.isEdit ? `编辑用户 - ${this.userName}` : '新增用户'
        if (name === 'form1') {
          this.$refs.form1.setData(this.formData, type)
        } else if (name === 'form2') {
          this.$refs.form2.setData(this.formData)
        } else if (name === 'form3') {
          this.$refs.form3.setData(this.formData)
        } else if (name === 'form4') {
          this.$refs.form4.setData(this.formData)
        }
      })
    }
  },
  created () {

  }
}
</script>
