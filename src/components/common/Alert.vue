<template>
  <div v-if="visible" class="alert-overlay">
    <div class="alert-content">
      <div class="alert-message">{{ message }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const close = () => {
  emit('close')
}

// 监听visible变化，当弹窗显示时，设置定时器自动关闭
watch(
  () => props.visible,
  (newValue) => {
    if (newValue) {
      // 2秒后自动关闭
      setTimeout(() => {
        close()
      }, 2000)
    }
  }
)
</script>

<style scoped>
.alert-overlay {
  position: fixed;
  top: 120px;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.alert-content {
  background-color: white;
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-xl);
  max-width: 400px;
  width: 90%;
  animation: fadeIn 0.3s ease-out;
  text-align: center;
}

.alert-message {
  font-size: 1rem;
  line-height: 1.5;
  color: var(--text-primary);
}



@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
