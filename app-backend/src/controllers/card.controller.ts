import { NextFunction, Request, Response } from 'express';
import CardService from '@/services/card.service';
import GeminiService from '@/services/gemini.service';

class CardController {
  private cardService = new CardService();
  private geminiService = new GeminiService();

  public getCards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cards = await this.cardService.getCards();
      res.status(200).json({ data: cards, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      const card = await this.cardService.getCard(cardId);
      res.status(200).json({ data: card, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardData = req.body;
      if (Array.isArray(cardData)) {
        const createdCardsIds = await this.cardService.createCards(cardData);
        res.status(201).json({ data: createdCardsIds, message: 'created' });
      } else {
        const createdCardId = await this.cardService.createCard(cardData);
        res.status(201).json({ data: createdCardId, message: 'created' });
      }
    } catch (error) {
      next(error);
    }
  };

  public updateCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      const cardData = req.body;
      await this.cardService.updateCard(cardId, cardData);
      res.status(200).json({ message: 'updated' });
    } catch (error) {
      next(error);
    }
  };

  public deleteCard = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cardId = req.params.id;
      await this.cardService.deleteCard(cardId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };

  public generateCards = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log('generateCards');
      const { numberOfCards, certification } = req.query;
      const cards = await this.geminiService.generateMultiChoiceCards(Number(numberOfCards), certification as string);
      res.status(200).json({ data: cards, message: 'generated' });
    } catch (error) {
      next(error);
    }
  };

  public generateFromPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const pdf = req.file.buffer;
      const { numberOfCards } = req.body;
      const cards = await this.geminiService.generateCardsFromPdf(pdf, Number(numberOfCards));
      res.status(200).json({ data: cards, message: 'generated' });
    } catch (error) {
      next(error);
    }
  };
}

export default CardController;
