<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'
import { ref } from 'vue'

const authStore = useAuthStore()

// Auth form state
const isLoginMode = ref(true)
const authForm = ref({
  email: '',
  password: '',
  name: ''
})
const authMessage = ref('')
const authMessageType = ref<'success' | 'error'>('success')


// Auth methods
const toggleAuthMode = () => {
  isLoginMode.value = !isLoginMode.value
  authMessage.value = ''
  authForm.value = { email: '', password: '', name: '' }
}

const handleAuth = (event: Event) => {
  event.preventDefault()
  console.log('Form submitted with:', authForm.value)

  if (isLoginMode.value) {
    const result = authStore.login(authForm.value.email.trim().toLowerCase(), authForm.value.password)
    authMessage.value = result.message
    authMessageType.value = result.success ? 'success' : 'error'
  } else {
    if (!authForm.value.name.trim()) {
      authMessage.value = 'Name is required'
      authMessageType.value = 'error'
      return
    }
    const result = authStore.register(authForm.value.email, authForm.value.password, authForm.value.name)
    authMessage.value = result.message
    authMessageType.value = result.success ? 'success' : 'error'
  }
}
</script>

<template>
  <div class="auth-page">
    <div class="auth-container">
      <div class="auth-card">
        <!-- Header -->
        <div class="auth-header">
          <h1 class="auth-title">Gold Calculator</h1>
          <p class="auth-subtitle">Login to access your gold pricing calculator</p>
        </div>

        <!-- Auth Form -->
        <form @submit="handleAuth" class="auth-form">
          <!-- Mode Toggle -->
          <div class="form-section">
            <div class="auth-tabs">
              <button
                type="button"
                class="tab-button"
                :class="{ active: isLoginMode }"
                @click="toggleAuthMode"
              >
                Sign In
              </button>
              <button
                type="button"
                class="tab-button"
                :class="{ active: !isLoginMode }"
                @click="toggleAuthMode"
              >
                Sign Up
              </button>
            </div>
          </div>

          <!-- Status Message -->
          <div v-if="authMessage" class="form-section">
            <div class="auth-message" :class="authMessageType">
              <span class="message-icon">{{ authMessageType === 'success' ? '✓' : '⚠️' }}</span>
              {{ authMessage }}
            </div>
          </div>

          <!-- Form Fields -->
          <div class="form-section">
            <div class="form-fields">
              <!-- Name Field (Register Only) -->
              <div v-if="!isLoginMode" class="form-group">
                <label for="name" class="form-label">
                  <span class="label-text">Full Name</span>
                </label>
                <input
                  id="name"
                  type="text"
                  v-model="authForm.name"
                  class="form-input"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <!-- Email Field -->
              <div class="form-group">
                <label for="email" class="form-label">
                  <span class="label-text">Email Address</span>
                </label>
                <input
                  id="email"
                  type="email"
                  v-model="authForm.email"
                  class="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>

              <!-- Password Field -->
              <div class="form-group">
                <label for="password" class="form-label">
                  <span class="label-text">Password</span>
                </label>
                <input
                  id="password"
                  type="password"
                  v-model="authForm.password"
                  class="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
          </div>

          <!-- Submit Button -->
          <div class="form-section">
            <button type="submit" class="auth-button">
              {{ isLoginMode ? 'Sign In' : 'Create Account' }}
            </button>
          </div>

          <!-- Footer Links -->
          <div class="form-section">
            <div class="auth-footer">
              <p class="footer-text">
                {{ isLoginMode ? "Don't have an account?" : "Already have an account?" }}
                <button type="button" class="switch-link" @click="toggleAuthMode">
                  {{ isLoginMode ? 'Sign up here' : 'Sign in here' }}
                </button>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem;
  pointer-events: auto;
}

.auth-container {
  width: 100%;
  max-width: 400px;
  pointer-events: auto;
}

.auth-card {
  background: white;
  border-radius: 16px;
  box-shadow:
    0 10px 40px rgba(0, 0, 0, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.06);
  border: 1px solid #e5e7eb;
  overflow: hidden;
  pointer-events: auto;
}

/* Header */
.auth-header {
  padding: 2rem 2rem 1.5rem;
  text-align: center;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #b8860b, #daa520);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.auth-subtitle {
  font-size: 0.9rem;
  color: #6b7280;
  margin: 0;
  font-weight: 400;
}

/* Form Structure */
.auth-form {
  padding: 1.5rem 2rem 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  pointer-events: auto;
}

.form-section {
  width: 100%;
}

/* Tabs */
.auth-tabs {
  display: flex;
  background: #f3f4f6;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}

.tab-button {
  flex: 1;
  padding: 0.875rem 1.25rem;
  border: none;
  background: transparent;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  z-index: 1;
}

.tab-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.8);
  color: #374151;
}

.tab-button.active {
  background: #ffd700;
  color: #92400e;
  font-weight: 600;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* Status Message */
.auth-message {
  padding: 0.875rem 1rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  text-align: left;
}

.auth-message.success {
  background: #dcfce7;
  color: #166534;
  border: 1px solid #bbf7d0;
}

.auth-message.error {
  background: #fef2f2;
  color: #dc2626;
  border: 1px solid #fecaca;
}

.message-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

/* Form Fields */
.form-fields {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.label-text {
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  border: 2px solid #d1d5db;
  border-radius: 8px;
  font-size: 1rem;
  background: white;
  transition: all 0.2s ease;
  color: #1f2937;
  outline: none;
  box-sizing: border-box;
  pointer-events: auto !important;
  cursor: text !important;
  user-select: text !important;
  -webkit-user-select: text !important;
  -moz-user-select: text !important;
  -ms-user-select: text !important;
}

.form-input:focus {
  border-color: #ffd700;
  box-shadow: 0 0 0 3px rgba(255, 215, 0, 0.1);
  background: #fefefe;
}

.form-input:hover:not(:focus) {
  border-color: #9ca3af;
}

/* Button */
.auth-button {
  width: 100%;
  padding: 1rem 1.5rem;
  background: #ffd700;
  color: #92400e;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
  margin-top: 0.5rem;
}

.auth-button:hover {
  background: #fbbf24;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
}

.auth-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(255, 215, 0, 0.2);
}

/* Footer */
.auth-footer {
  text-align: center;
  margin-top: 0.5rem;
}

.footer-text {
  color: #6b7280;
  font-size: 0.85rem;
  margin: 0;
  font-weight: 400;
  line-height: 1.5;
}

.switch-link {
  background: none;
  border: none;
  color: #ffd700;
  font-weight: 500;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin-left: 0.25rem;
  text-decoration: underline;
  text-underline-offset: 2px;
  transition: color 0.2s ease;
}

.switch-link:hover {
  color: #f59e0b;
}


/* Responsive Design */
@media (max-width: 768px) {
  .auth-page {
    padding: 1rem;
  }

  .auth-container {
    max-width: 380px;
  }

  .auth-card {
    border-radius: 12px;
  }

  .auth-header {
    padding: 1.75rem 1.5rem 1.25rem;
  }

  .auth-title {
    font-size: 1.5rem;
  }

  .auth-subtitle {
    font-size: 0.85rem;
  }

  .auth-form {
    padding: 1.5rem 2rem 2rem;
    gap: 0.875rem;
  }


  .tab-button {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .form-fields {
    gap: 0.875rem;
  }


  .form-input {
    padding: 0.8125rem 0.9375rem;
    font-size: 0.95rem;
  }

  .auth-button {
    padding: 0.875rem 1.25rem;
    font-size: 0.95rem;
  }
}

@media (max-width: 520px) {
  .auth-page {
    padding: 0.5rem;
  }

  .auth-container {
    max-width: 100%;
  }

  .auth-card {
    border-radius: 10px;
  }

  .auth-header {
    padding: 1.5rem 1.25rem 1rem;
  }

  .auth-title {
    font-size: 1.375rem;
  }

  .auth-subtitle {
    font-size: 0.8rem;
  }

  .auth-form {
    padding: 1.25rem 1.5rem 1.75rem;
    gap: 0.75rem;
  }

  .tab-button {
    padding: 0.625rem 0.875rem;
    font-size: 0.85rem;
  }

  .form-fields {
    gap: 0.75rem;
  }

  .form-label {
    font-size: 0.85rem;
    margin-bottom: 0.375rem;
  }

  .form-input {
    padding: 0.75rem 0.875rem;
    font-size: 0.9rem;
  }

  .auth-button {
    padding: 0.8125rem 1rem;
    font-size: 0.9rem;
  }

  .footer-text {
    font-size: 0.8rem;
  }
}
</style>