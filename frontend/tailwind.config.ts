import type { Config } from "tailwindcss";

const config: Config = {
  // 1. 다크 모드를 'class' 기반으로 활성화하는 설정을 추가합니다.
  darkMode: "class",

  // 2. tailwindcss가 스타일을 적용할 파일들의 경로를 지정합니다.
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  // 3. 나중에 커스텀 색상, 폰트 등을 추가할 수 있는 공간입니다.
  theme: {
    extend: {
      colors: {
        // 예시: '검푸른색'을 'dark-navy'라는 이름으로 추가
        "dark-navy": "#0D1117",
        "dark-card": "#161B22",
      },
    },
  },
  plugins: [],
};
export default config;
