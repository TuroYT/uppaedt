import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "uppaedt.ionic",
  appName: "uppaedt",
  webDir: "dist",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
  android: {
    buildOptions: {
      keystorePath: "/home/rpinsolle/uppaedt.jks",
      keystoreAlias: "Key0",
    },
  },
};

export default config;
