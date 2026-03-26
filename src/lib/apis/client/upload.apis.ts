import { kyNextInstance } from '@/lib/kyInstance/kyNext'
import { IApiResponseWrapperType, IMediaDataType } from '@/lib/types'
import { extractErrorMessage } from '@/lib/utils/error-handler'

/**
 * Upload general image (e.g., from tiptap editor)
 * @param file - File to upload
 * @returns Promise with upload response containing URL
 * @throws Error with backend message
 */
export async function uploadGeneralImage(file: File) {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const response = await kyNextInstance
      .post('upload/general-image', { body: formData })
      .json<IApiResponseWrapperType<IMediaDataType>>()

    return response
  } catch (error) {
    throw new Error(await extractErrorMessage(error, 'Upload failed'))
  }
}
