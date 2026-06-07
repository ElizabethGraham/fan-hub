declare namespace NodeJS {
  interface ProcessEnv {
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_MOCK_API?: string;
  }
}

declare const process: {
  env: NodeJS.ProcessEnv;
};
