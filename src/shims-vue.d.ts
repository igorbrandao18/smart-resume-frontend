declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'vuetify/components' {
  import { Component } from 'vue'
  const components: { [key: string]: Component }
  export default components
}

declare module 'vuetify/directives' {
  import { Directive } from 'vue'
  const directives: { [key: string]: Directive }
  export default directives
}

declare module 'vuetify' {
  import { Component } from 'vue'
  export interface Theme {
    dark: boolean
    themes: {
      light: ThemeDefinition
      dark: ThemeDefinition
    }
  }
  export interface ThemeDefinition {
    dark?: boolean
    colors?: {
      [key: string]: string
    }
  }
  export function createVuetify(options?: any): any
}

declare module 'vuetify/iconsets/mdi' {
  import type { IconSet } from 'vuetify'
  export const mdi: IconSet
  export const aliases: Record<string, string>
} 