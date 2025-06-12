import dealsData from '../mockData/deals.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
  constructor() {
    this.data = [...dealsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const deal = this.data.find(item => item.id === id);
    if (!deal) {
      throw new Error('Deal not found');
    }
    return { ...deal };
  }

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      id: Date.now().toString()
    };
    this.data.push(newDeal);
    return { ...newDeal };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Deal not found');
    }
    this.data.splice(index, 1);
    return { success: true };
  }
}

export default new DealService();