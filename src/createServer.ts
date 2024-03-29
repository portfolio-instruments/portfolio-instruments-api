import compression from 'compression';
import type { Express, NextFunction, Request, Response } from 'express';
import express from 'express';
import helmet from 'helmet';
import processErrorHandlers from './errors/processErrorHandler';
import deserializeUser from './middleware/deserializeUser';
import { errorFallbackHandler, notFoundHandler } from './middleware/errorHandlers';
import trafficLogger from './middleware/trafficLogger';
import routes from './routes';
import swaggerDocs from './utils/swaggerDocs';

/** Core server instance setup before port listening */
export default function createServer(): Express {
  const app = express();

  /** Process error handlers */
  processErrorHandlers();

  /** Log inbound and outbound traffic */
  app.use(trafficLogger);

  /** Basic security & performance  */
  app.use(helmet());
  app.use(compression());

  /** Body parser */
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  /** Swagger docs */
  swaggerDocs(app);

  /** API rules */
  app.use((req: Request, res: Response, next: NextFunction): void => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      res.status(200).json({});
      return;
    }

    next();
  });

  /** Deserialize user */
  app.use(deserializeUser);

  /** Routes */
  routes(app);

  /** Error handling */
  app.use(notFoundHandler);
  app.use(errorFallbackHandler);

  return app;
}
