DROP TABLE IF EXISTS recurring_movements;

CREATE TABLE recurring_movements (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    -- 10 -> total cifras, contando las de los dos lados. 8 cifras de euros y 2 de céntimos.
    -- 2 -> total decimales
    amount NUMERIC(10, 2) NOT NULL CHECK(amount > 0),
    category_id INTEGER REFERENCES categories (id) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE,
    day_of_repeat INTEGER NOT NULL CHECK(day_of_repeat BETWEEN 1 AND 31),
    description TEXT,

    CHECK(end_date >= start_date)
);
