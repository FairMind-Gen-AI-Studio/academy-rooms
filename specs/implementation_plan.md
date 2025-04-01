# Room Inventory Management Implementation Plan

This document outlines the detailed implementation plan for the room inventory management feature based on the user story in `specs/user_stories/room-inventory.md`.

## 1. Database Schema Enhancement

### 1.1 Add Status Field to Rooms Table

Create a migration script (`scripts/add_status_to_rooms.sql`):

```sql
-- Add status column to rooms table
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'available';

-- Add comment to the status column
COMMENT ON COLUMN public.rooms.status IS 'Current status of the room (available, booked, maintenance)';

-- Create an index on the status column for faster status-based queries
CREATE INDEX IF NOT EXISTS rooms_status_idx ON public.rooms (status);
```

## 2. Navigation Implementation

### 2.1 Create Navigation Component

Create a new component: `app/components/Navigation.tsx`:

```tsx
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation({ userRole = 'user' }) {
  const pathname = usePathname();
  const isAdmin = userRole === 'admin';

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="font-bold text-xl">
                Academy Rooms
              </Link>
            </div>
            <div className="ml-6 flex space-x-8">
              <Link 
                href="/" 
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-indigo-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Meeting Rooms
              </Link>
              
              {isAdmin && (
                <Link 
                  href="/admin/rooms" 
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    pathname === '/admin/rooms' 
                      ? 'border-indigo-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Room Management
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 2.2 Update Root Layout

Modify `app/layout.tsx` to include the Navigation component:

```tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navigation from "./components/Navigation";
import { createClient } from '@/utils/supabase/server';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Academy Rooms",
  description: "Room booking and management system",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get user role for navigation
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  let userRole = 'user';
  
  if (session) {
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
    
    if (user) {
      userRole = user.role;
    }
  }

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navigation userRole={userRole} />
        <main className="pt-4">
          {children}
        </main>
      </body>
    </html>
  );
}
```

## 3. Admin Section Implementation

### 3.1 Create Admin Layout

Create `app/admin/layout.tsx` with admin-specific layout:

```tsx
import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/sign-in');
  }
  
  // Get user role from database
  const { data: user } = await supabase
    .from('users')
    .select('role')
    .eq('id', session.user.id)
    .single();
  
  // Check if user is admin
  if (!user || user.role !== 'admin') {
    redirect('/');
  }
  
  return (
    <div className="admin-layout">
      <div className="max-w-6xl mx-auto p-4">
        {children}
      </div>
    </div>
  );
}
```

### 3.2 Create Room Management Page

Create `app/admin/rooms/page.tsx`:

```tsx
import RoomManagement from '@/app/components/admin/RoomManagement';

export const metadata = {
  title: 'Room Management - Academy Rooms',
  description: 'Manage meeting rooms in the system',
};

export default function RoomManagementPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Room Management</h1>
      <RoomManagement />
    </div>
  );
}
```

## 4. Room Management Component

### 4.1 Create RoomManagement Component

Create `app/components/admin/RoomManagement.tsx`:

```tsx
"use client";

import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRooms, createRoom, updateRoom, deleteRoom } from '@/app/actions/rooms';

type Room = {
  id: string;
  name: string;
  capacity: number;
  equipment: string[];
  status: 'available' | 'booked' | 'maintenance';
};

export default function RoomManagement() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [newRoom, setNewRoom] = useState<Omit<Room, 'id'>>({
    name: '',
    capacity: 0,
    equipment: [],
    status: 'available',
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('');
  const [equipmentFilter, setEquipmentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = async () => {
    try {
      setLoading(true);
      const data = await getRooms();
      setRooms(data);
      setError(null);
    } catch (err) {
      setError('Failed to load rooms');
      console.error('Failed to load rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async () => {
    try {
      // Check if room name already exists
      if (rooms.some(room => room.name === newRoom.name)) {
        setError('Room name must be unique');
        return;
      }

      await createRoom(newRoom);
      
      // Optimistically update UI
      const roomToAdd = { ...newRoom, id: Date.now().toString() };
      setRooms([...rooms, roomToAdd]);
      
      // Reset form
      setNewRoom({ name: '', capacity: 0, equipment: [], status: 'available' });
      setError(null);
      
      // Reload rooms to get the actual data from server
      loadRooms();
    } catch (err) {
      setError('Failed to add room');
      console.error('Failed to add room:', err);
    }
  };

  const handleUpdateRoom = async (id: string, updatedData: Partial<Room>) => {
    try {
      // Check if updated name already exists and is not the current room
      if (
        updatedData.name && 
        rooms.some(room => room.name === updatedData.name && room.id !== id)
      ) {
        setError('Room name must be unique');
        return;
      }

      await updateRoom(id, updatedData);
      
      // Optimistically update UI
      setRooms(rooms.map(room => room.id === id ? { ...room, ...updatedData } : room));
      setError(null);
      
      // Reload rooms to get the actual data from server
      loadRooms();
    } catch (err) {
      setError('Failed to update room');
      console.error('Failed to update room:', err);
    }
  };

  const handleDeleteRoom = async (id: string) => {
    try {
      if (!confirm('Are you sure you want to delete this room?')) {
        return;
      }
      
      await deleteRoom(id);
      
      // Optimistically update UI
      setRooms(rooms.filter(room => room.id !== id));
      setError(null);
    } catch (err) {
      setError('Failed to delete room');
      console.error('Failed to delete room:', err);
    }
  };

  const filteredRooms = rooms.filter(room =>
    room.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (capacityFilter === '' || room.capacity >= parseInt(capacityFilter)) &&
    (equipmentFilter === '' || room.equipment.includes(equipmentFilter))
  );

  if (loading) {
    return <div className="flex justify-center items-center min-h-[200px]">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Add New Room</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <Input
              placeholder="Room Name"
              value={newRoom.name}
              onChange={(e) => setNewRoom({ ...newRoom, name: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Capacity"
              value={newRoom.capacity || ''}
              onChange={(e) => setNewRoom({ ...newRoom, capacity: parseInt(e.target.value) || 0 })}
            />
            <Input
              placeholder="Equipment (comma-separated)"
              value={newRoom.equipment.join(', ')}
              onChange={(e) => setNewRoom({ ...newRoom, equipment: e.target.value.split(', ').filter(item => item.trim() !== '') })}
            />
            <Select
              value={newRoom.status}
              onValueChange={(value: 'available' | 'booked' | 'maintenance') => setNewRoom({ ...newRoom, status: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="booked">Booked</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button onClick={addRoom}>Add Room</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Filter Rooms</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <Input
              placeholder="Search by name"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Min Capacity"
              value={capacityFilter}
              onChange={(e) => setCapacityFilter(e.target.value)}
            />
            <Input
              placeholder="Equipment"
              value={equipmentFilter}
              onChange={(e) => setEquipmentFilter(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6">
        {filteredRooms.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No rooms found matching your criteria
          </div>
        ) : (
          filteredRooms.map(room => (
            <Card key={room.id}>
              <CardContent className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 gap-4">
                <div>
                  <h3 className="text-lg font-semibold">{room.name}</h3>
                  <p>Capacity: {room.capacity}</p>
                  <p>Equipment: {room.equipment.join(', ')}</p>
                  <p>Status: {room.status}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedName = prompt('Enter new room name', room.name);
                      if (updatedName) handleUpdateRoom(room.id, { name: updatedName });
                    }}
                  >
                    Edit Name
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedCapacity = prompt('Enter new capacity', room.capacity.toString());
                      if (updatedCapacity) handleUpdateRoom(room.id, { capacity: parseInt(updatedCapacity) });
                    }}
                  >
                    Edit Capacity
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const updatedEquipment = prompt('Enter equipment (comma-separated)', room.equipment.join(', '));
                      if (updatedEquipment) {
                        handleUpdateRoom(room.id, { 
                          equipment: updatedEquipment.split(', ').filter(item => item.trim() !== '') 
                        });
                      }
                    }}
                  >
                    Edit Equipment
                  </Button>
                  <Select
                    value={room.status}
                    onValueChange={(value: 'available' | 'booked' | 'maintenance') => 
                      handleUpdateRoom(room.id, { status: value })
                    }
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="available">Available</SelectItem>
                      <SelectItem value="booked">Booked</SelectItem>
                      <SelectItem value="maintenance">Maintenance</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteRoom(room.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
```

### 4.2 Update Room Actions

Enhance `app/actions/rooms.ts` to include the status field:

```typescript
'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getRooms(filters?: {
  capacity?: number
  equipment?: string[]
  search?: string
  status?: string
}) {
  const supabase = createClient()
  let query = supabase.from('rooms').select('*')

  if (filters?.capacity) {
    query = query.gte('capacity', filters.capacity)
  }

  if (filters?.equipment && filters.equipment.length > 0) {
    query = query.contains('equipment', filters.equipment)
  }

  if (filters?.search) {
    query = query.ilike('name', `%${filters.search}%`)
  }
  
  if (filters?.status) {
    query = query.eq('status', filters.status)
  }

  const { data, error } = await query.order('created_at', { ascending: false })
  
  if (error) throw new Error(error.message)
  return data
}

export async function getRoom(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw new Error(error.message)
  return data
}

export async function createRoom(data: {
  name: string
  capacity: number
  equipment: string[]
  status: 'available' | 'booked' | 'maintenance'
}) {
  const supabase = createClient()
  
  // Check if room name already exists
  const { data: existingRoom } = await supabase
    .from('rooms')
    .select('id')
    .eq('name', data.name)
    .single()
  
  if (existingRoom) {
    throw new Error('Room name must be unique')
  }
  
  const { error } = await supabase.from('rooms').insert([data])

  if (error) throw new Error(error.message)
  revalidatePath('/rooms')
  revalidatePath('/admin/rooms')
}

export async function updateRoom(
  id: string,
  data: {
    name?: string
    capacity?: number
    equipment?: string[]
    status?: 'available' | 'booked' | 'maintenance'
  }
) {
  const supabase = createClient()
  
  // If name is being updated, check if it's unique
  if (data.name) {
    const { data: existingRoom } = await supabase
      .from('rooms')
      .select('id')
      .eq('name', data.name)
      .neq('id', id)
      .single()
    
    if (existingRoom) {
      throw new Error('Room name must be unique')
    }
  }
  
  const { error } = await supabase
    .from('rooms')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/rooms')
  revalidatePath(`/rooms/${id}`)
  revalidatePath('/admin/rooms')
}

export async function deleteRoom(id: string) {
  const supabase = createClient()
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/rooms')
  revalidatePath('/admin/rooms')
}
```

## 5. Implementation Timeline

### 5.1 Phase 1: Core Implementation (1-2 weeks)
- Database schema update
- Navigation component
- Basic admin section with access control
- Room management functionality

### 5.2 Phase 2: Enhanced Features (2-3 weeks)
- Room groups
- Equipment requests
- Advanced filtering and sorting

### 5.3 Phase 3: Optimization (1-2 weeks)
- Performance improvements
- UI/UX refinements
- Additional admin tools

## 6. Future Enhancements

### 6.1 Room Groups Feature
- Create a new table for room groups
- Add UI for managing room groups
- Implement filtering by group

### 6.2 Equipment Request System
- Create a form for users to request new equipment
- Implement notification system for admins
- Add approval workflow

### 6.3 Advanced Room Status
- Expand status options
- Add calendar integration
- Implement automatic status updates

## 7. Testing Plan

### 7.1 Unit Tests
- Test room actions (CRUD operations)
- Test validation logic
- Test filtering functionality

### 7.2 Integration Tests
- Test admin access control
- Test navigation based on user role
- Test end-to-end room management workflow

### 7.3 User Acceptance Testing
- Verify all acceptance criteria are met
- Test with real administrators
- Gather feedback for improvements