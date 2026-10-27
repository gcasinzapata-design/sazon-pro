-- Pruebas de RLS para 0001_core.sql
-- Se ejecuta contra un Postgres local con el stub de auth (00_stub_auth.sql). Falla con ERROR si algo se rompe.

create schema test;

create function test.as_user(u uuid) returns void language plpgsql as $$
begin
  perform set_config('request.jwt.claim.sub', u::text, true);
  perform set_config('role', 'authenticated', true);
end $$;

create function test.reset() returns void language plpgsql as $$
begin
  execute 'reset role';
  perform set_config('request.jwt.claim.sub', '', true);
end $$;

create function test.eq(label text, actual bigint, expected bigint) returns void language plpgsql as $$
begin
  if actual is distinct from expected then
    raise exception 'FALLO [%]: esperado %, obtenido %', label, expected, actual;
  end if;
  raise notice 'ok  - %', label;
end $$;

-- Ejecuta sentencia y exige que falle (RLS o trigger)
create function test.denied(label text, stmt text) returns void language plpgsql as $$
begin
  begin
    execute stmt;
  exception when others then
    raise notice 'ok  - % (bloqueado: %)', label, sqlerrm;
    return;
  end;
  raise exception 'FALLO [%]: la operación debió ser bloqueada', label;
end $$;

grant usage on schema public, app, test to authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant execute on all functions in schema test to authenticated;

-- ── Datos de prueba (como superusuario: sin RLS) ───────
insert into auth.users (id) values
  ('a0000000-0000-0000-0000-000000000001'), -- admin A
  ('a0000000-0000-0000-0000-000000000002'), -- ejecutivo 1
  ('a0000000-0000-0000-0000-000000000003'), -- ejecutivo 2
  ('a0000000-0000-0000-0000-000000000004'), -- cliente de A1
  ('b0000000-0000-0000-0000-000000000001'); -- admin B

insert into public.organizations (id, name) values
  ('0a000000-0000-0000-0000-00000000000a', 'Org A'),
  ('0b000000-0000-0000-0000-00000000000b', 'Org B');

insert into public.profiles (id, org_id, full_name, role) values
  ('a0000000-0000-0000-0000-000000000001', '0a000000-0000-0000-0000-00000000000a', 'Admin A', 'admin'),
  ('a0000000-0000-0000-0000-000000000002', '0a000000-0000-0000-0000-00000000000a', 'Exec 1',  'executive'),
  ('a0000000-0000-0000-0000-000000000003', '0a000000-0000-0000-0000-00000000000a', 'Exec 2',  'executive'),
  ('a0000000-0000-0000-0000-000000000004', '0a000000-0000-0000-0000-00000000000a', 'Cliente 1','client'),
  ('b0000000-0000-0000-0000-000000000001', '0b000000-0000-0000-0000-00000000000b', 'Admin B', 'admin');

insert into public.brands (id, org_id, name) values
  ('c0000000-0000-0000-0000-0000000000a1', '0a000000-0000-0000-0000-00000000000a', 'Marca A1'),
  ('c0000000-0000-0000-0000-0000000000a2', '0a000000-0000-0000-0000-00000000000a', 'Marca A2'),
  ('c0000000-0000-0000-0000-0000000000b1', '0b000000-0000-0000-0000-00000000000b', 'Marca B1');

insert into public.executive_assignments values
  ('c0000000-0000-0000-0000-0000000000a1', 'a0000000-0000-0000-0000-000000000002'),
  ('c0000000-0000-0000-0000-0000000000a2', 'a0000000-0000-0000-0000-000000000003');
insert into public.client_memberships values
  ('c0000000-0000-0000-0000-0000000000a1', 'a0000000-0000-0000-0000-000000000004');

insert into public.metrics_daily (brand_id, platform, day, orders) values
  ('c0000000-0000-0000-0000-0000000000a1', 'rappi', '2026-10-01', 10),
  ('c0000000-0000-0000-0000-0000000000a2', 'rappi', '2026-10-01', 20),
  ('c0000000-0000-0000-0000-0000000000b1', 'rappi', '2026-10-01', 30);

insert into public.tasks (brand_id, title) values
  ('c0000000-0000-0000-0000-0000000000a1', 'Tarea A1'),
  ('c0000000-0000-0000-0000-0000000000a2', 'Tarea A2');
insert into public.alerts (brand_id, kind) values
  ('c0000000-0000-0000-0000-0000000000a1', 'store_paused');
insert into public.platform_accounts (brand_id, platform, external_store_id) values
  ('c0000000-0000-0000-0000-0000000000a1', 'rappi', 'store-1');
insert into public.reports (brand_id, period_start, period_end, status) values
  ('c0000000-0000-0000-0000-0000000000a1', '2026-09-01', '2026-09-30', 'draft'),
  ('c0000000-0000-0000-0000-0000000000a1', '2026-08-01', '2026-08-31', 'approved');
insert into public.prospects (org_id, name) values
  ('0a000000-0000-0000-0000-00000000000a', 'Prospecto 1');

-- ── Admin A ─────────────────────────────────────────────
begin;
select test.as_user('a0000000-0000-0000-0000-000000000001');
select test.eq('admin A ve sus 2 marcas',        (select count(*) from public.brands), 2);
select test.eq('admin A ve métricas de A1+A2',   (select count(*) from public.metrics_daily), 2);
select test.eq('admin A ve 2 tareas',            (select count(*) from public.tasks), 2);
select test.eq('admin A no ve la org B',         (select count(*) from public.organizations), 1);
select test.reset();
commit;

-- ── Ejecutivo 1 ─────────────────────────────────────────
begin;
select test.as_user('a0000000-0000-0000-0000-000000000002');
select test.eq('exec 1 ve solo 1 marca',         (select count(*) from public.brands), 1);
select test.eq('exec 1 ve métricas solo de A1',  (select count(*) from public.metrics_daily), 1);
select test.eq('exec 1 ve solo la tarea de A1',  (select count(*) from public.tasks), 1);
select test.eq('exec 1 ve los prospectos',       (select count(*) from public.prospects), 1);
select test.eq('exec 1 ve cuentas de plataforma',(select count(*) from public.platform_accounts), 1);
select test.denied('exec 1 no crea tareas en A2',
  $$insert into public.tasks (brand_id, title) values ('c0000000-0000-0000-0000-0000000000a2', 'intruso')$$);
select test.denied('exec 1 no escribe métricas',
  $$insert into public.metrics_daily (brand_id, platform, day, orders) values ('c0000000-0000-0000-0000-0000000000a1', 'didi', '2026-10-02', 1)$$);
select test.reset();
commit;

-- ── Ejecutivo 2 ─────────────────────────────────────────
begin;
select test.as_user('a0000000-0000-0000-0000-000000000003');
select test.eq('exec 2 ve solo A2',              (select count(*) from public.brands), 1);
select test.eq('exec 2 no ve tareas de A1',      (select count(*) from public.tasks where title = 'Tarea A1'), 0);
select test.reset();
commit;

-- ── Cliente de A1 ───────────────────────────────────────
begin;
select test.as_user('a0000000-0000-0000-0000-000000000004');
select test.eq('cliente ve solo su marca',       (select count(*) from public.brands), 1);
select test.eq('cliente ve sus métricas',        (select count(*) from public.metrics_daily), 1);
select test.eq('cliente NO ve tareas',           (select count(*) from public.tasks), 0);
select test.eq('cliente NO ve alertas',          (select count(*) from public.alerts), 0);
select test.eq('cliente NO ve cuentas de plataforma', (select count(*) from public.platform_accounts), 0);
select test.eq('cliente NO ve prospectos',       (select count(*) from public.prospects), 0);
select test.eq('cliente solo ve reportes aprobados', (select count(*) from public.reports), 1);
select test.eq('cliente solo ve su propio perfil', (select count(*) from public.profiles), 1);
select test.denied('cliente no escribe métricas',
  $$insert into public.metrics_daily (brand_id, platform, day, orders) values ('c0000000-0000-0000-0000-0000000000a1', 'didi', '2026-10-02', 999)$$);
select test.denied('cliente no se sube a admin',
  $$update public.profiles set role = 'admin' where id = 'a0000000-0000-0000-0000-000000000004'$$);
select test.denied('cliente no se cambia de organización',
  $$update public.profiles set org_id = '0b000000-0000-0000-0000-00000000000b' where id = 'a0000000-0000-0000-0000-000000000004'$$);
select test.denied('cliente no crea marcas',
  $$insert into public.brands (org_id, name) values ('0a000000-0000-0000-0000-00000000000a', 'Mía')$$);
select test.denied('cliente no crea dashboards en marca ajena',
  $$insert into public.dashboards (brand_id, owner_id, title) values ('c0000000-0000-0000-0000-0000000000a2', 'a0000000-0000-0000-0000-000000000004', 'x')$$);
insert into public.dashboards (brand_id, owner_id, title)
  values ('c0000000-0000-0000-0000-0000000000a1', 'a0000000-0000-0000-0000-000000000004', 'Mi dashboard');
select test.eq('cliente crea dashboard en su marca', (select count(*) from public.dashboards), 1);
select test.reset();
commit;

-- ── Admin B (otra organización) ─────────────────────────
begin;
select test.as_user('b0000000-0000-0000-0000-000000000001');
select test.eq('admin B solo ve B1',             (select count(*) from public.brands), 1);
select test.eq('admin B no ve métricas de A',    (select count(*) from public.metrics_daily where brand_id <> 'c0000000-0000-0000-0000-0000000000b1'), 0);
select test.eq('admin B no ve prospectos de A',  (select count(*) from public.prospects), 0);
select test.denied('admin B no crea marcas en org A',
  $$insert into public.brands (org_id, name) values ('0a000000-0000-0000-0000-00000000000a', 'Intruso')$$);
select test.reset();
commit;

-- ── Sin sesión (anon / sin sub) ─────────────────────────
begin;
select test.as_user('00000000-0000-0000-0000-000000000000');
select test.eq('usuario sin perfil no ve marcas', (select count(*) from public.brands), 0);
select test.reset();
commit;

do $$ begin raise notice 'TODAS LAS PRUEBAS DE RLS PASARON'; end $$;
