-- Stub mínimo del esquema `auth` de Supabase, SOLO para probar localmente.
-- En Supabase real ya existe; no se ejecuta en producción.
create role authenticated nologin;
create schema auth;
create table auth.users (id uuid primary key);
create function auth.uid() returns uuid language sql stable as
$$ select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid $$;
