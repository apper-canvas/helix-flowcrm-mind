import contactsData from '../mockData/contacts.json';

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
  constructor() {
    this.data = [...contactsData];
  }

  async getAll() {
    await delay(300);
    return [...this.data];
  }

  async getById(id) {
    await delay(200);
    const contact = this.data.find(item => item.id === id);
    if (!contact) {
      throw new Error('Contact not found');
    }
    return { ...contact };
  }

  async create(contactData) {
    await delay(400);
    const newContact = {
      ...contactData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      lastInteraction: null
    };
    this.data.push(newContact);
    return { ...newContact };
  }

  async update(id, updates) {
    await delay(300);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    this.data[index] = { ...this.data[index], ...updates };
    return { ...this.data[index] };
  }

  async delete(id) {
    await delay(250);
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error('Contact not found');
    }
    this.data.splice(index, 1);
    return { success: true };
  }
}

export default new ContactService();