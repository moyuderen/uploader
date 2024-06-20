<template>
  <div>
    <div class="">
      <el-button id="uploadBtn" type="primary">Upload</el-button>
    </div>
    {{ uploaderPending }}
    <div v-loading="uploaderPending === 'pending'">
      <div v-for="(file) in uploader && uploader.fileList" :key="file.id">
        {{ file.name }} {{ file.status }}
        <el-progress :percentage="+(file.progress * 100).toFixed(2)" />
        <div @click="remove(file.id)">X</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Uploader from "@/sdk";

const uploader = ref(null)

onMounted(() => {
  uploader.value = new Uploader()
  uploader.value.assignBrowse(document.getElementById('uploadBtn'))
  console.log(uploader)
})

const uploaderPending = computed(() => {
  return uploader.value && uploader.value.status
})

const remove = (id) => {
  uploader.value.remove(id)
}

</script>
