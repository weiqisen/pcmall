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
        <a-tab-pane :disabled="!isEdit" tab="访问授权" key="form3" forceRender name="form3">
          <role-api ref="form3"></role-api>
        </a-tab-pane>
        <a-tab-pane :disabled="!isEdit" tab="成员列表" key="form4" forceRender name="form4">
          <role-user ref="form4"></role-user>
        </a-tab-pane>
      </a-tabs>
    </div>
<!--    <a-spin :spinning="confirmLoading">-->
<!--      <a-steps :current="currentStep" :style="{ marginBottom: '28px' }" size="small">-->
<!--        <a-step title="基本信息" />-->
<!--        <a-step title="配置规则属性" />-->
<!--        <a-step title="设定调度周期" />-->
<!--      </a-steps>-->
<!--      <a-form :form="form">-->
<!--        &lt;!&ndash; step1 &ndash;&gt;-->
<!--        <div v-show="currentStep === 0">-->
<!--          <a-form-item-->
<!--            label="规则名称"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-input v-decorator="['name', {rules: [{required: true}]}]" />-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--            label="规则描述"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-textarea :rows="4" v-decorator="['desc', {rules: [{required: true}]}]"></a-textarea>-->
<!--          </a-form-item>-->
<!--        </div>-->
<!--        <div v-show="currentStep === 1">-->
<!--          <a-form-item-->
<!--            label="监控对象"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-select v-decorator="['target', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">-->
<!--              <a-select-option :value="0">表一</a-select-option>-->
<!--              <a-select-option :value="1">表二</a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->

<!--          <a-form-item-->
<!--            label="规则模板"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-select v-decorator="['template', { initialValue: 0, rules: [{required: true}]}]" style="width: 100%">-->
<!--              <a-select-option :value="0">规则模板一</a-select-option>-->
<!--              <a-select-option :value="1">规则模板二</a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->

<!--          <a-form-item-->
<!--            label="规则类型"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-radio-group v-decorator="['type', {initialValue: 0, rules: [{required: true}]}]" style="width: 100%">-->
<!--              <a-radio :value="0">强</a-radio>-->
<!--              <a-radio :value="1">弱</a-radio>-->
<!--            </a-radio-group>-->
<!--          </a-form-item>-->
<!--        </div>-->

<!--        <div v-show="currentStep === 2">-->
<!--          <a-form-item-->
<!--            label="开始时间"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-date-picker v-decorator="['time', {rules: [{ type: 'object', required: true, message: 'Please select time!' }]}]" style="width: 100%" />-->
<!--          </a-form-item>-->
<!--          <a-form-item-->
<!--            label="调度周期"-->
<!--            :labelCol="labelCol"-->
<!--            :wrapperCol="wrapperCol"-->
<!--          >-->
<!--            <a-select v-decorator="['frequency', { initialValue: 'month', rules: [{required: true}]}]" style="width: 100%">-->
<!--              <a-select-option value="month">月</a-select-option>-->
<!--              <a-select-option value="week">周</a-select-option>-->
<!--            </a-select>-->
<!--          </a-form-item>-->
<!--        </div>-->
<!--        &lt;!&ndash; step1 end &ndash;&gt;-->
<!--      </a-form>-->
<!--    </a-spin>-->
    <template slot="footer">
      <a-button key="cancel" @click="handleCancel(false)">取消</a-button>
      <a-button key="primary" :loading="confirmLoading" @click="handleSubmit">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
  import RoleInfo from './form/role-info'
  import RoleUser from './form/role-user'
  import RoleAuth from './form/role-auth'
  import RoleApi from './form/role-api'
  export default {
    name: 'RoleModal',
    components: { RoleInfo, RoleAuth, RoleUser, RoleApi },
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
          'form2',
          'form3',
          'form4'
        ]
      }
    },
    methods: {
      edit (data,current) {
        this.visible = true
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
          this.modalTitle = this.isEdit ? `编辑角色 - ${this.roleName}` : '新增角色'
          if (name == 'form1') {
            this.$refs.form1.setData(this.formData)
          } else if (name == 'form2') {
            this.$refs.form2.setData(this.formData)
          } else if (name == 'form3') {
            this.$refs.form3.setData(this.formData)
          } else if (name == 'form4') {
            this.$refs.form4.setData(this.formData)
          }
        })
      }
    },
    created () {

    }
  }
</script>
