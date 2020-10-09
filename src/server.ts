import * as express from "express";
import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";

import { AppRoutes } from "./routes/app_routes";

class App {
  public app: express.Application;
  private app_routes: AppRoutes = new AppRoutes();

  constructor() {
    this.app = express();
    this.config();
    this.app_routes.route(this.app);
  }

  private config(): void {
    this.app.use(express.static("web/build"));
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(cookieParser());
  }
}

export default new App().app;
