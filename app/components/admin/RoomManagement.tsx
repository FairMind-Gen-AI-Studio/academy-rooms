"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/app/actions/rooms';

type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'maintenance';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async () => {
    try {
      // Check if room name already exists
      if (rooms.some(room => room.name === newRoom.name)) {
        setError('Room name must be unique');
        return;
      }

      await createRoom(newRoom);
      
      // Optimistically update UI
      const roomToAdd = { ...newRoom, id: Date.now().toString() };
      setRooms([...rooms, roomToAdd]);
      
      // Reset form
      setNewRoom({ name: '', capacity: 0, equipment: [], status: 'available' });
      setError(null);
      
      // Reload rooms to get the actual data from server
      loadRooms();
    } catch (err) {
      setError('Failed to add room');
      console.error('Failed to add room:', err);
    }
  };

  const handleUpdateRoom = async (id: string, updatedData: Partial<Room>) => {
    try {
      // Check if updated name already exists and is not the current room
      if (
        updatedData.name && 
        rooms.some(room => room.name === updatedData.name && room.id !== id)
      ) {
        setError('Room name must be unique');
        return;
      }

      await updateRoom(id, updatedData);
      
      // Optimistically update UI
      setRooms(rooms.map(room => room.id === id ? { ...room, ...updatedData } : room));
      setError(null);
      
      // Reload rooms to get the actual data from server
      loadRooms();
    } catch (err) {
      setError('Failed to update room');
      console.error('Failed to update room:', err);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this room?')) {
        return;
      }
      
      await deleteRoom(id);
      
      // Optimistically update UI
      setRooms(rooms.filter(room => room.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete room');
      console.error('Failed to delete room:', err);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (capacityFilter === '' || room.capacity >= parseInt(capacityFilter)) &&
    (equipmentFilter === '' || room.equipment.includes(equipmentFilter))
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity || ''}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
            />
            <Input
              placeholder="Equipment (comma-separated)"
              value={newRoom.equipment.join(', ')}
              onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value.split(', ').filter(item => item.trim() !== '') })}
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

      <Card>
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
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
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No rooms found matching your criteria
          </div>
        ) : (
          filteredRooms.map(room => (
            <Card key={room.id}>
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p>Capacity: {room.capacity}</p>
                  <p>Equipment: {room.equipment.join(', ')}</p>
                  <p>Status: {room.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedName = prompt('Enter new room name', room.name);
                      if (updatedName) handleUpdateRoom(room.id, { name: updatedName });
                    }}
                  >
                    Edit Name
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedCapacity = prompt('Enter new capacity', room.capacity.toString());
                      if (updatedCapacity) handleUpdateRoom(room.id, { capacity: parseInt(updatedCapacity) });
                    }}
                  >
                    Edit Capacity
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedEquipment = prompt('Enter equipment (comma-separated)', room.equipment.join(', '));
                      if (updatedEquipment) {
                        handleUpdateRoom(room.id, { 
                          equipment: updatedEquipment.split(', ').filter(item => item.trim() !== '') 
                        });
                      }
                    }}
                  >
                    Edit Equipment
                  </Button>
                  <Select
                    value={room.status}
                    onValueChange={(value: 'available' | 'booked' | 'maintenance') => 
                      handleUpdateRoom(room.id, { status: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}