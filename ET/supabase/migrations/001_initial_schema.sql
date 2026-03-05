-- Profiles (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'analyst' check (role in ('analyst', 'editor', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Sources
create table public.sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  url text not null,
  feed_url text,
  source_type text not null default 'rss' check (source_type in ('rss', 'api', 'scrape')),
  is_active boolean not null default true,
  article_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.sources enable row level security;

create policy "Authenticated users can view sources"
  on public.sources for select
  to authenticated
  using (true);

-- Articles
create table public.articles (
  id uuid primary key default gen_random_uuid(),
  source_id uuid not null references public.sources on delete cascade,
  title text not null,
  url text not null,
  content text not null,
  excerpt text,
  published_at timestamptz not null,
  ingested_at timestamptz not null default now(),
  embedding_id text
);

alter table public.articles enable row level security;

create policy "Authenticated users can view articles"
  on public.articles for select
  to authenticated
  using (true);

create index idx_articles_source on public.articles(source_id);
create index idx_articles_published on public.articles(published_at desc);

-- Queries
create table public.queries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles on delete cascade,
  query_text text not null,
  is_saved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.queries enable row level security;

create policy "Users can view own queries"
  on public.queries for select
  using (auth.uid() = user_id);

create policy "Users can insert own queries"
  on public.queries for insert
  with check (auth.uid() = user_id);

create policy "Users can update own queries"
  on public.queries for update
  using (auth.uid() = user_id);

create index idx_queries_user on public.queries(user_id, created_at desc);

-- Analyses
create table public.analyses (
  id uuid primary key default gen_random_uuid(),
  query_id uuid not null references public.queries on delete cascade unique,
  content text not null,
  confidence numeric(5,2) not null default 0,
  primary_source_count integer not null default 0,
  supporting_source_count integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (
    exists (
      select 1 from public.queries q
      where q.id = analysis_id
        and q.user_id = auth.uid()
    )
  );

-- Fix: reference query_id not analysis_id
drop policy "Users can view own analyses" on public.analyses;
create policy "Users can view own analyses"
  on public.analyses for select
  using (
    exists (
      select 1 from public.queries q
      where q.id = query_id
        and q.user_id = auth.uid()
    )
  );

-- Citations
create table public.citations (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid not null references public.analyses on delete cascade,
  article_id uuid not null references public.articles on delete cascade,
  relevance_score numeric(5,2) not null default 0,
  excerpt text not null,
  position integer not null
);

alter table public.citations enable row level security;

create policy "Users can view citations for own analyses"
  on public.citations for select
  using (
    exists (
      select 1 from public.analyses a
      join public.queries q on q.id = a.query_id
      where a.id = analysis_id
        and q.user_id = auth.uid()
    )
  );

create index idx_citations_analysis on public.citations(analysis_id, position);

-- Seed some initial sources
insert into public.sources (name, slug, url, feed_url, source_type) values
  ('Financial Times', 'ft', 'https://ft.com', 'https://ft.com/rss/home', 'rss'),
  ('Caixin Global', 'caixin', 'https://caixinglobal.com', 'https://caixinglobal.com/rss', 'rss'),
  ('Nikkei Asia', 'nikkei', 'https://asia.nikkei.com', 'https://asia.nikkei.com/rss', 'rss'),
  ('Wall Street Journal', 'wsj', 'https://wsj.com', 'https://feeds.a.dj.com/rss/RSSWorldNews.xml', 'rss'),
  ('Reuters', 'reuters', 'https://reuters.com', 'https://reuters.com/rssfeed/worldnews', 'rss'),
  ('Bloomberg', 'bloomberg', 'https://bloomberg.com', null, 'api'),
  ('South China Morning Post', 'scmp', 'https://scmp.com', 'https://scmp.com/rss', 'rss');

-- Update article counts via trigger
create or replace function public.update_source_article_count()
returns trigger as $$
begin
  if tg_op = 'INSERT' then
    update public.sources set article_count = article_count + 1 where id = new.source_id;
  elsif tg_op = 'DELETE' then
    update public.sources set article_count = article_count - 1 where id = old.source_id;
  end if;
  return null;
end;
$$ language plpgsql security definer;

create trigger on_article_change
  after insert or delete on public.articles
  for each row execute function public.update_source_article_count();
