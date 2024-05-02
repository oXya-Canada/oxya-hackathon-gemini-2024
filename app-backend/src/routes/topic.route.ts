import { Router } from 'express';
import TopicController from '@/controllers/topic.controller';
import { Routes } from '@interfaces/routes.interface';
import multer from 'multer';
const upload = multer();

class topicRoute implements Routes {
  public path = '/api/topics';
  public router = Router();
  public topicController = new TopicController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.topicController.getTopics);
    this.router.get(`${this.path}/:id`, this.topicController.getTopic);
    this.router.post(`${this.path}`, this.topicController.createTopic);
    this.router.put(`${this.path}`, upload.array('pdfs'), this.topicController.updateTopic);
    this.router.delete(`${this.path}/:id`, this.topicController.deleteTopic);
    this.router.get(`${this.path}/:id/documents`, this.topicController.getDocumentsByTopicId);
  }
}

export default topicRoute;
