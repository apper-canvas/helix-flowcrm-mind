import interactionsData from '../mockData/interactions.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InteractionService {
  constructor() {
    this.data = [...interactionsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const interaction = this.data.find(item => item.id === id);
    if (!interaction) {
      throw new Error('Interaction not found');
    }
    return { ...interaction };
  }

  async create(interactionData) {
    await delay(400);
    const newInteraction = {
      ...interactionData,
      id: Date.now().toString(),
      date: new Date().toISOString()
    };
    this.data.push(newInteraction);
    return { ...newInteraction };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Interaction not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Interaction not found');
    }
    this.data.splice(index, 1);
    return { success: true };
  }
}

export default new InteractionService();