'use client'

import { useState, useCallback } from 'react'

import { generateSku } from '@/app/admin/products/components/product-form/product-form-helpers'

import type {
  IProductFormData,
  ICreateProductPayload,
  ICreateProductVariantPayload,
} from '@/lib/types/interfaces/apis/admin-product.interfaces'
import { generateSlug } from '@/lib/utils'

// Re-export để backward compatibility
export { generateSku }

// ============ Initial Form State ============
const INITIAL_VARIANT: ICreateProductVariantPayload = {
  sku: '',
  name: '',
  color: '',
  size: '',
  type: '',
  displayType: 'COLOR',
  quantity: 0,
  lowStockThreshold: 10,
}

const INITIAL_FORM_DATA: IProductFormData = {
  name: '',
  slug: '',
  sku: '',
  shortDesc: '',
  description: '',
  basePrice: 0,
  comparePrice: 0,
  brandId: '',
  categoryIds: [],
  isActive: true,
  isFeatured: false,
  weight: 0,
  variants: [],
}

// ============ Hook ============

export function useProductForm() {
  const [formData, setFormData] = useState<IProductFormData>(INITIAL_FORM_DATA)

  const updateField = useCallback(
    <K extends keyof IProductFormData>(
      field: K,
      value: IProductFormData[K],
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }))
    },
    [],
  )

  const handleNameChange = useCallback((name: string) => {
    setFormData((prev) => ({ ...prev, name, slug: generateSlug(name) }))
  }, [])

  // ── Variant helpers ──

  const addVariant = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { ...INITIAL_VARIANT }],
    }))
  }, [])

  const removeVariant = useCallback((index: number) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }))
  }, [])

  const updateVariant = useCallback(
    <K extends keyof ICreateProductVariantPayload>(
      index: number,
      field: K,
      value: ICreateProductVariantPayload[K],
    ) => {
      setFormData((prev) => ({
        ...prev,
        variants: prev.variants.map((v, i) =>
          i === index ? { ...v, [field]: value } : v,
        ),
      }))
    },
    [],
  )

  // ── Build payload for API ──

  const buildPayload = useCallback((): ICreateProductPayload => {
    const payload: ICreateProductPayload = {
      name: formData.name,
      categoryIds: formData.categoryIds,
      basePrice: formData.basePrice,
    }

    if (formData.sku) payload.sku = formData.sku
    if (formData.brandId) payload.brandId = formData.brandId
    if (formData.shortDesc) payload.shortDesc = formData.shortDesc
    if (formData.description) payload.description = formData.description
    if (formData.comparePrice) payload.comparePrice = formData.comparePrice
    if (formData.weight) payload.weight = formData.weight

    payload.isActive = formData.isActive
    payload.isFeatured = formData.isFeatured

    if (formData.variants.length > 0) {
      payload.variants = formData.variants.map((v) => ({
        ...v,
        sku: v.sku || generateSku(formData.name),
        // Backend yêu cầu price là number >= 0 — fallback 0 khi không điền
        price: v.price ?? 0,
      }))
    }

    return payload
  }, [formData])

  // ── Validation ──

  const isValid =
    formData.name.trim() !== '' &&
    formData.categoryIds.length > 0 &&
    formData.basePrice > 0

  const resetForm = useCallback(() => {
    setFormData(INITIAL_FORM_DATA)
  }, [])

  return {
    formData,
    updateField,
    handleNameChange,
    addVariant,
    removeVariant,
    updateVariant,
    buildPayload,
    isValid,
    resetForm,
  }
}
