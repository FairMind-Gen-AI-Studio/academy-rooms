import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

const BookingModal = ({ isOpen, onClose, date, existingReservation, onBook, onDelete }) => {
  const [formData, setFormData] = React.useState({
    organizer: existingReservation?.organizer || '',
    notes: existingReservation?.notes || '',
    startTime: existingReservation?.start?.toLocaleTimeString().slice(0, 5) || '09:00',
    endTime: existingReservation?.end?.toLocaleTimeString().slice(0, 5) || '10:00',
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const reservation = {
      start: new Date(date.setHours(...formData.startTime.split(':'))),
      end: new Date(date.setHours(...formData.endTime.split(':'))),
      organizer: formData.organizer,
      notes: formData.notes,
      status: 'booked'
    };
    onBook(reservation);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md relative">
        <button 
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
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
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Note</Label>
            <Input
              id="notes"
              value={formData.notes}
              onChange={e => setFormData({...formData, notes: e.target.value})}
            />
          </div>

          <div className="flex gap-2 pt-4">
            {existingReservation && (
              <Button 
                type="button" 
                variant="destructive"
                onClick={() => onDelete(existingReservation.id)}
              >
                Elimina
              </Button>
            )}
            <Button type="submit" className="ml-auto">
              {existingReservation ? 'Aggiorna' : 'Prenota'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal; 