const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class TaskService {
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
          { "Field": { "Name": "description" } },
          { "Field": { "Name": "due_date" } },
          { "Field": { "Name": "priority" } },
          { "Field": { "Name": "status" } },
          { "Field": { "Name": "contact_id" } },
          { "Field": { "Name": "deal_id" } }
        ]
      };
      
      const response = await this.apperClient.fetchRecords('task', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw error;
    }
  }

  async getById(id) {
    try {
      await delay(200);
      
      const params = {
        fields: ['Id', 'Name', 'Tags', 'Owner', 'title', 'description', 'due_date', 'priority', 'status', 'contact_id', 'deal_id']
      };
      
      const response = await this.apperClient.getRecordById('task', id, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error fetching task with ID ${id}:`, error);
      throw error;
    }
  }

  async create(taskData) {
    try {
      await delay(400);
      
      // Only include Updateable fields
      const updateableData = {
        Name: taskData.title || taskData.Name,
        Tags: taskData.tags || taskData.Tags || '',
        Owner: taskData.owner || taskData.Owner,
        title: taskData.title,
        description: taskData.description || '',
        due_date: taskData.dueDate || taskData.due_date,
        priority: taskData.priority,
        status: taskData.status || 'pending',
        contact_id: taskData.contactId ? parseInt(taskData.contactId) : (taskData.contact_id ? parseInt(taskData.contact_id) : null),
        deal_id: taskData.dealId ? parseInt(taskData.dealId) : (taskData.deal_id ? parseInt(taskData.deal_id) : null)
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.createRecord('task', params);
      
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
      console.error("Error creating task:", error);
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
        ...(updates.description && { description: updates.description }),
        ...(updates.dueDate && { due_date: updates.dueDate }),
        ...(updates.due_date && { due_date: updates.due_date }),
        ...(updates.priority && { priority: updates.priority }),
        ...(updates.status && { status: updates.status }),
        ...(updates.contactId && { contact_id: parseInt(updates.contactId) }),
        ...(updates.contact_id && { contact_id: parseInt(updates.contact_id) }),
        ...(updates.dealId && { deal_id: parseInt(updates.dealId) }),
        ...(updates.deal_id && { deal_id: parseInt(updates.deal_id) })
      };
      
      const params = {
        records: [updateableData]
      };
      
      const response = await this.apperClient.updateRecord('task', params);
      
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
      console.error("Error updating task:", error);
      throw error;
    }
  }

  async delete(id) {
    try {
      await delay(250);
      
      const params = {
        RecordIds: [id]
      };
      
      const response = await this.apperClient.deleteRecord('task', params);
      
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
      console.error("Error deleting task:", error);
      throw error;
    }
  }
}

export default new TaskService();
export default new TaskService();