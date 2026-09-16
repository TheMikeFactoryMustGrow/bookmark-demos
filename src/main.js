import createGlobe from 'cobe'
import './style.css'

const MARKERS = [
  { location: [37.7749, -122.4194], size: 0.04, id: 'sf' },
  { location: [40.7128, -74.006], size: 0.05, id: 'nyc' },
  { location: [51.5074, -0.1278], size: 0.04, id: 'lon' },
  { location: [35.6762, 139.6503], size: 0.045, id: 'tyo' },
  { location: [-33.8688, 151.2093], size: 0.035, id: 'syd' },
  { location: [-23.5505, -46.6333], size: 0.035, id: 'sao' },
  { location: [-33.9249, 18.4241], size: 0.03, id: 'cpt' },
]

const ARCS = [
  { from: [37.7749, -122.4194], to: [35.6762, 139.6503], id: 'sf-tyo' },
  { from: [40.7128, -74.006], to: [51.5074, -0.1278], id: 'nyc-lon' },
  { from: [51.5074, -0.1278], to: [-33.9249, 18.4241], id: 'lon-cpt' },
  { from: [35.6762, 139.6503], to: [-33.8688, 151.2093], id: 'tyo-syd' },
]

document.querySelector('#app').innerHTML = `
  <div class="stage">
    <div class="stars" aria-hidden="true"></div>
    <div class="glow" aria-hidden="true"></div>

    <header class="copy">
      <p class="kicker">day 0 · evergreen starter</p>
      <h1>daily X bookmark prototypes</h1>
      <p>One repo, one Vercel project. Drag the globe. Tomorrow is a branch.</p>
    </header>

    <div class="globe-wrap" id="globe-wrap">
      <canvas id="globe" width="800" height="800" aria-label="Interactive spinning earth"></canvas>
      <p class="fallback" hidden>
        This demo needs WebGL. Try another browser, or enable hardware acceleration.
      </p>
    </div>

    <footer class="meta">
      <span>bookmark-demos</span>
      <span aria-hidden="true">·</span>
      <a href="https://github.com/shuding/cobe" target="_blank" rel="noreferrer">cobe</a>
    </footer>
  </div>
`

seedStars(document.querySelector('.stars'))
mountGlobe()

function seedStars(layer) {
  const count = window.matchMedia('(max-width: 640px)').matches ? 70 : 140
  const dots = []

  for (let i = 0; i < count; i += 1) {
    const x = Math.random() * 100
    const y = Math.random() * 100
    const size = Math.random() * 1.35 + 0.2
    const alpha = Math.random() * 0.55 + 0.12
    dots.push(`${x}vw ${y}vh 0 ${size}px rgba(230, 236, 255, ${alpha})`)
  }

  layer.style.boxShadow = dots.join(',')
}

function mountGlobe() {
  const canvas = document.querySelector('#globe')
  const wrap = document.querySelector('#globe-wrap')
  const fallback = document.querySelector('.fallback')

  const dpr = Math.min(window.devicePixelRatio || 1, 2)
  let width = measure()
  let phi = 2.4
  let theta = 0.28
  let pointerX = 0
  let pointerY = 0
  let dragging = false
  let raf = 0
  let globe

  if (!supportsWebGL()) {
    showFallback()
    return
  }

  globe = createGlobe(canvas, {
    devicePixelRatio: dpr,
    width,
    height: width,
    phi,
    theta,
    dark: 1,
    diffuse: 1.35,
    mapSamples: 18000,
    mapBrightness: 6.2,
    mapBaseBrightness: 0.04,
    baseColor: [0.62, 0.72, 0.95],
    markerColor: [1, 0.55, 0.22],
    glowColor: [0.42, 0.52, 0.82],
    opacity: 0.88,
    scale: 1.02,
    markers: MARKERS,
    arcs: ARCS,
    arcColor: [0.55, 0.7, 1],
    arcWidth: 0.55,
    arcHeight: 0.28,
    markerElevation: 0.03,
  })

  requestAnimationFrame(() => {
    canvas.classList.add('is-ready')
  })

  const onPointerDown = (event) => {
    dragging = true
    const point = clientPoint(event)
    pointerX = point.x
    pointerY = point.y
    wrap.classList.add('is-dragging')
    wrap.setPointerCapture?.(event.pointerId)
  }

  const onPointerMove = (event) => {
    const point = clientPoint(event)

    if (dragging) {
      const dx = point.x - pointerX
      const dy = point.y - pointerY
      phi += dx * 0.005
      theta = clamp(theta + dy * 0.0035, -0.55, 0.7)
      pointerX = point.x
      pointerY = point.y
      return
    }

    const nx = point.x / window.innerWidth - 0.5
    const ny = point.y / window.innerHeight - 0.5
    wrap.style.setProperty('--tilt-x', `${nx * 5}deg`)
    wrap.style.setProperty('--tilt-y', `${-ny * 5}deg`)
  }

  const onPointerUp = (event) => {
    dragging = false
    wrap.classList.remove('is-dragging')
    if (event.pointerId != null) {
      try {
        wrap.releasePointerCapture(event.pointerId)
      } catch {
        // Pointer was not captured (touch-cancel, leave).
      }
    }
  }

  const onResize = () => {
    width = measure()
  }

  wrap.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerup', onPointerUp)
  window.addEventListener('pointercancel', onPointerUp)
  window.addEventListener('resize', onResize)

  const tick = () => {
    if (!dragging) {
      phi += 0.0028
    }

    globe.update({
      phi,
      theta,
      width,
      height: width,
    })

    raf = requestAnimationFrame(tick)
  }

  raf = requestAnimationFrame(tick)

  if (import.meta.hot) {
    import.meta.hot.dispose(() => {
      cancelAnimationFrame(raf)
      globe.destroy()
      wrap.removeEventListener('pointerdown', onPointerDown)
      window.removeEventListener('pointermove', onPointerMove)
      window.removeEventListener('pointerup', onPointerUp)
      window.removeEventListener('pointercancel', onPointerUp)
      window.removeEventListener('resize', onResize)
    })
  }

  function measure() {
    const shortest = Math.min(window.innerWidth, window.innerHeight)
    const scale = window.innerWidth < 640 ? 0.72 : 0.78
    return Math.round(Math.min(shortest * scale, 780))
  }

  function showFallback() {
    canvas.hidden = true
    fallback.hidden = false
  }
}

function clientPoint(event) {
  if (event.touches?.[0]) {
    return { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }

  return { x: event.clientX, y: event.clientY }
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value))
}

function supportsWebGL() {
  const probe = document.createElement('canvas')
  return Boolean(
    probe.getContext('webgl2') ||
      probe.getContext('webgl') ||
      probe.getContext('experimental-webgl'),
  )
}
