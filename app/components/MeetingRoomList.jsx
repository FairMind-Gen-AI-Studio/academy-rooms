"use client";

import React, { useState } from 'react';
import MeetingRoomFilter from './MeetingRoomFilter';
import MeetingRoomCalendar from './MeetingRoomCalendar';

const MeetingRoomList = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Conference Room A', capacity: 10, equipment: ['projector', 'whiteboard'] },
    { id: 2, name: 'Meeting Room B', capacity: 6, equipment: ['smartBoard'] },
    { id: 3, name: 'Board Room', capacity: 20, equipment: ['videoConference', 'smartBoard'] },
  ]);
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleFilterChange = (filters) => {
    const filtered = rooms.filter(room => {
      const matchesSearch = room.name.toLowerCase().includes(filters.searchTerm.toLowerCase());
      const matchesCapacity = room.capacity >= filters.capacity;
      const matchesEquipment = Object.entries(filters.equipment)
        .filter(([, isSelected]) => isSelected)
        .every(([equipment]) => room.equipment.includes(equipment));

      return matchesSearch && matchesCapacity && matchesEquipment;
    });

    setFilteredRooms(filtered);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meeting Rooms</h1>
        <span className="text-sm text-gray-500">
          {filteredRooms.length} room(s) found
        </span>
      </div>
      
      <MeetingRoomFilter onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRooms.map(room => (
          <div 
            key={room.id} 
            className={`border p-4 rounded-lg cursor-pointer transition-colors ${
              selectedRoom?.id === room.id ? 'border-primary' : ''
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <h3 className="font-semibold">{room.name}</h3>
            <p>Capacity: {room.capacity}</p>
            <p>Equipment: {room.equipment.join(', ')}</p>
          </div>
        ))}
      </div>

      <MeetingRoomCalendar selectedRoom={selectedRoom} />
    </div>
  );
};

export default MeetingRoomList; 