-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create workspaces table
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  integration_type TEXT NOT NULL, -- e.g., 'linear', 'github'
  access_token TEXT NOT NULL,
  team_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create changelogs table
CREATE TABLE changelogs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  date_from TIMESTAMP WITH TIME ZONE NOT NULL,
  date_to TIMESTAMP WITH TIME ZONE NOT NULL,
  raw_tickets JSONB NOT NULL,
  user_changelog TEXT,
  dev_changelog TEXT,
  exec_summary TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  slug TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_workspaces_user_id ON workspaces(user_id);
CREATE INDEX idx_changelogs_slug ON changelogs(slug);

-- Enable RLS
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE changelogs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Note: Assuming standard Supabase auth. If using Clerk, `auth.uid()` might need to be 
-- adjusted to match Clerk's JWT subject claim based on your integration method.
CREATE POLICY "Users can manage their own workspaces"
  ON workspaces
  FOR ALL
  USING (auth.uid()::text = user_id);

CREATE POLICY "Users can manage changelogs for their workspaces"
  ON changelogs
  FOR ALL
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()::text
    )
  );

CREATE POLICY "Anyone can view published changelogs"
  ON changelogs
  FOR SELECT
  USING (published_at IS NOT NULL);
