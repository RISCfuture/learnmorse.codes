declare module 'element-in-view' {
  interface Offset {
    top?: number
    right?: number
    bottom?: number
    left?: number
  }

  interface InViewOptions {
    offset?: number | Offset
    threshold?: number
  }

  export default function(element: HTMLElement, options?: InViewOptions): boolean
}
