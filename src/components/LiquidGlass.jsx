import { useEffect, useRef, useState, useId } from 'react'
import './LiquidGlass.css'

function LiquidGlass({
  children,
  className = '',
  borderRadius = 42,
  borderWidth = 0.07,
  brightness = 60,
  opacity = 1.93,
  blur = 10.7,
  displace = 0,
  backgroundOpacity = 0,
  saturation = 1.15,
  distortionScale = -80,
  redOffset = 0,
  greenOffset = 7,
  blueOffset = 14,
  xChannel = 'R',
  yChannel = 'G',
}) {
  const uniqueId = useId().replace(/:/g, '-')

  const filterId = `liquid-glass-filter-${uniqueId}`
  const redGradId = `liquid-red-grad-${uniqueId}`
  const blueGradId = `liquid-blue-grad-${uniqueId}`

  const [svgSupported, setSvgSupported] = useState(false)

  const containerRef = useRef(null)

  const feImageRef = useRef(null)
  const redChannelRef = useRef(null)
  const greenChannelRef = useRef(null)
  const blueChannelRef = useRef(null)
  const gaussianBlurRef = useRef(null)

  const generateDisplacementMap = () => {
    const rect = containerRef.current?.getBoundingClientRect()

    const actualWidth = rect?.width || 760
    const actualHeight = rect?.height || 720

    const edgeSize =
      Math.min(actualWidth, actualHeight) * (borderWidth * 0.5)

    const svgContent = `
      <svg
        viewBox="0 0 ${actualWidth} ${actualHeight}"
        xmlns="http://www.w3.org/2000/svg"
      >

        <defs>

          <linearGradient
            id="${redGradId}"
            x1="100%"
            y1="0%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stop-color="#0000" />
            <stop offset="100%" stop-color="red" />
          </linearGradient>

          <linearGradient
            id="${blueGradId}"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stop-color="#0000" />
            <stop offset="100%" stop-color="blue" />
          </linearGradient>

        </defs>

        <rect
          x="0"
          y="0"
          width="${actualWidth}"
          height="${actualHeight}"
          fill="black"
        />

        <rect
          x="0"
          y="0"
          width="${actualWidth}"
          height="${actualHeight}"
          rx="${borderRadius}"
          fill="url(#${redGradId})"
        />

        <rect
          x="0"
          y="0"
          width="${actualWidth}"
          height="${actualHeight}"
          rx="${borderRadius}"
          fill="url(#${blueGradId})"
          style="mix-blend-mode: screen"
        />

        <rect
          x="${edgeSize}"
          y="${edgeSize}"
          width="${actualWidth - edgeSize * 2}"
          height="${actualHeight - edgeSize * 2}"
          rx="${borderRadius}"
          fill="hsl(0 0% ${brightness}% / ${opacity})"
          style="filter: blur(${blur}px)"
        />

      </svg>
    `

    return `data:image/svg+xml,${encodeURIComponent(svgContent)}`
  }

  const updateDisplacementMap = () => {
    if (!feImageRef.current) return

    feImageRef.current.setAttribute(
      'href',
      generateDisplacementMap()
    )
  }

  useEffect(() => {
    updateDisplacementMap()

    if (redChannelRef.current) {
      redChannelRef.current.setAttribute(
        'scale',
        distortionScale + redOffset
      )

      redChannelRef.current.setAttribute(
        'xChannelSelector',
        xChannel
      )

      redChannelRef.current.setAttribute(
        'yChannelSelector',
        yChannel
      )
    }

    if (greenChannelRef.current) {
      greenChannelRef.current.setAttribute(
        'scale',
        distortionScale + greenOffset
      )

      greenChannelRef.current.setAttribute(
        'xChannelSelector',
        xChannel
      )

      greenChannelRef.current.setAttribute(
        'yChannelSelector',
        yChannel
      )
    }

    if (blueChannelRef.current) {
      blueChannelRef.current.setAttribute(
        'scale',
        distortionScale + blueOffset
      )

      blueChannelRef.current.setAttribute(
        'xChannelSelector',
        xChannel
      )

      blueChannelRef.current.setAttribute(
        'yChannelSelector',
        yChannel
      )
    }

    if (gaussianBlurRef.current) {
      gaussianBlurRef.current.setAttribute(
        'stdDeviation',
        displace
      )
    }
  }, [
    borderWidth,
    borderRadius,
    brightness,
    opacity,
    blur,
    displace,
    distortionScale,
    redOffset,
    greenOffset,
    blueOffset,
    xChannel,
    yChannel,
  ])

  useEffect(() => {
    if (!containerRef.current) return

    const resizeObserver = new ResizeObserver(() => {
      setTimeout(updateDisplacementMap, 0)
    })

    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
    }
  }, [])

  useEffect(() => {
    setTimeout(updateDisplacementMap, 0)
  }, [])

  useEffect(() => {
    setSvgSupported(supportsSVGFilters())
  }, [])

  const supportsSVGFilters = () => {
    if (
      typeof window === 'undefined' ||
      typeof document === 'undefined'
    ) {
      return false
    }

    const isWebkit =
      /Safari/.test(navigator.userAgent) &&
      !/Chrome/.test(navigator.userAgent)

    const isFirefox =
      /Firefox/.test(navigator.userAgent)

    if (isWebkit || isFirefox) {
      return false
    }

    const div = document.createElement('div')

    div.style.backdropFilter = `url(#${filterId})`

    return div.style.backdropFilter !== ''
  }

  const containerStyle = {
    '--glass-frost': backgroundOpacity,
    '--glass-saturation': saturation,
    '--filter-id': `url(#${filterId})`,
  }

  return (
    <div
      ref={containerRef}
      className={`liquid-glass ${
        svgSupported
          ? 'liquid-glass--svg'
          : 'liquid-glass--fallback'
      } ${className}`}
      style={containerStyle}
    >

      <svg
        className="liquid-glass__filters"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>

          <filter
            id={filterId}
            colorInterpolationFilters="sRGB"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
          >

            <feImage
              ref={feImageRef}
              x="0"
              y="0"
              width="100%"
              height="100%"
              preserveAspectRatio="none"
              result="map"
            />

            <feDisplacementMap
              ref={redChannelRef}
              in="SourceGraphic"
              in2="map"
              result="dispRed"
            />

            <feColorMatrix
              in="dispRed"
              type="matrix"
              values="
                1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0
              "
              result="red"
            />

            <feDisplacementMap
              ref={greenChannelRef}
              in="SourceGraphic"
              in2="map"
              result="dispGreen"
            />

            <feColorMatrix
              in="dispGreen"
              type="matrix"
              values="
                0 0 0 0 0
                0 1 0 0 0
                0 0 0 0 0
                0 0 0 1 0
              "
              result="green"
            />

            <feDisplacementMap
              ref={blueChannelRef}
              in="SourceGraphic"
              in2="map"
              result="dispBlue"
            />

            <feColorMatrix
              in="dispBlue"
              type="matrix"
              values="
                0 0 0 0 0
                0 0 0 0 0
                0 0 1 0 0
                0 0 0 1 0
              "
              result="blue"
            />

            <feBlend
              in="red"
              in2="green"
              mode="screen"
              result="rg"
            />

            <feBlend
              in="rg"
              in2="blue"
              mode="screen"
              result="output"
            />

            <feGaussianBlur
              ref={gaussianBlurRef}
              in="output"
              stdDeviation="0.7"
            />

          </filter>
        </defs>
      </svg>

      <div className="liquid-glass__content">
        {children}
      </div>

    </div>
  )
}

export default LiquidGlass