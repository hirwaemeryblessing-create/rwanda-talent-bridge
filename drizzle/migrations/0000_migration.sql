
-- ===== Enums & helpers =====
create type public.app_role as enum ('admin', 'seeker', 'institution');

create or replace function public.edu_rank(_lvl text) returns int
language sql immutable set search_path = public as $$
  select case lower(coalesce(_lvl,''))
    when 'primary' then 1 when 'secondary' then 2 when 'certificate' then 3
    when 'diploma' then 4 when 'bachelor' then 5 when 'master' then 6 when 'phd' then 7
    else 0 end
$$;

-- ===== Core user tables =====
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  account_type text not null check (account_type in ('seeker','institution','admin')),
  email text not null,
  full_name text not null default '',
  phone text,
  avatar_url text,
  status text not null default 'active' check (status in ('active','suspended')),
  language text not null default 'en',
  created_at timestamptz not null default now()
);
grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;
alter table public.profiles enable row level security;

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = _user_id and role = _role)
$$;

create policy "own roles" on public.user_roles for select to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

create table public.seeker_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  gender text,
  date_of_birth date,
  province text,
  district text,
  qualifications text,
  education_level text,
  field_of_study text,
  experience_years int not null default 0,
  experience_summary text,
  skills text[] not null default '{}',
  languages text[] not null default '{}',
  preferred_sector text,
  preferred_location text,
  cv_path text,
  visible_to_employers boolean not null default true,
  updated_at timestamptz not null default now()
);
grant select, insert, update on public.seeker_profiles to authenticated;
grant all on public.seeker_profiles to service_role;
alter table public.seeker_profiles enable row level security;

create table public.institution_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  name text not null,
  institution_type text,
  address text,
  province text,
  district text,
  website text,
  logo_url text,
  description text,
  contact_name text,
  contact_position text,
  verified boolean not null default false,
  created_at timestamptz not null default now()
);
grant select on public.institution_profiles to anon;
grant select, insert, update on public.institution_profiles to authenticated;
grant all on public.institution_profiles to service_role;
alter table public.institution_profiles enable row level security;

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique
);
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;
grant all on public.categories to service_role;
alter table public.categories enable row level security;
create policy "categories public" on public.categories for select using (true);
create policy "admin manage categories" on public.categories for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));
insert into public.categories(name) values
 ('Accounting & Finance'),('Agriculture'),('Construction & Engineering'),('Education'),('Health'),
 ('Hospitality & Tourism'),('ICT & Technology'),('Law & Legal'),('Logistics & Transport'),
 ('Manufacturing'),('Marketing & Sales'),('NGO & Development'),('Public Administration'),
 ('Banking & Insurance'),('Mining & Energy'),('Media & Communication'),('Human Resources'),('Other');

-- ===== Jobs =====
create table public.jobs (
  id uuid primary key default gen_random_uuid(),
  institution_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  reference text,
  category text,
  description text not null default '',
  positions int not null default 1,
  education_level text,
  fields_of_study text[] not null default '{}',
  qualifications text,
  skills_required text[] not null default '{}',
  skills_preferred text[] not null default '{}',
  min_experience int not null default 0,
  languages text[] not null default '{}',
  certifications text,
  employment_type text,
  salary_min int,
  salary_max int,
  location text not null default 'Any',
  is_international boolean not null default false,
  deadline date,
  gender_requirement text not null default 'Any',
  additional_requirements text,
  required_documents text,
  instructions text,
  status text not null default 'published' check (status in ('draft','published','closed','removed')),
  match_count int not null default 0,
  created_at timestamptz not null default now()
);
create index jobs_status_idx on public.jobs(status, created_at desc);
create index jobs_inst_idx on public.jobs(institution_id);
grant select on public.jobs to anon;
grant select, insert, update, delete on public.jobs to authenticated;
grant all on public.jobs to service_role;
alter table public.jobs enable row level security;
create policy "published jobs public" on public.jobs for select using (status = 'published');
create policy "inst own jobs" on public.jobs for all to authenticated
  using (institution_id = auth.uid())
  with check (institution_id = auth.uid() and public.has_role(auth.uid(),'institution'));
create policy "admin jobs" on public.jobs for all to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

-- ===== Applications & matches =====
create table public.applications (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  cover_letter text,
  answers text,
  cv_path text,
  document_paths text[] not null default '{}',
  status text not null default 'submitted' check (status in ('submitted','reviewing','shortlisted','interview','rejected','hired')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_id, seeker_id)
);
create index applications_seeker_idx on public.applications(seeker_id);
grant select, insert, update on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;

create table public.matches (
  id uuid primary key default gen_random_uuid(),
  job_id uuid not null references public.jobs(id) on delete cascade,
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  score int not null default 0,
  created_at timestamptz not null default now(),
  unique (job_id, seeker_id)
);
create index matches_seeker_idx on public.matches(seeker_id);
grant select on public.matches to authenticated;
grant all on public.matches to service_role;
alter table public.matches enable row level security;

create or replace function public.job_owner(_job uuid) returns uuid
language sql stable security definer set search_path = public as $$
  select institution_id from public.jobs where id = _job
$$;

create or replace function public.can_view_seeker(_viewer uuid, _seeker uuid) returns boolean
language sql stable security definer set search_path = public as $$
  select _viewer = _seeker
    or public.has_role(_viewer,'admin')
    or exists (select 1 from public.applications a join public.jobs j on j.id=a.job_id
               where a.seeker_id=_seeker and j.institution_id=_viewer)
    or exists (select 1 from public.matches m join public.jobs j on j.id=m.job_id
               join public.seeker_profiles s on s.user_id=m.seeker_id
               where m.seeker_id=_seeker and j.institution_id=_viewer and s.visible_to_employers)
$$;

create policy "seeker own apps" on public.applications for select to authenticated using (seeker_id = auth.uid());
create policy "seeker apply" on public.applications for insert to authenticated
  with check (seeker_id = auth.uid() and public.has_role(auth.uid(),'seeker')
    and exists (select 1 from public.jobs j where j.id = job_id and j.status='published'));
create policy "inst view apps" on public.applications for select to authenticated using (public.job_owner(job_id) = auth.uid());
create policy "inst update apps" on public.applications for update to authenticated
  using (public.job_owner(job_id) = auth.uid()) with check (public.job_owner(job_id) = auth.uid());
create policy "admin apps" on public.applications for select to authenticated using (public.has_role(auth.uid(),'admin'));

create policy "seeker own matches" on public.matches for select to authenticated using (seeker_id = auth.uid());
create policy "inst job matches" on public.matches for select to authenticated using (public.job_owner(job_id) = auth.uid());
create policy "admin matches" on public.matches for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- profiles / seeker / institution policies
create policy "profiles view" on public.profiles for select to authenticated
  using (id = auth.uid() or account_type = 'institution' or public.can_view_seeker(auth.uid(), id));
create policy "profiles update own" on public.profiles for update to authenticated
  using (id = auth.uid()) with check (id = auth.uid());
create policy "profiles admin update" on public.profiles for update to authenticated
  using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create policy "seeker view" on public.seeker_profiles for select to authenticated
  using (public.can_view_seeker(auth.uid(), user_id));
create policy "seeker insert own" on public.seeker_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "seeker update own" on public.seeker_profiles for update to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "inst public" on public.institution_profiles for select using (true);
create policy "inst insert own" on public.institution_profiles for insert to authenticated with check (user_id = auth.uid());
create policy "inst update own" on public.institution_profiles for update to authenticated
  using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'))
  with check (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));

-- protect privileged columns
create or replace function public.protect_columns() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if public.has_role(auth.uid(),'admin') or auth.uid() is null then return new; end if;
  if tg_table_name = 'profiles' then
    new.status := old.status; new.account_type := old.account_type; new.email := old.email;
  elsif tg_table_name = 'institution_profiles' then
    new.verified := old.verified;
  end if;
  return new;
end $$;
create trigger profiles_protect before update on public.profiles for each row execute function public.protect_columns();
create trigger inst_protect before update on public.institution_profiles for each row execute function public.protect_columns();

-- ===== Messaging & notifications =====
create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  institution_id uuid not null references public.profiles(id) on delete cascade,
  updated_at timestamptz not null default now(),
  unique (seeker_id, institution_id)
);
grant select, insert, update on public.conversations to authenticated;
grant all on public.conversations to service_role;
alter table public.conversations enable row level security;
create policy "conv participants" on public.conversations for select to authenticated
  using (auth.uid() in (seeker_id, institution_id));
create policy "conv create" on public.conversations for insert to authenticated
  with check (
    (auth.uid() = institution_id and public.has_role(auth.uid(),'institution') and public.can_view_seeker(auth.uid(), seeker_id))
    or (auth.uid() = seeker_id and public.has_role(auth.uid(),'seeker') and public.has_role(institution_id,'institution')));
create policy "conv touch" on public.conversations for update to authenticated
  using (auth.uid() in (seeker_id, institution_id)) with check (auth.uid() in (seeker_id, institution_id));

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references public.conversations(id) on delete cascade,
  sender_id uuid references public.profiles(id) on delete set null,
  recipient_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null default 'direct' check (kind in ('direct','job_match','interview','status','system')),
  subject text,
  body text not null,
  job_id uuid references public.jobs(id) on delete set null,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index messages_recipient_idx on public.messages(recipient_id, created_at desc);
create index messages_conv_idx on public.messages(conversation_id, created_at);
grant select, insert, update on public.messages to authenticated;
grant all on public.messages to service_role;
alter table public.messages enable row level security;
create policy "msg view" on public.messages for select to authenticated
  using (auth.uid() = recipient_id or auth.uid() = sender_id);
create policy "msg send" on public.messages for insert to authenticated
  with check (sender_id = auth.uid() and kind = 'direct' and conversation_id is not null
    and exists (select 1 from public.conversations c where c.id = conversation_id
      and ((c.seeker_id = auth.uid() and c.institution_id = recipient_id)
        or (c.institution_id = auth.uid() and c.seeker_id = recipient_id))));
create policy "msg mark read" on public.messages for update to authenticated
  using (auth.uid() = recipient_id) with check (auth.uid() = recipient_id);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  title text not null,
  body text,
  link text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);
create index notifications_user_idx on public.notifications(user_id, created_at desc);
grant select, update on public.notifications to authenticated;
grant all on public.notifications to service_role;
alter table public.notifications enable row level security;
create policy "notif own" on public.notifications for select to authenticated using (user_id = auth.uid() or public.has_role(auth.uid(),'admin'));
create policy "notif read" on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

create table public.interviews (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  scheduled_at timestamptz not null,
  mode text not null default 'In person',
  location text,
  notes text,
  status text not null default 'scheduled' check (status in ('scheduled','completed','cancelled')),
  created_at timestamptz not null default now()
);
grant select, insert, update on public.interviews to authenticated;
grant all on public.interviews to service_role;
alter table public.interviews enable row level security;
create or replace function public.app_parties(_app uuid, _user uuid) returns text
language sql stable security definer set search_path = public as $$
  select case when a.seeker_id = _user then 'seeker' when j.institution_id = _user then 'institution' else null end
  from public.applications a join public.jobs j on j.id = a.job_id where a.id = _app
$$;
create policy "interview view" on public.interviews for select to authenticated using (public.app_parties(application_id, auth.uid()) is not null);
create policy "interview create" on public.interviews for insert to authenticated with check (public.app_parties(application_id, auth.uid()) = 'institution');
create policy "interview update" on public.interviews for update to authenticated using (public.app_parties(application_id, auth.uid()) = 'institution');

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null default auth.uid() references public.profiles(id) on delete cascade,
  target_type text not null check (target_type in ('job','user')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','resolved','dismissed')),
  created_at timestamptz not null default now()
);
grant select, insert, update on public.reports to authenticated;
grant all on public.reports to service_role;
alter table public.reports enable row level security;
create policy "report create" on public.reports for insert to authenticated with check (reporter_id = auth.uid());
create policy "report admin" on public.reports for select to authenticated using (public.has_role(auth.uid(),'admin') or reporter_id = auth.uid());
create policy "report admin update" on public.reports for update to authenticated using (public.has_role(auth.uid(),'admin'));

-- admin read-all
create policy "admin profiles" on public.profiles for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admin conv" on public.conversations for select to authenticated using (public.has_role(auth.uid(),'admin'));

-- ===== Signup trigger =====
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  m jsonb := coalesce(new.raw_user_meta_data, '{}'::jsonb);
  t text := case when m->>'account_type' = 'institution' then 'institution' else 'seeker' end;
begin
  insert into public.profiles(id, account_type, email, full_name, phone)
  values (new.id, t, new.email, coalesce(m->>'full_name', m->>'institution_name', m->>'name', ''), m->>'phone');
  insert into public.user_roles(user_id, role) values (new.id, t::app_role);
  if t = 'institution' then
    insert into public.institution_profiles(user_id, name, institution_type, address, province, district, website, description, contact_name, contact_position)
    values (new.id, coalesce(m->>'institution_name','Institution'), m->>'institution_type', m->>'address', m->>'province', m->>'district',
            m->>'website', m->>'description', m->>'contact_name', m->>'contact_position');
  else
    insert into public.seeker_profiles(user_id, gender, date_of_birth, province, district, qualifications, education_level, field_of_study,
      experience_years, experience_summary, skills, languages, preferred_sector, preferred_location)
    values (new.id, nullif(m->>'gender',''), nullif(m->>'date_of_birth','')::date, m->>'province', m->>'district', m->>'qualifications',
      m->>'education_level', m->>'field_of_study', coalesce(nullif(m->>'experience_years','')::int, 0), m->>'experience_summary',
      coalesce(array(select jsonb_array_elements_text(m->'skills')), '{}'),
      coalesce(array(select jsonb_array_elements_text(m->'languages')), '{}'),
      m->>'preferred_sector', m->>'preferred_location');
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ===== Matching engine =====
create or replace function public.is_eligible(j public.jobs, s public.seeker_profiles) returns boolean
language plpgsql stable security definer set search_path = public as $$
declare g text;
begin
  if public.edu_rank(j.education_level) > public.edu_rank(s.education_level) then return false; end if;
  if coalesce(s.experience_years,0) < coalesce(j.min_experience,0) then return false; end if;
  if exists (select 1 from unnest(j.skills_required) r
             where not exists (select 1 from unnest(s.skills) k where lower(trim(k)) = lower(trim(r)))) then return false; end if;
  if exists (select 1 from unnest(j.languages) r
             where not exists (select 1 from unnest(s.languages) k where lower(trim(k)) = lower(trim(r)))) then return false; end if;
  if array_length(j.fields_of_study,1) > 0 and not exists (
       select 1 from unnest(j.fields_of_study) f
       where coalesce(s.field_of_study,'') ilike '%'||trim(f)||'%' or trim(f) ilike '%'||coalesce(nullif(s.field_of_study,''),'~~~')||'%') then return false; end if;
  if coalesce(j.location,'Any') not in ('Any','Remote') and not j.is_international then
    if not (coalesce(s.preferred_location,'Any') in ('Any', j.location) or s.district = j.location
            or (j.location = 'Kigali' and s.province = 'Kigali City')) then return false; end if;
  end if;
  if coalesce(j.gender_requirement,'Any') <> 'Any' then
    if coalesce(s.gender,'') <> j.gender_requirement then return false; end if;
  end if;
  return true;
end $$;

create or replace function public.notify_match(_job uuid, _seeker uuid) returns void
language plpgsql security definer set search_path = public as $$
declare j public.jobs; s public.seeker_profiles; p public.profiles; inst text; sc int; ins int;
begin
  select * into j from public.jobs where id = _job;
  select * into s from public.seeker_profiles where user_id = _seeker;
  select * into p from public.profiles where id = _seeker;
  select name into inst from public.institution_profiles where user_id = j.institution_id;
  select count(*) into sc from unnest(j.skills_preferred) r where exists (select 1 from unnest(s.skills) k where lower(trim(k))=lower(trim(r)));
  insert into public.matches(job_id, seeker_id, score) values (_job, _seeker, sc) on conflict do nothing;
  get diagnostics ins = row_count;
  if ins = 0 then return; end if;
  insert into public.messages(recipient_id, kind, subject, body, job_id)
  values (_seeker, 'job_match', 'NEW JOB OPPORTUNITY FOR YOU!',
    'Hello ' || split_part(coalesce(nullif(p.full_name,''),'there'),' ',1) || E',\n\n' ||
    coalesce(inst,'An institution') || E' has published a new job opportunity that matches your professional qualifications and experience.\n\n' ||
    'Position: ' || j.title || E'\nLocation: ' || coalesce(j.location,'Any') || E'\nRequired experience: ' || j.min_experience || E' year(s)\n\n' ||
    E'Your profile meets the eligibility conditions specified by the employer.\n\nYou are encouraged to review the job description and submit your application' ||
    coalesce(' before the deadline (' || to_char(j.deadline,'DD Mon YYYY') || ')', '') || E'.\n\nThank you for using hiJOBS RWANDA.', _job);
  insert into public.notifications(user_id, title, body, link)
  values (_seeker, 'New job match: ' || j.title, coalesce(inst,'An institution') || ' · ' || coalesce(j.location,'Any'), '/jobs/' || _job);
end $$;

create or replace function public.run_job_matching(_job uuid) returns int
language plpgsql security definer set search_path = public as $$
declare j public.jobs; s public.seeker_profiles; n int;
begin
  select * into j from public.jobs where id = _job;
  if j.status <> 'published' then return 0; end if;
  for s in select sp.* from public.seeker_profiles sp join public.profiles p on p.id = sp.user_id where p.status = 'active' loop
    if public.is_eligible(j, s) then perform public.notify_match(_job, s.user_id); end if;
  end loop;
  select count(*) into n from public.matches where job_id = _job;
  update public.jobs set match_count = n where id = _job;
  return n;
end $$;

create or replace function public.jobs_after_write() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.status = 'published' and (tg_op = 'INSERT' or old.status is distinct from 'published'
     or old.skills_required is distinct from new.skills_required or old.education_level is distinct from new.education_level
     or old.min_experience is distinct from new.min_experience or old.languages is distinct from new.languages
     or old.location is distinct from new.location or old.fields_of_study is distinct from new.fields_of_study) then
    perform public.run_job_matching(new.id);
  end if;
  return null;
end $$;
create trigger jobs_match after insert or update on public.jobs for each row execute function public.jobs_after_write();

-- when a seeker updates their profile, match them against open jobs
create or replace function public.seeker_after_write() returns trigger
language plpgsql security definer set search_path = public as $$
declare j public.jobs;
begin
  for j in select * from public.jobs where status = 'published' and (deadline is null or deadline >= current_date) loop
    if public.is_eligible(j, new) then
      perform public.notify_match(j.id, new.user_id);
      update public.jobs set match_count = (select count(*) from public.matches where job_id = j.id) where id = j.id;
    end if;
  end loop;
  return null;
end $$;
create trigger seeker_match after insert or update on public.seeker_profiles for each row execute function public.seeker_after_write();

-- ===== Application events =====
create or replace function public.applications_events() returns trigger
language plpgsql security definer set search_path = public as $$
declare j public.jobs; nm text;
begin
  select * into j from public.jobs where id = new.job_id;
  if tg_op = 'INSERT' then
    select full_name into nm from public.profiles where id = new.seeker_id;
    insert into public.notifications(user_id, title, body, link)
    values (j.institution_id, 'New application: ' || j.title, coalesce(nm,'A candidate') || ' applied', '/employer/applicants');
  elsif new.status is distinct from old.status then
    new.updated_at := now();
    insert into public.messages(recipient_id, sender_id, kind, subject, body, job_id)
    values (new.seeker_id, j.institution_id, 'status', 'Application update: ' || j.title,
      'Your application for "' || j.title || '" is now: ' || upper(new.status) || '.', j.id);
    insert into public.notifications(user_id, title, body, link)
    values (new.seeker_id, 'Application ' || new.status, j.title, '/seeker/applications');
  end if;
  return new;
end $$;
create trigger applications_ins after insert on public.applications for each row execute function public.applications_events();
create trigger applications_upd before update on public.applications for each row execute function public.applications_events();

create or replace function public.interviews_events() returns trigger
language plpgsql security definer set search_path = public as $$
declare a public.applications; j public.jobs;
begin
  select * into a from public.applications where id = new.application_id;
  select * into j from public.jobs where id = a.job_id;
  insert into public.messages(recipient_id, sender_id, kind, subject, body, job_id)
  values (a.seeker_id, j.institution_id, 'interview', 'Interview invitation: ' || j.title,
    'You are invited for an interview for "' || j.title || '" on ' || to_char(new.scheduled_at at time zone 'Africa/Kigali', 'DD Mon YYYY HH24:MI') ||
    ' (Kigali time). Mode: ' || new.mode || coalesce(E'\nLocation: ' || new.location, '') || coalesce(E'\nNotes: ' || new.notes, ''), j.id);
  insert into public.notifications(user_id, title, body, link)
  values (a.seeker_id, 'Interview invitation', j.title, '/seeker/interviews');
  if a.status <> 'interview' then update public.applications set status = 'interview' where id = a.id; end if;
  return new;
end $$;
create trigger interviews_ins after insert on public.interviews for each row execute function public.interviews_events();

-- direct message -> notification + bump conversation
create or replace function public.messages_events() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.kind = 'direct' then
    update public.conversations set updated_at = now() where id = new.conversation_id;
    insert into public.notifications(user_id, title, body, link)
    values (new.recipient_id, 'New message', left(new.body, 80), null);
  end if;
  return null;
end $$;
create trigger messages_ins after insert on public.messages for each row execute function public.messages_events();

revoke execute on function public.run_job_matching(uuid) from anon, authenticated, public;
revoke execute on function public.notify_match(uuid, uuid) from anon, authenticated, public;

alter publication supabase_realtime add table public.messages;
alter publication supabase_realtime add table public.notifications;

-- ===== Storage policies (buckets created separately) =====
create policy "docs own write" on storage.objects for insert to authenticated
  with check (bucket_id in ('documents','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "docs own update" on storage.objects for update to authenticated
  using (bucket_id in ('documents','avatars') and (storage.foldername(name))[1] = auth.uid()::text);
create policy "docs read" on storage.objects for select to authenticated
  using (bucket_id = 'documents' and public.can_view_seeker(auth.uid(), ((storage.foldername(name))[1])::uuid));
create policy "avatars public read" on storage.objects for select using (bucket_id = 'avatars');
