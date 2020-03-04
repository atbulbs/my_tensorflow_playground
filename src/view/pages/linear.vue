<template lang="pug">
  .linear {{ computedMsg }}
</template>

<script lang="ts">
import Vue from 'vue'
import Component from 'vue-class-component'

@Component
export default class HelloComponent extends Vue {
  msg = ''

  mounted () {
    this.greet()
  }

  get computedMsg () {
    return this.msg
  }

  greet () {
    this.msg = 'linear'
  }
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">

.linear
  width 100vw
  height 100vh
  background-color blue
</style>