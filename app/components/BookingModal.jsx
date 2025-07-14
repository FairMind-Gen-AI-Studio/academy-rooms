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
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-md relative shadow-2xl border border-slate-200 animate-in fade-in-0 zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-slate-400 hover:text-slate-600 transition-colors duration-200 p-1 rounded-full hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-slate-800">
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