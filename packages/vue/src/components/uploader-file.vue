<template>
  <div class="tiny-uploader-file">
    <div class="tiny-uploader-info-wrap">
      <file-icon :size="14" class="tiny-uploader-file-icon" />
      <div class="tiny-uploader-filename-container" @click="$emit('click', file)" :title="file.name">
        <div class="tiny-uploader-filename">
          {{ file.name }}
          <span class="tiny-uploader-size" v-if="file.size > 0">{{ `(${file.renderSize})` }}</span>
        </div>
      </div>
      <div style="display: flex">
        <div class="tiny-uploader-status">
          <LoadingIcon v-if="file.status === FileStatus.Ready || file.status === FileStatus.Reading"/>
          <div v-else>{{ file.errorMessage || statusMap[file.status] }}</div>
        </div>
        <div class="tiny-uploader-percent">{{ parseProgress(file.progress) }}%</div>
        <div class="tiny-uploader-actions">
          <span
            v-if="file.status === FileStatus.Uploading || file.status === FileStatus.Ready || file.status===FileStatus.Reading"
            class="tiny-uploader-action"
            @click="pause(file)">
            <pause-icon :size="14" />
          </span>
          <span v-if="file.status === FileStatus.Pause" class="tiny-action" @click="resume(file)">
            <play-icon :size="14" />
          </span>
          <span
            v-if="file.status === FileStatus.CheckFail || file.status === FileStatus.Fail || file.status === FileStatus.UploadFail"
            class="tiny-uploader-action"
            @click="retry(file)"
          >
            <retry-icon :size="14" />
          </span>
          <span class="tiny-uploader-action" @click="remove(file)">
            <remove-icon :size="14" />
          </span>
        </div>
      </div>
      <div class="tiny-uploader-progress-wrap">
        <div
          class="tiny-uploader-progress"
          :style="{ width: progressWidth }"
          :class="{
            'tiny-uploader--reading': file.status === FileStatus.Reading,
            'tiny-uploader--uploading':
              file.status === FileStatus.Uploading ||
              file.status === FileStatus.Pause ||
              file.status === FileStatus.Resume ||
              file.status === FileStatus.UploadSuccess,
            'tiny-uploader--success': file.status === FileStatus.Success,
            'tiny-uploader--fail': file.status === FileStatus.AddFail || file.status === FileStatus.CheckFail || file.status === FileStatus.Fail || file.status === FileStatus.UploadFail
          }"
        >
          <div class="glow-effect"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { FileStatus } from '@tinyuploader/sdk'
import { uploaderMixin } from '../common/mixins'
import FileIcon from '../icons/file-icon.vue'
import LoadingIcon from '../icons/loading-icon.vue'
import PauseIcon from '../icons/pause-icon.vue'
import PlayIcon from '../icons/play-icon.vue'
import RemoveIcon from '../icons/remove-icon.vue'
import RetryIcon from '../icons/retry-icon.vue'

const customStatus = {
  Ready: 'Ready',
  Reading: 'Reading',
  Uploading: 'Uploading',
  Pause: 'Pause',
  Resume: 'Resume',
  Success: 'Success',
  Fail: 'Fail',
}

export default {
  components: {
    FileIcon,
    PlayIcon,
    PauseIcon,
    RetryIcon,
    RemoveIcon,
    LoadingIcon
  },
  props: {
    file: {
      type: Object
    },
    customStatus: {
      type: Object,
      default() {
        return null
      }
    }
  },
  mixins: [uploaderMixin],
  data() {
    return {
      FileStatus,
      progressWidth: 0,
    }
  },
  computed: {
    statusMap() {
      const status  = this.customStatus ? Object.assign(customStatus, this.customStatus) : customStatus

      return {
        [FileStatus.Ready]: status['Ready'],
        [FileStatus.Reading]: status['Reading'],
        [FileStatus.Uploading]: status['Uploading'],
        [FileStatus.Pause]: status['Pause'],
        [FileStatus.Resume]: status['Resume'],
        [FileStatus.UploadSuccess]: status['Uploading'],
        [FileStatus.Success]: status['Success'],
        [FileStatus.Fail]: status['Fail'],
        [FileStatus.UploadFail]: status['Fail'],
        [FileStatus.AddFail]: status['Fail'],
        [FileStatus.CheckFail]: status['Fail'],
      }
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
.tiny-uploader-info-wrap {
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
  top: 0;
  left: 0;
  width: 100%;
  border-radius: 3px;
  z-index: -1;
  background-color: var(--tiny-fill-color-light);
  opacity: 0.8;
}

.tiny-uploader-progress {
  height: 28px;
  border-radius: 4px;
  transition: width 1s;
}

.tiny-uploader-percent {
  width: 58px;
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

@keyframes glow {
  100% {
    transform: skewX(-45deg) translateX(350%);
  }
}

.tiny-uploader--uploading {
  background-color: var(--tiny-color-uploading);
}

.tiny-uploader--success {
  background-color: var(--tiny-color-success);
}

.tiny-uploader--fail {
  width: 100%!important;
  background-color: var(--tiny-color-fail)
}

.tiny-uploader-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-right: 8px;
  width: 50px;
}

.tiny-uploader-action {
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
