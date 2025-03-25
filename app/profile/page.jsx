"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, User, Mail, Phone, Building } from 'lucide-react';

export default function ProfilePage() {
  // Mock user data (in a real app, would come from database/API)
  const [userData, setUserData] = useState({
    name: "Mario Rossi",
    email: "mario.rossi@example.com",
    phone: "+39 333 1234567",
    department: "Amministrazione",
    avatar: null
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({...userData});
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, you'd save to a database/API here
    setUserData({...formData});
    setIsEditing(false);
  };
  
  return (
    <div className="min-h-screen">
      <header className="border-b border-border py-4">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link href="/" className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
              <span>Torna alla Home</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Profilo Utente</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Dettagli Profilo</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-4xl font-medium mb-4">
                {userData.name.charAt(0)}
              </div>
              <h2 className="text-xl font-semibold">{userData.name}</h2>
              <p className="text-muted-foreground">{userData.department}</p>
              
              <div className="w-full mt-6 space-y-4">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{userData.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{userData.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building className="w-4 h-4 text-muted-foreground" />
                  <span>{userData.department}</span>
                </div>
              </div>
              
              {!isEditing && (
                <Button 
                  className="mt-6 w-full"
                  onClick={() => setIsEditing(true)}
                >
                  Modifica Profilo
                </Button>
              )}
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>{isEditing ? "Modifica Profilo" : "Riepilogo Attività"}</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Nome Completo
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      Telefono
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="department" className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      Dipartimento
                    </Label>
                    <Input
                      id="department"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    />
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button type="submit" className="gap-1">
                      <Save className="w-4 h-4" />
                      Salva Modifiche
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setFormData({...userData});
                        setIsEditing(false);
                      }}
                    >
                      Annulla
                    </Button>
                  </div>
                </form>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">Qui verranno visualizzate le tue prenotazioni recenti e le attività.</p>
                  
                  <div className="border border-border rounded-md p-4 flex items-center justify-center h-48 text-muted-foreground">
                    Nessuna prenotazione recente
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}