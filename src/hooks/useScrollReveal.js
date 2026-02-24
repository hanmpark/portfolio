import { useEffect, useRef } from 'react'

/**
 * Scroll-reveal hook using IntersectionObserver.
 *
 * @param {Object}  options
 * @param {number}  [options.threshold=0.12]  – visibility ratio to trigger
 * @param {string}  [options.rootMargin='0px 0px -60px 0px']
 * @param {boolean} [options.once=true]       – un-observe after first reveal
 * @param {string}  [options.selector='.reveal'] – child selector to observe
 * @returns {React.RefObject}
 */
export default function useScrollReveal({
  threshold = 0.12,
  rootMargin = '0px 0px -60px 0px',
  once = true,
  selector = '.reveal',
} = {}) {
  const containerRef = useRef(null)

  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    // Observe children matching `selector`, or the root itself
    const targets =
      selector && root.querySelectorAll(selector).length
        ? Array.from(root.querySelectorAll(selector))
        : [root]

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed')
            if (once) observer.unobserve(entry.target)
          } else if (!once) {
            entry.target.classList.remove('is-revealed')
          }
        })
      },
      { threshold, rootMargin },
    )

    targets.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [threshold, rootMargin, once, selector])

  return containerRef
}
