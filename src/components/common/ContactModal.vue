<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="visible" class="modal-overlay" @click.self="handleOverlayClick">
        <div class="modal-container">
          <div class="modal-header">
            <div class="modal-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
              </svg>
            </div>
            <h3 class="modal-title">采购咨询</h3>
          </div>
          <div class="modal-body">
            <p class="modal-message">{{ message }}</p>
            <div class="modal-highlight">
              <span class="phone-number">13326003767</span>
            </div>
          </div>
          <div class="modal-footer">
            <button class="modal-close-btn" @click="close">
              <span>我知道了</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
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

// 点击遮罩层不关闭，只有点击关闭按钮才关闭
const handleOverlayClick = () => {
  // 不执行任何操作，只能通过关闭按钮关闭
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
}

.modal-container {
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1);
  max-width: 420px;
  width: 100%;
  overflow: hidden;
  transform: scale(1);
}

.modal-header {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  padding: 32px 24px 24px;
  text-align: center;
  position: relative;
}

.modal-header::after {
  content: '';
  position: absolute;
  bottom: -20px;
  left: 0;
  right: 0;
  height: 40px;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border-radius: 0 0 50% 50%;
}

.modal-icon {
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
  color: #1a1a2e;
  box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
}

.modal-title {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
  position: relative;
  z-index: 1;
}

.modal-body {
  padding: 40px 24px 24px;
  text-align: center;
}

.modal-message {
  font-size: 1.1rem;
  color: #4a5568;
  margin: 0 0 20px;
  line-height: 1.6;
}

.modal-highlight {
  background: linear-gradient(135deg, #fef9e7 0%, #fdebd0 100%);
  border: 2px solid #d4af37;
  border-radius: 12px;
  padding: 20px;
  margin: 20px 0;
}

.phone-number {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: 2px;
  display: block;
}

.modal-footer {
  padding: 0 24px 24px;
}

.modal-close-btn {
  width: 100%;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 24px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.modal-close-btn:hover {
  background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%);
  color: #1a1a2e;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(212, 175, 55, 0.3);
}

.modal-close-btn:active {
  transform: translateY(0);
}

/* 过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: all 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(-20px);
}

/* 响应式 */
@media (max-width: 480px) {
  .modal-container {
    margin: 16px;
  }
  
  .phone-number {
    font-size: 1.5rem;
  }
  
  .modal-icon {
    width: 60px;
    height: 60px;
  }
  
  .modal-title {
    font-size: 1.25rem;
  }
}
</style>