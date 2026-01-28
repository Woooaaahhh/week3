import { defineStore } from 'pinia'
import { ref } from 'vue'

interface CalculatorData {
  gram: number
  designPrice: number
}

export const useGoldCalculatorStore = defineStore('goldCalculator', () => {
  // State - Separate calculators for each karat
  const calculators = ref<Record<number, CalculatorData>>({
    24: { gram: 0, designPrice: 0 },
    22: { gram: 0, designPrice: 0 },
    18: { gram: 0, designPrice: 0 },
    14: { gram: 0, designPrice: 0 },
    12: { gram: 0, designPrice: 0 }
  })

  // Base gold price per gram (in PHP) - current market rate
  const baseGoldPricePerGram = ref(4000) // ₱4000 per gram of pure gold

  // Tax rate (12%)
  const taxRate = ref(0.12)

  // Available karats
  const availableKarats = [24, 22, 18, 14, 12]

  // Computed: Calculate for a specific karat
  const getCalculatorData = (karat: number) => {
    const data = calculators.value[karat]
    if (!data) {
      throw new Error(`Unsupported karat: ${karat}`)
    }
    const purityPercentage = karat / 24
    const pureGoldWeight = data.gram * purityPercentage
    const goldMaterialCost = pureGoldWeight * baseGoldPricePerGram.value
    const subtotal = goldMaterialCost + data.designPrice
    const totalPrice = subtotal * (1 + taxRate.value)

    return {
      gram: data.gram,
      designPrice: data.designPrice,
      purityPercentage,
      pureGoldWeight,
      goldMaterialCost,
      subtotal,
      totalPrice
    }
  }

  // Methods to update calculator data
  const updateGram = (karat: number, gram: number) => {
    const data = calculators.value[karat]
    if (!data) throw new Error(`Unsupported karat: ${karat}`)
    data.gram = gram
  }

  const updateDesignPrice = (karat: number, designPrice: number) => {
    const data = calculators.value[karat]
    if (!data) throw new Error(`Unsupported karat: ${karat}`)
    data.designPrice = designPrice
  }

  return {
    calculators,
    baseGoldPricePerGram,
    taxRate,
    availableKarats,
    getCalculatorData,
    updateGram,
    updateDesignPrice
  }
})