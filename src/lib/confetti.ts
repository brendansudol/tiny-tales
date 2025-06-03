import confetti from "canvas-confetti"

interface Args {
  duration?: number
  particles?: number
  intervalMs?: number // time between bursts
  spread?: number
  startVelocity?: number
}

export function celebrate({
  duration = 1_000,
  particles = 50,
  intervalMs = 250,
  spread = 360,
  startVelocity = 30,
}: Args = {}): () => void {
  const animationEnd = Date.now() + duration
  const defaults = { spread, startVelocity, ticks: 60, zIndex: 0 }

  let lastBurst = Date.now() - intervalMs
  let frameId = 0

  const frame = () => {
    const now = Date.now()
    const timeLeft = animationEnd - now
    if (timeLeft <= 0) return

    // only fire when our throttle interval has elapsed
    if (now - lastBurst >= intervalMs) {
      lastBurst = now

      const progress = timeLeft / duration
      const particleCount = particles * progress

      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.1, 0.3), y: Math.random() - 0.2 },
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: random(0.7, 0.9), y: Math.random() - 0.2 },
      })
    }

    frameId = requestAnimationFrame(frame)
  }

  frameId = requestAnimationFrame(frame)

  return () => cancelAnimationFrame(frameId)
}

function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}
