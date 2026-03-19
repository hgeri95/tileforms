import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');

  const angularApp = new AngularNodeAppEngine();

  server.use(
    express.static(browserDistFolder, {
      maxAge: '1y',
      index: 'index.csr.html',
    }),
  );

  server.use('/**', (req, res, next) => {
    angularApp
      .handle(req, { server: res })
      .then((response: Response | null) =>
        response ? writeResponseToNodeResponse(response, res) : next()
      )
      .catch(next);
  });

  return server;
}

const port = process.env['PORT'] || 4000;

if (isMainModule(import.meta.url)) {
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

export const reqHandler = createNodeRequestHandler(app());
