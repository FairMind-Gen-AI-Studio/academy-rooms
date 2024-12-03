import { getRooms } from './rooms'
import { createClient } from '@/utils/supabase/server'

// Mock the entire server module
jest.mock('@/utils/supabase/server', () => ({
  createClient: jest.fn(() => ({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    order: jest.fn().mockResolvedValue({
      data: [
        {
          id: 1,
          name: 'Test Room',
          capacity: 10,
          equipment: ['projector']
        }
      ],
      error: null
    })
  }))
}))

describe('Room actions', () => {
  it('should fetch rooms', async () => {
    const rooms = await getRooms()
    expect(rooms).toEqual([
      {
        id: 1,
        name: 'Test Room',
        capacity: 10,
        equipment: ['projector']
      }
    ])
  })
}) 