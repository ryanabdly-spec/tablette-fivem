-- Module Événements BLACK ACE V15.8
-- Tables séparées des groupes de la tablette : les partenaires ne deviennent pas des comptes.
create table if not exists public.event_groups (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 100),
  notes text not null default '',
  active boolean not null default true,
  created_by uuid references public.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create unique index if not exists event_groups_name_ci on public.event_groups(lower(trim(name)));

create table if not exists public.event_entries (
  id uuid primary key default gen_random_uuid(),
  group_id uuid not null references public.event_groups(id) on delete restrict,
  entry_type text not null check (entry_type in ('don', 'reception')),
  item text not null check (char_length(trim(item)) between 1 and 90),
  quantity numeric(14,3) not null check (quantity > 0 and quantity <= 100000000),
  unit text not null check (unit in ('pcs','L','heures','g','kg')),
  event_date date not null,
  note text not null default '' check (char_length(note) <= 2000),
  created_by uuid references public.app_users(id) on delete set null,
  updated_by uuid references public.app_users(id) on delete set null,
  deleted_by uuid references public.app_users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint event_entry_items check (
     (entry_type='reception' and item='Têtes fraîches' and unit in ('g','kg'))
     or (entry_type='don' and item in ('Graines','Eau','Pots','Fertilisant','Lumière','Terre','Autre'))
  )
);
create index if not exists idx_event_entries_group_date on public.event_entries(group_id,event_date desc) where deleted_at is null;
create index if not exists idx_event_entries_date on public.event_entries(event_date desc) where deleted_at is null;

alter table public.event_groups enable row level security;
alter table public.event_entries enable row level security;
revoke all on public.event_groups from anon, authenticated;
revoke all on public.event_entries from anon, authenticated;

-- Les membres Black Ace peuvent accéder à la rubrique ; les clients n'y ont pas accès.
update public.roles set permissions = coalesce(permissions, '{}'::jsonb) || '{"events.view":true,"events.edit":true}'::jsonb
where slug='member';
