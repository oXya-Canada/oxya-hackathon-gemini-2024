import { NextFunction, Request, Response } from 'express';
import TopicService from '@/services/topic.service';

class TopicController {
  private topicService = new TopicService();

  public getTopics = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topics = await this.topicService.getTopics();
      res.status(200).json({ data: topics, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };

  public getTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      const topic = await this.topicService.getTopic(topicId);
      res.status(200).json({ data: topic, message: 'findOne' });
    } catch (error) {
      next(error);
    }
  };

  public createTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicData = req.body;
      if (Array.isArray(topicData)) {
        const createdTopicsIds = await this.topicService.createTopics(topicData);
        res.status(201).json({ data: createdTopicsIds, message: 'created' });
      } else {
        const createdTopicId = await this.topicService.createTopic(topicData);
        res.status(201).json({ data: createdTopicId, message: 'created' });
      }
    } catch (error) {
      next(error);
    }
  };

  public updateTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicData = req.body;
      if (!topicData.id) {
        const topic = await this.topicService.createTopic(topicData);
        return res.status(201).json({ data: topic, message: 'created' });
      } else {
        await this.topicService.updateTopic(topicData);
        return res.status(200).json({ data: topicData.id, message: 'updated' });
      }
    } catch (error) {
      next(error);
    }
  };

  public deleteTopic = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      await this.topicService.deleteTopic(topicId);
      res.status(200).json({ message: 'deleted' });
    } catch (error) {
      next(error);
    }
  };
}

export default TopicController;
