import React, { useState, useEffect } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";

type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'booked' | 'maintenance';
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: '',
    capacity: 0,
    equipment: [],
    status: 'available',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');

  useEffect(() => {
    // Simulate fetching rooms from an API
    const fetchedRooms: Room[] = [
      { id: '1', name: 'Conference Room A', capacity: 20, equipment: ['Projector', 'Whiteboard'], status: 'available' },
      { id: '2', name: 'Meeting Room B', capacity: 10, equipment: ['TV', 'Webcam'], status: 'booked' },
    ];
    setRooms(fetchedRooms);
  }, []);

  const addRoom = () => {
    if (rooms.some(room => room.name === newRoom.name)) {
      alert('Room name must be unique');
      return;
    }
    const roomToAdd = { ...newRoom, id: Date.now().toString() };
    setRooms([...rooms, roomToAdd]);
    setNewRoom({ name: '', capacity: 0, equipment: [], status: 'available' });
  };

  const updateRoom = (id: string, updatedRoom: Partial<Room>) => {
    setRooms(rooms.map(room => room.id === id ? { ...room, ...updatedRoom } : room));
  };

  const deleteRoom = (id: string) => {
    setRooms(rooms.filter(room => room.id !== id));
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (capacityFilter === '' || room.capacity >= parseInt(capacityFilter)) &&
    (equipmentFilter === '' || room.equipment.includes(equipmentFilter))
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Room Management</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-4">
            <Input
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity || ''}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) })}
            />
            <Input
              placeholder="Equipment (comma-separated)"
              value={newRoom.equipment.join(', ')}
              onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value.split(', ') })}
            />
            <Select
              value={newRoom.status}
              onValueChange={(value: 'available' | 'booked' | 'maintenance') => setNewRoom({ ...newRoom, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addRoom}>Add Room</Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Min Capacity"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
            />
            <Input
              placeholder="Equipment"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredRooms.map(room => (
          <Card key={room.id}>
            <CardContent className="flex justify-between items-center p-4">
              <div>
                <h3 className="text-lg font-semibold">{room.name}</h3>
                <p>Capacity: {room.capacity}</p>
                <p>Equipment: {room.equipment.join(', ')}</p>
                <p>Status: {room.status}</p>
              </div>
              <div>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => {
                    const updatedName = prompt('Enter new room name', room.name);
                    if (updatedName) updateRoom(room.id, { name: updatedName });
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => deleteRoom(room.id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}