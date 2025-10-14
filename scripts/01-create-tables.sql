-- FitList Database Schema
-- Tabla de socios/miembros
CREATE TABLE IF NOT EXISTS members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_number VARCHAR(20) UNIQUE NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  date_of_birth DATE,
  address TEXT,
  emergency_contact_name VARCHAR(200),
  emergency_contact_phone VARCHAR(20),
  photo_url TEXT,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de tipos de membresía
CREATE TABLE IF NOT EXISTS membership_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  duration_days INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  class_limit INTEGER, -- NULL = ilimitado
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de membresías activas
CREATE TABLE IF NOT EXISTS memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  membership_type_id UUID REFERENCES membership_types(id),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
  auto_renew BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de pagos
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  membership_id UUID REFERENCES memberships(id),
  amount DECIMAL(10, 2) NOT NULL,
  payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('cash', 'card', 'transfer', 'other')),
  payment_date DATE NOT NULL,
  concept VARCHAR(255) NOT NULL,
  notes TEXT,
  receipt_number VARCHAR(50),
  created_by VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de clases/actividades
CREATE TABLE IF NOT EXISTS classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  instructor VARCHAR(100),
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=Domingo, 6=Sábado
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  max_capacity INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla de reservas de clases
CREATE TABLE IF NOT EXISTS class_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'attended')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(class_id, member_id, booking_date)
);

-- Tabla de asistencias
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  member_id UUID REFERENCES members(id) ON DELETE CASCADE,
  check_in_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  check_out_time TIMESTAMP WITH TIME ZONE,
  class_booking_id UUID REFERENCES class_bookings(id),
  notes TEXT
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_members_status ON members(status);
CREATE INDEX IF NOT EXISTS idx_members_email ON members(email);
CREATE INDEX IF NOT EXISTS idx_memberships_member_id ON memberships(member_id);
CREATE INDEX IF NOT EXISTS idx_memberships_status ON memberships(status);
CREATE INDEX IF NOT EXISTS idx_memberships_end_date ON memberships(end_date);
CREATE INDEX IF NOT EXISTS idx_payments_member_id ON payments(member_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_attendance_member_id ON attendance(member_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(check_in_time);
CREATE INDEX IF NOT EXISTS idx_class_bookings_member ON class_bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_class_bookings_class ON class_bookings(class_id);
