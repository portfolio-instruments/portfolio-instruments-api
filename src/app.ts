import compression from 'compression';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import initProcessErrorHandler from './errors/processErrorHandler';
import deserializeUser from './middleware/deserializeUser';
import { errorFallbackHandler, notFoundHandler } from './middleware/errorHandlers';
import trafficLogger from './middleware/trafficLogger';
import routes from './routes';
import Logger from './utils/Logger';

const app = express();

/** Startup */
initProcessErrorHandler();

/** Log inbound and outbound traffic */
app.use(trafficLogger);

/** Basic security & performance  */
app.use(helmet());
app.use(compression());

/** Body Parser */
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

/** Deserialize User */
app.use(deserializeUser);

/** Routes */
routes(app);

/** Error handling */
app.use(notFoundHandler);
app.use(errorFallbackHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => Logger.info(`App server started on port ${PORT}`));
