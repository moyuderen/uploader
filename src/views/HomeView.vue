<template>
  <div>
    <div class="">
      <el-button id="uploadBtn" type="primary">Upload</el-button>
      <el-button type="primary" @click="getUploader">get uploader</el-button>
      <el-button type="primary" @click="submit">Submit</el-button>
    </div>
    <div v-for="(file) in files" :key="file.id">
      <div style="overflow: hidden; text-overflow: ellipsis;">
        {{ file.name }}
      </div>
      <div style="display: flex; align-items: center;">
        <el-progress :percentage="+(file.progress * 100).toFixed(2)" :status="PROGRESS[file.status]" style="flex: 1;" />
        <div style="width: 44px;">
          <el-icon v-if="file.status === 'fail'" @click="retry(file.id)" class="action">
            <RefreshRight color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === 'pause'" @click="resume(file.id)" class="action">
            <VideoPlay color="#409EFF" />
          </el-icon>
          <el-icon v-if="file.status === 'uploading'" @click="pause(file.id)" class="action">
            <VideoPause color="#E6A23C" />
          </el-icon>
          <el-icon @click="remove(file.id)" class="action">
            <Close />
          </el-icon>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { RefreshRight, VideoPlay, VideoPause, Close } from '@element-plus/icons-vue'
import Uploader from "@/sdk";
const Status = Uploader.Status

const PROGRESS = {
  [Status.Success]: 'success',
  [Status.Fail]: 'exception',
}
const uploader = ref(null)
const files = ref([])

onMounted(() => {
  uploader.value = new Uploader({
    // autoUpload: false
  })
  uploader.value.assignBrowse(document.getElementById('uploadBtn'))
  uploader.value.on('filesAdded', (fileList) => {
    files.value = fileList
  })

  uploader.value.on('allSuccess', (fileList) => {
    console.log('全部上传成功', fileList)
    files.value = fileList
  })

  uploader.value.on('fileSuccess', (file, fileList) => {
    console.log(`${file.name}上传成功`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileFail', (file, fileList) => {
    console.log(`${file.name}上传失败`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileRemove', (file, fileList) => {
    console.log(`${file.name}被删除`, file, fileList)
    files.value = fileList
  })

  uploader.value.on('fileProgress', (progress, file, fileList) => {
    // console.log(`${file.name} progress ${progress}`, file, fileList)
  })
})

const remove = (id) => {
  uploader.value.remove(id)
}

const retry = (id) => {
  uploader.value.retry(id)
}

const resume = (id) => {
  uploader.value.resume(id)
}

const pause = (id) => {
  uploader.value.pause(id)
}

const getUploader = () => {
  console.log(uploader)
  const fileList = uploader.value.fileList
  const list = fileList.map(file => {
    return {
      name: file.name,
      chunks: file.chunks,
      errorChunks: file.chunks.filter(chunk => chunk.status === Status.Fail),
      successChunks: file.chunks.filter(chunk => chunk.status === Status.Success),
      readyChunks: file.chunks.filter(chunk => chunk.status === Status.Ready),
      pendingChunks: file.chunks.filter(chunk => chunk.status === Status.Pending)
    }
  })

  console.log(list)
}

const submit = () => {
  uploader.value.submit()
}

</script>

<style scoped>
.action {
  margin-left: 6px;
}
</style>
