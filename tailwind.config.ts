const config: import("tailwindcss").Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}", // if you use /src folder
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
