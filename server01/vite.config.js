import { defineConfig } from 'vite';
import fs from 'fs';

export default defineConfig({
  server: {
    https: {
      key: fs.readFileSync('./security/server.key'),
      cert: fs.readFileSync('./security/server.cert')
    }
  }
});