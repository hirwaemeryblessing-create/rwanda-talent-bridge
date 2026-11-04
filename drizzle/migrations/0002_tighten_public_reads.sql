drop policy if exists "categories public" on public.categories;
create policy "categories read" on public.categories for select to anon, authenticated
  using (auth.uid() is not null or exists (select 1 from public.jobs j where j.category = categories.name and j.status = 'published'));

drop policy if exists "inst public" on public.institution_profiles;
create policy "inst read" on public.institution_profiles for select to anon, authenticated
  using (auth.uid() is not null or exists (select 1 from public.jobs j where j.institution_id = institution_profiles.user_id and j.status = 'published'));

drop policy if exists "avatars public read" on storage.objects;
create policy "avatars own read" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (auth.uid())::text);