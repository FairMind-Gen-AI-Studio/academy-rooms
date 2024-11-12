"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import BookingModal from './BookingModal';

const MeetingRoomCalendar = ({ selectedRoom }) => {
  const [reservations, setReservations] = useState([
    { 
      id: 1, 
      roomId: 1, 
      start: new Date(2024, 2, 20, 9), 
      end: new Date(2024, 2, 20, 11), 
      status: 'booked', 
      organizer: 'John Doe', 
      notes: 'Team meeting' 
    },
    { 
      id: 2, 
      roomId: 2, 
      start: new Date(2024, 2, 21, 14), 
      end: new Date(2024, 2, 21, 16), 
      status: 'tentative', 
      organizer: 'Jane Smith', 
      notes: 'Client call' 
    },
  ]);

  const [timeZone, setTimeZone] = useState('UTC');

  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'booked': return 'bg-red-500';
      case 'tentative': return 'bg-yellow-500';
      case 'available': return 'bg-green-500';
      default: return 'bg-gray-200';
    }
  };

  const getDayStatus = (date) => {
    const dayReservations = reservations.filter(
      res => 
        res.roomId === selectedRoom?.id && 
        res.start.getDate() === date.getDate() && 
        res.start.getMonth() === date.getMonth() && 
        res.start.getFullYear() === date.getFullYear()
    );

    if (dayReservations.some(res => res.status === 'booked')) return 'booked';
    if (dayReservations.some(res => res.status === 'tentative')) return 'tentative';
    return 'available';
  };

  const handleSlotClick = (day, reservation) => {
    setSelectedDate(day);
    setSelectedReservation(reservation);
    setIsModalOpen(true);
  };

  const handleBooking = (bookingData) => {
    setReservations(prev => {
      const newReservations = [...prev];
      if (selectedReservation) {
        const index = newReservations.findIndex(r => r.id === selectedReservation.id);
        newReservations[index] = { ...bookingData, id: selectedReservation.id, roomId: selectedRoom.id };
      } else {
        newReservations.push({
          ...bookingData,
          id: Math.max(...prev.map(r => r.id)) + 1,
          roomId: selectedRoom.id
        });
      }
      return newReservations;
    });
    setIsModalOpen(false);
  };

  const handleDelete = (reservationId) => {
    setReservations(prev => prev.filter(r => r.id !== reservationId));
    setIsModalOpen(false);
  };

  const renderCalendar = () => {
    const today = new Date();
    const days = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      return day;
    });

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-2">
          {days.map(day => (
            <div key={day.toISOString()} className="text-center font-semibold">
              {day.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
            </div>
          ))}
          {days.map(day => {
            const status = getDayStatus(day);
            return (
              <div 
                key={day.toISOString()} 
                className={`h-20 ${getStatusColor(status)} rounded-md p-2 cursor-pointer transition-colors`}
                onClick={() => {
                  const reservation = reservations.find(r => 
                    r.roomId === selectedRoom?.id && 
                    r.start.getDate() === day.getDate()
                  );
                  handleSlotClick(day, reservation);
                }}
              />
            );
          })}
        </div>
      </div>
    );
  };

  if (!selectedRoom) {
    return <div className="text-center p-4">Please select a room to view its calendar</div>;
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{selectedRoom.name} - Calendar</h2>
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
        {renderCalendar()}
      </CardContent>
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        date={selectedDate}
        existingReservation={selectedReservation}
        onBook={handleBooking}
        onDelete={handleDelete}
      />
    </Card>
  );
};

export default MeetingRoomCalendar; 