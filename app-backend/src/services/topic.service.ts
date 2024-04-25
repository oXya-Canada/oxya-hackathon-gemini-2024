import { Firestore } from '@google-cloud/firestore';

class TopicService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore({
      projectId: 'oxya-hackaton-2024',
      databaseId: '(default)',
    });
  }

  async getTopics() {
    const topics = await this.firestore.collection('topics').get();
    return topics.docs.map(topic => {
      return { id: topic.id, ...topic.data() };
    });
    return topics.docs;
  }

  async getTopic(id: string) {
    const topic = await this.firestore.collection('topics').doc(id).get();
    return topic.data();
  }

  async createTopics(topics: any[]) {
    const batch = this.firestore.batch();
    const topicRefs = topics.map(topic => {
      const newTopic = this.firestore.collection('topics').doc();
      batch.set(newTopic, topic);
      return newTopic;
    });
    await batch.commit();
    return topicRefs.map(topic => topic.id);
  }

  async createTopic(topic: any) {
    const newTopic = await this.firestore.collection('topics').add(topic);
    return newTopic.id;
  }

  async updateTopic(topic: any) {
    return await this.firestore.collection('topics').doc(topic.id).set(topic);
  }

  async deleteTopic(id: string) {
    await this.firestore.collection('topics').doc(id).delete();
  }
}

export default TopicService;
