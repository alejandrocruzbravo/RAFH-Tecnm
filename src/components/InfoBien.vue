<template>
  <div>
    <span class="text-xs font-medium text-gray-600 dark:text-gray-400">{{ label }}</span>
    <p class="text-sm text-gray-900 dark:text-white font-medium break-words">{{ value || 'N/A' }}</p>
  </div>
</template>
<script setup>
defineProps(['label', 'value']);
</script>