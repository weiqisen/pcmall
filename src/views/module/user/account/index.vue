<template>
  <div class="page-header-index-wide page-header-wrapper-grid-content-main">
    <a-row :gutter="24">
      <a-col :md="24" :lg="7">
        <a-card :bordered="false">
          <div class="account-center-avatarHolder">
            <div class="avatar">
              <a-upload
                list-type="picture-card"
                class="avatar-uploader"
                :show-upload-list="false"
                :data="handleUploadData"
                :before-upload="beforeUpload"
                :action="$apis.device.upload"
                :headers="header"
                name="file"
                @change="handleChange"
              >
                <img src="/src/assets/avatar.png" alt="avatar" />

                <!--                <img v-if="userInfo.avatar" :src="userInfo.avatar" alt="avatar" />-->
                <!--                <div v-else>-->
                <!--                  <a-icon :type="loading ? 'loading' : 'plus'" />-->
                <!--                  <div class="ant-upload-text">-->
                <!--                    Upload-->
                <!--                  </div>-->
                <!--                </div>-->
              </a-upload>
            </div>
            <div class="username">{{ userInfo.nickname }}</div>
          </div>
          <div class="account-center-detail">
            <p><jihao-icon title="手机" type="icon_tel_gray"/>手机</p>
            <p>{{ userInfo.mobile }}</p>
            <a-divider style="margin: 15px 0;"/>
            <p><jihao-icon title="邮箱" type="icon_email"/>邮箱</p>
            <p style="word-break: break-word;">{{ userInfo.email }}</p>
            <a-divider style="margin: 15px 0;"/>
            <p><jihao-icon title="城市" type="icon_location_dark"/>城市</p>
            <p style="word-break: break-word;">{{ userInfo.city }} </p>
            <a-divider style="margin: 15px 0;"/>
            <p><jihao-icon title="简介" type="iconjianjie"/>简介</p>
            <p style="word-break: break-word;">{{ userInfo.userDesc }}</p>
            <p></p>
          </div>

        </a-card>
      </a-col>
      <a-col :md="24" :lg="17">
        <a-card
          style="width:100%"
          :bordered="false"
        >
          <a-tabs :activeKey="noTitleKey" @tabClick="handleTabClick">
            <a-tab-pane tab="个人资料" key="form1" name="form1">
              <profile @ok="handleOk" ref="form1" :parent-visable.sync="visible"></profile>
            </a-tab-pane>
            <a-tab-pane tab="修改密码" key="form2" forceRender name="form2">
              <midify-password @ok="handleOk" ref="form2"></midify-password>
            </a-tab-pane>
          </a-tabs>
        </a-card>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { PageView, RouteView } from '@/layouts'
import Profile from './form/profile'
import MidifyPassword from './form/midify_password'
import { ACCESS_TOKEN } from '@/store/mutation-types'
import Vue from 'vue'
export default {
  components: {
    RouteView,
    PageView,
    Profile,
    MidifyPassword
  },
  data () {
    return {
      header: {
        'Authorization': 'Bearer ' + Vue.ls.get(ACCESS_TOKEN)
      },
      loading: false,
      tagInputVisible: false,
      tagInputValue: '',
      teams: [],
      teamSpinning: true,
      tabListNoTitle: [
        {
          key: 'profile',
          tab: '个人资料'
        },
        {
          key: 'midifyPassword',
          tab: '修改密码'
        }
      ],
      noTitleKey: 'form1',
      userInfo: '',
      visible: false
    }
  },
  mounted () {
  },
  created () {
    this.getTeams()
  },
  methods: {
    handleUploadData () {
      const data = {
        username: this.$store.getters.username,
        tenantId: this.$store.getters.tenantId,
        serverName: 'device_manage',
        groupName: '',
        fileFlag: '2'
      }
      return data
    },
    handleChange (info) {
      if (info.file.status !== 'uploading') {
        this.loading = true
      }
      if (info.file.status === 'done') {
        this.loading = false
        if (info.file.response.code === 0) {
          this.userInfo.avatar = info.file.response.data.fileUrl
          this.$store.commit('SET_AVATAR', info.file.response.data.fileUrl)
          // this.$store.commit('setNickName', this.profile.nickName)
          this.$message.success(`${info.file.name} 文件上传成功！`)
          this.$http.post(this.$apis.user.updateAvatar, { avatar: info.file.response.data.fileUrl }, this)
        } else {
          this.$message.error(`${info.file.name}` + info.file.response.message)
        }
      } else if (info.file.status === 'error') {
        this.$message.error(`${info.file.name} 文件上传失败！`)
        this.loading = false
      }
    },
    beforeUpload (file) {
      debugger
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif'
      if (!isJpgOrPng) {
        this.$message.error('只能上传jpeg,png,gif图片!')
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        this.$message.error('Image must smaller than 2MB!')
      }
      return isJpgOrPng && isLt2M
    },
    getTeams () {
      const that = this
      this.$http.get(this.$apis.user.queryUser).then(res => {
        this.userInfo = res.data
        that.handleTabClick(that.noTitleKey)
      })
    },

    handleTabClick (name) {
      this.$nextTick(() => {
        this.noTitleKey = name
        if (name == 'form1') {
          this.$refs.form1.setData(this.userInfo)
        } else if (name == 'form2') {
          this.$refs.form2.setData(this.userInfo)
        }
      })
    },
    showTagInput () {
      this.tagInputVisible = true
      this.$nextTick(() => {
        this.$refs.tagInput.focus()
      })
    },

    handleInputChange (e) {
      this.tagInputValue = e.target.value
    },
    handleOk () {
      this.getTeams()
    }
  }
}
</script>

<style lang="less" scoped>
  .page-header-wrapper-grid-content-main {
    width: 100%;
    height: 100%;
    min-height: 100%;
    transition: 0.3s;

    .account-center-avatarHolder {
      text-align: center;
      margin-bottom: 24px;

      & > .avatar {
        margin: 0 auto;
        width: 104px;
        height: 104px;
        margin-bottom: 20px;
        border-radius: 50%;
        overflow: hidden;
        img {
          height: 100%;
          width: 100%;
        }
      }

      .username {
        color: rgba(0, 0, 0, 0.85);
        font-size: 20px;
        line-height: 28px;
        font-weight: 500;
        margin-bottom: 4px;
      }
    }

    .account-center-detail {
      p {
        margin-bottom: 8px;
        padding-left: 26px;
        position: relative;
      }

      i {
        position: absolute;
        height: 14px;
        width: 14px;
        left: 0;
        top: 4px;
        /*background: url(https://gw.alipayobjects.com/zos/rmsportal/pBjWzVAHnOOtAUvZmZfy.svg);*/
      }

      .title {
        background-position: 0 0;
      }
      .group {
        background-position: 0 -22px;
      }
      .address {
        background-position: 0 -44px;
      }
    }

    .account-center-tags {
      .ant-tag {
        margin-bottom: 8px;
      }
    }

    .account-center-team {
      .members {
        a {
          display: block;
          margin: 12px 0;
          line-height: 24px;
          height: 24px;
          .member {
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 24px;
            max-width: 100px;
            vertical-align: top;
            margin-left: 12px;
            transition: all 0.3s;
            display: inline-block;
          }
          &:hover {
            span {
              color: #1890ff;
            }
          }
        }
      }
    }

    /*.tagsTitle,*/
    /*.teamTitle {*/
      /*font-weight: 500;*/
      /*color: rgba(0, 0, 0, 0.85);*/
      /*margin-bottom: 12px;*/
    /*}*/
  }
</style>
