import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import { NODE_ENV, PORT, LOG_FORMAT, ORIGIN, CREDENTIALS } from '@config';
import { Routes } from '@interfaces/routes.interface';
import errorMiddleware from '@middlewares/error.middleware';
import { logger, stream } from '@utils/logger';
import { Server } from 'socket.io';

class App {
  public app: express.Application;
  public server: any;
  public io: any;
  public env: string;
  public port: string | number;

  constructor(routes: Routes[]) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;

    this.server = require('http').Server(this.app);
    this.io = new Server(this.server, {
      cors: {
        origin: ORIGIN,
      },
    });

    this.initializeMiddlewares();
    this.initializeRoutes(routes);
    this.initializeErrorHandling();
  }

  public listen() {
    this.server.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    if (this.env == 'development') this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(
      cors({
        origin: ORIGIN,
        credentials: CREDENTIALS,
        // preflightContinue: false,
        // methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        // optionsSuccessStatus: 204,
      }),
    );
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
  }

  private initializeRoutes(routes: Routes[]) {
    routes.forEach(route => {
      this.app.use('/', route.router);
    });
    this.app.get('/api/headers', (req, res) => {
      res.set('Content-Type', 'text/plain');
      let s = '';
      for (const name in req.headers) {
        s += `${name}: ${req.headers[name]}\n`;
      }
      res.send(s);
    });
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }
}

export default App;
