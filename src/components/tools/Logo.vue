<template>
  <div class="logo">
    <router-link :to="{name:'home'}">
      <!--<LogoSvg alt="logo" />-->
      <h1 class="title" style="margin-left: 0;">{{ iconTitle }}</h1>
      <h1 v-if="showTitle" style="margin-left: 0;">{{ title }}</h1>
    </router-link>
  </div>
</template>

<script>
import LogoSvg from '@/assets/logo.svg?inline'

export default {
  name: 'Logo',
  components: {
    LogoSvg
  },
  props: {
    iconTitle: {
      type: String,
      default: 'TC',
      required: false
    },
    title: {
      type: String,
      default: '系统',
      required: false
    },
    showTitle: {
      type: Boolean,
      default: true,
      required: false
    }
  }
}
</script>
