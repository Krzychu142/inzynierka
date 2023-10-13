interface ImportMetaEnv {
    // Add here environment variables defined in the `.env` file
    VITE_BASE_BACKEND_URL?: string;
}

interface ImportMeta {
    env: ImportMetaEnv;
}