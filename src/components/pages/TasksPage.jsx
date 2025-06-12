import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import TaskList from '@/components/organisms/TaskList';
import Modal from '@/components/molecules/Modal';
import CreateTaskForm from '@/components/organisms/CreateTaskForm';
import taskService from '@/services/api/taskService';
import contactService from '@/services/api/contactService';
import dealService from '@/services/api/dealService';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [filter, setFilter] = useState('all');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, contactsData, dealsData] = await Promise.all([
        taskService.getAll(),
        contactService.getAll(),
        dealService.getAll()
      ]);
      setTasks(tasksData);
      setContacts(contactsData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleCreateTask = async (formData) => {
    try {
      const newTask = await taskService.create(formData);
      setTasks([...tasks, newTask]);
      setShowCreateModal(false);
      toast.success('Task created successfully');
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const handleToggleComplete = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';

    try {
      const updatedTask = await taskService.update(taskId, { status: newStatus });
      setTasks(tasks.map(t => t.id === taskId ? updatedTask : t));
      toast.success(`Task ${newStatus === 'completed' ? 'completed' : 'reopened'}`);
    } catch (err) {
      toast.error('Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;

    try {
      await taskService.delete(taskId);
      setTasks(tasks.filter(t => t.id !== taskId));
      toast.success('Task deleted successfully');
    } catch (err) {
      toast.error('Failed to delete task');
    }
  };

  return (
    <>
      <TaskList
        tasks={tasks} // Pass all tasks, TaskList will filter internally
        contacts={contacts}
        deals={deals}
        filter={filter}
        onFilterChange={setFilter}
        onAddTask={() => setShowCreateModal(true)}
        onToggleComplete={handleToggleComplete}
        onDeleteTask={handleDeleteTask}
        loading={loading}
        error={error}
      />

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add New Task"
      >
        <CreateTaskForm
          contacts={contacts}
          deals={deals}
          onSubmit={handleCreateTask}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>
    </>
  );
};

export default TasksPage;