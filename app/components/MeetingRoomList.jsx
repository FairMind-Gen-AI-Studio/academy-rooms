"use client";

import React, { useState, useEffect } from 'react';
import MeetingRoomFilter from './MeetingRoomFilter';
import MeetingRoomCalendar from './MeetingRoomCalendar';
import { getRooms } from '@/app/actions/rooms';

const MeetingRoomList = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      const data = await getRooms();
      setRooms(data);
      setFilteredRooms(data);
    } catch (error) {
      console.error('Failed to load rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = async (filters) => {
    try {
      console.log('Sending filters:', {
        capacity: filters.capacity || undefined,
        equipment: Object.entries(filters.equipment)
          .filter(([, isSelected]) => isSelected)
          .map(([equipment]) => equipment),
        search: filters.searchTerm || undefined
      });
      
      const data = await getRooms({
        capacity: filters.capacity || undefined,
        equipment: Object.entries(filters.equipment)
          .filter(([, isSelected]) => isSelected)
          .map(([equipment]) => equipment),
        search: filters.searchTerm || undefined
      });
      console.log('Received data:', data);
      setFilteredRooms(data);
    } catch (error) {
      console.error('Failed to filter rooms:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

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

      {selectedRoom && <MeetingRoomCalendar selectedRoom={selectedRoom} />}
    </div>
  );
};

export default MeetingRoomList; 