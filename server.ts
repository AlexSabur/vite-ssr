import express, { Express } from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import httpDevServer from "vavite/http-dev-server";
import viteDevServer from "vavite/vite-dev-server";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resolve = (...paths: string[]) => path.resolve(__dirname, ...paths);
const isProduction = import.meta.env.PROD;

const addViteMiddlewares = async (app: Express) => {
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      // 1. Read index.html
      let template = fs.readFileSync(
        isProduction ? resolve("../client/index.html") : resolve("index.html"),
        "utf-8"
      );

      // 2. Apply Vite HTML transforms. This injects the Vite HMR client, and
      //    also applies HTML transforms from Vite plugins, e.g. global preambles
      //    from @vitejs/plugin-react
      if (viteDevServer) {
        template = await viteDevServer.transformIndexHtml(url, template);
      }

      // 3. Load the server entry. vite.ssrLoadModule automatically transforms
      //    your ESM source code to be usable in Node.js! There is no bundling
      //    required, and provides efficient invalidation similar to HMR.
      const { render } = await import("./src/entry-server.js");

      // 4. render the app HTML. This assumes entry-server.js's exported `render`
      //    function calls appropriate framework SSR APIs,
      //    e.g. ReactDOMServer.renderToString()
      const { renderTemplate, storesValues, emotionCss } = await render(req);

      // 5. Inject the app-rendered HTML into the template.
      const html = template
        .replace(`<!--app-html-->`, renderTemplate)
        .replace(`<!--app-css-->`, emotionCss)
        .replace(`{ /** app-state */ }`, JSON.stringify(storesValues));

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (error) {
      // If an error is caught, let Vite fix the stack trace so it maps back to
      // your actual source code.
      if (viteDevServer) {
        viteDevServer.ssrFixStacktrace(error as Error);
      }

      next(error);
    }
  });
};

async function createServer() {
  const app = express();

  void addViteMiddlewares(app);

  if (isProduction) {
    app.use(
      "/assets",
      express.static(path.resolve(__dirname, "dist/client/assets"))
    );

    // app.use("*", async (_, res, ) => {
    //   res.sendfile(path.resolve(__dirname, "dist/client/index.html"));
    // });
  }

  if (viteDevServer) {
    httpDevServer!.on("request", app);

    return;
  }

  app.listen(5173);
}

createServer();
