DROP TABLE IF EXISTS expenses;

CREATE TABLE expenses (
    id  INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    amount NUMERIC(10, 2) NOT NULL CHECK(amount > 0),
    category_id INTEGER REFERENCES categories (id) NOT NULL,
    spent_at DATE NOT NULL,
    description TEXT
);

-- SELECT column_name, data_type, is_nullable
-- FROM information_schema.columns
-- WHERE table_name = 'expenses';

\d expenses