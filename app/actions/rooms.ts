'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { currentUser } from "@clerk/nextjs/server";

export async function getRooms(filters?: {
  capacity?: number
  equipment?: string[]
  search?: string
}) {
  const user = await currentUser();
  
  if (!user) {
    throw new Error("Unauthorized");
  }

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
}) {
  const supabase = createClient()
  const { error } = await supabase.from('rooms').insert([data])

  if (error) throw new Error(error.message)
  revalidatePath('/rooms')
}

export async function updateRoom(
  id: string,
  data: {
    name?: string
    capacity?: number
    equipment?: string[]
  }
) {
  const supabase = createClient()
  const { error } = await supabase
    .from('rooms')
    .update(data)
    .eq('id', id)

  if (error) throw new Error(error.message)
  revalidatePath('/rooms')
  revalidatePath(`/rooms/${id}`)
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