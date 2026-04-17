'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'

import { generateSku } from '@/app/admin/products/components/product-form/product-form-helpers'

import type {
  IProductFormData,
  IUpdateProductPayload,
  ICreateProductVariantPayload,
  IAdminProductDataType,
} from '@/lib/types/interfaces/apis/admin-product.interfaces'
import { generateSlug } from '@/lib/utils'

// ============ Helpers: map BE data → form data ============

function mapProductToFormData(
  product: IAdminProductDataType,
): IProductFormData {
  return {
    name: product.name,
    slug: product.slug,
    sku: product.sku,
    shortDesc: product.shortDesc ?? '',
    description: product.description ?? '',
    basePrice: Number(product.basePrice) || 0,
    comparePrice: Number(product.comparePrice) || 0,
    brandId: product.brand?.id ?? '',
    categoryIds: product.productCategories?.map((c) => c.category.id) ?? [],
    isActive: product.isActive,
    isFeatured: product.isFeatured,
    weight: Number(product.weight) || 0,
    variants:
      product.variants?.map((v) => ({
        sku: v.sku ?? '',
        name: v.name,
        color: v.color ?? '',
        size: v.size ?? '',
        type: v.type ?? '',
        displayType: v.displayType ?? 'COLOR',
        price: Number(v.price) || 0,
        quantity: v.inventory?.quantity ?? 0,
        lowStockThreshold: v.inventory?.lowStockThreshold ?? 10,
      })) ?? [],
  }
}

// ============ Hook ============

export function useEditProductForm(product: IAdminProductDataType) {
  const initialFormData = useMemo(
    () => mapProductToFormData(product),
    [product],
  )
  const [formData, setFormData] = useState<IProductFormData>(initialFormData)

  // Sync form khi product thay đổi (dialog mở cho product khác mà không unmount)
  useEffect(() => {
    setFormData(mapProductToFormData(product))
  }, [product])

  // Reset khi product thay đổi (khi dialog mở product khác)
  const resetForm = useCallback(() => {
    setFormData(mapProductToFormData(product))
  }, [product])

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
      variants: [
        ...prev.variants,
        {
          sku: '',
          name: '',
          color: '',
          size: '',
          type: '',
          displayType: 'COLOR',
          price: 0,
          quantity: 0,
          lowStockThreshold: 10,
        },
      ],
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

  // ── Build update payload ──

  const buildUpdatePayload = useCallback((): IUpdateProductPayload => {
    const payload: IUpdateProductPayload = {}

    if (formData.name !== initialFormData.name) payload.name = formData.name
    if (formData.sku !== initialFormData.sku) payload.sku = formData.sku
    if (formData.shortDesc !== initialFormData.shortDesc)
      payload.shortDesc = formData.shortDesc
    if (formData.description !== initialFormData.description)
      payload.description = formData.description
    if (formData.basePrice !== initialFormData.basePrice)
      payload.basePrice = formData.basePrice
    if (formData.comparePrice !== initialFormData.comparePrice)
      payload.comparePrice = formData.comparePrice
    if (formData.weight !== initialFormData.weight)
      payload.weight = formData.weight
    if (formData.isActive !== initialFormData.isActive)
      payload.isActive = formData.isActive
    if (formData.isFeatured !== initialFormData.isFeatured)
      payload.isFeatured = formData.isFeatured
    if (formData.brandId !== initialFormData.brandId)
      payload.brandId = formData.brandId || undefined

    // categoryIds: so sánh bằng sorted strings
    const oldCats = [...initialFormData.categoryIds].sort().join(',')
    const newCats = [...formData.categoryIds].sort().join(',')
    if (oldCats !== newCats) payload.categoryIds = formData.categoryIds

    // Variants: luôn gửi toàn bộ nếu có thay đổi
    const variantsChanged =
      JSON.stringify(formData.variants) !==
      JSON.stringify(initialFormData.variants)
    if (variantsChanged) {
      payload.variants = formData.variants.map((v, index) => {
        const originalVariant = product.variants?.[index]
        return {
          id: originalVariant?.id,
          sku: v.sku || generateSku(formData.name),
          name: v.name,
          color: v.color || undefined,
          size: v.size || undefined,
          type: v.type || undefined,
          displayType: v.displayType,
          // If price is 0 or not set, use basePrice
          price: v.price || formData.basePrice,
          quantity: v.quantity,
          lowStockThreshold: v.lowStockThreshold,
        }
      })
    }

    return payload
  }, [formData, initialFormData, product.variants])

  // ── Validation ──

  const isValid =
    formData.name.trim() !== '' &&
    formData.categoryIds.length > 0 &&
    formData.basePrice > 0

  // ── Has changes ──

  const hasChanges = useMemo(() => {
    const payload = buildUpdatePayload()
    return Object.keys(payload).length > 0
  }, [buildUpdatePayload])

  return {
    formData,
    updateField,
    handleNameChange,
    addVariant,
    removeVariant,
    updateVariant,
    buildUpdatePayload,
    isValid,
    hasChanges,
    resetForm,
  }
}
