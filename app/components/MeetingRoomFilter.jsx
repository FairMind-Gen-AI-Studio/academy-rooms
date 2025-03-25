"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Search,
  Users,
  Pen,
  Video,
  MonitorSmartphone,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Mic
} from "lucide-react";

const MeetingRoomFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    capacity: 0,
    equipment: {
      projector: false,
      whiteboard: false,
      videoConference: false,
      smartBoard: false,
      microphone: false,
    },
    searchTerm: '',
  });
  
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);

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

  const resetFilters = () => {
    const resetFilters = {
      capacity: 0,
      equipment: {
        projector: false,
        whiteboard: false,
        videoConference: false,
        smartBoard: false,
        microphone: false,
      },
      searchTerm: '',
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  // Count active filters to show in the toggle button
  const countActiveFilters = () => {
    let count = 0;
    if (filters.capacity > 0) count++;
    Object.values(filters.equipment).forEach(value => {
      if (value) count++;
    });
    return count;
  };

  const activeFiltersCount = countActiveFilters();

  return (
    <Card className="w-full">
      <CardHeader className="p-4 sm:p-6">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg sm:text-xl font-bold flex items-center gap-2">
            <Search className="w-5 h-5" />
            Filtra Sale
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm"
            className="sm:hidden"
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
          >
            {isFiltersExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <>
                <ChevronDown className="h-4 w-4" />
                {activeFiltersCount > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs">
                    {activeFiltersCount}
                  </span>
                )}
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className={`p-4 sm:p-6 space-y-4 ${!isFiltersExpanded ? 'hidden sm:block' : 'block'}`}>
        <div className="space-y-2">
          <Label htmlFor="search" className="text-base flex items-center gap-2">
            <Search className="w-4 h-4" />
            Cerca Sale
          </Label>
          <Input
            id="search"
            placeholder="Cerca per nome sala..."
            value={filters.searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="space-y-2 pt-2">
          <Label className="text-base flex items-center gap-2">
            <Users className="w-4 h-4" />
            Capacità Minima: {filters.capacity} persone
          </Label>
          <Slider
            defaultValue={[0]}
            max={50}
            step={1}
            onValueChange={handleCapacityChange}
            value={[filters.capacity]}
          />
        </div>

        <div className="space-y-3 pt-2">
          <Label className="text-base">Dotazione Sala</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-lg">
              <Checkbox
                id="projector"
                checked={filters.equipment.projector}
                onCheckedChange={() => handleEquipmentChange('projector')}
              />
              <Label htmlFor="projector" className="flex items-center gap-1 text-sm">
                <Pen className="w-3.5 h-3.5" />
                Proiettore
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-lg">
              <Checkbox
                id="whiteboard"
                checked={filters.equipment.whiteboard}
                onCheckedChange={() => handleEquipmentChange('whiteboard')}
              />
              <Label htmlFor="whiteboard" className="flex items-center gap-1 text-sm">
                <Pen className="w-3.5 h-3.5" />
                Lavagna
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-lg">
              <Checkbox
                id="videoConference"
                checked={filters.equipment.videoConference}
                onCheckedChange={() => handleEquipmentChange('videoConference')}
              />
              <Label htmlFor="videoConference" className="flex items-center gap-1 text-sm">
                <Video className="w-3.5 h-3.5" />
                Video
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-lg">
              <Checkbox
                id="smartBoard"
                checked={filters.equipment.smartBoard}
                onCheckedChange={() => handleEquipmentChange('smartBoard')}
              />
              <Label htmlFor="smartBoard" className="flex items-center gap-1 text-sm">
                <MonitorSmartphone className="w-3.5 h-3.5" />
                Smart Board
              </Label>
            </div>
            <div className="flex items-center space-x-2 bg-secondary/20 p-2 rounded-lg">
              <Checkbox
                id="microphone"
                checked={filters.equipment.microphone}
                onCheckedChange={() => handleEquipmentChange('microphone')}
              />
              <Label htmlFor="microphone" className="flex items-center gap-1 text-sm">
                <Mic className="w-3.5 h-3.5" />
                Microfono
              </Label>
            </div>
          </div>
        </div>

        <div className="pt-2 flex justify-end">
          <Button 
            variant="outline" 
            size="sm"
            className="text-sm"
            onClick={resetFilters}
            disabled={activeFiltersCount === 0}
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Azzera Filtri {activeFiltersCount > 0 && `(${activeFiltersCount})`}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MeetingRoomFilter;