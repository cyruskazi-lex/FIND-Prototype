/// <reference types="vite/client" />

// SVG assets imported with the `?raw` query resolve to their source string.
declare module '*.svg?raw' {
  const content: string;
  export default content;
}
