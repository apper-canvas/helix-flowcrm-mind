const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ContactService {
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
          { "Field": { "Name": "email" } },
          { "Field": { "Name": "phone" } },
          { "Field": { "Name": "company" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "created_at" } },
          { "Field": { "Name": "last_interaction" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('contact', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching contacts:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'email', 'phone', 'company', 'notes', 'created_at', 'last_interaction']
      };
      
      const response = await this.apperClient.getRecordById('contact', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching contact with ID ${id}:`, error);
      throw error;
    }
  }

  async create(contactData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: contactData.name || contactData.Name,
        Tags: contactData.tags || contactData.Tags || '',
        Owner: contactData.owner || contactData.Owner,
        email: contactData.email,
        phone: contactData.phone,
        company: contactData.company,
        notes: contactData.notes || '',
        created_at: new Date().toISOString(),
        last_interaction: contactData.lastInteraction || contactData.last_interaction || null
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('contact', params);
      
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
      console.error("Error creating contact:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      await delay(300);
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        ...(updates.name && { Name: updates.name }),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.tags && { Tags: updates.tags }),
        ...(updates.Tags && { Tags: updates.Tags }),
        ...(updates.owner && { Owner: updates.owner }),
        ...(updates.Owner && { Owner: updates.Owner }),
        ...(updates.email && { email: updates.email }),
        ...(updates.phone && { phone: updates.phone }),
        ...(updates.company && { company: updates.company }),
        ...(updates.notes && { notes: updates.notes }),
        ...(updates.lastInteraction !== undefined && { last_interaction: updates.lastInteraction }),
        ...(updates.last_interaction !== undefined && { last_interaction: updates.last_interaction })
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('contact', params);
      
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
      console.error("Error updating contact:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('contact', params);
      
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
      
      return { success: true };
    } catch (error) {
      console.error("Error deleting contact:", error);
      throw error;
    }
  }
}

export default new ContactService();