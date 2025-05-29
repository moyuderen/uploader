<template>
  <div class="tiny-uploader-file">
    <div class="tiny-uploader-info-wrap">
      <file-icon class="tiny-uploader-file-icon" />
      <div
        class="tiny-uploader-filename-container"
        @click="$emit('click', file)"
        :title="file.name"
      >
        <div
          class="tiny-uploader-filename"
          :class="{
            'tiny-uploader-name-fail':
              file.status === FileStatus.AddFail ||
              file.status === FileStatus.CheckFail ||
              file.status === FileStatus.Fail ||
              file.status === FileStatus.UploadFail
          }"
        >
          {{ file.name }}
          <span class="tiny-uploader-size" v-if="file.size > 0">{{ `(${file.renderSize})` }}</span>
        </div>
      </div>
      <div style="display: flex; align-items: center">
        <div class="tiny-uploader-status">
          <loading-icon
            v-if="file.status === FileStatus.Ready || file.status === FileStatus.Reading"
          />
          <div v-else-if="file.errorMessage" class="tiny-uploader-error-meessage">
            {{ file.errorMessage }}
          </div>
        </div>
        <div class="tiny-uploader-percent">
          <success-icon v-if="file.status === FileStatus.Success"></success-icon>
          <span v-else>{{ parseProgress(file.progress) }}%</span>
        </div>
        <div class="tiny-uploader-actions">
          <span
            v-if="
              file.status === FileStatus.Uploading ||
              file.status === FileStatus.Ready ||
              file.status === FileStatus.Reading
            "
            class="tiny-uploader-action"
            @click="pause(file)"
          >
            <pause-icon />
          </span>
          <span
            v-if="file.status === FileStatus.Pause"
            class="tiny-uploader-action"
            @click="resume(file)"
          >
            <play-icon />
          </span>
          <span
            v-if="
              file.status === FileStatus.CheckFail ||
              file.status === FileStatus.Fail ||
              file.status === FileStatus.UploadFail
            "
            class="tiny-uploader-action"
            @click="retry(file)"
          >
            <retry-icon />
          </span>
          <span class="tiny-uploader-action" @click="remove(file)">
            <remove-icon />
          </span>
        </div>
      </div>
      <div
        class="tiny-uploader-progress-wrap"
        v-if="
          file.status === FileStatus.Uploading ||
          file.status === FileStatus.Pause ||
          file.status === FileStatus.Resume ||
          file.status === FileStatus.UploadSuccess ||
          file.status === FileStatus.UploadFail
        "
      >
        <div
          class="tiny-uploader-progress"
          :class="{
            'tiny-uploader--uploading':
              file.status === FileStatus.Uploading ||
              file.status === FileStatus.Pause ||
              file.status === FileStatus.Resume,
            'tiny-uploader--success': file.status === FileStatus.UploadSuccess,
            'tiny-uploader--fail':
              file.status === FileStatus.Fail || file.status == FileStatus.UploadFail
          }"
          :style="{ width: progressWidth }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { inject, ref, toRefs, watch } from 'vue'
import { FileStatus } from '@tinyuploader/sdk'
import LoadingIcon from '../icons/loading-icon.vue'
import FileIcon from '../icons/file-icon.vue'
import PlayIcon from '../icons/play-icon.vue'
import PauseIcon from '../icons/pause-icon.vue'
import RetryIcon from '../icons/retry-icon.vue'
import RemoveIcon from '../icons/remove-icon.vue'
import SuccessIcon from '../icons/success-icon.vue'

const props = defineProps({
  file: Object
})

const { file } = toRefs(props)
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

<style lang="scss">
.tiny-uploader-info-wrap {
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 22px;
  margin: 6px 0;
  padding: 0px 6px;
  color: #606266;
  font-size: 14px;
  border-radius: 2px;
  z-index: 0;
}

.tiny-uploader-info-wrap:hover {
  background-color: var(--tiny-fill-color-lighter);

  .tiny-uploader-filename {
    color: var(--tiny-color-primary);
  }

  .tiny-uploader-name-fail {
    color: var(--tiny-color-error);
  }
}

.tiny-uploader-filename-container {
  flex: 1;
  width: 0;
  display: flex;
  align-items: center;
  margin-right: 6px;
}

.tiny-uploader-filename {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
  cursor: pointer;
}

.tiny-uploader-name-fail {
  color: var(--tiny-color-error);
}

.tiny-uploader-size {
  font-size: var(--tiny-font-size-small);
}

.tiny-uploader-error-meessage {
  color: var(--tiny-color-error);
  font-size: var(--tiny-font-size-extra-small);
}

.tiny-uploader-file-icon {
  margin-right: 4px;
}

.tiny-uploader-status {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-right: 4px;
}

.tiny-uploader-progress-wrap {
  position: absolute;
  top: 22px;
  left: 2px;
  width: 100%;
  height: 2px;
  border-radius: 2px;
  z-index: -1;
  background-color: var(--tiny-fill-color-light);
  opacity: 0.8;
}

.tiny-uploader-progress {
  height: 2px;
  border-radius: 2px;
  transition: width 1s;
}

.tiny-uploader-percent {
  display: flex;
  align-items: center;
  height: 100%;
  text-align: right;
}

.tiny-uploader-size {
  width: 70px;
  text-align: left;
  margin-left: 8px;
  color: var(--tiny-text-color-secondary);
}

.tiny-uploader--reading {
  background-color: var(--tiny-color-reading);
}

.tiny-uploader--uploading {
  background-color: var(--tiny-color-primary);
}

.tiny-uploader--success {
  background-color: var(--tiny-color-success);
}

.tiny-uploader--fail {
  background-color: var(--tiny-color-error);
}

.tiny-uploader-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 8px;
  cursor: pointer;
}

.tiny-uploader-action {
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  margin-left: 8px;
  overflow: hidden;
}
</style>
