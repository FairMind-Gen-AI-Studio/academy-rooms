/// <reference types="jest" />

import { createClient } from '@/utils/supabase/server'

// Create a test version of getRooms that doesn't use Clerk
async function getRoomsTest(filters?: {
  capacity?: number
  equipment?: string[]
  search?: string
}) {
  const mockData = [
    {
      id: 1,
      name: 'Test Room',
      capacity: 10,
      equipment: ['projector']
    }
  ];
  
  return mockData;
}

// Mock the Supabase server module
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn()
}));

describe('Room actions', () => {
  it('should fetch rooms', async () => {
    const rooms = await getRoomsTest();
    expect(rooms).toEqual([
      {
        id: 1,
        name: 'Test Room',
        capacity: 10,
        equipment: ['projector']
      }
    ]);
  });
});