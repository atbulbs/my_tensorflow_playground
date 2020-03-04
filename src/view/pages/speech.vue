<template lang='pug'>
	.speech
		button.btn(
			v-for="(item, index) in labels"
			:class="{'current': index === currentIndex }"
		) {{ item }}
</template>

<script lang="ts">
/**
 * @description 使用预训练模型进行语音识别
 */

import * as tf from '@tensorflow/tfjs'
import * as speechCommands from '@tensorflow-models/speech-commands'
import Vue from 'vue'
import Component from 'vue-class-component'

const PATH = window.location.origin + window.location.pathname

@Component
export default class SpeechComponent extends Vue {

	labels = []
	currentIndex = -1

	mounted() {
		this.init()
	}

	async init() {
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

		// 注意用https, getUserMedia
		// https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
		recognizer.listen(
			result => {
				const { scores } = result
				const maxValue = Math.max(...(<Array<any>>scores))
				this.currentIndex = (<Array<any>>scores).indexOf(maxValue)
				return Promise.resolve()
			},
			// 流式识别的配置
			{
				// 重叠率
				overlapFactor: 0.0001,
				// 可能性阈值
				probabilityThreshold: 0.9
			}
		)
	}

}
</script>

<style scoped lang='stylus' rel='stylesheet/stylus'>
.speech
	width 100vw
	height 100vh
	background-color #5CACEE
	.label
		float left
		background-color #C9C9C9
		font-size 17px
		text-align center
		height 25px
		margin 5px
		padding 5px
		display table
		color #ffffff
	.current
		background-color #CD69C9
		color #9AC0CD
</style>