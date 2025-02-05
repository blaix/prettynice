CREATE TABLE IF NOT EXISTS "schema_migrations" (version varchar(128) primary key);
CREATE TABLE User (
    id integer not null primary key autoincrement,
    name text
);
-- Dbmate schema migrations
INSERT INTO "schema_migrations" (version) VALUES
  ('20250205124609');
