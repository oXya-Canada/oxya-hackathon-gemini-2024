import { NextFunction, Request, Response } from 'express';

class IndexController {
  public index = (req: Request, res: Response, next: NextFunction): void => {
    try {
      res.send('1.1.10');
    } catch (error) {
      next(error);
    }
  };
}

export default IndexController;
