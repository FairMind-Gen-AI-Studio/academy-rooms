import React, { useState, useEffect } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import { Card, CardContent } from "/components/ui/card";

const MeetingRoomCalendar = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Small Room 1', type: 'small' },
    { id: 2, name: 'Medium Room 1', type: 'medium' },
    { id: 3, name: 'Large Room 1', type: 'large' },
  ]);

  const [reservations, setReservations] = useState([
    { id: 1, roomId: 1, start: new Date(2023, 5, 1, 9), end: new Date(2023, 5, 1, 11), status: 'booked', organizer: 'John Doe', notes: 'Team meeting' },
    { id: 2, roomId: 2, start: new Date(2023, 5, 1, 14), end: new Date(2023, 5, 1, 16), status: 'tentative', organizer: 'Jane Smith', notes: 'Client call' },
  ]);

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [searchQuery, setSearchQuery] = useState('');
  const [roomTypeFilter, setRoomTypeFilter] = useState('all');
  const [timeZone, setTimeZone] = useState('UTC');

  useEffect(() => {
    let filtered = rooms;
    if (searchQuery) {
      filtered = filtered.filter(room => room.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }
    if (roomTypeFilter !== 'all') {
      filtered = filtered.filter(room => room.type === roomTypeFilter);
    }
    setFilteredRooms(filtered);
  }, [rooms, searchQuery, roomTypeFilter]);

  const getDayStatus = (roomId, date) => {
    const dayReservations = reservations.filter(
      res => res.roomId === roomId && 
      res.start.getDate() === date.getDate() && 
      res.start.getMonth() === date.getMonth() && 
      res.start.getFullYear() === date.getFullYear()
    );

    if (dayReservations.some(res => res.status === 'booked')) return 'booked';
    if (dayReservations.some(res => res.status === 'tentative')) return 'tentative';
    return 'available';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-500';
      case 'tentative': return 'bg-yellow-500';
      case 'available': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const renderCalendar = () => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return day;
    });

    return (
      <div className="grid grid-cols-[200px_repeat(7,1fr)] gap-1">
        <div className="font-bold">Rooms</div>
        {days.map(day => (
          <div key={day.toISOString()} className="font-bold text-center">
            {day.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </div>
        ))}
        {filteredRooms.map(room => (
          <React.Fragment key={room.id}>
            <div>{room.name}</div>
            {days.map(day => {
              const status = getDayStatus(room.id, day);
              return (
                <div 
                  key={`${room.id}-${day.toISOString()}`} 
                  className={`h-8 ${getStatusColor(status)} cursor-pointer`}
                  title={`${room.name} - ${status}`}
                  onClick={() => alert(`Room: ${room.name}\nDate: ${day.toLocaleDateString()}\nStatus: ${status}`)}
                />
              );
            })}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Meeting Room Availability Calendar</h1>
      <div className="flex space-x-4 mb-4">
        <Input 
          type="text" 
          placeholder="Search rooms..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-64"
        />
        <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Room type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All types</SelectItem>
            <SelectItem value="small">Small</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="large">Large</SelectItem>
          </SelectContent>
        </Select>
        <Select value={timeZone} onValueChange={setTimeZone}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time zone" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="UTC">UTC</SelectItem>
            <SelectItem value="EST">EST</SelectItem>
            <SelectItem value="PST">PST</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardContent>
          {renderCalendar()}
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingRoomCalendar;