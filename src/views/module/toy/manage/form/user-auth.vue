<!--<template>-->
  <!--&lt;!&ndash;分配权限&ndash;&gt;-->
  <!--<div>-->
    <!--<a-form :model="formItem" @submit="handleSubmit" :form="form">-->
      <!--<a-form-item-->
        <!--:wrapperCol="{lg: {span: 24}, sm: {span: 24} }">-->
        <!--<a-transfer-->
          <!--showSearch-->
          <!--:dataSource="selectApis"-->
          <!--:listStyle="{-->
                        <!--width: '46%',-->
                        <!--height: '350px',-->
                      <!--}"-->
          <!--:targetKeys="formItem.authorityIds"-->
          <!--@change="handleTransferChange"-->
          <!--:render="item=>`${item.title}`">-->
                    <!--<span slot="notFoundContent">-->
                      <!--没数据-->
                    <!--</span>-->
        <!--</a-transfer>-->
      <!--</a-form-item>-->
    <!--</a-form>-->
  <!--</div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
  <!--name: 'UserAuth',-->
  <!--props: {},-->
  <!--data () {-->
    <!--return {-->
      <!--selectApis: [],-->
      <!--// selectMenus: [],-->
      <!--pageInfo: {},-->
      <!--checkRowKeys: [],-->
      <!--disableRowKeys: [],-->
      <!--formItem: this.getFormItem(),-->
      <!--form: this.$form.createForm(this)-->
    <!--}-->
  <!--},-->
  <!--methods: {-->
    <!--getFormItem () {-->
      <!--return {-->
        <!--userId: '',-->
        <!--authorityIds: [],-->
        <!--grantMenus: [],-->
        <!--expireTime: '',-->
        <!--isExpired: false-->
      <!--}-->
    <!--},-->
    <!--setData (data) {-->
      <!--if (data && data.userId) {-->
        <!--Object.assign(this.formItem, {-->
          <!--userId: data.userId-->
        <!--})-->
        <!--this.handleLoadUserGranted(data.userId)-->
      <!--}-->
    <!--},-->
    <!--checkMethod ({ row, rowIndex }) {-->
      <!--if (this.disableRowKeys.includes(row.menuId)) {-->
        <!--return false-->
      <!--} else {-->
        <!--return true-->
      <!--}-->
    <!--},-->
    <!--handleReset () {-->
      <!--this.form.resetFields()-->
      <!--this.formItem = this.getFormItem()-->
    <!--},-->
    <!--handleSubmit () {-->
      <!--return new Promise((resolve, reject) => {-->
        <!--this.form.validateFields((err, values) => {-->
          <!--if (!err) {-->
            <!--this.$http.post(this.$apis.authority.userGrant, {-->
              <!--userId: this.formItem.userId,-->
              <!--authorityIds: this.formItem.authorityIds.join(',') }, this).then(res => {-->
              <!--resolve(res)-->
            <!--}).catch(function (err) {-->
              <!--reject(err)-->
            <!--})-->
          <!--} else {-->
            <!--resolve(false)-->
          <!--}-->
        <!--})-->
      <!--})-->
    <!--},-->
    <!--getCheckedAuthorities () {-->
      <!--const menuIds = []-->
      <!--this.$refs['tree'].getSelectRecords().map(item => {-->
        <!--menuIds.push(item.authorityId)-->
      <!--})-->
      <!--return menuIds.concat(this.formItem.grantActions)-->
    <!--},-->
    <!--handleLoadUserGranted(userId){-->
      <!--if (!userId) {-->
        <!--return-->
      <!--}-->
      <!--const that = this-->
      <!--const p1 = this.$http.get(this.$apis.authority.api, {}, this)-->
      <!--const p2 = this.$http.get(this.$apis.authority.user, { userId: userId }, this)-->
      <!--Promise.all([p1, p2]).then(function (values) {-->
        <!--const res1 = values[0]-->
        <!--const res2 = values[1]-->
        <!--if (res1.code === 0) {-->
          <!--res1.data.map(item => {-->
            <!--item.key = item.authorityId-->
            <!--item.title = `${item.prefix.replace('/**', '')}${item.path} - ${item.apiName}`-->
            <!--item.disabled = item.path === '/**'-->
          <!--})-->
          <!--that.selectApis = res1.data-->
        <!--}-->
        <!--if (res2.code === 0) {-->
          <!--const result = []-->
          <!--res2.data.map(item => {-->
            <!--if (!result.includes(item.authorityId)) {-->
              <!--result.push(item.authorityId)-->
            <!--}-->
          <!--})-->
          <!--that.formItem.authorityIds = result-->
        <!--}-->
      <!--})-->
    <!--},-->
    <!--handleTransferChange (newTargetKeys, direction, moveKeys) {-->
      <!--this.formItem.authorityIds = newTargetKeys-->
    <!--},-->
  <!--},-->
  <!--created () {-->

  <!--},-->
  <!--components: {}-->
<!--}-->
<!--</script>-->

<!--<style scoped lang="less" rel="stylesheet/less">-->

<!--</style>-->
