import React, { useState } from 'react';
import { Button } from "/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";

const MeetingRoomReservation = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [participants, setParticipants] = useState('');

  const rooms = [
    { id: 1, name: 'Conference Room A', capacity: 10, equipment: 'Projector, Whiteboard' },
    { id: 2, name: 'Meeting Room B', capacity: 6, equipment: 'TV Screen, Conference Phone' },
    { id: 3, name: 'Board Room', capacity: 20, equipment: 'Video Conferencing, Smart Board' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would implement the logic to validate availability and send invitations
    console.log('Reservation submitted:', { selectedRoom, date, time, participants });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meeting Room Reservation</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Available Rooms</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {rooms.map((room) => (
                <li key={room.id} className="border p-2 rounded">
                  <h3 className="font-semibold">{room.name}</h3>
                  <p>Capacity: {room.capacity}</p>
                  <p>Equipment: {room.equipment}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Make a Reservation</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="room">Select Room</Label>
                <Select value={selectedRoom} onValueChange={setSelectedRoom}>
                  <SelectTrigger id="room">
                    <SelectValue placeholder="Choose a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.name}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="participants">Participants (comma-separated)</Label>
                <Input
                  id="participants"
                  type="text"
                  value={participants}
                  onChange={(e) => setParticipants(e.target.value)}
                  placeholder="john@example.com, jane@example.com"
                />
              </div>
              <Button type="submit">Reserve Room</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MeetingRoomReservation;