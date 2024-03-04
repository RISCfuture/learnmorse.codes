/**
 * Returns whether an element is within the scroll viewport.
 *
 * @param el The element.
 * @return `true` if it is visible within the scroll viewport.
 */
export default function inView(el: HTMLElement) {
  const rect = el.getBoundingClientRect()

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}
