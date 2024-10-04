import {
  isolateInsideOfContainer,
  scopedPreflightStyles,
} from "tailwindcss-scoped-preflight"

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [
    // ...
    scopedPreflightStyles({
      isolationStrategy: isolateInsideOfContainer(".twp"),
    }),
  ],
}
