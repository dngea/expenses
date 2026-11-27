ALTER TABLE movements
ADD COLUMN recurring_movement_id INTEGER REFERENCES recurring_movements (id) ON DELETE SET NULL,
ADD COLUMN recurring_movement_date DATE,
ADD UNIQUE (recurring_movement_id, recurring_movement_date);
