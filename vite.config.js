import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
    ],
    server: {
        port: 8082 // 设置端口为3000
    },
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    // devServer: {
    //     proxy: {
    //         '/peirs/list': {
    //             target: 'http://localhost:8080',// 后端接口
    //             changeOrigin: true, // 是否跨域
    //         }
    //     }
    // }
})
