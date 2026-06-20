import { useEffect, useRef, useState } from 'react'

interface CounterProps {
  end: number
  suffix?: string
  duration?: number
  visible: boolean
}

export default function Counter({ end, suffix = '', duration = 2000, visible }: CounterProps) {
  const [value, setValue] = useState(0)
  const startTime = useRef<number | null>(null)
  const rafId = useRef<number>(0)

  useEffect(() => {
    if (!visible) {
      setValue(0)
      startTime.current = null
      return
    }

    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp
      const elapsed = timestamp - startTime.current
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(eased * end))

      if (progress < 1) {
        rafId.current = requestAnimationFrame(animate)
      }
    }

    rafId.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId.current)
  }, [visible, end, duration])

  return (
    <span className="font-heading tabular-nums">
      {value}{suffix}
    </span>
  )
}
