import { Router } from 'express';
import CardController from '@/controllers/card.controller';
import { Routes } from '@interfaces/routes.interface';
import multer from 'multer';
const upload = multer();

class cardRoute implements Routes {
  public path = '/api/cards';
  public router = Router();
  public cardController = new CardController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/generate`, this.cardController.generateCards);
    this.router.post(`${this.path}/generateFromPdf`, upload.single('file'), this.cardController.generateFromPdf);
    this.router.get(`${this.path}/generateFromCorpus`, this.cardController.generateFromCorpus);
    this.router.get(`${this.path}`, this.cardController.getCards);
    this.router.get(`${this.path}/:id`, this.cardController.getCard);
    this.router.post(`${this.path}`, this.cardController.createCard);
    this.router.put(`${this.path}/:id`, this.cardController.updateCard);
    this.router.delete(`${this.path}/:id`, this.cardController.deleteCard);
  }
}

export default cardRoute;
