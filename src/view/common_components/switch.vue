<template lang="pug">
  .ignore(
    :style="rootStyle"
    @click="handleClick"
  )
    .slider(:style="sliderStyle")
</template>

<script lang="ts">
/**
 * @description 开关组件
 */

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

@Component
export default class HelloComponent extends Vue {
  @Prop({
    type: Boolean,
    default: false,
    required: true,
    validator: val => typeof val === 'boolean'
  })
  private isOpen!: boolean

  @Prop({
    type: Boolean,
    default: true,
    required: true,
    validator: val => typeof val === 'boolean'
  })
  private canOpen!: boolean

  @Watch('isOpen', {
    immediate: true
  })
  handler (newVal: boolean, oldVal: boolean) {
    if (newVal) {
      this.rootStyle.backgroundColor = '#4596ec'
      this.sliderStyle.transform = 'translateX(25px)'
      this.sliderStyle.boxShadow = '1px 1px 1px #4596ec'
    } else {
      this.rootStyle.backgroundColor = '#DADADA'
      this.sliderStyle.transform = 'translateX(0)'
      this.sliderStyle.boxShadow = '-1px 1px 1px #DADADA'
    }
  }

  rootStyle = {
    backgroundColor: '#4596ec'
  }
  sliderStyle = {
    transform: 'translateX(25px)',
    boxShadow: '1px 1px 1px #4596ec'
  }
  timer = null

  handleClick () {
    if (this.canOpen) {
      // 防止暴力点击
      if (this.timer) { return }
      this.timer = setTimeout(() => {
        this.$emit('onSwitch')
        this.clearTimer()
      }, 100)
    }
  }

  clearTimer () {
    window.clearTimeout(this.timer)
    this.timer = null
  }

  beforeDestroy () {
    this.clearTimer()
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~styles/mixin.styl"

.ignore
  display inline-block
  width 50px
  height 25px
  border-radius 12.5px
  .slider
    circle(25px)
    background-color #fff
    transition transform .1s linear
</style>
