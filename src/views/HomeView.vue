<template>
  <div>
    <div class="">
      <el-button id="uploadBtn" type="primary">Upload</el-button>
      <el-button type="primary" @click="getUploader">get uploader</el-button>
      <el-button type="primary" @click="submit">Submit</el-button>
    </div>
    {{ uploaderPending }}
    <div v-loading="uploaderPending === 'pending'">
      <div v-for="(file) in files" :key="file.id">
        {{ file.name }} {{ file.status }}
        <el-progress :percentage="+(file.progress * 100).toFixed(2)" />
        <div v-if="file.status === 'fail'" @click="retry(file.id)">
          重试
        </div>
        <div v-if="file.status === 'pause'" @click="retry(file.id)">
          继续
        </div>
        <div v-if="file.status === 'uploading'" @click="pause(file.id)">
          暂停
        </div>
        <div @click="remove(file.id)">X</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Uploader, { Status } from "@/sdk";

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
    console.log(`${file.name} progress ${progress}`, file, fileList)
  })
})

const uploaderPending = computed(() => {
  return uploader.value && uploader.value.status
})

const remove = (id) => {
  uploader.value.remove(id)
}

const retry = (id) => {
  uploader.value.retry(id)
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
