import "virtual:group-icons.css";
import type { EnhanceAppContext, Theme } from "vitepress";
import { enhanceAppWithTabs } from "vitepress-plugin-tabs/client";
import DefaultTheme from "vitepress/theme";
import "./custom.css";

export default {
  extends: DefaultTheme,
  enhanceApp({ app }: EnhanceAppContext) {
    enhanceAppWithTabs(app);
  },
} satisfies Theme;
