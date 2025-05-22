/// <reference types="jest" />

import { render, screen } from '@testing-library/react'
import MeetingRoomList from './MeetingRoomList'

// Mock the entire rooms module
jest.mock('../actions/rooms', () => ({
  getRooms: jest.fn().mockResolvedValue([
    {
      id: 1,
      name: 'Test Room',
      capacity: 10,
      equipment: ['projector']
    }
  ])
}))

// Mock Clerk to prevent ES module issues
jest.mock('@clerk/nextjs/server', () => ({
  currentUser: jest.fn().mockResolvedValue({ id: 'test-user-id' })
}))

// Mock reservations to prevent ES module issues
jest.mock('../actions/reservations', () => ({
  getReservations: jest.fn().mockResolvedValue([])
}))

describe('MeetingRoomList', () => {
  it('renders meeting rooms', async () => {
    render(<MeetingRoomList />)
    const roomElement = await screen.findByText('Test Room')
    expect(roomElement).toBeInTheDocument()
  })
})