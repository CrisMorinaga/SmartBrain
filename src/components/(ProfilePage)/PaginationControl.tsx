'use client'

import { FC } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface PaginationControlsProps {
  hasNextPage: boolean
  hasPrevPage: boolean
  size: number
}

const PaginationControls: FC<PaginationControlsProps> = (
  {
    hasNextPage,
    hasPrevPage,
    size,
  }
) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const {data: session} = useSession()

  const page = searchParams.get('page') ?? '1'
  const per_page = searchParams.get('per_page') ?? '6'

  return (
    <div className='flex gap-2 align-middle'>
      <button
        className={`project-button p-2 rounded-xl !text-white ${!hasPrevPage ? '!cursor-default' : ''}`}
        disabled={!hasPrevPage}
        onClick={() => {
          router.push(`/profile/${session?.user.username}?page=${Number(page) - 1}&per_page=${per_page}`)
        }}>
        prev page
      </button>

      <div className='self-center'>
        {page} / {Math.ceil(size / Number(per_page))}
      </div>

      <button
        className={`project-button p-2 rounded-xl !text-white ${!hasNextPage ? '!cursor-default' : ''}`}
        disabled={!hasNextPage}
        onClick={() => {
          router.push(`/profile/${session?.user.username}?page=${Number(page) + 1}&per_page=${per_page}`)
        }}>
        next page
      </button>
    </div>
  )
}

export default PaginationControls