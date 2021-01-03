<template>
  <div>
    <!--<a-table-->
    <!--ref="table"-->
    <!--size="default"-->
    <!--rowKey="genertorId"-->
    <!--:columns="columns"-->
    <!--:data="loadData"-->
    <!--&gt;-->
    <!--<span slot="status" slot-scope="text">-->
    <!--<a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
    <!--</span>-->

    <!--<span slot="action" slot-scope="text, record">-->
    <!--<template>-->
    <!--<a @click="handleEdit(record)">编辑</a>-->
    <!--<a-divider type="vertical" />-->
    <!--<a @click="handleCodeGenertor(record)">代码生成</a>-->
    <!--<a-divider type="vertical" />-->
    <!--<a @click="handleRemove(record)">删除</a>-->
    <!--</template>-->
    <!--</span>-->
    <!--</a-table>-->

    <a-table
      ref="table"
      rowKey="name"
      :columns="columns"
      :dataSource="loadData"
      :pagination="false">
      <span slot="status" slot-scope="text">
        <a-tag :color="text | statusTypeFilter">{{ text | statusFilter }}</a-tag>
        <!--<a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />-->
      </span>
      <span slot="icon" slot-scope="text">
        <tc-icon :type="text"/>
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">编辑</a>
          <a-divider type="vertical" />
          <a @click="handleRemove(record)" :disabled="$auth('systemMenuEdit')?false:true">删除</a>
        </template>
      </span>
    </a-table>

  </div>
</template>

<script>
import { STable } from '@/components'
export default {
  name: 'TableStructure',
  components: {
    STable
  },
  data () {
    return {
      loadData: [],
      columns: [
        {
          title: '字段',
          dataIndex: 'name'
        },
        {
          title: '字段类型',
          dataIndex: 'type'
        },
        {
          title: '实体类型',
          dataIndex: 'propertyType'
        },
        {
          title: '备注',
          dataIndex: 'comment'
        }
      ]
    }
  },
  computed: {
  },
  methods: {
    setData (data) {
      if (data) {
        this.loadData = data
      }
    }
    // handlePasswordLevel (rule, value, callback) {
    //   let level = 0
    //
    //   // 判断这个字符串中有没有数字
    //   if (/[0-9]/.test(value)) {
    //     level++
    //   }
    //   // 判断字符串中有没有字母
    //   if (/[a-zA-Z]/.test(value)) {
    //     level++
    //   }
    //   // 判断字符串中有没有特殊符号
    //   if (/[^0-9a-zA-Z_]/.test(value)) {
    //     level++
    //   }
    //   this.state.passwordLevel = level
    //   this.state.percent = level * 30
    //   if (level >= 2) {
    //     if (level >= 3) {
    //       this.state.percent = 100
    //     }
    //     callback()
    //   } else {
    //     if (level === 0) {
    //       this.state.percent = 10
    //     }
    //     callback(new Error('密码强度不够'))
    //   }
    // },
    // handlePasswordInputClick (bool) {
    //   this.state.passwordLevelChecked = bool
    // },
    // handlePasswordCheck (rule, value, callback) {
    //   const newPassword = this.form.getFieldValue('newPassword')
    //   console.log('value', value)
    //   if (value === undefined) {
    //     callback(new Error('请输入密码'))
    //   }
    //   if (value && newPassword && value.trim() !== newPassword.trim()) {
    //     callback(new Error('两次密码不一致'))
    //   }
    //   callback()
    // },
    //
    // getFormItem () {
    //   return {
    //     userId: '',
    //     oldPassword: '',
    //     newPassword: '',
    //     confirmPassword: ''
    //   }
    // },

    // handleReset () {
    //   this.form.resetFields()
    //   this.formItem = this.getFormItem()
    // },
    // handleSubmit () {
    //   return new Promise((resolve, reject) => {
    //     this.form.validateFields((err, values) => {
    //       if (!err) {
    //         const param = {
    //           oldPassword: values.oldPassword,
    //           newPassword: values.newPassword
    //         }
    //         this.$http.post(this.$apis.user.updatePassword, param, this).then(res => {
    //           if(res.code===0){
    //             this.$notification.open({
    //               message: '操作',
    //               description:'修改密码成功！'
    //             });
    //           }
    //           this.handleReset ()
    //           this.$emit('ok')
    //           resolve(res)
    //         }).catch(function (err) {
    //           reject(err)
    //         })
    //       } else {
    //         resolve(false)
    //       }
    //     })
    //   })
    // }
  },
  mounted: function () {
  }
}
</script>
