import { NextFunction, Request, Response } from 'express';
import TopicService from '@/services/topic.service';
import OxyagenAiService from '@/services/oxyagenai.service';
import { HttpException } from '@/exceptions/HttpException';

class TopicController {
  private topicService = new TopicService();
  private oxyagenAiService = new OxyagenAiService();

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
      const body = req.body;
      const topic = JSON.parse(body.topic);
      console.log('topic', topic);
      const files = req.files as Express.Multer.File[];
      console.log('files', files);

      if (!topic.id) {
        //create corpus
        if (files.length > 0) {
          const corpus = await this.oxyagenAiService.createCorpus(topic.name);
          topic.corpus_id = corpus.corpus_id;
          for (const file of files) {
            await this.oxyagenAiService.addDocumentToCorpus(Number(topic.corpus_id), file);
          }
        }
        const topicId = await this.topicService.createTopic({ ...topic, ...{ corpus_id: topic.corpus_id ?? null } });
        return res.status(201).json({ data: { topicId: topicId, corpus_id: topic.corpus_id ?? null }, message: 'created' });
      } else {
        const prevTopic = await this.topicService.getTopic(topic.id);
        if (!prevTopic) {
          throw new HttpException(404, 'Topic not found');
        }
        if (files.length > 0) {
          if (!prevTopic.corpus_id) {
            const corpus = await this.oxyagenAiService.createCorpus(topic.name);
            prevTopic.corpus_id = corpus.corpus_id;
          }
          for (const file of files) {
            await this.oxyagenAiService.addDocumentToCorpus(Number(prevTopic.corpus_id), file);
          }
        }
        //TODO: do the same for deleting files
        await this.topicService.updateTopic({ ...topic, ...{ corpus_id: prevTopic.corpus_id ?? null } });
        return res.status(200).json({ data: { topicId: topic.id, corpus_id: prevTopic.corpus_id ?? null }, message: 'updated' });
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

  public getDocumentsByTopicId = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const topicId = req.params.id;
      const topic = await this.topicService.getTopic(topicId);
      console.log(topic.corpus_id);
      if (!topic) {
        throw new HttpException(404, 'Topic not found');
      }
      if (!topic.corpus_id) {
        return res.status(200).json({ data: [], message: 'findAll' });
      }
      const documents = await this.oxyagenAiService.getDocumentsByCorpusId(topic.corpus_id);
      res.status(200).json({ data: documents, message: 'findAll' });
    } catch (error) {
      next(error);
    }
  };
}

export default TopicController;
