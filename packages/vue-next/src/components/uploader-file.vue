<template>
  <div class="uploader-file">
    <div class="info-wrap">
      <div class="file-name">
        <file-icon :size="14" class="file-icon" />
        {{ file.name }}
      </div>
      <div style="display: flex">
        <div class="percent">{{ parseProgress(file.progress) }}%</div>
        <div class="actions">
          <span v-if="file.status === Status.Pause" class="action" @click="resume(file)">
            <play-icon :size="14" />
          </span>
          <span v-if="file.status === Status.Uploading" class="action" @click="pause(file)">
            <pause-icon :size="14" />
          </span>
          <span
            v-if="file.status === Status.Fail || file.status === Status.UploadFail"
            class="action"
            @click="retry(file)"
          >
            <retry-icon :size="14" />
          </span>
          <span class="action remove" @click="remove(file)">
            <remove-icon :size="14" />
          </span>
        </div>
      </div>
      <div class="progress-wrap">
        <div
          class="progress"
          :style="{ width: progressWidth }"
          :class="{
            uploading:
              file.status === Status.Uploading ||
              file.status === Status.Pause ||
              file.status === Status.Resume ||
              file.status === Status.UploadSuccess,
            success: file.status === Status.Success,
            fail: file.status === Status.Fail || file.status === Status.UploadFail
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { inject, ref, watch } from 'vue'
import { Status } from '@tinyuploader/sdk'
import FileIcon from './file-icon.vue'
import PlayIcon from './play-icon.vue'
import PauseIcon from './pause-icon.vue'
import RetryIcon from './retry-icon.vue'
import RemoveIcon from './remove-icon.vue'

const props = defineProps({
  file: Object
})
const uploader = inject('uploader')
const progressWidth = ref(0)
watch(
  () => props.file.progress,
  (progress) => {
    progressWidth.value = `${progress * 100}%`
  },
  {
    immediate: true
  }
)

const parseProgress = (progress) => {
  return parseFloat(progress * 100).toFixed(2)
}

const remove = (file) => {
  uploader.value.remove(file)
}

const retry = (file) => {
  uploader.value.retry(file)
}

const resume = (file) => {
  uploader.value.resume(file)
}

const pause = (file) => {
  uploader.value.pause(file)
}
</script>

<style>
.info-wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 28px;
  margin: 6px 0;
  padding: 0px 6px;
  cursor: pointer;
  color: #606266;
  font-size: 14px;
  z-index: 0;
}

.info-wrap:hover .actions {
  display: flex;
}

.file-name {
  display: flex;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
  margin-right: 6px;
}

.file-icon {
  margin-right: 4px;
}

.progress-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 3px;
  z-index: -1;
  background-color: #f4f4f5;
  opacity: 0.8;
}
.progress {
  height: 28px;
  border-radius: 4px;
}

.percent {
  width: 50px;
  margin-right: 8px;
}

.uploading {
  background-color: #d9ecff;
}

.success {
  background-color: #f0f9eb;
}

.fail {
  background-color: #fef0f0;
}

.actions {
  display: none;
  align-items: center;
  margin-right: 8px;
}
.action {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 14px;
  height: 14px;
  cursor: pointer;
  margin-left: 8px;
  overflow: hidden;
}
</style>
