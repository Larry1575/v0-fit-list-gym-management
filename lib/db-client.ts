// Cliente de base de datos para FitList
// Este archivo se actualizará cuando se agregue la integración de Supabase

export interface DatabaseClient {
  from: (table: string) => any;
}

// Placeholder para cuando se agregue Supabase
export function getDatabase(): DatabaseClient | null {
  // Cuando se agregue Supabase, aquí se creará el cliente
  // const supabase = createBrowserClient(...)
  // return supabase

  return null;
}

// Funciones helper para datos mock mientras no hay DB
export const mockMembers = [
  {
    id: "1",
    first_name: "Juan",
    last_name: "Pérez",
    email: "juan.perez@email.com",
    phone: "+34 600 123 456",
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    first_name: "María",
    last_name: "García",
    email: "maria.garcia@email.com",
    phone: "+34 600 234 567",
    status: "active" as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const mockMembershipTypes = [
  {
    id: "1",
    name: "Básica",
    description: "Acceso al gimnasio en horario regular",
    duration_days: 30,
    price: 29.99,
    class_limit: 8,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Premium",
    description: "Acceso completo + clases ilimitadas",
    duration_days: 30,
    price: 49.99,
    class_limit: null,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];

export const mockClasses = [
  {
    id: "1",
    name: "Yoga Matutino",
    description: "Clase de yoga para comenzar el día",
    instructor: "María González",
    day_of_week: 1,
    start_time: "07:00",
    end_time: "08:00",
    max_capacity: 20,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "CrossFit",
    description: "Entrenamiento funcional de alta intensidad",
    instructor: "Carlos Ruiz",
    day_of_week: 1,
    start_time: "18:00",
    end_time: "19:00",
    max_capacity: 15,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "3",
    name: "Spinning",
    description: "Ciclismo indoor con música motivadora",
    instructor: "Ana López",
    day_of_week: 2,
    start_time: "19:00",
    end_time: "20:00",
    max_capacity: 25,
    is_active: true,
    created_at: new Date().toISOString(),
  },
  {
    id: "4",
    name: "Pilates",
    description: "Fortalecimiento y flexibilidad",
    instructor: "Laura Martínez",
    day_of_week: 3,
    start_time: "10:00",
    end_time: "11:00",
    max_capacity: 15,
    is_active: true,
    created_at: new Date().toISOString(),
  },
];
