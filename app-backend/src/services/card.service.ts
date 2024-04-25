import { Firestore } from '@google-cloud/firestore';

class CardService {
  private firestore: Firestore;

  constructor() {
    this.firestore = new Firestore({
      projectId: 'oxya-hackaton-2024',
      databaseId: '(default)',
    });
  }

  async getCards() {
    const cards = await this.firestore.collection('cards').get();
    return cards.docs.map(card => {
      return { id: card.id, ...card.data() };
    });
  }

  async getCard(id: string) {
    const card = await this.firestore.collection('cards').doc(id).get();
    return card.data();
  }

  async createCards(cards: any[]) {
    const batch = this.firestore.batch();
    const cardRefs = cards.map(card => {
      const newCard = this.firestore.collection('cards').doc();
      batch.set(newCard, card);
      return newCard;
    });
    await batch.commit();
    return cardRefs.map(card => card.id);
  }

  async createCard(card: any) {
    const newCard = await this.firestore.collection('cards').add(card);
    return newCard.id;
  }

  async updateCard(id: string, card: any) {
    await this.firestore.collection('cards').doc(id).set(card);
  }

  async deleteCard(id: string) {
    await this.firestore.collection('cards').doc(id).delete();
  }
}

export default CardService;
