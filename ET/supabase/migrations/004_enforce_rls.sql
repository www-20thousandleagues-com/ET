-- ============================================================================
-- Migration 004: Enforce RLS on ALL tables
--
-- CRITICAL: This migration enables RLS and creates policies that allow:
--   - Anonymous users: read sources and articles (public data)
--   - Authenticated users: read/write their own queries, analyses, citations
--   - Service role (n8n pipeline): full access to all tables
--
-- Run this in the Supabase SQL Editor with the service_role key.
-- ============================================================================

-- Step 1: Force-enable RLS on all tables (idempotent)
ALTER TABLE public.sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.citations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 2: Force RLS even for table owners (prevents bypass)
ALTER TABLE public.sources FORCE ROW LEVEL SECURITY;
ALTER TABLE public.articles FORCE ROW LEVEL SECURITY;
ALTER TABLE public.queries FORCE ROW LEVEL SECURITY;
ALTER TABLE public.analyses FORCE ROW LEVEL SECURITY;
ALTER TABLE public.citations FORCE ROW LEVEL SECURITY;
ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;

-- Step 3: Drop ALL existing policies to start clean
DO $$
DECLARE
    r RECORD;
BEGIN
    FOR r IN (
        SELECT schemaname, tablename, policyname
        FROM pg_policies
        WHERE schemaname = 'public'
    ) LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- ============================================================================
-- SOURCES: Public read, service_role write
-- ============================================================================
CREATE POLICY "Anyone can view active sources"
  ON public.sources FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

CREATE POLICY "Service role full access to sources"
  ON public.sources FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ARTICLES: Public read, service_role write
-- ============================================================================
CREATE POLICY "Anyone can view articles"
  ON public.articles FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Service role full access to articles"
  ON public.articles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- QUERIES: Owner read/write, service_role full access
-- ============================================================================
CREATE POLICY "Users can view own queries"
  ON public.queries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own queries"
  ON public.queries FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own queries"
  ON public.queries FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own queries"
  ON public.queries FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Service role full access to queries"
  ON public.queries FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- ANALYSES: Owner read/write (via query ownership), service_role full access
-- ============================================================================
CREATE POLICY "Users can view own analyses"
  ON public.analyses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.queries q
      WHERE q.id = query_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own analyses"
  ON public.analyses FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.queries q
      WHERE q.id = query_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own analyses"
  ON public.analyses FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.queries q
      WHERE q.id = query_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access to analyses"
  ON public.analyses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- CITATIONS: Owner read/write (via analysis->query ownership), service_role full access
-- ============================================================================
CREATE POLICY "Users can view own citations"
  ON public.citations FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses a
      JOIN public.queries q ON q.id = a.query_id
      WHERE a.id = analysis_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own citations"
  ON public.citations FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.analyses a
      JOIN public.queries q ON q.id = a.query_id
      WHERE a.id = analysis_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own citations"
  ON public.citations FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.analyses a
      JOIN public.queries q ON q.id = a.query_id
      WHERE a.id = analysis_id AND q.user_id = auth.uid()
    )
  );

CREATE POLICY "Service role full access to citations"
  ON public.citations FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================================================
-- PROFILES: Owner read/update, no role escalation
-- ============================================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id
    AND role = (SELECT role FROM public.profiles WHERE id = auth.uid())
  );

CREATE POLICY "Service role full access to profiles"
  ON public.profiles FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
