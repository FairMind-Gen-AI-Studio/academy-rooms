"use client";

import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";
import { createReservation, updateReservation, deleteReservation } from '@/app/actions/reservations';
import { toast } from 'sonner';

const BookingModal = ({ isOpen, onClose, date, room, existingReservation, onSuccess }) => {
  const [loading, setLoading] = React.useState(false);
  const [formData, setFormData] = React.useState({
    organizer: existingReservation?.organizer || '',
    notes: existingReservation?.notes || '',
    startTime: existingReservation?.start_time?.slice(11, 16) || '09:00',
    endTime: existingReservation?.end_time?.slice(11, 16) || '10:00',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const dateStr = date.toISOString().split('T')[0];
      const reservationData = {
        room_id: room.id,
        start_time: `${dateStr}T${formData.startTime}:00Z`,
        end_time: `${dateStr}T${formData.endTime}:00Z`,
        organizer: formData.organizer,
        notes: formData.notes,
        status: 'booked'
      };

      if (existingReservation) {
        await updateReservation(existingReservation.id, reservationData);
        toast.success('Prenotazione aggiornata con successo');
      } else {
        await createReservation(reservationData);
        toast.success('Prenotazione creata con successo');
      }
      
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Errore durante la prenotazione');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!existingReservation?.id) return;
    
    setLoading(true);
    try {
      await deleteReservation(existingReservation.id);
      toast.success('Prenotazione eliminata con successo');
      onSuccess?.();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Errore durante l\'eliminazione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
          disabled={loading}
        >
          <X className="h-4 w-4" />
        </button>
        
        <h2 className="text-xl font-bold mb-4">
          {existingReservation ? 'Gestisci Prenotazione' : 'Nuova Prenotazione'}
        </h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="organizer">Organizzatore</Label>
            <Input
              id="organizer"
              value={formData.organizer}
              onChange={e => setFormData({...formData, organizer: e.target.value})}
              required
              disabled={loading}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startTime">Inizio</Label>
              <Input
                id="startTime"
                type="time"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endTime">Fine</Label>
              <Input
                id="endTime"
                type="time"
                value={formData.endTime}
                onChange={e => setFormData({...formData, endTime: e.target.value})}
                required
                disabled={loading}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
              disabled={loading}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {existingReservation && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={handleDelete}
                disabled={loading}
              >
                Elimina
              </Button>
            )}
            <Button type="submit" className="ml-auto" disabled={loading}>
              {loading ? 'Caricamento...' : existingReservation ? 'Aggiorna' : 'Prenota'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 