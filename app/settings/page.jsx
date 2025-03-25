"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Save, Bell, Eye, Lock, Globe } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import ThemeToggle from '../components/ThemeToggle';

export default function SettingsPage() {
  const { theme } = useTheme();
  
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      browser: false,
      mobile: true,
    },
    privacy: {
      showProfile: true,
      showAvailability: true,
    },
    language: 'it'
  });
  
  const handleToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };
  
  const handleSave = () => {
    // In a real app, you'd save to a database/API here
    alert("Impostazioni salvate!");
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
        <h1 className="text-2xl font-bold mb-6">Impostazioni</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <aside className="md:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Categorie</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <nav className="space-y-1">
                  <a href="#notifications" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary w-full text-left border-l-2 border-primary">
                    <Bell className="w-4 h-4" />
                    <span>Notifiche</span>
                  </a>
                  <a href="#privacy" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary w-full text-left border-l-2 border-transparent">
                    <Eye className="w-4 h-4" />
                    <span>Privacy</span>
                  </a>
                  <a href="#appearance" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary w-full text-left border-l-2 border-transparent">
                    <Globe className="w-4 h-4" />
                    <span>Aspetto</span>
                  </a>
                  <a href="#security" className="flex items-center gap-2 px-4 py-2 hover:bg-secondary w-full text-left border-l-2 border-transparent">
                    <Lock className="w-4 h-4" />
                    <span>Sicurezza</span>
                  </a>
                </nav>
              </CardContent>
            </Card>
          </aside>
          
          <div className="md:col-span-2 space-y-6">
            <Card id="notifications">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Notifiche
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="email-notifications" className="text-base font-medium">
                      Notifiche Email
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi notifiche via email per le prenotazioni
                    </p>
                  </div>
                  <Switch 
                    id="email-notifications" 
                    checked={settings.notifications.email}
                    onCheckedChange={() => handleToggle('notifications', 'email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="browser-notifications" className="text-base font-medium">
                      Notifiche Browser
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi notifiche nel browser
                    </p>
                  </div>
                  <Switch 
                    id="browser-notifications" 
                    checked={settings.notifications.browser}
                    onCheckedChange={() => handleToggle('notifications', 'browser')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="mobile-notifications" className="text-base font-medium">
                      Notifiche Mobile
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Ricevi notifiche sul dispositivo mobile
                    </p>
                  </div>
                  <Switch 
                    id="mobile-notifications" 
                    checked={settings.notifications.mobile}
                    onCheckedChange={() => handleToggle('notifications', 'mobile')}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card id="privacy">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Privacy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-profile" className="text-base font-medium">
                      Mostra Profilo
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permetti agli altri utenti di vedere il tuo profilo
                    </p>
                  </div>
                  <Switch 
                    id="show-profile" 
                    checked={settings.privacy.showProfile}
                    onCheckedChange={() => handleToggle('privacy', 'showProfile')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-availability" className="text-base font-medium">
                      Mostra Disponibilità
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Permetti agli altri utenti di vedere la tua disponibilità
                    </p>
                  </div>
                  <Switch 
                    id="show-availability" 
                    checked={settings.privacy.showAvailability}
                    onCheckedChange={() => handleToggle('privacy', 'showAvailability')}
                  />
                </div>
              </CardContent>
            </Card>
            
            <Card id="appearance">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Aspetto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Tema
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Seleziona il tema chiaro o scuro
                    </p>
                  </div>
                  <ThemeToggle />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">
                      Lingua
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Seleziona la lingua dell'interfaccia
                    </p>
                  </div>
                  <select 
                    className="bg-background border border-input rounded-md h-9 px-3 text-sm"
                    value={settings.language}
                    onChange={(e) => setSettings(prev => ({...prev, language: e.target.value}))}
                  >
                    <option value="it">Italiano</option>
                    <option value="en">English</option>
                    <option value="fr">Français</option>
                    <option value="de">Deutsch</option>
                  </select>
                </div>
              </CardContent>
            </Card>
            
            <div className="flex justify-end mt-6">
              <Button onClick={handleSave} className="gap-1">
                <Save className="w-4 h-4" />
                Salva Impostazioni
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}