<template>
  <div class="text-h5 text-center" style="max-width: 400px">
    {{ text }}
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  text: string;
}>();
</script>
