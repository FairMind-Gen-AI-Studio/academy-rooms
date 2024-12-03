"use client";

import React, { useState, useEffect } from 'react';
import { Calendar } from "@/components/ui/calendar";
import BookingModal from './BookingModal';
import { getReservations } from '@/app/actions/reservations';

const MeetingRoomCalendar = ({ selectedRoom }) => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedRoom) {
      loadReservations();
    }
  }, [selectedRoom, date]);

  const loadReservations = async () => {
    if (!selectedRoom) return;
    
    setLoading(true);
    try {
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1).toISOString();
      const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0).toISOString();
      
      const data = await getReservations({
        room_id: selectedRoom.id,
        start_date: startDate,
        end_date: endDate
      });
      
      setReservations(data);
    } catch (error) {
      console.error('Failed to load reservations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDayClick = (day) => {
    setDate(day);
    setSelectedReservation(null);
    setShowModal(true);
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
    setDate(new Date(reservation.start_time));
    setShowModal(true);
  };

  if (!selectedRoom) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        Seleziona una sala per vedere il calendario
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold mb-4">
        Calendario: {selectedRoom.name}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border"
          />
          <button
            onClick={() => {
              setSelectedReservation(null);
              setShowModal(true);
            }}
            className="w-full mt-4 bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
          >
            Prenota per il {date.toLocaleDateString()}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Prenotazioni del {date.toLocaleDateString()}</h3>
          {loading ? (
            <div>Caricamento...</div>
          ) : reservations
              .filter(res => {
                const resDate = new Date(res.start_time);
                return resDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
              })
              .length === 0 ? (
            <div className="text-muted-foreground">
              Nessuna prenotazione per questa data
            </div>
          ) : (
            <div className="space-y-2">
              {reservations
                .filter(res => {
                  const resDate = new Date(res.start_time);
                  return resDate.toISOString().split('T')[0] === date.toISOString().split('T')[0];
                })
                .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
                .map(reservation => (
                  <div
                    key={reservation.id}
                    onClick={() => handleReservationClick(reservation)}
                    className="p-3 border rounded-md cursor-pointer hover:bg-muted"
                  >
                    <div className="font-medium">{reservation.organizer}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(reservation.start_time).toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        timeZone: 'UTC'  // Forza UTC
                      })} - 
                      {new Date(reservation.end_time).toLocaleTimeString('it-IT', { 
                        hour: '2-digit', 
                        minute: '2-digit',
                        timeZone: 'UTC'  // Forza UTC
                      })}
                    </div>
                    {reservation.notes && (
                      <div className="text-sm mt-1">{reservation.notes}</div>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <BookingModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        date={date}
        room={selectedRoom}
        existingReservation={selectedReservation}
        onSuccess={loadReservations}
      />
    </div>
  );
};

export default MeetingRoomCalendar; 