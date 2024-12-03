import { render, screen } from '@testing-library/react'
import MeetingRoomList from './MeetingRoomList'

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

describe('MeetingRoomList', () => {
  it('renders meeting rooms', async () => {
    render(<MeetingRoomList />)
    const roomElement = await screen.findByText('Test Room')
    expect(roomElement).toBeInTheDocument()
  })
}) 