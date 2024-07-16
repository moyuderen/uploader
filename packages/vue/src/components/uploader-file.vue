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
          <span v-if="file.status === 'pause'" class="action" @click="resume(file.id)">
            <play-icon :size="14" />
          </span>
          <span v-if="file.status === 'uploading'" class="action" @click="pause(file.id)">
            <pause-icon :size="14" />
          </span>
          <span v-if="file.status === 'fail'" class="action" @click="retry(file.id)">
            <retry-icon :size="14" />
          </span>
          <span class="action remove" @click="remove(file.id)">
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
              file.status === 'uploading' ||
              file.status === 'pause' ||
              file.status === 'resume' ||
              file.status === 'uploadSuccess',
            success: file.status === 'success',
            fail: file.status === 'fail'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
import { uploaderMixin } from '../common/mixins'
import FileIcon from './file-icon.vue'
import PlayIcon from './play-icon.vue'
import PauseIcon from './pause-icon.vue'
import RetryIcon from './retry-icon.vue'
import RemoveIcon from './remove-icon.vue'

export default {
  components: {
    FileIcon,
    PlayIcon,
    PauseIcon,
    RetryIcon,
    RemoveIcon
  },
  props: {
    file: {
      type: Object
    }
  },
  mixins: [uploaderMixin],
  data() {
    return {
      progressWidth: 0
    }
  },
  watch: {
    'file.progress': {
      handler(progress) {
        this.progressWidth = `${progress * 100}%`
      },
      immediate: true
    }
  },
  methods: {
    parseProgress(progress) {
      return parseFloat(progress * 100).toFixed(2)
    },
    remove(id) {
      this.uploader.remove(id)
    },
    retry(id) {
      this.uploader.retry(id)
    },
    resume(id) {
      this.uploader.resume(id)
    },
    pause(id) {
      this.uploader.pause(id)
    }
  }
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
