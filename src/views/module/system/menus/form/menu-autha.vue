<template>
  <div>
    <a-form @submit="handleSubmit" :form="formItem">
      <a-form-item
        :wrapperCol="{lg: {span: 24}, sm: {span: 24} }">
        <a-transfer
          showSearch
          :dataSource="selectApis"
          :listStyle="{
            width: '46%',
            height: '350px',
          }"
          :targetKeys="authorityIds"
          @change="handleTransferChange"
          :render="item=>`${item.title}`">
          <span slot="notFoundContent">
            没数据
          </span>
        </a-transfer>
      </a-form-item>
    </a-form>
  </div>
</template>

<script>
export default {
  name: 'MenuAutha',
  data () {
    return {
      selectApis: [],
      authorityIds: [],
      pageInfo: {},
      // checkRowKeys: [],
      // submitMenus: [],
      formItem: this.getFormItem(),
      form: this.$form.createForm(this),
      replaceFields: {
        key: 'authorityId',
        title: 'name'
      }
    }
  },
  methods: {
    getFormItem () {
      return {
        menuId: ''
      }
    },
    /* 初始数据 */
    setData (data) {
      if (data && data.menuId) {
        Object.assign(this.formItem, {
          menuId: data.menuId
        })
        this.handleLoadTenantGrantedMenu(data.menuType, data.menuId)
      }
    },
    handleReset () {
      this.form.resetFields()
      this.formItem = this.getFormItem()
    },
    /* 提交授权 */
    handleSubmit () {
      return new Promise((resolve, reject) => {
        this.form.validateFields((err, values) => {
          if (!err) {
            this.$http.post(this.$apis.menu.grantMenuApi, {
              menuId: this.formItem.menuId,
              apiIds: this.authorityIds.join(',')
            }, this).then(res => {
              resolve(res)
            }).catch(function (err) {
              reject(err)
            })
          } else {
            resolve(false)
          }
        })
      })
    },
    // /* 获取已选择节点 */
    // getCheckedAuthorities () {
    //   const menuIds = []
    //   this.$refs['tree'].getSelectRecords().map(item => {
    //     menuIds.push(item.authorityId)
    //   })
    //   return menuIds.concat(this.formItem.grantActions)
    // },
    /* 获取已选择节点 */
    // getCheckedAuthorities (node,event) {
    //   const checkArray = []
    //   checkArray.push(...node)
    //   checkArray.push(...event.halfCheckedKeys)
    //   this.submitMenus = checkArray
    // },
    /* 加载权限 */
    handleLoadTenantGrantedMenu (apiType, menuId) {
      if (!apiType) {
        return
      }
      const that = this
      this.selectApis = []
      this.authorityIds = []
      this.$http.get(this.$apis.api.menuList, { apiType: apiType, menuId: menuId }, this).then(res => {
        res.data.menuAllList.map(item => {
          that.selectApis.push({
            key: item.apiId,
            title: `${item.path} - ${item.apiName}`,
            disabled: item.path === '/**'
          })
        })
        that.authorityIds = res.data.menuGrantList
      })
    },
    handleTransferChange (newTargetKeys, direction, moveKeys) {
      this.authorityIds = newTargetKeys
    }
    // render(data,parentId,parentName){
    //   const children = []
    //   const parent = []
    //   if (!data) return null
    //   for(var i = 0; i < data.length;i++){
    //     if(data[i].parentId===parentId){
    //       if(parentName){
    //         data[i].parentName = parentName
    //       }
    //       parent.push(data[i])
    //     }else{
    //       children.push(data[i])
    //     }
    //   }
    //   if(parent.length>0){
    //     for(var t = 0; t<parent.length;t++){
    //       const tt = this.render(children,parent[t].menuId,parent[t].menuName)
    //       if(tt && tt.length>0){
    //         parent[t].children=tt
    //       }else{
    //         parent[t].children=null
    //       }
    //
    //     }
    //   }
    //   return parent
    // },
  },
  mounted: function () {
  }
}
</script>
