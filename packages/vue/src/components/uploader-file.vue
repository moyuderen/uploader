<template>
  <div class="uploader-file">
    <div class="tiny-info-wrap">
      <file-icon :size="14" class="tiny-file-icon" />
      <div class="tiny-file-name" @click="$emit('click', file)" :title="file.name">
        {{ file.name }}
      </div>
      <div style="display: flex">
        <div class="tiny-percent">{{ parseProgress(file.progress) }}%</div>
        <div class="tiny-actions">
          <span v-if="file.status === 'pause'" class="tiny-action" @click="resume(file)">
            <play-icon :size="14" />
          </span>
          <span v-if="file.status === 'uploading'" class="tiny-action" @click="pause(file)">
            <pause-icon :size="14" />
          </span>
          <span
            v-if="file.status === 'fail' || file.status === 'uploadFail'"
            class="tiny-action"
            @click="retry(file)"
          >
            <retry-icon :size="14" />
          </span>
          <span class="tiny-action" @click="remove(file)">
            <remove-icon :size="14" />
          </span>
        </div>
      </div>
      <div class="tiny-progress-wrap">
        <div
          class="tiny-progress"
          :style="{ width: progressWidth }"
          :class="{
            'tiny--reading': file.status === 'reading',
            'tiny--uploading':
              file.status === 'uploading' ||
              file.status === 'pause' ||
              file.status === 'resume' ||
              file.status === 'uploadSuccess',
            'tiny--success': file.status === 'success',
            'tiny--fail': file.status === 'fail' || file.status === 'uploadFail'
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
    remove(file) {
      this.uploader.remove(file)
    },
    retry(file) {
      this.uploader.retry(file)
    },
    resume(file) {
      this.uploader.resume(file)
    },
    pause(file) {
      this.uploader.pause(file)
    }
  }
}
</script>

<style>
.tiny-info-wrap {
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

.tiny-info-wrap:hover .tiny-actions {
  display: flex;
}

.tiny-file-name {
  flex: 1;
  align-items: center;
  overflow: hidden;
  text-overflow: ellipsis;
  word-wrap: normal;
  white-space: nowrap;
  margin-right: 6px;
}

.tiny-file-icon {
  margin-right: 4px;
}

.tiny-progress-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 3px;
  z-index: -1;
  background-color: #f4f4f5;
  opacity: 0.8;
}
.tiny-progress {
  height: 28px;
  border-radius: 4px;
}

.tiny-percent {
  width: 50px;
  margin-right: 8px;
}

.tiny--uploading {
  background-color: #d9ecff;
}

.tiny--success {
  background-color: #f0f9eb;
}

.tiny--fail {
  background-color: #fef0f0;
}

.tiny-actions {
  display: none;
  align-items: center;
  margin-right: 8px;
}
.tiny-action {
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
