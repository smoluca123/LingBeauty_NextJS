import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
} from '@tanstack/react-query'
import {
  getAllFlashSalesClientAPI,
  getFlashSaleByIdClientAPI,
  createFlashSaleClientAPI,
  updateFlashSaleClientAPI,
  deleteFlashSaleClientAPI,
  addProductsToFlashSaleClientAPI,
  updateFlashSaleProductClientAPI,
  removeProductFromFlashSaleClientAPI,
  getCurrentFlashSaleClientAPI,
  getUpcomingFlashSalesClientAPI,
} from '@/lib/apis/client/admin-flash-sale.apis'
import type {
  IApiPaginationResponseWrapperType,
  IApiResponseWrapperType,
} from '@/lib/types/interfaces/apis/api.interfaces'
import type {
  IFlashSaleDataType,
  IFlashSaleFilterParams,
  ICreateFlashSaleFormData,
  IUpdateFlashSaleFormData,
  IAddFlashSaleProductFormData,
  IUpdateFlashSaleProductFormData,
} from '@/lib/types/interfaces/apis/flash-sale.interfaces'

// ── Query Keys ────────────────────────────────────────────────────────────────

export const adminFlashSaleQueryKeys = {
  flashSales: ['admin', 'flash-sales'] as const,
  flashSale: (id: string) => ['admin', 'flash-sale', id] as const,
  currentFlashSale: ['flash-sale', 'current'] as const,
  upcomingFlashSales: ['flash-sale', 'upcoming'] as const,
}

// ── Get All Flash Sales ───────────────────────────────────────────────────────

export const useAdminFlashSalesQuery = (
  params?: IFlashSaleFilterParams,
  options?: Omit<
    UseQueryOptions<IApiPaginationResponseWrapperType<IFlashSaleDataType>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: [...adminFlashSaleQueryKeys.flashSales, params],
    queryFn: () => getAllFlashSalesClientAPI(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
    ...options,
  })

// ── Get Flash Sale by ID ──────────────────────────────────────────────────────

export const useAdminFlashSaleQuery = (
  id: string,
  options?: Omit<
    UseQueryOptions<IApiResponseWrapperType<IFlashSaleDataType>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: adminFlashSaleQueryKeys.flashSale(id),
    queryFn: () => getFlashSaleByIdClientAPI(id),
    staleTime: 1000 * 60 * 2, // 2 minutes
    enabled: !!id,
    ...options,
  })

// ── Get Current Flash Sale (Public) ───────────────────────────────────────────

export const useCurrentFlashSaleQuery = (
  options?: Omit<
    UseQueryOptions<IApiResponseWrapperType<IFlashSaleDataType | null>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: adminFlashSaleQueryKeys.currentFlashSale,
    queryFn: () => getCurrentFlashSaleClientAPI(),
    staleTime: 1000 * 30, // 30 seconds - refresh more frequently for countdown
    refetchInterval: 1000 * 60, // Refetch every minute
    ...options,
  })

// ── Get Upcoming Flash Sales (Public) ─────────────────────────────────────────

export const useUpcomingFlashSalesQuery = (
  options?: Omit<
    UseQueryOptions<IApiResponseWrapperType<IFlashSaleDataType[]>>,
    'queryKey' | 'queryFn'
  >,
) =>
  useQuery({
    queryKey: adminFlashSaleQueryKeys.upcomingFlashSales,
    queryFn: () => getUpcomingFlashSalesClientAPI(),
    staleTime: 1000 * 60 * 5, // 5 minutes
    ...options,
  })

// ── Create Flash Sale ─────────────────────────────────────────────────────────

export const useCreateFlashSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: ICreateFlashSaleFormData) =>
      createFlashSaleClientAPI(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSales,
      })
    },
  })
}

// ── Update Flash Sale ─────────────────────────────────────────────────────────

export const useUpdateFlashSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: IUpdateFlashSaleFormData
    }) => updateFlashSaleClientAPI(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSales,
      })
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSale(variables.id),
      })
    },
  })
}

// ── Delete Flash Sale ─────────────────────────────────────────────────────────

export const useDeleteFlashSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => deleteFlashSaleClientAPI(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSales,
      })
    },
  })
}

// ── Add Products to Flash Sale ────────────────────────────────────────────────

export const useAddProductsToFlashSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      flashSaleId,
      data,
    }: {
      flashSaleId: string
      data: IAddFlashSaleProductFormData[]
    }) => addProductsToFlashSaleClientAPI(flashSaleId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSale(variables.flashSaleId),
      })
    },
  })
}

// ── Update Flash Sale Product ─────────────────────────────────────────────────

export const useUpdateFlashSaleProductMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      flashSaleId,
      productId,
      data,
      variantId,
    }: {
      flashSaleId: string
      productId: string
      data: IUpdateFlashSaleProductFormData
      variantId?: string
    }) =>
      updateFlashSaleProductClientAPI(flashSaleId, productId, data, variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSale(variables.flashSaleId),
      })
    },
  })
}

// ── Remove Product from Flash Sale ────────────────────────────────────────────

export const useRemoveProductFromFlashSaleMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      flashSaleId,
      productId,
      variantId,
    }: {
      flashSaleId: string
      productId: string
      variantId?: string
    }) =>
      removeProductFromFlashSaleClientAPI(flashSaleId, productId, variantId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: adminFlashSaleQueryKeys.flashSale(variables.flashSaleId),
      })
    },
  })
}
