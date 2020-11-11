<template>
  <page-view style="margin-bottom: 50px;">
    <a-card :bordered="false">
    <a-form @submit="handleSubmit" :form="form">
      <a-form-item
        help="设备型号名称支持4到30位以内的字母，数字，汉字，下划线及破折号"
        label="设备型号名称"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          autocomplete="off"
          v-decorator="[
            'deviceName',
            {rules: [{ required: true,whitespace:true, message: '请输入设备名称' },$rules.name]}
          ]"
          name="distributionName"
          placeholder="请输入设备型号名称" />
      </a-form-item>
      <a-form-item
        label="设备SN编号"
        :labelCol="{lg: {span: 4}, sm: {span: 4}}"
        :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
          autocomplete="off"
          v-decorator="[
            'deviceSn',
            {rules: [{ required: true, message: '请输入设备编号' }]}
          ]"
                name="lat"
                placeholder="请输入设备编号" />
      </a-form-item>
      <a-form-item
          label="设备成色"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
            autocomplete="off"
            v-decorator="[
            'deviceNew',
            {rules: [{ required: true, message: '请输入设备编号' }]}
          ]"
            name="lat"
            placeholder="请输入设备成色" />
      </a-form-item>
      <a-form-item
          label="设备规格"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
            autocomplete="off"
            v-decorator="[
            'deviceRom',
            {rules: [{ required: true, message: '请输入设备编号' }]}
          ]"
            name="lat"
            placeholder="请输入设备规格" />
      </a-form-item>
      <a-form-item
          label="设备缺陷"
          :labelCol="{lg: {span: 4}, sm: {span: 4}}"
          :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
            autocomplete="off"
            v-decorator="[
            'deviceBug',
            {rules: [{ required: true, message: '请输入设备编号' }]}
          ]"
            name="lat"
            placeholder="请输入设备缺陷" />
      </a-form-item>
      <a-form-item
              label="设备型号分类"
              :labelCol="{lg: {span: 4}, sm: {span: 4}}"
              :wrapperCol="{lg: {span: 14}, sm: {span: 14} }">
        <a-input
            autocomplete="off"
            v-decorator="[
            'categoryName',
            {rules: [{ required: true, message: '请输入设备型号分类' }]}
          ]"
            name="lat"
            placeholder="请输入设备型号分类" />
        <!--<a-tree-select-->
            <!--v-decorator="[-->
              <!--'categoryId',-->
              <!--{rules: [{ required: true, message: '请选择设备分类' }]}-->
            <!--]"-->
            <!--replaceFields="{children:'children', title:'name', key:'categoryId', value: 'categoryId' }"-->
            <!--tree-default-expand-all-->
            <!--:tree-data="categoryList"-->
            <!--placeholder="请选择上级菜单"-->
            <!--allow-clear-->
            <!--@change="handleTreeSelect"-->
        <!--/>-->
        <!--<a-select-->
          <!--v-decorator="[-->
            <!--'categoryId',-->
            <!--{rules: [{ required: true, message: '请选择设备分类' }]}-->
          <!--]"-->
          <!--placeholder="请选择设备型号分类"-->
          <!--@change="handleChangeSelect"-->
        <!--&gt;-->
          <!--<a-select-option v-for="(item, index) in categoryList" :key="index" :value="item.categoryId">-->
            <!--{{ item.name }}</a-select-option>-->
        <!--</a-select>-->
      </a-form-item>
      <!--<a-form-item-->
              <!--label="设备分布地"-->
              <!--:labelCol="{lg: {span: 4}, sm: {span: 4}}"-->
              <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
        <!--<a-select-->
          <!--v-decorator="[-->
            <!--'distribuId',-->
            <!--{rules: [{ required: true, message: '请选择设备分布地' }]}-->
          <!--]"-->
          <!--@change="handleDistribuChange"-->
          <!--placeholder="请选择设备分布地"-->
        <!--&gt;-->
          <!--<a-select-option v-for="(item, index) in distribuList" :key="index" :value="item.distributionId">-->
            <!--{{ item.distributionName }}</a-select-option>-->
        <!--</a-select>-->
      <!--</a-form-item>-->
      <!--<a-form-item-->
        <!--label="分布地图片"-->
        <!--:labelCol="{lg: {span: 4}, sm: {span: 4}}"-->
        <!--:wrapperCol="{lg: {span: 20}, sm: {span: 20} }">-->
        <!--<div style="position: relative;">-->
          <!--<img @click="getXY" ref="deviceImage" id="preview" style="width:100%;height: auto;" :src="formItem.imgPath" :alt="formItem.imgPath">-->
          <!--<div v-show="formItem.distribuImgX" :style="{'line-height': '21px','cursor': 'pointer','top':formItem.distribuImgY+ 'px','left':formItem.distribuImgX+ 'px','position':'absolute','text-align': 'center'}">-->
            <!--<span style="line-height:21px;">{{formItem.deviceName}}</span><br/>-->
            <!--<span style="line-height:21px;">-->
            <!--<jihao-icon type="icon_device_center_dark" />-->
              <!--</span>-->
          <!--</div>-->
        <!--</div>-->
      <!--</a-form-item>-->
      <!--<a-form-item-->
        <!--help="图片坐标：x轴，y轴，宽，高"-->
        <!--label="分布图坐标"-->
        <!--:labelCol="{lg: {span: 4}, sm: {span: 4}}"-->
        <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
        <!--<a-input-->
                <!--v-model="formItem.distribuImgX"-->
                <!--placeholder="选取图片坐标x"-->
                <!--:disabled="true"-->
                <!--type='text'-->
                <!--@change="handleNumberChange"-->
                <!--style="width: 24%; margin-right: 1%;"-->
        <!--/>-->
        <!--<a-input-->
                <!--v-model="formItem.distribuImgY"-->
                <!--placeholder="选取图片坐标y"-->
                <!--:disabled="true"-->
                <!--type='text'-->
                <!--@change="handleNumberChange"-->
                <!--style="width: 24%; margin-right: 1%;"-->
        <!--/>-->
        <!--<a-input-->
                <!--v-model="formItem.distribuImgW"-->
                <!--placeholder="图片长度"-->
                <!--:disabled="true"-->
                <!--type='text'-->
                <!--@change="handleNumberChange"-->
                <!--style="width: 24%; margin-right: 1%;"-->
        <!--/>-->
        <!--<a-input-->
                <!--v-model="formItem.distribuImgH"-->
                <!--placeholder="图片高度"-->
                <!--:disabled="true"-->
                <!--type='text'-->
                <!--@change="handleNumberChange"-->
                <!--style="width: 24%; margin-right: 1%;"-->
        <!--/>-->
      <!--</a-form-item>-->
      <!--<a-form-item-->
              <!--label="设备状态"-->
              <!--:labelCol="{lg: {span: 4}, sm: {span: 4}}"-->
              <!--:wrapperCol="{lg: {span: 14}, sm: {span: 14} }">-->
        <!--<a-input v-model="formItem.online===1?'在线':'离线'" :disabled="true"/>-->
      <!--</a-form-item>-->
    </a-form>
    </a-card>

    <!-- fixed footer toolbar -->
    <footer-tool-bar :style="{ width: isSideMenu() && isDesktop() ? `calc(100% - ${sidebarOpened ? 220 : 80}px)` : '100%'}">
      <!--<span class="popover-wrapper">-->
        <!--<a-popover title="表单校验信息" overlayClassName="antd-pro-pages-forms-style-errorPopover" trigger="click" :getPopupContainer="trigger => trigger.parentNode">-->
          <!--<template slot="content">-->
            <!--<li v-for="item in errors" :key="item.key" @click="scrollToField(item.key)" class="antd-pro-pages-forms-style-errorListItem">-->
              <!--<a-icon type="cross-circle-o" class="antd-pro-pages-forms-style-errorIcon" />-->
              <!--<div class="">{{ item.message }}</div>-->
              <!--<div class="antd-pro-pages-forms-style-errorField">{{ item.fieldLabel }}</div>-->
            <!--</li>-->
          <!--</template>-->
          <!--<span class="antd-pro-pages-forms-style-errorIcon" v-if="errors.length > 0">-->
            <!--<a-icon type="exclamation-circle" />{{ errors.length }}-->
          <!--</span>-->
        <!--</a-popover>-->
      <!--</span>-->
      <a-button @click="handleBack" :loading="loading" style="margin-right: 5px;">返回</a-button>
      <a-button @click="validate" :loading="loading">提交</a-button>
    </footer-tool-bar>
    <a-modal
            :centered="true"
            :title="modalTitle"
            :visible="visible"
            :confirm-loading="confirmLoading"
            :maskClosable="false"
            @ok="handleBackSubmit"
            @cancel="handleCancel"
    >
      <p>您确定返回？</p>
    </a-modal>
  </page-view>
</template>

<script>
  import { PageView } from '@/layouts'
  import pick from 'lodash.pick'
  import FooterToolBar from '@/components/FooterToolbar'
  import { mixin, mixinDevice } from '@/utils/mixin'
  import AFormItem from "ant-design-vue/es/form/FormItem";
  export default {
    name: 'DistribuAdd',
    mixins: [mixin, mixinDevice],
    components: {
      AFormItem,
      FooterToolBar,
      PageView
    },
    data () {
      return {
        visible:false,
        confirmLoading:false,
        modalTitle:'返回',
        loading:false,
        isAdd: true,
        formItem: this.getFormItem(),
        form: this.$form.createForm(this),
        errors: [],
        distribuList: [],
        distribuName:'',
        categoryList:[]
      }
    },
    methods: {
      // validateToDeviceName (rule, value, callback){
      //   const reg = this.$rules.cnEnNumSpace4to30
      //   if (!reg.test(value)) {
      //     callback(new Error(this.$rules.cnEnNumSpace4to30Msg))
      //   } else {
      //     callback()
      //   }
      // },
      // validateToDeviceSn(rule, value, callback) {
      //   if(value.substring(0, 7) === "CP335C_"){
      //     const reg = this.$rules.enUumSpace8to40
      //     if (!reg.test(value)) {
      //       callback(new Error(this.$rules.enUumSpace8to40Msg))
      //     } else {
      //       callback()
      //     }
      //     // callback()
      //   }else{
      //     callback('设备编号必须以CP335C_IMEI格式')
      //   }
      // },
      handleNumberChange(e) {
        const number = parseInt(e.target.value || 0, 10);
        if (isNaN(number)) {
          return;
        }
        this.triggerChange({ number });
      },
      getFormItem () {
        return {
          deviceId: '',
          deviceNew: '',
          categoryId: undefined,
          categoryName: '',
          deviceName: '',
          deviceSn: 'CP335C_',
          distribuId: undefined,
          imgPath: '',
          distribuImgH: 0,
          distribuImgW: 0,
          distribuImgX: 0,
          distribuImgY: 0
        }
      },
      handleReset () {
        this.form.resetFields()
        this.formItem = this.getFormItem()
      },
      handleSubmit () {
        const that = this
        return new Promise((resolve, reject) => {
          this.form.validateFields((err, values) => {
            if (!err) {
              Object.assign(this.formItem, {
                deviceName: values.deviceName,
                deviceSn: values.deviceSn,
                deviceBug: values.deviceBug,
                deviceNew: values.deviceNew,
                deviceRom: values.deviceRom,
                categoryId: values.categoryId
              })
              this.$http.post(this.$apis.device.save, this.formItem, this).then(res => {
                if(res.code===0) {
                  this.$notification.success({
                    message: '提示',
                    description: '设备操作成功',
                    duration: 8
                  })
                  that.handleBackSubmit()
                }else{
                  this.$notification.error({
                    message: '提示',
                    description: res.data.message,
                    duration: 8
                  })
                }
              }).catch(function (err) {
                reject(err)
              })
            } else {
              for(const item in err){
                this.$notification.error({
                  message: '提示',
                  description:err[item].errors[0].message
                })
              }
              resolve(false)
            }
          })
        })
      },

      handleInit() {
        const that = this
        if(!this.categoryList ||(this.categoryList && this.categoryList.length<=0)){
          this.handleLoadMenuList()
        }
        const p1 = this.$http.get(this.$apis.distribu.list, {}, this)
        if(this.$route.params.deviceId){
          this.formItem.deviceId = this.$route.params.deviceId
        }else if(this.formItem.deviceId){
          this.formItem.deviceId = this.formItem.deviceId
        }else{
          Promise.all([p1]).then(function (values) {
            const res1 = values[0]
            if (res1.code === 0) {
              that.distribuList = res1.data
              that.handleLoadImage(that.formItem.distribuId,res1.data,that)
              const { form: { setFieldsValue } } = that
              that.$nextTick(() => {
                setFieldsValue(pick(that.formItem, ['categoryId','deviceName','deviceSn','distribuId']))
              })
            }
          })
          return
        }
        const p2 = this.$http.get(this.$apis.device.info, {deviceId: this.formItem.deviceId}, this)
        Promise.all([p1, p2]).then(function (values) {
          const res1 = values[0]
          const res2 = values[1]
          if (res2.code === 0) {
            that.formItem = res2.data
            const { form: { setFieldsValue } } = that
            that.$nextTick(() => {
              setFieldsValue(pick(that.formItem, ['categoryId','deviceName','deviceSn','distribuId']))
            })
          }
          if (res1.code === 0) {
            that.distribuList = res1.data
            that.handleLoadImage(that.formItem.distribuId,res1.data,that)
          }
        })

      },
      handleLoadMenuList (){
        const that = this
        this.$http.get(this.$apis.category.list, {parentId : 0 }, this).then(res => {
          that.categoryList = res.data
        })
      },
      handleChangeSelect (value, option){
        value = value.key
        this.formItem.categoryName = option.componentOptions.children[0].elm.data.trim()
      },
      handleDistribuChange (value){
        this.handleLoadImage(value,this.distribuList,this)
      },
      handleLoadImage (distribuId,distribuList,that){
        distribuList.map(item =>{
          if(item.distributionId===distribuId){
            that.formItem.imgPath = item.imgPath
            that.distribuName = item.distributionName
            let rect = that.$refs.deviceImage.getBoundingClientRect()
            console.log(that.formItem.distribuImgX)
            console.log(that.formItem.distribuImgY)
            if(rect.width&&that.formItem.distribuImgW&&that.formItem.distribuImgW>0){
              let widthRatio = that.formItem.distribuImgW/rect.width
              that.formItem.distribuImgX = that.formItem.distribuImgX/widthRatio
              that.formItem.distribuImgY = that.formItem.distribuImgY/widthRatio
              console.log(that.formItem.distribuImgX)
              console.log(that.formItem.distribuImgY)
            }
          }
        })
      },
      // 最终全页面提交
      validate () {
        this.handleSubmit()
      },
      errorList (errors) {
        if (!errors || errors.length === 0) {
          return null
        }
        this.errors = Object.keys(errors).map(key => {
          if (!errors[key]) {
            return null
          }

          return {
            key: key,
            message: errors[key][0],
            fieldLabel: fieldLabels[key]
          }
        })
      },
      getXY(e) {
        this.formItem.deviceName = this.form.getFieldValue("deviceName")
        let rect = this.$refs.deviceImage.getBoundingClientRect()
        this.formItem.distribuImgH = rect.height
        this.formItem.distribuImgW = rect.width
        this.formItem.distribuImgX = e.clientX - rect.left
        this.formItem.distribuImgY = e.clientY - rect.top
      },
      handleBack (){
        this.visible = true
      },
      handleBackSubmit (){
        this.visible = false
        this.$router.go(-1)//返回上一层
      },
      handleCancel() {
        this.visible = false
      },
    },
    mounted: function () {
    },
    create (){
      this.handleInit()
    },
    beforeRouteEnter (to, from, next) {
      if(to.params&&typeof(to.params.option)!=='undefined'){
        if(to.params.option==1){
          to.meta.title='编辑设备'
        }else{
          to.meta.title='添加设备'
        }
      }
      if(from.name==='deviceIndex') {
        next(vm => {
          vm.handleInit()
        })
      }else if(from.name === 'deviceIndex'){
        next(vm => {
          vm.handleReset()
        })
      }else{
        next(vm => {
          vm.handleInit()
        })
      }
    }
  }
</script>
