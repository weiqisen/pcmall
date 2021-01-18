<template>
  <div>
    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="handleGenertor()">生成代码</a-button>
    </div>
    <a-collapse default-active-key="0" :bordered="false">
      <template #expandIcon="props">
        <a-icon type="caret-right" :rotate="props.isActive ? 90 : 0" />
      </template>
      <a-collapse-panel key="0" :disabled="true" :style="customStyle">
        <span slot="header" style="color: rgba(0, 0, 0, 0.65);">
          全局配置
        </span>
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="24" :sm="24">
              <a-form-item label="父类包名" style="width: 100%;">
                <a-checkbox-group
                  v-model="checkboxGroup"
                  @change="onChange"
                  style="width: 100%;"
                >
                  <div>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isEntity">
                        实体类配置
                      </a-checkbox>
                    </span>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isService">
                        service配置
                      </a-checkbox>
                    </span>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isServiceImpl">
                        sercieImpl配置
                      </a-checkbox>
                    </span>
                  </div>
                  <div>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isController">
                        controller配置
                      </a-checkbox>
                    </span>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isMapper">
                        mapper配置
                      </a-checkbox>
                    </span>
                    <span style="width:140px;display: inline-block;">
                      <a-checkbox value="isXml">
                        mapper.xml配置
                      </a-checkbox>
                    </span>
                  </div>
                </a-checkbox-group>
              </a-form-item>
            </a-col>

            <a-col :md="12" :sm="12">
              <a-form-item label="配置选择" style="width: 100%;">
                <a-select
                  style="width: 270px;"
                  allowClear
                  placeholder="请选择字段策略！"
                  @change="handleConfig"
                >
                  <a-select-option value="config">
                    默认配置
                  </a-select-option>
                  <a-select-option value="useConfig">
                    自定义配置
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="父类包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.parentPackage" placeholder="父类包名如：com.xxx.abc" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="模块名称" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.moduleName" placeholder="模块名称如：order" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="去表前缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.tablePrefix" placeholder="去掉表的前缀，多个用逗号分割" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="表名策略" style="width: 100%;">
                <a-select
                  style="width: 270px;"
                  v-model="param.naming"
                  allowClear
                  placeholder="请选择表名策略！"
                >
                  <a-select-option value="no_change">
                    不改变
                  </a-select-option>
                  <a-select-option value="underline_to_camel">
                    下划线转驼峰法
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="字段策略" style="width: 100%;">
                <a-select
                  style="width: 270px;"
                  v-model="param.columnNaming"
                  allowClear
                  placeholder="请选择字段策略！"
                >
                  <a-select-option value="no_change">
                    不改变
                  </a-select-option>
                  <a-select-option value="underline_to_camel">
                    下划线转驼峰法
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="主键策略" style="width: 100%;">
                <a-select
                  style="width: 270px;"
                  v-model="param.idType"
                  allowClear
                  placeholder="请选择主键策略！"
                >
                  <a-select-option value="AUTO">
                    数据库自增
                  </a-select-option>
                  <a-select-option value="NONE">
                    没有主键策略
                  </a-select-option>
                  <a-select-option value="INPUT">
                    自主输入主键
                  </a-select-option>
                  <a-select-option value="ID_WORKER">
                    全局唯一(雪花算法)
                  </a-select-option>
                  <a-select-option value="UUID">
                    全局唯一(UUID)
                  </a-select-option>
                  <a-select-option value="ID_WORKER_STR">
                    字符串全局唯一(雪花算法)
                  </a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>

      <a-collapse-panel key="1" header="实体类配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="实体尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.entityName" placeholder="实体类名尾缀如：Entity" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实体包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.entity" placeholder="实体类包名如：entity" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实体继承" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.superEntityClass" placeholder="实体类继承父类：com.xxx.abc.supperEntity" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实体模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.entityTemp" placeholder="实体类继承父类：/templates/entity.java.vm" allowClear/>
              </a-form-item>
            </a-col>
            <!--superEntityColumns;-->
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="2" header="service配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="服务尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.serviceName" placeholder="服务类名尾缀如：Service" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="服务包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.service" placeholder="服务类包名如：service" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="服务继承" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.superServiceClass" placeholder="服务类继承父类：com.xxx.abc.supperService" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="服务模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.serviceTemp" placeholder="服务类模版：/templates/service.java.vm" allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="3" header="sercieImpl配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="实现尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.serviceImplName" placeholder="实现类名尾缀如：ServiceImpl" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实现包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.serviceImpl" placeholder="实现类包名如：service.impl" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实现继承" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.superServiceImplClass" placeholder="实现类继承父类：com.xxx.abc.superServiceImpl" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="实现模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.serviceImplTemp" placeholder="实现类模版：/templates/serviceImpl.java.vm" allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="4" header="controller配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="控制尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.controllerName" placeholder="控制类尾缀缀如：Controller" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="控制包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.controller" placeholder="控制类包名如：controller" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="控制继承" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.superControllerClass" placeholder="控制类继承父类：com.xxx.abc.superController" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="控制模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.controllerTemp" placeholder="控制类模版：/templates/controller.java.vm" allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="5" header="mapper配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="数据尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.mapperName" placeholder="数据类名尾缀如：Mapper" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="数据包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.mapper" placeholder="数据类包名如：mapper" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="数据继承" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.superMapperClass" placeholder="数据类继承父类：com.xxx.abc.superMapper" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="数据模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.mapperTemp" placeholder="数据类模版：/templates/mapper.java.vm" allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
      <a-collapse-panel key="6" header="mapper.xml配置" :style="customStyle">
        <a-form layout="inline">
          <a-row :gutter="48" style="margin: 0;">
            <a-col :md="12" :sm="12">
              <a-form-item label="xml尾缀" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.xmlName" placeholder="xml尾缀缀如：Mapper" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="xml包名" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.xml" placeholder="xml包名如：mapper.xml" allowClear/>
              </a-form-item>
            </a-col>
            <a-col :md="12" :sm="12">
              <a-form-item label="xml模版" style="width: 100%;">
                <a-input style="width: 270px;" v-model="param.xmlTemp" placeholder="xml模版：/templates/mapper.xml.vm" allowClear/>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>

<script>
import pick from 'lodash.pick'
export default {
  name: 'TableConfig',
  data () {
    return {
      param: {
        genertorId: '',
        xml: '',
        xmlName: '',
        xmlTemp: '',
        mapperName: '',
        mapper: '',
        superMapperClass: '',
        mapperTemp: '',
        controllerName: '',
        controller: '',
        superControllerClass: '',
        controllerTemp: '',
        serviceImplName: '',
        serviceImpl: '',
        superServiceImplClass: '',
        serviceImplTemp: '',
        serviceName: '',
        service: '',
        superServiceClass: '',
        serviceTemp: '',
        entityName: '',
        entity: '',
        superEntityClass: '',
        entityTemp: '',
        parentPackage: '',
        moduleName: '',
        tablePrefix: '',
        naming: undefined,
        idType: undefined,
        columnNaming: undefined,
        genertorContext: ''
      },
      queryParam: {},
      checkboxGroup: [],
      tableSelect: [],
      text: 'ceshi',
      customStyle: 'background: #f7f7f7;border-radius: 4px;border: 0;overflow: hidden'
    }
  },
  created () {
    this.$bus.on('setMsg', content => {
      this.tableSelect = content
    })
  },
  methods: {
    setData (data) {
      if (data) {
        this.tableSelect = data.tableSelect
        this.param.genertorId = data.genertorId
      } else {

      }
    },
    onChange (checkedValues) {
      if (checkedValues && checkedValues.length > 0) {
        this.param.genertorContext = checkedValues.join(',')
      }
    },
    handleConfig (value) {
      if (value && value === 'config') {
        Object.assign(this.param, {
          mapperName: '%sMapper',
          mapper: 'server.mapper',
          superMapperClass: 'com.opencloud.common.mybatis.base.mapper.SuperMapper',
          controllerName: '%sController',
          controller: 'server.controller',
          serviceImplName: '%sServiceImpl',
          serviceImpl: 'server.service.impl',
          superServiceImplClass: 'com.opencloud.common.mybatis.base.service.impl.BaseServiceImpl',
          serviceName: '%sService',
          service: 'server.service',
          superServiceClass: 'com.opencloud.common.mybatis.base.service.IBaseService',
          entityName: '%sEntity',
          entity: 'client.model.entity',
          superEntityClass: 'com.opencloud.common.mybatis.base.entity.AbstractEntity',
          parentPackage: 'com.opencloud',
          moduleName: 'health',
          naming: 'underline_to_camel',
          idType: 'ID_WORKER',
          columnNaming: 'underline_to_camel'
        })
      }
    },
    handleGenertor () {
      if (this.tableSelect && this.tableSelect.length > 0) {
        this.param.includeTables = this.tableSelect.join(',')
      }
      this.$http.post(this.$apis.developer.code.genertor.excute, this.param, this).then(res => {
        if (res.code === 0) {
          this.$http.getDown(this.$apis.developer.code.genertor.download, { filePath: res.data.filePath }, 'arraybuffer').then(res => {
            const blob = new Blob([res.data])
            const fileName = res.headers['content-disposition'].split('=')[1]
            const downloadElement = document.createElement('a')
            const href = window.URL.createObjectURL(blob)
            downloadElement.href = href
            downloadElement.download = decodeURIComponent(fileName)
            document.body.appendChild(downloadElement)
            downloadElement.click()
            document.body.removeChild(downloadElement)
            window.URL.revokeObjectURL(href)
          })
        }
        this.$emit('ok')
      })
    }
    // handleSubmit () {
    //   return new Promise((resolve, reject) => {
    //     this.form.validateFields((err, values) => {
    //       if (!err) {
    //         Object.assign(this.formItem, {
    //           nickName: values.nickName,
    //           mobile: values.mobile,
    //           email: values.email,
    //           city: values.city,
    //           userDesc: values.userDesc,
    //         })
    //         this.$http.post(this.$apis.user.updateCurrent, this.formItem, this).then(res => {
    //           if (res.code===0){
    //             this.$store.commit('SET_NAME', {name:this.formItem.nickName,welcome:'修改个人资料成功！'})
    //             this.$notification.open({
    //               message: '操作',
    //               description: '修改个人资料成功！'
    //             })
    //           }
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
