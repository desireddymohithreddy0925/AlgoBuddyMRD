-- Add joined_community column to user_profiles for Join Community Button
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS joined_community BOOLEAN DEFAULT false;

-- ── user_activity ──────────────────────────────────────────────────────
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own activity" ON user_activity
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activity" ON user_activity
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activity" ON user_activity
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── problem_bookmarks ──────────────────────────────────────────────────
ALTER TABLE problem_bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own bookmarks" ON problem_bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks" ON problem_bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks" ON problem_bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks" ON problem_bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- ── user_progress ──────────────────────────────────────────────────────
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own progress" ON user_progress
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own progress" ON user_progress
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own progress" ON user_progress
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ── user_profiles ──────────────────────────────────────────────────────
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON user_profiles
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- ── community_contributors (already has SELECT for public) ──────────────
ALTER TABLE community_contributors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON community_contributors
  FOR SELECT
  USING (true);

-- Admin users can manage contributors (requires a custom claim or user_metadata)
CREATE POLICY "Admins can insert contributors" ON community_contributors
  FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can update contributors" ON community_contributors
  FOR UPDATE
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

CREATE POLICY "Admins can delete contributors" ON community_contributors
  FOR DELETE
  USING (
    auth.role() = 'authenticated' AND
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );

-- ====================================================================
-- pending_messages table for SMTP quota fallback
-- ====================================================================
CREATE TABLE IF NOT EXISTS pending_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('contact', 'review')),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  sent_at TIMESTAMPTZ
);

ALTER TABLE pending_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can insert pending_messages" ON pending_messages
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read pending_messages" ON pending_messages
  FOR SELECT
  USING (true);

CREATE POLICY "Service role can update pending_messages" ON pending_messages
  FOR UPDATE
  USING (true);

-- ====================================================================
-- newsletter_subscriptions table for Footer Newsletter
-- ====================================================================
CREATE TABLE IF NOT EXISTS newsletter_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMPTZ DEFAULT now(),
  status TEXT DEFAULT 'active'
);

ALTER TABLE newsletter_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role can manage newsletter_subscriptions" ON newsletter_subscriptions
  USING (true) WITH CHECK (true);
