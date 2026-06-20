import { useProgress } from '@react-three/drei'

export default function LoadingScreen() {
  const { progress, active } = useProgress()

  if (!active) return null

  return (
    <div className="fixed inset-0 z-50 bg-[#0d0e10] flex flex-col items-center justify-center">
      <h1 className="font-heading text-5xl font-bold mb-8 tracking-tight">ПРОКС</h1>
      <div className="w-48 h-px bg-white/10 relative overflow-hidden rounded-full">
        <div
          className="absolute inset-y-0 left-0 bg-[#2b7bd2] transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <p className="text-white/30 text-xs mt-4 tracking-[0.2em] uppercase">
        Загрузка {Math.round(progress)}%
      </p>
    </div>
  )
}
