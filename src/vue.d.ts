declare module 'vue' {
  interface ComponentCustomProperties {
    $filters: {
      symbol: (char: string) => string
    }
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $filters: {
      symbol: (char: string) => string
    }
  }
}

export {} // Important! See note.
