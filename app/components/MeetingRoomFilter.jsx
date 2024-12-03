"use client";

import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import debounce from 'lodash/debounce';

const EQUIPMENT_OPTIONS = {
  projector: 'Proiettore',
  whiteboard: 'Lavagna',
  videoConference: 'Video Conferenza',
  smartBoard: 'Smart Board'
};

const MeetingRoomFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    searchTerm: '',
    capacity: 0,
    equipment: Object.keys(EQUIPMENT_OPTIONS).reduce((acc, key) => ({
      ...acc,
      [key]: false
    }), {})
  });

  const debouncedFilterChange = debounce((newFilters) => {
    onFilterChange(newFilters);
  }, 300);

  useEffect(() => {
    debouncedFilterChange(filters);
    return () => debouncedFilterChange.cancel();
  }, [filters]);

  const handleEquipmentChange = (equipment) => {
    setFilters(prev => ({
      ...prev,
      equipment: {
        ...prev.equipment,
        [equipment]: !prev.equipment[equipment]
      }
    }));
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg">
      <div className="space-y-2">
        <Label htmlFor="search">Cerca sala</Label>
        <Input
          id="search"
          type="text"
          placeholder="Nome sala..."
          value={filters.searchTerm}
          onChange={e => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="capacity">Capacità minima</Label>
        <Input
          id="capacity"
          type="number"
          min="0"
          value={filters.capacity}
          onChange={e => setFilters(prev => ({ ...prev, capacity: parseInt(e.target.value) || 0 }))}
        />
      </div>

      <div className="space-y-2">
        <Label>Attrezzatura</Label>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(EQUIPMENT_OPTIONS).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={filters.equipment[key]}
                onCheckedChange={() => handleEquipmentChange(key)}
              />
              <Label htmlFor={key} className="cursor-pointer">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MeetingRoomFilter; 