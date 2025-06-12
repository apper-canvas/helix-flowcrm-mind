// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class CompanyService {
  constructor() {
    // Initialize ApperClient with Project ID and Public Key
    const { ApperClient } = window.ApperSDK;
    this.apperClient = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
  }

  async getAll() {
    try {
      await delay(300);
      
      const params = {
        "Fields": [
          { "Field": { "Name": "Id" } },
          { "Field": { "Name": "Name" } },
          { "Field": { "Name": "Tags" } },
          { "Field": { "Name": "Owner" } },
          { "Field": { "Name": "CreatedOn" } },
          { "Field": { "Name": "CreatedBy" } },
          { "Field": { "Name": "ModifiedOn" } },
          { "Field": { "Name": "ModifiedBy" } },
          { "Field": { "Name": "industry" } },
          { "Field": { "Name": "employees" } },
          { "Field": { "Name": "revenue" } },
          { "Field": { "Name": "size" } },
          { "Field": { "Name": "status" } },
          { "Field": { "Name": "contact_person" } },
          { "Field": { "Name": "email" } },
          { "Field": { "Name": "phone" } },
          { "Field": { "Name": "address" } },
          { "Field": { "Name": "website" } },
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "updated_at" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching companies:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'industry', 'employees', 'revenue', 'size', 'status', 'contact_person', 'email', 'phone', 'address', 'website', 'description', 'created_at', 'updated_at']
      };
      
      const response = await this.apperClient.getRecordById('company', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching company with ID ${id}:`, error);
      throw error;
    }
  }

  async create(companyData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: companyData.name || companyData.Name,
        Tags: companyData.tags || companyData.Tags || '',
        Owner: companyData.owner || companyData.Owner,
        industry: companyData.industry,
        employees: parseInt(companyData.employees) || 0,
        revenue: parseFloat(companyData.revenue) || 0,
        size: companyData.size,
        status: companyData.status,
        contact_person: companyData.contactPerson || companyData.contact_person,
        email: companyData.email,
        phone: companyData.phone,
        address: companyData.address,
        website: companyData.website,
        description: companyData.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulRecords = response.results.filter(result => result.success);
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          failedRecords.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulRecords[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating company:", error);
      throw error;
    }
  }

  async update(id, updateData) {
    try {
      await delay(300);
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        ...(updateData.name && { Name: updateData.name }),
        ...(updateData.Name && { Name: updateData.Name }),
        ...(updateData.tags && { Tags: updateData.tags }),
        ...(updateData.Tags && { Tags: updateData.Tags }),
        ...(updateData.owner && { Owner: updateData.owner }),
        ...(updateData.Owner && { Owner: updateData.Owner }),
        ...(updateData.industry && { industry: updateData.industry }),
        ...(updateData.employees && { employees: parseInt(updateData.employees) }),
        ...(updateData.revenue && { revenue: parseFloat(updateData.revenue) }),
        ...(updateData.size && { size: updateData.size }),
        ...(updateData.status && { status: updateData.status }),
        ...(updateData.contactPerson && { contact_person: updateData.contactPerson }),
        ...(updateData.contact_person && { contact_person: updateData.contact_person }),
        ...(updateData.email && { email: updateData.email }),
        ...(updateData.phone && { phone: updateData.phone }),
        ...(updateData.address && { address: updateData.address }),
        ...(updateData.website && { website: updateData.website }),
        ...(updateData.description && { description: updateData.description }),
        updated_at: new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const successfulUpdates = response.results.filter(result => result.success);
        const failedUpdates = response.results.filter(result => !result.success);
        
        if (failedUpdates.length > 0) {
          console.error(`Failed to update ${failedUpdates.length} records:${JSON.stringify(failedUpdates)}`);
          failedUpdates.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
        
        return successfulUpdates[0]?.data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating company:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('company', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedDeletions = response.results.filter(result => !result.success);
        
        if (failedDeletions.length > 0) {
          console.error(`Failed to delete ${failedDeletions.length} records:${JSON.stringify(failedDeletions)}`);
          failedDeletions.forEach(record => {
            if (record.message) throw new Error(record.message);
          });
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting company:", error);
      throw error;
    }
  }
}

const companyService = new CompanyService();
export default companyService;