import { NextFunction, Request, Response } from 'express';

class UserController {
  public getUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      res.json({ email: req.headers['x-goog-authenticated-user-email'], id: req.headers['x-goog-authenticated-user-id'] });
    } catch (error) {
      next(error);
    }
  };
}

export default UserController;
