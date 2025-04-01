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

  console.log('Filters:', filters)

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
  
  console.log('Query result:', data)
  
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
} 