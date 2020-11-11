<template>
  <Card shadow>
    <div>
      <div class="account-setting-con left-con">
        <Menu active-name="profile" @on-select="handleSelect">
          <MenuItem name="profile">
            <span>基本信息</span>
          </MenuItem>
          <MenuItem name="security">
            <span>安全设置</span>
          </MenuItem>
        </Menu>
      </div>
      <div class="account-setting-con view-con">
        <Form v-if="currentSelect==='profile'" ref="userForm" :rules="formItemRules" :model="profile">
          <h3>
            <span>基本信息</span>
          </h3>
          <Row>
            <Col span="8">
            <FormItem label="昵称" prop="nickName">
              <Input v-model="profile.nickName" placeholder="请输入内容"></Input>
            </FormItem>
            <FormItem label="描述">
              <Input v-model="profile.userDesc" type="textarea" placeholder="请输入内容"></Input>
            </FormItem>
            </Col>
            <Col span="8">
            <FormItem label="头像" prop="avatar">
              <Avatar style="height: 128px;width: 128px;border-radius: 50%;"/>
            </FormItem>
            </Col>
          </Row>
          <FormItem>
            <Button @click="handleSubmit('userForm')">保存</Button>
          </FormItem>
        </Form>

        <div v-if="currentSelect==='security'">
          <h3>
            <span>安全设置</span>
          </h3>
          <Divider/>
          <p>登录名</p>
          <p style="color: #9ea7b4">当前登录名:{{ profile.userName }}</p>
          <Divider/>
          <p>绑定手机</p>
          <p style="color: #9ea7b4">
            <span v-if="profile.mobile">已绑定手机：{{ profile.mobile }}&nbsp;&nbsp;<a>修改</a></span>
            <span v-else="">
              尚未绑定手机 <a>绑定</a>
            </span>
          </p>
          <Divider/>
          <p>绑定邮箱</p>
          <p style="color: #9ea7b4">
            <span v-if="profile.email">已绑定邮箱：{{ profile.email }}<span style="margin-left: 5px"></span><a>修改</a></span>
            <span v-else="">
              尚未绑定手机 <a>绑定</a>
            </span>
          </p>
          <Divider style="color: #9ea7b4"/>
        </div>
      </div>
    </div>
  </Card>
</template>

<script>
export default {
  name: 'MessagePage',
  data () {
    return {
      currentSelect: 'profile',
      formItemRules: {
        nickName: [
          { required: true, message: '昵称不能为空', trigger: 'blur' }
        ]
      },
      profile: this.$store.state.user
    }
  },
  methods: {
    handleSubmit (form) {
      if (form === 'userForm') {
        this.$refs['userForm'].validate((valid) => {
          if (valid) {
            this.$http.post(this.$apis.user.updateCurrent, this.profile, this).then(res => {
              if (res.code === 0) {
                this.$Message.success('修改成功')
                this.$store.commit('setAvatar', this.profile.avatar)
                this.$store.commit('setNickName', this.profile.nickName)
              }
            }).finally(() => {
              this.saving = false
            })
          }
        })
      }
    },
    handleSelect (name) {
      this.currentSelect = name
    }
  },
  mounted () {
  }
}
</script>

<style lang="less">
  .account-setting {
    &-con {
      height: ~"calc(100vh - 176px)";
      display: inline-block;
      vertical-align: top;
      position: relative;
      &.left-con {
        border-right: 1px solid #e6e6e6;
      }
      &.view-con {
        position: absolute;
        left: 264px;
        top: 16px;
        right: 16px;
        bottom: 16px;
        overflow: auto;
        padding: 12px 20px 0;
      }
    }
  }
</style>
