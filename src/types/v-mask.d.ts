declare module 'v-mask' {
  import type { Directive, Plugin } from 'vue'
  
  const VueMask: Plugin
  export default VueMask

  export const mask: Directive
  export const VueMaskDirective: Directive
} 