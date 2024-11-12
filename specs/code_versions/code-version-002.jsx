import React, { useState, useEffect } from 'react';
import { Button } from "/components/ui/button";
import { Input } from "/components/ui/input";
import { Label } from "/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "/components/ui/card";

const MeetingRoomFilter = () => {
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Conference Room A', capacity: 10, equipment: ['Projector', 'Whiteboard'] },
    { id: 2, name: 'Meeting Room B', capacity: 6, equipment: ['TV Screen', 'Conference Phone'] },
    { id: 3, name: 'Board Room', capacity: 20, equipment: ['Video Conferencing', 'Smart Board'] },
    { id: 4, name: 'Small Room', capacity: 4, equipment: ['Whiteboard'] },
    { id: 5, name: 'Large Conference Room', capacity: 30, equipment: ['Projector', 'Video Conferencing', 'Smart Board'] },
  ]);

  const [filteredRooms, setFilteredRooms] = useState(rooms);
  const [capacityFilter, setCapacityFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('capacity');

  const allEquipment = [...new Set(rooms.flatMap(room => room.equipment))];

  useEffect(() => {
    let result = rooms;

    if (searchQuery) {
      result = result.filter(room => 
        room.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (capacityFilter) {
      result = result.filter(room => room.capacity >= parseInt(capacityFilter));
    }

    if (equipmentFilter.length > 0) {
      result = result.filter(room => 
        equipmentFilter.every(eq => room.equipment.includes(eq))
      );
    }

    result.sort((a, b) => {
      if (sortBy === 'capacity') return b.capacity - a.capacity;
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      return 0;
    });

    setFilteredRooms(result);
  }, [rooms, capacityFilter, equipmentFilter, searchQuery, sortBy]);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Meeting Room Filter</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="capacity">Minimum Capacity</Label>
          <Input
            id="capacity"
            type="number"
            placeholder="Enter minimum capacity"
            value={capacityFilter}
            onChange={(e) => setCapacityFilter(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="sort">Sort By</Label>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger id="sort">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="capacity">Capacity</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="mb-6">
        <Label>Equipment</Label>
        <div className="flex flex-wrap gap-2">
          {allEquipment.map(eq => (
            <Button
              key={eq}
              variant={equipmentFilter.includes(eq) ? "default" : "outline"}
              onClick={() => setEquipmentFilter(prev => 
                prev.includes(eq) ? prev.filter(item => item !== eq) : [...prev, eq]
              )}
            >
              {eq}
            </Button>
          ))}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-lg font-semibold">Matching Rooms: {filteredRooms.length}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRooms.map(room => (
          <Card key={room.id}>
            <CardHeader>
              <CardTitle>{room.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Capacity: {room.capacity}</p>
              <p>Equipment: {room.equipment.join(', ')}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default MeetingRoomFilter;