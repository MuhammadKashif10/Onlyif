import { USE_MOCKS, withMockFallback } from '@/utils/mockWrapper';
import { request } from '@/utils/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock assignments data
const mockAssignments = [
  {
    id: 'assignment-1',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    propertyAddress: '123 Main St, Austin, TX 78701',
    agentId: 'agent-1',
    agentName: 'Sarah Johnson',
    buyerId: 'buyer-1',
    buyerName: 'John Smith',
    buyerEmail: 'john.smith@email.com',
    buyerPhone: '(555) 123-4567',
    status: 'active',
    assignedAt: '2024-01-15T10:00:00Z',
    priority: 'high',
    notes: 'First-time buyer, needs guidance through the process',
    tasks: [
      {
        id: 'task-1',
        title: 'Schedule property viewing',
        completed: true,
        completedAt: '2024-01-16T14:30:00Z'
      },
      {
        id: 'task-2',
        title: 'Review financing options',
        completed: false,
        dueDate: '2024-01-25T17:00:00Z'
      },
      {
        id: 'task-3',
        title: 'Prepare offer documentation',
        completed: false,
        dueDate: '2024-01-28T17:00:00Z'
      }
    ]
  },
  {
    id: 'assignment-2',
    propertyId: '2',
    propertyTitle: 'Spacious Family Home',
    propertyAddress: '456 Oak Ave, Austin, TX 78702',
    agentId: 'agent-2',
    agentName: 'Michael Chen',
    buyerId: 'buyer-2',
    buyerName: 'Emily Davis',
    buyerEmail: 'emily.davis@email.com',
    buyerPhone: '(555) 987-6543',
    status: 'completed',
    assignedAt: '2024-01-10T09:00:00Z',
    completedAt: '2024-01-20T16:00:00Z',
    priority: 'medium',
    notes: 'Experienced buyer, quick decision maker',
    tasks: [
      {
        id: 'task-4',
        title: 'Property inspection',
        completed: true,
        completedAt: '2024-01-12T11:00:00Z'
      },
      {
        id: 'task-5',
        title: 'Negotiate offer',
        completed: true,
        completedAt: '2024-01-18T15:30:00Z'
      },
      {
        id: 'task-6',
        title: 'Finalize purchase agreement',
        completed: true,
        completedAt: '2024-01-20T16:00:00Z'
      }
    ]
  }
];

export const assignmentsApi = {
  // Get assignments for an agent
  async getAssignmentsByAgent(agentId: string) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(500);
        return mockAssignments.filter(assignment => assignment.agentId === agentId)
          .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
      },
      // Real API call
      async () => {
        const response = await request(`/assignments/agent/${agentId}`);
        return response.data;
      }
    );
  },

  // Get assignments for a buyer
  async getAssignmentsByBuyer(buyerId: string) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(400);
        return mockAssignments.filter(assignment => assignment.buyerId === buyerId)
          .sort((a, b) => new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime());
      },
      // Real API call
      async () => {
        const response = await request(`/assignments/buyer/${buyerId}`);
        return response.data;
      }
    );
  },

  // Get assignment by ID
  async getAssignmentById(assignmentId: string) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(300);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        if (!assignment) {
          throw new Error('Assignment not found');
        }
        return assignment;
      },
      // Real API call
      async () => {
        const response = await request(`/assignments/${assignmentId}`);
        return response.data;
      }
    );
  },

  // Create new assignment
  async createAssignment(assignmentData: any) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(600);
        const newAssignment = {
          id: `assignment-${Date.now()}`,
          ...assignmentData,
          status: 'active',
          assignedAt: new Date().toISOString(),
          tasks: assignmentData.tasks || []
        };
        mockAssignments.push(newAssignment);
        return newAssignment;
      },
      // Real API call
      async () => {
        const response = await request('/assignments', {
          method: 'POST',
          body: JSON.stringify(assignmentData)
        });
        return response.data;
      }
    );
  },

  // Update assignment status
  async updateAssignmentStatus(assignmentId: string, status: string) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(400);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        if (!assignment) {
          throw new Error('Assignment not found');
        }
        assignment.status = status;
        if (status === 'completed') {
          assignment.completedAt = new Date().toISOString();
        }
        return assignment;
      },
      // Real API call
      async () => {
        const response = await request(`/assignments/${assignmentId}/status`, {
          method: 'PUT',
          body: JSON.stringify({ status })
        });
        return response.data;
      }
    );
  },

  // Update task completion
  async updateTaskCompletion(assignmentId: string, taskId: string, completed: boolean) {
    return withMockFallback(
      // Mock implementation
      async () => {
        await delay(300);
        const assignment = mockAssignments.find(a => a.id === assignmentId);
        if (!assignment) {
          throw new Error('Assignment not found');
        }
        const task = assignment.tasks.find(t => t.id === taskId);
        if (!task) {
          throw new Error('Task not found');
        }
        task.completed = completed;
        if (completed) {
          task.completedAt = new Date().toISOString();
        } else {
          delete task.completedAt;
        }
        return task;
      },
      // Real API call
      async () => {
        const response = await request(`/assignments/${assignmentId}/tasks/${taskId}`, {
          method: 'PUT',
          body: JSON.stringify({ completed })
        });
        return response.data;
      }
    );
  }
};