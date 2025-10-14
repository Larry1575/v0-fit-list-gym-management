-- Datos de ejemplo para FitList

-- Tipos de membresía
INSERT INTO membership_types (name, description, duration_days, price, class_limit, features) VALUES
('Básica', 'Acceso al gimnasio en horario regular', 30, 29.99, 8, '{"gym_access": true, "locker": false, "guest_pass": 0}'),
('Premium', 'Acceso completo + clases ilimitadas', 30, 49.99, NULL, '{"gym_access": true, "locker": true, "guest_pass": 2, "classes": "unlimited"}'),
('Estudiante', 'Membresía especial para estudiantes', 30, 24.99, 4, '{"gym_access": true, "locker": false, "guest_pass": 0, "discount": "student"}'),
('Anual', 'Membresía anual con descuento', 365, 499.99, NULL, '{"gym_access": true, "locker": true, "guest_pass": 4, "classes": "unlimited", "discount": "annual"}');

-- Clases de ejemplo
INSERT INTO classes (name, description, instructor, day_of_week, start_time, end_time, max_capacity) VALUES
('Yoga Matutino', 'Clase de yoga para comenzar el día', 'María González', 1, '07:00', '08:00', 20),
('CrossFit', 'Entrenamiento funcional de alta intensidad', 'Carlos Ruiz', 1, '18:00', '19:00', 15),
('Spinning', 'Ciclismo indoor con música motivadora', 'Ana López', 2, '19:00', '20:00', 25),
('Pilates', 'Fortalecimiento y flexibilidad', 'Laura Martínez', 3, '10:00', '11:00', 15),
('Zumba', 'Baile fitness con ritmos latinos', 'Sofia Torres', 4, '19:30', '20:30', 30),
('Boxeo', 'Técnicas de boxeo y acondicionamiento', 'Miguel Ángel', 5, '18:00', '19:00', 12);

-- Miembros de ejemplo
INSERT INTO members (member_number, first_name, last_name, email, phone, date_of_birth, status) VALUES
('M001', 'Juan', 'Pérez', 'juan.perez@email.com', '+34 600 123 456', '1990-05-15', 'active'),
('M002', 'María', 'García', 'maria.garcia@email.com', '+34 600 234 567', '1985-08-22', 'active'),
('M003', 'Pedro', 'Rodríguez', 'pedro.rodriguez@email.com', '+34 600 345 678', '1992-03-10', 'active'),
('M004', 'Laura', 'Fernández', 'laura.fernandez@email.com', '+34 600 456 789', '1988-11-30', 'active'),
('M005', 'Carlos', 'López', 'carlos.lopez@email.com', '+34 600 567 890', '1995-07-18', 'inactive');

-- Membresías activas (usando los IDs de los miembros insertados)
INSERT INTO memberships (member_id, membership_type_id, start_date, end_date, status)
SELECT 
  m.id,
  mt.id,
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '30 days',
  'active'
FROM members m
CROSS JOIN membership_types mt
WHERE m.member_number = 'M001' AND mt.name = 'Premium'
LIMIT 1;

INSERT INTO memberships (member_id, membership_type_id, start_date, end_date, status)
SELECT 
  m.id,
  mt.id,
  CURRENT_DATE - INTERVAL '15 days',
  CURRENT_DATE + INTERVAL '15 days',
  'active'
FROM members m
CROSS JOIN membership_types mt
WHERE m.member_number = 'M002' AND mt.name = 'Básica'
LIMIT 1;

INSERT INTO memberships (member_id, membership_type_id, start_date, end_date, status)
SELECT 
  m.id,
  mt.id,
  CURRENT_DATE - INTERVAL '5 days',
  CURRENT_DATE + INTERVAL '25 days',
  'active'
FROM members m
CROSS JOIN membership_types mt
WHERE m.member_number = 'M003' AND mt.name = 'Estudiante'
LIMIT 1;

-- Pagos de ejemplo
INSERT INTO payments (member_id, membership_id, amount, payment_method, payment_date, concept, receipt_number)
SELECT 
  m.id,
  ms.id,
  49.99,
  'card',
  CURRENT_DATE,
  'Membresía Premium - Mensual',
  'REC-001'
FROM members m
JOIN memberships ms ON ms.member_id = m.id
WHERE m.member_number = 'M001'
LIMIT 1;

INSERT INTO payments (member_id, membership_id, amount, payment_method, payment_date, concept, receipt_number)
SELECT 
  m.id,
  ms.id,
  29.99,
  'cash',
  CURRENT_DATE - INTERVAL '15 days',
  'Membresía Básica - Mensual',
  'REC-002'
FROM members m
JOIN memberships ms ON ms.member_id = m.id
WHERE m.member_number = 'M002'
LIMIT 1;
