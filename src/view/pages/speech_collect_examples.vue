<template lang="pug">
  .container
    button(@click="collect") 你瞅啥
    button(@click="collect") 瞅你咋地
    button(@click="collect") 背景噪音
    pre {{ countInfo }}
    button(@click="save") 保存
    <br/>
    button(@click="train") 训练
    <br/>
    span 录音开关
    my-switch(class="switch" :isOpen="isRecording" @onSwitch="handleSwitch")
    <br/>
    span {{ result }}
</template>

<script lang="ts">
/**
 * @description 使用预训练模型创建迁移学习器, 并产生自定义训练数据
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
  isRecording: Boolean = false
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
	}

  async collect (e) {
    const btn = e.target
    btn.disabled = true
    const label = btn.innerText
    await this.transferRecognizer.collectExample(
      label === '背景噪音' ? '_background_noise_' : label
    )
    btn.disabled = false
    this.countInfo = JSON.stringify(
      this.transferRecognizer.countExamples(),
      null,
      2,
    )
  }

  async train () {
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

  save () {
    const arrayBuffer: ArrayBuffer = this.transferRecognizer.serializeExamples()
    const blob = new Blob([arrayBuffer])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = 'data.bin'
    link.click()
  }

}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
@import "~styles/custom.styl"
</style>