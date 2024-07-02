<template>
  <button class="openx-button" @click="clickHandler">
    Butto1
    <slot></slot>
  </button>
</template>

<script setup>
import Uploader from '@uploader/sdk'

const uploader = new Uploader()
function clickHandler() {
  console.log('uploader')
  uploader.say()
}
</script>