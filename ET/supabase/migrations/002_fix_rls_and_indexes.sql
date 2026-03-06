-- Allow service role to insert articles (for n8n RSS pipeline)
create policy "Service role can insert articles"
  on public.articles for insert
  to service_role
  with check (true);

-- Allow service role to update articles
create policy "Service role can update articles"
  on public.articles for update
  to service_role
  using (true);

-- Allow service role to insert/update sources
create policy "Service role can insert sources"
  on public.sources for insert
  to service_role
  with check (true);

create policy "Service role can update sources"
  on public.sources for update
  to service_role
  using (true);

-- Allow authenticated users to insert their own analyses and citations
create policy "Users can insert own analyses"
  on public.analyses for insert
  to authenticated
  with check (
    exists (
      select 1 from public.queries q
      where q.id = query_id
        and q.user_id = auth.uid()
    )
  );

create policy "Users can insert citations for own analyses"
  on public.citations for insert
  to authenticated
  with check (
    exists (
      select 1 from public.analyses a
      join public.queries q on q.id = a.query_id
      where a.id = analysis_id
        and q.user_id = auth.uid()
    )
  );

-- Index for Pinecone-to-Supabase cross-reference lookups
create index if not exists idx_articles_embedding_id on public.articles(embedding_id);

-- Auto-update updated_at on profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
