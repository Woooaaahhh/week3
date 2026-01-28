<script setup lang="ts">
import { useGoldCalculatorStore } from '@/stores/goldCalculator'
import { useAuthStore } from '@/stores/auth'
import AuthForm from '@/components/AuthForm.vue'

const goldStore = useGoldCalculatorStore()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
}
</script>

<template>
  <div v-if="!authStore.isAuthenticated" class="auth-container">
    <AuthForm />
  </div>

  <div v-else class="calculator">
    <div class="calculator-bg-element"></div>
    <div class="calculator-bg-element"></div>
    <div class="calculator-bg-element"></div>
    <main class="calculator-content">
      <header class="calculator-header">
        <div class="header-content">
          <div class="welcome-section">
            <h1>Gold Calculator</h1>
            <p class="subtitle">
              <span class="welcome-icon">👋</span>
              Welcome back, {{ authStore.currentUser?.name }}!
            </p>
          </div>
          <div class="header-actions">
            <div class="user-status">
              <span class="status-dot"></span>
              <span class="status-text">Online</span>
            </div>
            <button @click="handleLogout" class="logout-button">
              <span class="logout-icon">🚪</span>
              Logout
            </button>
          </div>
        </div>
      </header>

      <div class="calculators-section">
        <div class="section-header">
          <h2 class="section-title">
            <span class="section-icon">💰</span>
            Gold Price Calculators
          </h2>
          <p class="section-subtitle">Calculate prices for different gold purity levels</p>
        </div>

        <div class="calculators-grid">
          <div v-for="karat in goldStore.availableKarats" :key="karat" class="calculator-card">
            <div class="card-header">
              <div class="karat-info">
                <div class="karat-number">{{ karat }}K</div>
                <div class="karat-label">Gold</div>
              </div>
              <div class="purity-indicator">
                <span class="purity-text">{{ (karat / 24 * 100).toFixed(1) }}%</span>
              </div>
            </div>

            <div class="card-body">
              <div class="input-section">
                <div class="input-group">
                  <label class="input-label">
                    <span class="input-icon">⚖️</span>
                    Weight
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="number"
                      :value="goldStore.calculators[karat]?.gram || ''"
                      @input="goldStore.updateGram(karat, parseFloat(($event.target as HTMLInputElement).value) || 0)"
                      min="0"
                      step="0.01"
                      class="modern-input"
                      placeholder="0.00"
                    />
                    <span class="input-unit">grams</span>
                  </div>
                </div>

                <div class="input-group">
                  <label class="input-label">
                    <span class="input-icon">🔨</span>
                    Making Charge
                  </label>
                  <div class="input-wrapper">
                    <input
                      type="number"
                      :value="goldStore.calculators[karat]?.designPrice || ''"
                      @input="goldStore.updateDesignPrice(karat, parseFloat(($event.target as HTMLInputElement).value) || 0)"
                      min="0"
                      step="0.01"
                      class="modern-input"
                      placeholder="0.00"
                    />
                    <span class="input-unit">₱</span>
                  </div>
                </div>
              </div>

              <div class="results-section">
                <div class="result-breakdown">
                  <div class="result-row">
                    <span class="result-label">Gold Material:</span>
                    <span class="result-value material">₱{{ goldStore.getCalculatorData(karat).goldMaterialCost.toFixed(2) }}</span>
                  </div>
                  <div class="result-row">
                    <span class="result-label">Making Charge:</span>
                    <span class="result-value charge">₱{{ goldStore.getCalculatorData(karat).designPrice.toFixed(2) }}</span>
                  </div>
                  <div class="result-row subtotal">
                    <span class="result-label">Subtotal:</span>
                    <span class="result-value">₱{{ goldStore.getCalculatorData(karat).subtotal.toFixed(2) }}</span>
                  </div>
                  <div class="result-row tax">
                    <span class="result-label">Tax (12%):</span>
                    <span class="result-value">₱{{ (goldStore.getCalculatorData(karat).subtotal * goldStore.taxRate).toFixed(2) }}</span>
                  </div>
                </div>

                <div class="total-display">
                  <div class="total-label">Total Price</div>
                  <div class="total-amount">₱{{ goldStore.getCalculatorData(karat).totalPrice.toFixed(2) }}</div>
                  <div class="total-decoration">
                    <span class="decoration-line"></span>
                    <span class="decoration-sparkle">✨</span>
                    <span class="decoration-line"></span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Auth Container */
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background:
    radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
    url('https://static.vecteezy.com/system/resources/previews/007/288/513/large_2x/gold-bars-background-photo.jpg') center/cover no-repeat,
    linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.auth-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 25% 25%, rgba(255, 255, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 75% 75%, rgba(255, 255, 255, 0.05) 0%, transparent 50%);
  animation: background-float 20s ease-in-out infinite;
}

@keyframes background-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-10px) rotate(1deg); }
  66% { transform: translateY(10px) rotate(-1deg); }
}

/* Calculator Styles */
.calculator {
  min-height: 100vh;
  background:
    radial-gradient(ellipse at top, rgba(255, 215, 0, 0.15) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(120, 119, 198, 0.15) 0%, transparent 50%),
    url('https://static.vecteezy.com/system/resources/previews/007/288/513/large_2x/gold-bars-background-photo.jpg') center/cover no-repeat,
    linear-gradient(180deg, #f8fafc 0%, #e2e8f0 25%, #cbd5e1 50%, #94a3b8 75%, #64748b 100%);
  padding: 2rem;
  position: relative;
  overflow: hidden;
}

.calculator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image:
    radial-gradient(circle at 20% 80%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(120, 119, 198, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 60% 60%, rgba(16, 185, 129, 0.06) 0%, transparent 50%);
  animation: web-bg-float 25s ease-in-out infinite;
}

.calculator::after {
  content: '';
  position: absolute;
  top: 10%;
  right: 10%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(255, 215, 0, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: web-shape-1 30s ease-in-out infinite;
}

/* Additional background elements for modern web app look */
.calculator-bg-element {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.calculator-bg-element:nth-child(1) {
  top: 20%;
  left: 5%;
  width: 120px;
  height: 120px;
  background: linear-gradient(45deg, rgba(120, 119, 198, 0.1), rgba(255, 215, 0, 0.1));
  border-radius: 50% 20% 50% 20%;
  animation: web-element-1 40s ease-in-out infinite;
}

.calculator-bg-element:nth-child(2) {
  top: 60%;
  right: 8%;
  width: 80px;
  height: 80px;
  background: linear-gradient(45deg, rgba(16, 185, 129, 0.08), rgba(120, 119, 198, 0.08));
  border-radius: 20% 50% 20% 50%;
  animation: web-element-2 35s ease-in-out infinite reverse;
}

.calculator-bg-element:nth-child(3) {
  bottom: 15%;
  left: 15%;
  width: 150px;
  height: 150px;
  background: linear-gradient(45deg, rgba(255, 215, 0, 0.06), rgba(239, 68, 68, 0.06));
  border-radius: 50% 20% 50% 20%;
  animation: web-element-3 45s ease-in-out infinite;
}

@keyframes web-element-1 {
  0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
  33% { transform: translateY(-30px) rotate(120deg) scale(1.1); }
  66% { transform: translateY(20px) rotate(240deg) scale(0.9); }
}

@keyframes web-element-2 {
  0%, 100% { transform: translateX(0px) rotate(0deg) scale(1); }
  50% { transform: translateX(40px) rotate(180deg) scale(1.2); }
}

@keyframes web-element-3 {
  0%, 100% { transform: translateX(0px) translateY(0px) rotate(0deg); }
  25% { transform: translateX(50px) translateY(-25px) rotate(90deg); }
  50% { transform: translateX(-25px) translateY(40px) rotate(180deg); }
  75% { transform: translateX(-40px) translateY(-15px) rotate(270deg); }
}

@keyframes web-bg-float {
  0%, 100% { transform: translateY(0px) translateX(0px); }
  25% { transform: translateY(-20px) translateX(10px); }
  50% { transform: translateY(-10px) translateX(-15px); }
  75% { transform: translateY(15px) translateX(5px); }
}

@keyframes web-shape-1 {
  0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.1; }
  50% { transform: scale(1.2) rotate(180deg); opacity: 0.2; }
}

.calculator-content {
  max-width: 800px;
  margin: 0 auto;
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 50%, #f8f9fa 100%);
  border-radius: 28px;
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.12),
    0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(255, 215, 0, 0.15);
  position: relative;
  overflow: hidden;
}

.calculator-header {
  padding: 3rem 3rem 2rem 3rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
}

.welcome-section h1 {
  margin: 0 0 0.5rem 0;
  text-align: left;
}

.welcome-section .subtitle {
  text-align: left;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.welcome-icon {
  font-size: 1.2rem;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.user-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(34, 197, 94, 0.1);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  border: 1px solid rgba(34, 197, 94, 0.2);
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(34, 197, 94, 0.5);
}

.status-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: #15803d;
}

.logout-button {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.logout-button:hover {
  background: linear-gradient(135deg, #dc2626, #b91c1c);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
}

.logout-icon {
  font-size: 1rem;
}

.calculator-form {
  padding: 3rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.form-group {
  position: relative;
}

.form-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
}

.field-icon {
  font-size: 1rem;
  opacity: 0.8;
}

.form-select, .form-input {
  width: 100%;
  padding: 1.25rem 1.5rem;
  border: 2px solid #e2e8f0;
  border-radius: 14px;
  font-size: 1rem;
  background: linear-gradient(135deg, #ffffff 0%, #fafbfc 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 2px 4px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  color: #1e293b;
  font-weight: 500;
  outline: none;
}

.form-select:focus, .form-input:focus {
  border-color: #ffd700;
  box-shadow:
    0 0 0 4px rgba(255, 215, 0, 0.12),
    0 6px 20px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
  background: #ffffff;
}

.form-select:hover:not(:focus), .form-input:hover:not(:focus) {
  border-color: #fbbf24;
  box-shadow:
    0 3px 8px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}


/* Main Calculators Section */
.calculators-section {
  padding: 0 2rem 4rem 2rem;
}

.section-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

.section-title {
  font-size: 3rem;
  font-weight: 900;
  background: linear-gradient(135deg, #1f2937 0%, #374151 50%, #1f2937 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0 0 0.75rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
}

.section-title::after {
  content: '';
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  border-radius: 2px;
}

.section-icon {
  font-size: 2.5rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.section-subtitle {
  font-size: 1.2rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
  opacity: 0.9;
}

.calculators-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.calculator-card {
  background: linear-gradient(145deg, #ffffff 0%, #fefefe 25%, #f8fafc 50%, #ffffff 75%, #fefefe 100%);
  border-radius: 24px;
  box-shadow:
    0 15px 50px rgba(0, 0, 0, 0.08),
    0 5px 20px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -1px 0 rgba(0, 0, 0, 0.02);
  border: 2px solid rgba(255, 215, 0, 0.08);
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  backdrop-filter: blur(10px);
}

.calculator-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow:
    0 25px 80px rgba(0, 0, 0, 0.15),
    0 10px 35px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.95),
    inset 0 -1px 0 rgba(0, 0, 0, 0.02);
  border-color: rgba(255, 215, 0, 0.15);
}

.calculator-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 5px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700, #ffed4e, #ffd700);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.calculator-card::after {
  content: '';
  position: absolute;
  bottom: -40%;
  right: -20%;
  width: 180px;
  height: 180px;
  background: radial-gradient(ellipse, rgba(255, 215, 0, 0.06) 0%, rgba(120, 119, 198, 0.04) 50%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
  animation: card-glow 8s ease-in-out infinite;
}

@keyframes card-glow {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50% { opacity: 0.6; transform: scale(1.1); }
}

/* Card Header */
.card-header {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.karat-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.karat-number {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #92400e 0%, #b45309 50%, #92400e 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.karat-label {
  font-size: 0.9rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.purity-indicator {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.purity-text {
  font-weight: 700;
}

.purity-label {
  opacity: 0.9;
  font-size: 0.75rem;
}

/* Card Body */
.card-body {
  padding: 2rem;
}

/* Input Section */
.input-section {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.input-group:last-child {
  margin-bottom: 0;
}

.input-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #374151;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.input-icon {
  font-size: 1rem;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.modern-input {
  width: 100%;
  padding: 1rem 3rem 1rem 1rem;
  border: 2px solid #e5e7eb;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  color: #1f2937;
  outline: none;
}

.modern-input:focus {
  border-color: #ffd700;
  box-shadow:
    0 0 0 3px rgba(255, 215, 0, 0.1),
    0 4px 12px rgba(255, 215, 0, 0.2),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
  transform: translateY(-1px);
  background: #ffffff;
}

.modern-input:hover:not(:focus) {
  border-color: #fbbf24;
  box-shadow:
    0 2px 6px rgba(0, 0, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.input-unit {
  position: absolute;
  right: 1rem;
  color: #6b7280;
  font-weight: 500;
  font-size: 0.85rem;
  pointer-events: none;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Results Section */
.results-section {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid rgba(0, 0, 0, 0.05);
}

.result-breakdown {
  margin-bottom: 2rem;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.result-row:last-child {
  border-bottom: none;
}

.result-row.subtotal {
  border-bottom: 2px solid rgba(59, 130, 246, 0.2);
  background: linear-gradient(90deg, rgba(59, 130, 246, 0.05) 0%, transparent 100%);
  padding: 1rem 0;
  margin: 0.5rem 0;
  border-radius: 8px;
}

.result-row.tax {
  border-bottom: 2px solid rgba(239, 68, 68, 0.2);
  background: linear-gradient(90deg, rgba(239, 68, 68, 0.05) 0%, transparent 100%);
  padding: 1rem 0;
  margin: 0.5rem 0;
  border-radius: 8px;
}

.result-label {
  font-weight: 500;
  color: #6b7280;
  font-size: 0.9rem;
}

.result-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 1rem;
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
}

.result-row.subtotal .result-value {
  color: #1d4ed8;
  font-size: 1.1rem;
  font-weight: 800;
}

.result-row.tax .result-value {
  color: #dc2626;
  font-size: 1rem;
  font-weight: 700;
}

.result-value.material {
  color: #92400e;
  font-weight: 600;
}

.result-value.charge {
  color: #7c3aed;
  font-weight: 600;
}

/* Total Display */
.total-display {
  text-align: center;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 30%, #ffd700 60%, #ffed4e 90%, #ffd700 100%);
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow:
    0 15px 40px rgba(255, 215, 0, 0.4),
    0 5px 15px rgba(255, 215, 0, 0.2),
    inset 0 2px 0 rgba(255, 255, 255, 0.4),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.total-display::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: total-shine 4s ease-in-out infinite;
}

@keyframes total-shine {
  0%, 100% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  50% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.total-amount {
  font-size: 2.5rem;
  font-weight: 800;
  color: #92400e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  letter-spacing: -0.02em;
  margin-bottom: 1rem;
}

.total-decoration {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.decoration-line {
  width: 30px;
  height: 2px;
  background: rgba(146, 64, 14, 0.3);
  border-radius: 1px;
}

.decoration-sparkle {
  font-size: 1.2rem;
  color: #92400e;
  opacity: 0.8;
}

.total-result {
  text-align: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  border-radius: 16px;
  box-shadow:
    0 8px 25px rgba(255, 215, 0, 0.3),
    inset 0 2px 0 rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;
}

.total-result::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shine 3s infinite;
}

.total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.total-amount {
  font-size: 1.8rem;
  font-weight: 800;
  color: #92400e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  letter-spacing: -0.02em;
}

.calculator::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
  border-radius: 24px 24px 0 0;
}

h1 {
  text-align: center;
  background: linear-gradient(135deg, #b8860b 0%, #daa520 50%, #ffd700 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-size: 2.25rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -0.02em;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.subtitle {
  text-align: center;
  color: #64748b;
  font-size: 1.1rem;
  font-weight: 400;
  margin-top: 0;
  margin-bottom: 2.5rem;
  opacity: 0.8;
}


.result-section {
  background: linear-gradient(135deg, rgba(255, 248, 220, 0.5) 0%, rgba(254, 249, 195, 0.7) 100%);
  border-radius: 20px;
  padding: 3rem;
  border: 2px solid rgba(255, 215, 0, 0.25);
  position: relative;
  box-shadow:
    0 10px 40px rgba(255, 215, 0, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  overflow: hidden;
}

.result-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #ffd700, #ffed4e, #ffd700);
}

.result-header {
  text-align: center;
  margin-bottom: 2rem;
}

.result-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #92400e;
  margin: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.result-icon {
  font-size: 1.5rem;
}

.price-breakdown {
  background: rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 2rem;
  margin-bottom: 2.5rem;
  border: 1px solid rgba(255, 215, 0, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
}

.breakdown-item {
  margin-bottom: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.6);
  border-radius: 12px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.breakdown-item:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.breakdown-item:last-child {
  margin-bottom: 0;
}

.breakdown-item.subtotal {
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%);
  border: 1px solid rgba(59, 130, 246, 0.2);
  font-weight: 600;
  color: #1d4ed8;
}

.breakdown-item.tax {
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%);
  border: 1px solid rgba(239, 68, 68, 0.2);
  color: #dc2626;
  font-weight: 500;
}

.item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.item-icon {
  font-size: 1rem;
  margin-right: 0.25rem;
}

.breakdown-item .label {
  display: flex;
  align-items: center;
  font-weight: 500;
  color: #374151;
  opacity: 0.9;
}

.breakdown-item .value {
  font-weight: 700;
  font-size: 1.1rem;
  color: #1f2937;
}

.breakdown-item.subtotal .value {
  color: #1d4ed8;
  font-size: 1.2rem;
}

.breakdown-item.tax .value {
  color: #dc2626;
}

.total-price-section {
  text-align: center;
  position: relative;
}

.total-price-container {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffed4e 50%, #ffd700 100%);
  padding: 2rem 3rem;
  border-radius: 24px;
  box-shadow:
    0 10px 40px rgba(255, 215, 0, 0.4),
    inset 0 2px 0 rgba(255, 255, 255, 0.3),
    inset 0 -2px 0 rgba(0, 0, 0, 0.1);
  border: 3px solid rgba(255, 255, 255, 0.4);
  position: relative;
  overflow: hidden;
}

.total-price-container::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
  animation: shine 3s infinite;
}

@keyframes shine {
  0% { transform: translateX(-100%) translateY(-100%) rotate(45deg); }
  100% { transform: translateX(100%) translateY(100%) rotate(45deg); }
}

.total-label {
  font-size: 1rem;
  font-weight: 600;
  color: #92400e;
  opacity: 0.9;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.total-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: #92400e;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  font-family: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
  letter-spacing: -0.02em;
}

.price-decoration {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.sparkle {
  font-size: 1.5rem;
  animation: sparkle 2s ease-in-out infinite;
}

.sparkle:nth-child(1) { animation-delay: 0s; }
.sparkle:nth-child(2) { animation-delay: 0.5s; }
.sparkle:nth-child(3) { animation-delay: 1s; }

@keyframes sparkle {
  0%, 100% { opacity: 0.5; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@media (max-width: 768px) {
  .auth-container {
    padding: 1rem;
  }

  .calculator {
    padding: 1rem;
  }

  .calculator-content {
    margin: 0;
  }

  .calculator-header {
    padding: 2rem 2rem 1rem 2rem;
    flex-direction: column;
    gap: 1rem;
    text-align: center;
  }

  .calculators-section {
    padding: 0 1rem 3rem 1rem;
  }

  .section-title {
    font-size: 2.2rem;
  }

  /* Hide background elements on mobile for better performance */
  .calculator-bg-element {
    display: none;
  }

  .calculators-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .calculator-card {
    border-radius: 16px;
  }

  .card-header {
    padding: 1.25rem 1.5rem;
  }

  .karat-number {
    font-size: 1.75rem;
  }

  .card-body {
    padding: 1.5rem;
  }

  .input-section {
    margin-bottom: 1.5rem;
  }

  .results-section {
    padding: 1.5rem;
  }

  .result-breakdown {
    margin-bottom: 1.5rem;
  }

  .total-display {
    padding: 1.5rem;
  }

  .total-amount {
    font-size: 2rem;
  }
}

@media (max-width: 520px) {
  .calculator-content {
    margin: 0;
  }

  .calculator-header {
    padding: 1.5rem 1.5rem 1rem 1.5rem;
  }

  .calculators-section {
    padding: 0 0.5rem 2rem 0.5rem;
  }

  .section-header {
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 1.75rem;
  }

  .calculators-grid {
    gap: 1.25rem;
  }

  .calculator-card {
    border-radius: 14px;
  }

  .card-header {
    padding: 1rem 1.25rem;
  }

  .karat-number {
    font-size: 1.5rem;
  }

  .purity-indicator {
    padding: 0.4rem 0.8rem;
    font-size: 0.8rem;
  }

  .card-body {
    padding: 1.25rem;
  }

  .input-group {
    margin-bottom: 1.25rem;
  }

  .modern-input {
    padding: 0.875rem 2.5rem 0.875rem 0.875rem;
  }

  .results-section {
    padding: 1.25rem;
  }

  .result-row {
    padding: 0.625rem 0;
  }

  .result-label {
    font-size: 0.85rem;
  }

  .result-value {
    font-size: 0.95rem;
  }

  .total-display {
    padding: 1.25rem;
  }

  .total-amount {
    font-size: 1.75rem;
  }

  .total-decoration {
    gap: 0.25rem;
  }

  .decoration-line {
    width: 20px;
  }

  /* Hide background elements on small screens */
  .calculator-bg-element {
    display: none;
  }
}

/* Animation for smooth interactions */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.calculator {
  animation: fadeInUp 0.6s ease-out;
}

.calculator-card {
  animation: fadeInUp 0.6s ease-out both;
}

.calculator-card:nth-child(1) { animation-delay: 0.1s; }
.calculator-card:nth-child(2) { animation-delay: 0.2s; }
.calculator-card:nth-child(3) { animation-delay: 0.3s; }
.calculator-card:nth-child(4) { animation-delay: 0.4s; }
.calculator-card:nth-child(5) { animation-delay: 0.5s; }
</style>
