"use client";

import React, { useState } from 'react';
import MeetingRoomFilter from './MeetingRoomFilter';
import MeetingRoomCalendar from './MeetingRoomCalendar';

const MeetingRoomList = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Conference Room A', capacity: 10, equipment: ['projector', 'whiteboard'] },
    { id: 2, name: 'Meeting Room B', capacity: 6, equipment: ['smartBoard'] },
    { id: 3, name: 'Board Room', capacity: 20, equipment: ['videoConference', 'smartBoard'] },
    { id: 4, name: 'Sala Riunioni 1', capacity: 8, equipment: ['projector', 'whiteboard'] },
    { id: 5, name: 'Sala Conferenze', capacity: 30, equipment: ['videoConference', 'projector', 'microphone'] },
  ]);
  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Responsive hook for small screens
  React.useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkScreenSize();
    
    // Add event listener
    window.addEventListener('resize', checkScreenSize);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h2 className="text-xl font-semibold">Sale Disponibili</h2>
        <span className="text-sm text-muted-foreground">
          {filteredRooms.length} sala/e trovata/e
        </span>
      </div>
      
      <MeetingRoomFilter onFilterChange={handleFilterChange} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRooms.map(room => (
          <div 
            key={room.id} 
            className={`border p-4 rounded-lg cursor-pointer transition-colors hover:border-primary hover:bg-card/50 ${
              selectedRoom?.id === room.id ? 'border-primary bg-card/50' : ''
            }`}
            onClick={() => setSelectedRoom(room)}
          >
            <h3 className="font-semibold">{room.name}</h3>
            <div className="mt-2 text-sm text-muted-foreground">
              <p>Capacità: {room.capacity} persone</p>
              <p className="mt-1">
                <span className="inline-block">Dotazione:</span>{' '}
                <span className="inline-flex flex-wrap gap-1">
                  {room.equipment.map((item, i) => (
                    <span key={i} className="rounded-full bg-secondary px-2 py-0.5 text-xs">
                      {item}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {isMobile && selectedRoom && (
        <div className="sticky bottom-4 right-4 z-10 w-full flex justify-end">
          <button 
            onClick={() => setSelectedRoom(null)}
            className="rounded-full bg-primary text-primary-foreground p-2 shadow-lg"
          >
            Torna alla lista
          </button>
        </div>
      )}

      <MeetingRoomCalendar selectedRoom={selectedRoom} />
    </div>
  );
};

export default MeetingRoomList;