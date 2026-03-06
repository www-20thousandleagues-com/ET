-- Fix #1: Profiles UPDATE policy - prevent role escalation
-- The old policy only had USING but no WITH CHECK, allowing role changes
drop policy "Users can update own profile" on public.profiles;
create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id AND role = (select role from public.profiles where id = auth.uid()));

-- Fix #2: DELETE policies for GDPR compliance (users can delete their own data)
create policy "Users can delete own queries"
  on public.queries for delete
  using (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (
    exists (
      select 1 from public.queries q
      where q.id = query_id
        and q.user_id = auth.uid()
    )
  );

create policy "Users can delete own citations"
  on public.citations for delete
  using (
    exists (
      select 1 from public.analyses a
      join public.queries q on q.id = a.query_id
      where a.id = analysis_id
        and q.user_id = auth.uid()
    )
  );
