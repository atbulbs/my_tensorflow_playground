<template lang="pug">
  .container(v-if="transferRecognizer")
    span 操作步骤:
    <br/>
    span 1. 等待模型训练完
    <br/>
    span 2. 打开录音开关
    <br/>
    span 3. 说 "你瞅啥" / "瞅你咋地"
    <br/>
    <br/>
    span 录音开关
    my-switch(
      :canOpen="canRecording"
      :isOpen="isRecording"
      @onSwitch="handleSwitch"
    )
    <br/>
    span {{ result }}
</template>

<script lang="ts">
/**
 * @description 使用自己的数据集训练模型并进行语音识别
 */

import * as tf from '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'
import * as tfvis from '@tensorflow/tfjs-vis'
import Vue from 'vue'
import Component from 'vue-class-component'
import MySwitch from '../common_components/switch.vue'

const PATH = window.location.origin + window.location.pathname

@Component({
  components: {
    MySwitch
  }
})
export default class SpeechComponent extends Vue {

	labels = []
  currentIndex = -1
  transferRecognizer: speechCommands.TransferSpeechCommandRecognizer = null
  countInfo = ''
  isTrainDone = false
  isRecording = false
  canRecording = false
  result = ''

	mounted() {
		this.createTransferRecognizer()
  }

  async createTransferRecognizer() {
    const recognizer: speechCommands.SpeechCommandRecognizer
      = speechCommands.create(
        // 浏览器原生的傅里叶变换
        'BROWSER_FFT',
        // 自定义单词
        null,
        // 模型链接
        PATH + 'data/speech/model.json',
        // 元信息链接
        PATH + 'data/speech/metadata.json'
      )
		// 识别器的确保模型加载好
		await recognizer.ensureModelLoaded()
		console.warn('recognizer', recognizer)
		// 预训练模型里的单词
		this.labels = recognizer.wordLabels()
    console.warn('this.labels', this.labels)
    this.transferRecognizer = recognizer.createTransfer('myTransfer')
    const res = await fetch(PATH + 'data/speech/data.bin')
    const arrayBuffer = await res.arrayBuffer()
    this.transferRecognizer.loadExamples(arrayBuffer)
    console.warn(this.transferRecognizer.countExamples())
    await this.transferRecognizer.train({
      // 迭代次数
      epochs: 100,
      callback: tfvis.show.fitCallbacks(
        { name: '训练效果' },
        // 度量, 查看损失, 准确度
        ['loss', 'acc'],
        { callbacks: ['onEpochEnd'] },
      )
    })
    this.canRecording = true
  }

  async handleSwitch () {
    this.result = ''
    if (!this.isRecording) {
      this.isRecording = true
      await this.transferRecognizer.listen(
        result => {
          const { scores } = result
          console.warn('result', result)
          const maxValue = Math.max(...(<Array<any>>scores))
          const index= (<Array<any>>scores).indexOf(maxValue)
          const labels = this.transferRecognizer.wordLabels()
          console.log(labels[index])
          this.result = ''
          setTimeout(() => {
            this.result = `你是不是在说 "${ labels[index] }"?`
          }, 1000)
          return Promise.resolve()
        },
        {
          overlapFactor: 0.1,
          probabilityThreshold: 0.9,
        }
      )
    } else {
      this.isRecording = false
      this.transferRecognizer.stopListening()
    }
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~styles/custom.styl"
</style>