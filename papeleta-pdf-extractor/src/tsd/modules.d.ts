declare namespace NodeJS {
  interface ProcessEnv {
    OCR_API_KEY: string;
    USE_OCR?: string;
    NODE_ENV: 'development' | 'production';
  }
}
