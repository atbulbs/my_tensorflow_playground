<template lang="pug">
  .container
    button(
      v-for="(item, index) in demos",
      @click="$router.push(item[1])",
    ) {{ item[0] }}
</template>

<script lang="ts">
/**
 * @description 首页
 */

import { PAGES } from '../../shared/consts'
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloComponent extends Vue {
  demos = PAGES.slice(1)
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~styles/custom.styl"
  
button
  display block
  margin 6px auto
  width 100vw
</style>