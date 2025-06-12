const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class DealService {
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
          { "Field": { "Name": "title" } },
          { "Field": { "Name": "value" } },
          { "Field": { "Name": "stage" } },
          { "Field": { "Name": "probability" } },
          { "Field": { "Name": "expected_close" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "contact_id" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('deal', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching deals:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'title', 'value', 'stage', 'probability', 'expected_close', 'notes', 'contact_id']
      };
      
      const response = await this.apperClient.getRecordById('deal', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching deal with ID ${id}:`, error);
      throw error;
    }
  }

  async create(dealData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: dealData.title || dealData.Name,
        Tags: dealData.tags || dealData.Tags || '',
        Owner: dealData.owner || dealData.Owner,
        title: dealData.title,
        value: parseFloat(dealData.value) || 0,
        stage: dealData.stage,
        probability: parseInt(dealData.probability) || 0,
        expected_close: dealData.expectedClose || dealData.expected_close,
        notes: dealData.notes || '',
        contact_id: parseInt(dealData.contactId) || parseInt(dealData.contact_id)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('deal', params);
      
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
      console.error("Error creating deal:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      await delay(300);
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        ...(updates.title && { Name: updates.title, title: updates.title }),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.tags && { Tags: updates.tags }),
        ...(updates.Tags && { Tags: updates.Tags }),
        ...(updates.owner && { Owner: updates.owner }),
        ...(updates.Owner && { Owner: updates.Owner }),
        ...(updates.value && { value: parseFloat(updates.value) }),
        ...(updates.stage && { stage: updates.stage }),
        ...(updates.probability && { probability: parseInt(updates.probability) }),
        ...(updates.expectedClose && { expected_close: updates.expectedClose }),
        ...(updates.expected_close && { expected_close: updates.expected_close }),
        ...(updates.notes && { notes: updates.notes }),
        ...(updates.contactId && { contact_id: parseInt(updates.contactId) }),
        ...(updates.contact_id && { contact_id: parseInt(updates.contact_id) })
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('deal', params);
      
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
      console.error("Error updating deal:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('deal', params);
      
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
      console.error("Error deleting deal:", error);
      throw error;
    }
  }
}

export default new DealService();