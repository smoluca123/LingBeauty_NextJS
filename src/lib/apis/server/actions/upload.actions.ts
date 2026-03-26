'use server'

import { kyInstance } from '@/lib/kyInstance/ky'
import type { IApiResponseWrapperType } from '@/lib/types/interfaces/apis/api.interfaces'

interface IMediaResponse {
  id: string
  url: string
  key: string
  filename: string
  mimetype: string
  size: number
  type: string
  uploadedById: string
  createdAt: Date
  updatedAt: Date
}

/**
 * Upload general image to backend
 * Used for tiptap editor, rich text editor, or any general image upload
 * @param file - Image file to upload
 * @returns Uploaded media data
 * @throws Error with backend message if request fails
 */
export const uploadGeneralImageAction = async (file: File) => {
  const formData = new FormData()
  formData.append('file', file)

  return kyInstance
    .post('storage/upload/general-image', { body: formData })
    .json<IApiResponseWrapperType<IMediaResponse>>()
}
