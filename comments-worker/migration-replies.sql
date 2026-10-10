ALTER TABLE comments ADD COLUMN parent_id INTEGER REFERENCES comments(id);
ALTER TABLE comments ADD COLUMN anchor TEXT;
