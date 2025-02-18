import type { Config } from "tailwindcss";
import flowbite from "flowbite-react/tailwind";
import taildWindTypografy from '@tailwindcss/typography'
const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    flowbite.content(),
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {"50":"#fffbeb","100":"#fef3c7","200":"#fde68a","300":"#fcd34d","400":"#fbbf24","500":"#f59e0b","600":"#d97706","700":"#b45309","800":"#92400e","900":"#78350f","950":"#451a03"}
        
      },
    },
  },
  darkMode: 'class',
  plugins: [
    flowbite.plugin(),
    taildWindTypografy
  ]
};
export default config;
