'use client'

import { useSocket } from '@/providers/SocketProvider'
import { Badge } from '../ui/badge'

export default function SocketIndicator() {
  const { isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge variant="outline" className="bg-yellow-600 text-white border-none">
        delay 1s
      </Badge>
    )
  }

  return (
    <Badge variant="outline" className="bg-emerald-500 text-white border-none">
      realtime
    </Badge>
  )
}
