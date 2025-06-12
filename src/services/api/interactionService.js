const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class InteractionService {
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
          { "Field": { "Name": "type" } },
          { "Field": { "Name": "contact_id" } },
          { "Field": { "Name": "notes" } },
          { "Field": { "Name": "date" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('interaction', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching interactions:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'type', 'contact_id', 'notes', 'date']
      };
      
      const response = await this.apperClient.getRecordById('interaction', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching interaction with ID ${id}:`, error);
      throw error;
    }
  }

  async create(interactionData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: interactionData.type || interactionData.Name || 'Interaction',
        Tags: interactionData.tags || interactionData.Tags || '',
        Owner: interactionData.owner || interactionData.Owner,
        type: interactionData.type,
        contact_id: parseInt(interactionData.contactId) || parseInt(interactionData.contact_id),
        notes: interactionData.notes || '',
        date: interactionData.date || new Date().toISOString()
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('interaction', params);
      
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
      console.error("Error creating interaction:", error);
      throw error;
    }
  }

  async update(id, updates) {
    try {
      await delay(300);
      
      // Only include Updateable fields
      const updateableData = {
        Id: id,
        ...(updates.type && { Name: updates.type, type: updates.type }),
        ...(updates.Name && { Name: updates.Name }),
        ...(updates.tags && { Tags: updates.tags }),
        ...(updates.Tags && { Tags: updates.Tags }),
        ...(updates.owner && { Owner: updates.owner }),
        ...(updates.Owner && { Owner: updates.Owner }),
        ...(updates.contactId && { contact_id: parseInt(updates.contactId) }),
        ...(updates.contact_id && { contact_id: parseInt(updates.contact_id) }),
        ...(updates.notes && { notes: updates.notes }),
        ...(updates.date && { date: updates.date })
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('interaction', params);
      
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
      console.error("Error updating interaction:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('interaction', params);
      
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
      console.error("Error deleting interaction:", error);
      throw error;
    }
  }
}

export default new InteractionService();