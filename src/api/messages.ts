import { USE_MOCKS, withMockFallback } from '@/utils/mockWrapper';
import { request } from '@/utils/api';
import { Conversation, Message } from '@/types/api';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Business rule validation function
function validateMessageParticipants(senderRole: string, recipientRole: string): boolean {
  // No direct buyer-seller communication allowed
  if ((senderRole === 'buyer' && recipientRole === 'seller') ||
      (senderRole === 'seller' && recipientRole === 'buyer')) {
    return false;
  }
  
  // Valid combinations: buyer-agent, agent-seller, agent-agent
  const validCombinations = [
    ['buyer', 'agent'],
    ['agent', 'buyer'],
    ['agent', 'seller'],
    ['seller', 'agent'],
    ['agent', 'agent']
  ];
  
  return validCombinations.some(([role1, role2]) => 
    (senderRole === role1 && recipientRole === role2)
  );
}

// Mock conversation data with business rules enforcement
const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    type: 'buyer_agent',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    participants: [
      { userId: 'buyer-1', name: 'John Doe', role: 'buyer', email: 'john@example.com' },
      { userId: 'agent-1', name: 'Sarah Johnson', role: 'agent', email: 'sarah@example.com' }
    ],
    lastMessage: {
      id: 'msg-2',
      senderId: 'agent-1',
      messageText: 'I\'d be happy to show you the property this weekend.',
      timestamp: '2024-01-20T11:15:00Z'
    },
    unreadCount: 1,
    createdAt: '2024-01-20T10:30:00Z',
    updatedAt: '2024-01-20T11:15:00Z'
  },
  {
    id: 'conv-2',
    type: 'agent_seller',
    propertyId: '1',
    propertyTitle: 'Modern Downtown Condo',
    participants: [
      { userId: 'agent-1', name: 'Sarah Johnson', role: 'agent', email: 'sarah@example.com' },
      { userId: 'seller-1', name: 'Mike Wilson', role: 'seller', email: 'mike@example.com' }
    ],
    lastMessage: {
      id: 'msg-4',
      senderId: 'seller-1',
      messageText: 'The property is available for viewing this weekend.',
      timestamp: '2024-01-20T12:00:00Z'
    },
    unreadCount: 0,
    createdAt: '2024-01-20T09:00:00Z',
    updatedAt: '2024-01-20T12:00:00Z'
  }
];

const mockMessages: Message[] = [
  {
    id: 'msg-1',
    conversationId: 'conv-1',
    senderId: 'buyer-1',
    messageText: 'Hi, I\'m interested in the property at 123 Main St. Can we schedule a viewing?',
    timestamp: '2024-01-20T10:30:00Z',
    read: true
  },
  {
    id: 'msg-2',
    conversationId: 'conv-1',
    senderId: 'agent-1',
    messageText: 'I\'d be happy to show you the property this weekend.',
    timestamp: '2024-01-20T11:15:00Z',
    read: false
  },
  {
    id: 'msg-3',
    conversationId: 'conv-2',
    senderId: 'agent-1',
    messageText: 'I have a potential buyer interested in your property.',
    timestamp: '2024-01-20T11:30:00Z',
    read: true
  },
  {
    id: 'msg-4',
    conversationId: 'conv-2',
    senderId: 'seller-1',
    messageText: 'The property is available for viewing this weekend.',
    timestamp: '2024-01-20T12:00:00Z',
    read: true
  }
];

// Get conversations for a user
export async function getConversations(userId: string, userRole?: string): Promise<Conversation[]> {
  return withMockFallback(
    // Mock implementation
    async () => {
      await delay(500);
      return mockConversations.filter(conv => 
        conv.participants.some(p => p.userId === userId)
      );
    },
    // Real API call
    async () => {
      const response = await request(`/api/messages?userId=${userId}&userRole=${userRole}`);
      return response.data;
    }
  );
}

// Get messages in a conversation
export async function getConversationMessages(conversationId: string): Promise<Message[]> {
  return withMockFallback(
    // Mock implementation
    async () => {
      await delay(400);
      return mockMessages
        .filter(msg => msg.conversationId === conversationId)
        .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    },
    // Real API call
    async () => {
      const response = await request(`/api/messages/${conversationId}`);
      return response.data;
    }
  );
}

// Send a message with business rules enforcement
export async function sendMessage(messageData: {
  conversationId?: string;
  senderId: string;
  senderRole: string;
  recipientId?: string;
  recipientRole?: string;
  messageText: string;
  propertyId?: string;
}): Promise<Message> {
  // Validate business rules before sending
  if (messageData.recipientRole && !validateMessageParticipants(messageData.senderRole, messageData.recipientRole)) {
    throw new Error('Direct communication between buyers and sellers is not allowed. Please communicate through an agent.');
  }

  return withMockFallback(
    // Mock implementation
    async () => {
      await delay(600);
      const newMessage: Message = {
        id: `msg-${Date.now()}`,
        conversationId: messageData.conversationId || `conv-${Date.now()}`,
        senderId: messageData.senderId,
        messageText: messageData.messageText,
        timestamp: new Date().toISOString(),
        read: false
      };
      
      mockMessages.push(newMessage);
      
      // Update conversation's last message
      const conversation = mockConversations.find(c => c.id === newMessage.conversationId);
      if (conversation) {
        conversation.lastMessage = {
          id: newMessage.id,
          senderId: newMessage.senderId,
          messageText: newMessage.messageText,
          timestamp: newMessage.timestamp
        };
        conversation.updatedAt = newMessage.timestamp;
      }
      
      return newMessage;
    },
    // Real API call
    async () => {
      const response = await request('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(messageData)
      });
      return response.data;
    }
  );
}

// Mark conversation as read
export async function markConversationAsRead(conversationId: string, userId?: string): Promise<void> {
  return withMockFallback(
    // Mock implementation
    async () => {
      await delay(200);
      mockMessages.forEach(msg => {
        if (msg.conversationId === conversationId && msg.senderId !== userId) {
          msg.read = true;
        }
      });
      
      // Update conversation unread count
      const conversation = mockConversations.find(c => c.id === conversationId);
      if (conversation) {
        conversation.unreadCount = 0;
      }
    },
    // Real API call
    async () => {
      await request(`/api/messages/${conversationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId })
      });
    }
  );
}

// Create a new conversation with business rules enforcement
export async function createConversation(conversationData: {
  type: 'buyer_agent' | 'agent_seller';
  participantIds: string[];
  propertyId: string;
  initialMessage: string;
}): Promise<{ success: boolean; conversation?: Conversation; error?: string }> {
  // Validate conversation type matches business rules
  if (!['buyer_agent', 'agent_seller'].includes(conversationData.type)) {
    return {
      success: false,
      error: 'Invalid conversation type. Only buyer-agent and agent-seller conversations are allowed.'
    };
  }

  return withMockFallback(
    // Mock implementation
    async () => {
      await delay(500);
      const newConversation: Conversation = {
        id: `conv-${Date.now()}`,
        type: conversationData.type,
        propertyId: conversationData.propertyId,
        propertyTitle: 'Property Title', // Would be fetched from property data
        participants: [
          // Mock participants - in real implementation, fetch user details
          { userId: conversationData.participantIds[0], name: 'User 1', role: 'buyer', email: 'user1@example.com' },
          { userId: conversationData.participantIds[1], name: 'User 2', role: 'agent', email: 'user2@example.com' }
        ],
        lastMessage: {
          id: `msg-${Date.now()}`,
          senderId: conversationData.participantIds[0],
          messageText: conversationData.initialMessage,
          timestamp: new Date().toISOString()
        },
        unreadCount: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      mockConversations.push(newConversation);
      
      return {
        success: true,
        conversation: newConversation
      };
    },
    // Real API call
    async () => {
      const response = await request('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(conversationData)
      });
      return response;
    }
  );
}

// Legacy API for backward compatibility
export const messagesApi = {
  getThreads: (userId: string) => getConversations(userId),
  getMessages: (threadId: string) => getConversationMessages(threadId),
  sendMessage: (messageData: any) => sendMessage(messageData),
  markAsRead: (threadId: string, userId: string) => markConversationAsRead(threadId, userId),
  createThread: (threadData: any) => createConversation(threadData)
};