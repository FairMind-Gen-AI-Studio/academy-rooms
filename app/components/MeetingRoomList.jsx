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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center py-4">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Meeting Rooms</h1>
          <span className="text-sm text-slate-600 bg-white px-3 py-1 rounded-full shadow-sm">
            {filteredRooms.length} room(s) found
          </span>
        </div>
      
      <MeetingRoomFilter onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredRooms.map(room => (
          <div 
            key={room.id} 
            className={`bg-white border border-slate-200 p-6 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-lg hover:border-blue-300 ${
              selectedRoom?.id === room.id ? 'border-blue-500 shadow-md ring-2 ring-blue-100' : ''
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <h3 className="font-semibold text-lg text-slate-800 mb-2">{room.name}</h3>
            <p className="text-slate-600 mb-1">Capacity: <span className="font-medium">{room.capacity}</span></p>
            <p className="text-slate-600">Equipment: <span className="font-medium">{room.equipment.join(', ')}</span></p>
          </div>
        ))}
      </div>

      <MeetingRoomCalendar selectedRoom={selectedRoom} />
      </div>
    </div>
  );
};

export default MeetingRoomList;  