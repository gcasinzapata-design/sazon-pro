-- Sazón Platform — esquema base multi-tenant con RLS
-- Roles: admin (ve toda la org), executive (solo cuentas asignadas), client (solo sus marcas)
-- Escritura de métricas: solo service_role (workers/conectores); nunca desde el navegador.

create schema if not exists app;

-- ── Tipos ───────────────────────────────────────────────
create type public.user_role      as enum ('admin', 'executive', 'client');
create type public.platform_kind  as enum ('rappi', 'pedidosya', 'didi');
create type public.alert_severity as enum ('info', 'warning', 'critical');
create type public.alert_status   as enum ('open', 'acknowledged', 'resolved');
create type public.task_status    as enum ('todo', 'doing', 'done', 'dismissed');
create type public.task_source    as enum ('rule', 'ai', 'manual');
create type public.report_status  as enum ('draft', 'approved', 'sent');
create type public.prospect_stage as enum ('new', 'contacted', 'meeting', 'proposal', 'won', 'lost');

-- ── Tablas ──────────────────────────────────────────────
create table public.organizations (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id         uuid primary key references auth.users (id) on delete cascade,
  org_id     uuid not null references public.organizations (id) on delete cascade,
  full_name  text,
  role       public.user_role not null default 'client',
  created_at timestamptz not null default now()
);
create index on public.profiles (org_id);

create table public.brands (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations (id) on delete cascade,
  name       text not null,
  category   text,
  country    text not null default 'PE',
  status     text not null default 'active',
  created_at timestamptz not null default now()
);
create index on public.brands (org_id);

create table public.executive_assignments (
  brand_id uuid not null references public.brands (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (brand_id, user_id)
);
create index on public.executive_assignments (user_id);

create table public.client_memberships (
  brand_id uuid not null references public.brands (id) on delete cascade,
  user_id  uuid not null references public.profiles (id) on delete cascade,
  primary key (brand_id, user_id)
);
create index on public.client_memberships (user_id);

-- Cuenta de la marca en cada plataforma. Las credenciales NO viven aquí:
-- solo una referencia al secreto (Supabase Vault). Esta tabla no se expone a clientes.
create table public.platform_accounts (
  id                uuid primary key default gen_random_uuid(),
  brand_id          uuid not null references public.brands (id) on delete cascade,
  platform          public.platform_kind not null,
  external_store_id text,
  credentials_ref   text,
  status            text not null default 'pending',
  last_synced_at    timestamptz,
  unique (brand_id, platform, external_store_id)
);
create index on public.platform_accounts (brand_id);

create table public.metrics_daily (
  brand_id     uuid not null references public.brands (id) on delete cascade,
  platform     public.platform_kind not null,
  day          date not null,
  impressions  integer,
  visits       integer,
  orders       integer,
  gross_sales  numeric(12, 2),
  ad_spend     numeric(12, 2),
  ad_sales     numeric(12, 2),
  cancel_rate  numeric(5, 2),
  avg_prep_min numeric(6, 2),
  rating       numeric(3, 2),
  uptime_pct   numeric(5, 2),
  source       text not null default 'connector',
  primary key (brand_id, platform, day)
);

create table public.alerts (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  kind        text not null,
  severity    public.alert_severity not null default 'warning',
  status      public.alert_status not null default 'open',
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  resolved_at timestamptz
);
create index on public.alerts (brand_id, status);

create table public.tasks (
  id          uuid primary key default gen_random_uuid(),
  brand_id    uuid not null references public.brands (id) on delete cascade,
  assignee_id uuid references public.profiles (id) on delete set null,
  title       text not null,
  detail      text,
  priority    smallint not null default 3 check (priority between 1 and 5),
  status      public.task_status not null default 'todo',
  source      public.task_source not null default 'manual',
  due_date    date,
  created_at  timestamptz not null default now()
);
create index on public.tasks (brand_id, status);
create index on public.tasks (assignee_id, status);

create table public.reports (
  id           uuid primary key default gen_random_uuid(),
  brand_id     uuid not null references public.brands (id) on delete cascade,
  period_start date not null,
  period_end   date not null,
  status       public.report_status not null default 'draft',
  content      jsonb not null default '{}'::jsonb,
  approved_by  uuid references public.profiles (id) on delete set null,
  created_at   timestamptz not null default now()
);
create index on public.reports (brand_id, period_end);

-- Dashboards guardados (del cliente o del equipo). spec = definición declarativa, nunca código ni SQL.
create table public.dashboards (
  id         uuid primary key default gen_random_uuid(),
  brand_id   uuid not null references public.brands (id) on delete cascade,
  owner_id   uuid not null references public.profiles (id) on delete cascade,
  title      text not null,
  spec       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index on public.dashboards (brand_id);

-- CRM de outbound compartido (reemplaza el localStorage de /outbound)
create table public.prospects (
  id         uuid primary key default gen_random_uuid(),
  org_id     uuid not null references public.organizations (id) on delete cascade,
  owner_id   uuid references public.profiles (id) on delete set null,
  name       text not null,
  contact    text,
  category   text,
  stage      public.prospect_stage not null default 'new',
  notes      text,
  created_at timestamptz not null default now()
);
create index on public.prospects (org_id, stage);

create table public.audit_log (
  id         bigint generated always as identity primary key,
  org_id     uuid,
  actor_id   uuid,
  action     text not null,
  entity     text,
  entity_id  text,
  meta       jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ── Funciones de ayuda (SECURITY DEFINER para evitar recursión de RLS) ──
create function app.my_role() returns public.user_role
language sql stable security definer set search_path = public as
$$ select role from public.profiles where id = auth.uid() $$;

create function app.my_org() returns uuid
language sql stable security definer set search_path = public as
$$ select org_id from public.profiles where id = auth.uid() $$;

-- Admin: toda la org. Ejecutivo: cuentas asignadas. Cliente: sus marcas.
create function app.can_access_brand(b uuid) returns boolean
language sql stable security definer set search_path = public as
$$
  select exists (
    select 1
    from public.brands br
    join public.profiles p on p.id = auth.uid() and p.org_id = br.org_id
    where br.id = b
      and (
        p.role = 'admin'
        or (p.role = 'executive' and exists (
              select 1 from public.executive_assignments ea
              where ea.brand_id = b and ea.user_id = p.id))
        or (p.role = 'client' and exists (
              select 1 from public.client_memberships cm
              where cm.brand_id = b and cm.user_id = p.id))
      )
  )
$$;

-- Equipo interno (admin o ejecutivo asignado). Los clientes no cuentan.
create function app.is_staff_for_brand(b uuid) returns boolean
language sql stable security definer set search_path = public as
$$
  select exists (
    select 1
    from public.brands br
    join public.profiles p on p.id = auth.uid() and p.org_id = br.org_id
    where br.id = b
      and (
        p.role = 'admin'
        or (p.role = 'executive' and exists (
              select 1 from public.executive_assignments ea
              where ea.brand_id = b and ea.user_id = p.id))
      )
  )
$$;

revoke all on function app.my_role(), app.my_org(), app.can_access_brand(uuid), app.is_staff_for_brand(uuid) from public;
grant execute on function app.my_role(), app.my_org(), app.can_access_brand(uuid), app.is_staff_for_brand(uuid) to authenticated;

-- Nadie cambia su propio rol ni su organización, salvo un admin (service_role no tiene auth.uid()).
create function app.guard_profile_change() returns trigger
language plpgsql security definer set search_path = public as
$$
begin
  if auth.uid() is not null
     and (new.role is distinct from old.role or new.org_id is distinct from old.org_id)
     and app.my_role() is distinct from 'admin' then
    raise exception 'No puedes cambiar rol u organización';
  end if;
  return new;
end
$$;
create trigger guard_profile_change before update on public.profiles
  for each row execute function app.guard_profile_change();

-- ── RLS ─────────────────────────────────────────────────
alter table public.organizations         enable row level security;
alter table public.profiles              enable row level security;
alter table public.brands                enable row level security;
alter table public.executive_assignments enable row level security;
alter table public.client_memberships    enable row level security;
alter table public.platform_accounts     enable row level security;
alter table public.metrics_daily         enable row level security;
alter table public.alerts                enable row level security;
alter table public.tasks                 enable row level security;
alter table public.reports               enable row level security;
alter table public.dashboards            enable row level security;
alter table public.prospects             enable row level security;
alter table public.audit_log             enable row level security;

-- organizations / profiles
create policy org_read on public.organizations for select to authenticated
  using (id = app.my_org());

create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or (org_id = app.my_org() and app.my_role() in ('admin', 'executive')));
create policy profiles_update_self on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy profiles_admin_all on public.profiles for all to authenticated
  using (org_id = app.my_org() and app.my_role() = 'admin')
  with check (org_id = app.my_org() and app.my_role() = 'admin');

-- brands
create policy brands_read on public.brands for select to authenticated
  using (app.can_access_brand(id));
create policy brands_admin_write on public.brands for all to authenticated
  using (org_id = app.my_org() and app.my_role() = 'admin')
  with check (org_id = app.my_org() and app.my_role() = 'admin');

-- asignaciones y membresías: lectura propia; gestión solo admin
create policy assignments_read on public.executive_assignments for select to authenticated
  using (user_id = auth.uid() or app.my_role() = 'admin');
create policy assignments_admin_write on public.executive_assignments for all to authenticated
  using (app.my_role() = 'admin' and app.can_access_brand(brand_id))
  with check (app.my_role() = 'admin' and app.can_access_brand(brand_id));

create policy memberships_read on public.client_memberships for select to authenticated
  using (user_id = auth.uid() or app.is_staff_for_brand(brand_id));
create policy memberships_admin_write on public.client_memberships for all to authenticated
  using (app.my_role() = 'admin' and app.can_access_brand(brand_id))
  with check (app.my_role() = 'admin' and app.can_access_brand(brand_id));

-- cuentas de plataforma: solo equipo interno (sin credenciales, pero no es para clientes)
create policy platform_accounts_staff on public.platform_accounts for select to authenticated
  using (app.is_staff_for_brand(brand_id));

-- métricas: lectura por acceso a la marca; escritura solo service_role (sin policy de escritura)
create policy metrics_read on public.metrics_daily for select to authenticated
  using (app.can_access_brand(brand_id));

-- alertas y tareas: internas
create policy alerts_staff on public.alerts for all to authenticated
  using (app.is_staff_for_brand(brand_id)) with check (app.is_staff_for_brand(brand_id));
create policy tasks_staff on public.tasks for all to authenticated
  using (app.is_staff_for_brand(brand_id)) with check (app.is_staff_for_brand(brand_id));

-- reportes: el equipo gestiona; el cliente solo ve los aprobados o enviados
create policy reports_staff on public.reports for all to authenticated
  using (app.is_staff_for_brand(brand_id)) with check (app.is_staff_for_brand(brand_id));
create policy reports_client_read on public.reports for select to authenticated
  using (status in ('approved', 'sent') and app.can_access_brand(brand_id));

-- dashboards: ver los de las marcas accesibles; crear/editar/borrar solo los propios
create policy dashboards_read on public.dashboards for select to authenticated
  using (app.can_access_brand(brand_id));
create policy dashboards_insert on public.dashboards for insert to authenticated
  with check (owner_id = auth.uid() and app.can_access_brand(brand_id));
create policy dashboards_update on public.dashboards for update to authenticated
  using (owner_id = auth.uid() and app.can_access_brand(brand_id))
  with check (owner_id = auth.uid() and app.can_access_brand(brand_id));
create policy dashboards_delete on public.dashboards for delete to authenticated
  using (owner_id = auth.uid());

-- prospectos: equipo interno de la org (nunca clientes)
create policy prospects_staff on public.prospects for all to authenticated
  using (org_id = app.my_org() and app.my_role() in ('admin', 'executive'))
  with check (org_id = app.my_org() and app.my_role() in ('admin', 'executive'));

-- audit_log: solo lectura para admin; se escribe con service_role
create policy audit_admin_read on public.audit_log for select to authenticated
  using (org_id = app.my_org() and app.my_role() = 'admin');
