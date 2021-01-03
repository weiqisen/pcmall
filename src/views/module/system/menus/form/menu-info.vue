<template>
  <div>
    <a-form @submit="handleSubmit" :form="form">
      <!--      <a-form-item-->
      <!--        label="菜单平台"-->
      <!--        :labelCol="{lg: {span: 6}, sm: {span: 6}}"-->
      <!--        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">-->
      <!--        <a-select-->
      <!--          v-decorator="[-->
      <!--            'menuType',-->
      <!--            {rules: [{ required: true, message: '请选择菜单平台' }]}-->
      <!--          ]"-->
      <!--          allowClear-->
      <!--          placeholder="请选择菜单平台！"-->
      <!--          @change="handleSelect"-->
      <!--        >-->
      <!--          <a-select-option v-for="d in selectServiceList" :key="d.value">-->
      <!--            {{ d.text }}-->
      <!--          </a-select-option>-->
      <!--        </a-select>-->
      <!--      </a-form-item>-->
      <!--<a-form-item-->
      <!--label="上级菜单"-->
      <!--:labelCol="{lg: {span: 6}, sm: {span: 6}}"-->
      <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14}}">-->
      <!--<a-select-->
      <!--v-decorator="[-->
      <!--'parentId',-->
      <!--{rules: [{ required: true, message: '请选择上级菜单' }]}-->
      <!--]"-->
      <!--allowClear-->
      <!--:disabled=menuCheck-->
      <!--placeholder="请选择上级菜单！"-->
      <!--@change="handleMenuSelect"-->
      <!--&gt;-->
      <!--<a-select-option v-for="(menu, index) in menuSelectList" :key="index" :value="menu.menuId">-->
      <!--{{ menu.menuName }}-->
      <!--</a-select-option>-->
      <!--</a-select>-->
      <!--</a-form-item>-->

      <a-form-item
        label="上级菜单"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">
        <a-tree-select
          :treeDefaultExpandAll="true"
          v-decorator="[
            'parentId',
            {rules: [{ required: true, message: '请选择上级菜单' }]}
          ]"
          tree-data-simple-mode
          style="width: 100%"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          :tree-data="treeData"
          placeholder="请选择上级菜单"
          :TreeNode="onLoadData"
          @change="handleMenuSelect"
        />
      </a-form-item>

      <!--      <a-form-item-->
      <!--        label="类型"-->
      <!--        :labelCol="{lg: {span: 6}, sm: {span: 6}}"-->
      <!--        :wrapperCol="{lg: {span: 14}, sm: {span: 14}}">-->
      <!--        <a-select-->
      <!--          v-decorator="[-->
      <!--            'type',-->
      <!--            {rules: [{ required: true, message: '请选择菜单类型' }]}-->
      <!--          ]"-->
      <!--          allowClear-->
      <!--          placeholder="请选择菜单类型！"-->
      <!--        >-->
      <!--          <a-select-option value="10">导航</a-select-option>-->
      <!--          <a-select-option value="20">菜单</a-select-option>-->
      <!--          <a-select-option value="30">按钮</a-select-option>-->
      <!--        </a-select>-->
      <!--      </a-form-item>-->

      <a-form-item
        label="菜单名称"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'menuName',
            {rules: [{ required: true, message: '请选择上级菜单' }]}
          ]"
          @blur="handleMenuName"
          placeholder="请输入内容" />
      </a-form-item>
      <a-form-item
        label="菜单编码"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'menuCode',
            {rules: [{ required: true, message: '请填写菜单编码' }]}
          ]"
          placeholder="请输入内容" />
      </a-form-item>

      <a-form-item
        label="页面地址"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          @change="handleInputChange"
          v-decorator="[
            'path',
            {rules: [{ required: false, message: '请填写页面地址' }]}
          ]"
          placeholder="请输入内容">
          <a-select
            style="width: 80px"
            slot="addonBefore"
            v-decorator="[
              'scheme',
              {rules: [{ required: false, message: '请填写页面前缀' }]}
            ]"
            allowClear
            @change="handleSchemeChange"
            placeholder="请选择应用类型">
            <a-select-option value="/">/</a-select-option>
            <a-select-option value="http://">http://</a-select-option>
            <a-select-option value="https://">https://</a-select-option>
          </a-select>
          <a-select
            style="width: 100px"
            slot="addonAfter"
            v-decorator="[
              'target',
              {rules: [{ required: false, message: '请填写页面跳转' }]}
            ]"
            allowClear>
            <a-select-option value="_self">窗口内打开</a-select-option>
            <a-select-option :disabled="formItem.scheme==='/'" value="_blank">新窗口打开</a-select-option>
          </a-select>
        </a-input>
        <span v-if="formItem.scheme === '/'">前端组件：/view/module/{{ formItem.path }}.vue</span>
        <span v-else="">跳转地址：{{ formItem.scheme }}{{ formItem.path }}</span>
      </a-form-item>
      <a-form-item
        label="图标"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'iconCode',
            {rules: [{ required: false, message: '请填写页面跳转' }]}
          ]"
          placeholder="请选择图标">
          <a slot="addonBefore" v-if="formItem.iconCode.indexOf('jihao')!==-1"><tc-icon :type="formItem.iconCode"/></a>
          <a slot="addonBefore" v-else-if="formItem.iconCode"><a-icon :type="formItem.iconCode"/></a>

          <a-popconfirm slot="addonAfter" placement="top" ok-text=" " cancel-text=" ">
            <a-icon slot="icon" type=""/>
            <template slot="title">
              <div slot="title">
                <icon-selector :value="formItem.iconCode" v-model="formItem.iconCode" @change="handleIconChange"/>
              </div>
            </template>
            <a style="cursor:pointer;" @click="handleShowIconSelect"><a-icon type="search"/></a>
          </a-popconfirm>
        </a-input>
      </a-form-item>
      <a-form-item
        label="排序"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          v-decorator="[
            'priority',
            {rules: [{ required: true, message: '请填写优先级' }]}
          ]"
          placeholder="请填写优先级" />
      </a-form-item>

      <a-form-item
        label="状态"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <div>
          <a-radio-group
            buttonStyle="solid"
            v-decorator="[
              'status',
              {rules: [{ required: true, message: '请选择状态' }]}
            ]"
          >
            <a-radio-button value="0">禁用</a-radio-button>
            <a-radio-button value="1">正常</a-radio-button>
          </a-radio-group>
        </div>
      </a-form-item>
      <a-form-item
        label="描述"
        :labelCol="{lg: {span: 6}, sm: {span: 6}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-textarea
          rows="4"
          placeholder="请输入描述内容"
          v-decorator="[
            'menuDesc',
            {rules: [{ required: true, message: '请输入描述内容' }]}
          ]"
        />
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
import pick from 'lodash.pick'
import IconSelector from '@/components/IconSelector'
export default {
  name: 'MenuInfo',
  components: {
    IconSelector
  },
  data () {
    return {
      onLoadData: false,
      treeData: [],
      selectServiceList: [],
      menuParentList: [],
      menuSelectList: [],
      menuCheck: false,
      isAdd: true,
      formItem: this.getFormItem(),
      form: this.$form.createForm(this)
    }
  },
  methods: {
    getFormItem () {
      return {
        onLoadData: false,
        treeData: [],
        menuId: '',
        menuName: '',
        menuCode: '',
        menuType: '20',
        type: undefined,
        status: 1,
        path: '',
        iconCode: '',
        level: '',
        priority: 0,
        menuDesc: '',
        parentName: '',
        parentId: undefined
      }
    },
    setData (data) {
      this.isAdd = true
      this.menuCheck = false
      if (data && data.menuId) {
        Object.assign(this.formItem, {
          menuId: data.menuId,
          menuName: data.menuName,
          menuCode: data.menuCode,
          menuType: data.menuType + '',
          type: data.type + '',
          path: data.path,
          iconCode: data.icon,
          level: data.level,
          scheme: data.scheme,
          priority: data.priority,
          status: data.status + '',
          menuDesc: data.menuDesc,
          target: data.target,
          parentName: data.parentName,
          parentId: data.parentId
        })
        this.isAdd = false
        if (data.parentId === '0') {
          this.menuCheck = true
        }
      } else {
        this.formItem = this.getFormItem()
        this.form.resetFields()
      }
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(this.formItem, ['parentId', 'menuName', 'menuCode', 'menuType', 'type', 'path', 'scheme', 'status', 'iconCode', 'target', 'priority', 'menuDesc']))
      })
      // this.handleLoadServiceList()
      // if(this.menuParentList || this.menuParentList.length<=0){
      //   this.handleLoadMenuList()
      // }
      if (this.formItem.menuType) {
        this.handleInitSelect(this.formItem.menuType, 0)
      }
    },
    handleLoadMenuList (menuType, type) {
      this.$http.get(this.$apis.menu.list, { menuType: menuType }, this).then(res => {
        this.menuParentList = res.data
        this.menuParentList.push({
          menuName: '顶级菜单',
          menuType: '10',
          menuId: '0',
          level: 0
        })
        this.menuSelectList = this.menuParentList
        const treeData = []
        this.menuParentList.map(item => {
          treeData.push({
            id: item.menuId,
            pId: item.parentId,
            value: item.menuId,
            title: item.menuName,
            level: item.level
          })
        })
        this.treeData = treeData
        if (type === 1) {
          this.form.setFieldsValue({ parentId: undefined })
          this.form.setFieldsValue({ type: undefined })
        }
      })
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            const paramer = {
              menuName: values.menuName,
              menuCode: values.menuCode,
              menuType: values.menuType,
              type: values.type,
              path: values.path,
              status: values.status,
              scheme: values.scheme,
              icon: values.iconCode,
              level: this.formItem.level,
              priority: values.priority,
              menuDesc: values.menuDesc,
              menuId: this.formItem.menuId,
              parentId: values.parentId
            }
            this.$http.post(this.$apis.menu.save, paramer, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
            this.$emit('ok')
          } else {
            resolve(false)
          }
        })
      })
    },
    handleIconChange (icon) {
      this.formItem.iconCode = icon
    },
    handleInputChange (e) {
      this.formItem.path = e.target.value
    },
    validatePass (rule, value, callback) {
      const reg2 = /^.{6,18}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (value !== this.form.getFieldValue('password')) {
        callback(new Error('两次输入密码不一致'))
      } else if (value !== '' && !reg2.test(value)) {
        callback(new Error('长度6到18个字符'))
      } else {
        callback()
      }
    },
    validatePassConfirm (rule, value, callback) {
      if (value === '') {
        callback(new Error('请再次输入密码'))
      } else if (value !== this.form.getFieldValue('password')) {
        callback(new Error('两次输入密码不一致'))
      } else {
        callback()
      }
    },
    handleSchemeChange (value) {
      this.formItem.scheme = value
    },
    handleShowIconSelect () {
      console.log('ddddd')
    },
    onSearch (value) {
      console.log(value)
    },
    // handleSelect(value) {
    //   const selectList = []
    //   this.menuParentList.map(item=>{
    //     if(item.menuType){
    //       if(item.menuType===Number(value)){
    //         selectList.push(item)
    //       }
    //     }else{
    //       selectList.push(item)
    //     }
    //   })
    //   this.menuSelectList = selectList
    // },
    handleInitSelect (value, type) {
      this.handleLoadMenuList(value, type)
    },
    handleSelect (value) {
      this.handleLoadMenuList(value, 1)
    },
    // handleLoadServiceList () {
    //   this.$http.get(this.$apis.dict.list, { dictType: 1 }, this).then(res => {
    //     const data = res.data.map(item => ({
    //       text: item.dictName,
    //       value: item.dictValue,
    //       key: item.level,
    //       label: item.level
    //     }))
    //     this.selectServiceList = data
    //   })
    // },
    handleMenuSelect (value, option, extra) {
      this.formItem.level = extra.triggerNode.$options.propsData.dataRef.level + 1
      if (this.formItem.level === 1) {
        this.formItem.type = 10
      } else if (this.formItem.level === 2) {
        this.formItem.type = 20
      } else if (this.formItem.level === 3) {
        this.formItem.type = 30
      }
      this.form.setFieldsValue({ type: this.formItem.type + '' })
    },
    handleMenuName () {
      const tt = this.form.getFieldValue('menuName')
      this.form.setFieldsValue({ menuDesc: tt })
    }
  },
  mounted: function () {
  }
}
</script>
