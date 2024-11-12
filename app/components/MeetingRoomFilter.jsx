import React, { useState } from 'react';
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Slider } from "../../components/ui/slider";
import { Checkbox } from "../../components/ui/checkbox";
import {
  Search,
  Users,
  Projector,
  Pen,
  Video,
  MonitorSmartphone,
  RotateCcw
} from "lucide-react";

const MeetingRoomFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    capacity: 0,
    equipment: {
      projector: false,
      whiteboard: false,
      videoConference: false,
      smartBoard: false,
    },
    searchTerm: '',
  });

  const handleEquipmentChange = (equipment) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        equipment: {
          ...prev.equipment,
          [equipment]: !prev.equipment[equipment]
        }
      };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleCapacityChange = (value) => {
    setFilters(prev => {
      const newFilters = { ...prev, capacity: value[0] };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  const handleSearchChange = (e) => {
    setFilters(prev => {
      const newFilters = { ...prev, searchTerm: e.target.value };
      onFilterChange(newFilters);
      return newFilters;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <Search className="w-6 h-6" />
          Filtra Sale Riunioni
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-6">
        <div className="space-y-2">
          <Label htmlFor="search" className="text-lg flex items-center gap-2">
            <Search className="w-4 h-4" />
            Cerca Sale
          </Label>
          <Input
            id="search"
            placeholder="Cerca per nome sala..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
            className="text-lg"
          />
        </div>

        <div className="space-y-4">
          <Label className="text-lg flex items-center gap-2">
            <Users className="w-4 h-4" />
            Capacità Minima: {filters.capacity} persone
          </Label>
          <Slider
            defaultValue={[0]}
            max={50}
            step={1}
            onValueChange={handleCapacityChange}
          />
        </div>

        <div className="space-y-4">
          <Label className="text-lg">Dotazione Sala</Label>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-lg">
              <Checkbox
                id="projector"
                checked={filters.equipment.projector}
                onCheckedChange={() => handleEquipmentChange('projector')}
              />
              <Label htmlFor="projector" className="flex items-center gap-2">
                <Projector className="w-4 h-4" />
                Proiettore
              </Label>
            </div>
            <div className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-lg">
              <Checkbox
                id="whiteboard"
                checked={filters.equipment.whiteboard}
                onCheckedChange={() => handleEquipmentChange('whiteboard')}
              />
              <Label htmlFor="whiteboard" className="flex items-center gap-2">
                <Pen className="w-4 h-4" />
                Lavagna
              </Label>
            </div>
            <div className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-lg">
              <Checkbox
                id="videoConference"
                checked={filters.equipment.videoConference}
                onCheckedChange={() => handleEquipmentChange('videoConference')}
              />
              <Label htmlFor="videoConference" className="flex items-center gap-2">
                <Video className="w-4 h-4" />
                Video Conferenza
              </Label>
            </div>
            <div className="flex items-center space-x-3 bg-secondary/20 p-3 rounded-lg">
              <Checkbox
                id="smartBoard"
                checked={filters.equipment.smartBoard}
                onCheckedChange={() => handleEquipmentChange('smartBoard')}
              />
              <Label htmlFor="smartBoard" className="flex items-center gap-2">
                <MonitorSmartphone className="w-4 h-4" />
                Smart Board
              </Label>
            </div>
          </div>
        </div>

        <Button 
          variant="outline" 
          className="w-full text-lg"
          onClick={() => {
            const resetFilters = {
              capacity: 0,
              equipment: {
                projector: false,
                whiteboard: false,
                videoConference: false,
                smartBoard: false,
              },
              searchTerm: '',
            };
            setFilters(resetFilters);
            onFilterChange(resetFilters);
          }}
        >
          <RotateCcw className="w-4 h-4" />
          Azzera Filtri
        </Button>
      </CardContent>
    </Card>
  );
};

export default MeetingRoomFilter; 