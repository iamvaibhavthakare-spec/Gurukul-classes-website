import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

const brochureFileName = "GSC_Science_Brochure_2026_CC.pdf";
const brochureSourcePath = path.resolve(process.cwd(), "brochures", brochureFileName);

function brochureDownloadPlugin() {
  return {
    name: "brochure-download",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }

        const requestPath = req.url.split("?")[0];
        if (requestPath !== `/${brochureFileName}`) {
          next();
          return;
        }

        if (!fs.existsSync(brochureSourcePath)) {
          res.statusCode = 404;
          res.end("Brochure file not found.");
          return;
        }

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename="${brochureFileName}"`);
        fs.createReadStream(brochureSourcePath).pipe(res);
      });
    },
    writeBundle(outputOptions) {
      if (!fs.existsSync(brochureSourcePath)) {
        return;
      }

      const outDir = outputOptions.dir ?? path.resolve(process.cwd(), "dist");
      fs.copyFileSync(brochureSourcePath, path.join(outDir, brochureFileName));
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths(), brochureDownloadPlugin()],
});
