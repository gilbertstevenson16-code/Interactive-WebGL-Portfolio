import next from "eslint-config-next/core-web-vitals";
// The application owns history transitions to preserve the persistent WebGL scene.
export default [
  ...next,
  {
    rules: {
      "react-hooks/set-state-in-effect": "off",
      "@next/next/no-html-link-for-pages": "off",
    },
  },
];
