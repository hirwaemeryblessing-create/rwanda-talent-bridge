
create table public.saved_jobs (
  id uuid primary key default gen_random_uuid(),
  seeker_id uuid not null references public.profiles(id) on delete cascade,
  job_id uuid not null references public.jobs(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (seeker_id, job_id)
);
grant select, insert, delete on public.saved_jobs to authenticated;
grant all on public.saved_jobs to service_role;
alter table public.saved_jobs enable row level security;
create policy "saved own" on public.saved_jobs for all to authenticated
  using (seeker_id = auth.uid()) with check (seeker_id = auth.uid());

alter table public.jobs add constraint jobs_institution_profile_fk
  foreign key (institution_id) references public.institution_profiles(user_id) on delete cascade;
alter table public.applications add constraint applications_seeker_profile_fk
  foreign key (seeker_id) references public.seeker_profiles(user_id) on delete cascade;
alter table public.matches add constraint matches_seeker_profile_fk
  foreign key (seeker_id) references public.seeker_profiles(user_id) on delete cascade;
alter table public.conversations add constraint conv_inst_profile_fk
  foreign key (institution_id) references public.institution_profiles(user_id) on delete cascade;
