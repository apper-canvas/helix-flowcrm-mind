import companiesData from '../mockData/companies.json';

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CompanyService {
  constructor() {
    // Initialize with mock data
    this.companies = [...companiesData];
  }

  async getAll() {
    await delay(500);
    return [...this.companies];
  }

  async getById(id) {
    await delay(300);
    const company = this.companies.find(c => c.id === id);
    if (!company) {
      throw new Error('Company not found');
    }
    return { ...company };
  }

  async create(companyData) {
    await delay(600);
    const newCompany = {
      id: Date.now(),
      ...companyData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.companies.unshift(newCompany);
    return { ...newCompany };
  }

  async update(id, updateData) {
    await delay(500);
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.companies[index] = {
      ...this.companies[index],
      ...updateData,
      updatedAt: new Date().toISOString()
    };
    
    return { ...this.companies[index] };
  }

  async delete(id) {
    await delay(400);
    const index = this.companies.findIndex(c => c.id === id);
    if (index === -1) {
      throw new Error('Company not found');
    }
    
    this.companies.splice(index, 1);
    return true;
  }
}

const companyService = new CompanyService();
export default companyService;