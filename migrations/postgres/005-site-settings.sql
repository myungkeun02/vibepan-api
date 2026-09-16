CREATE TABLE IF NOT EXISTS site_settings (key TEXT PRIMARY KEY, value JSONB NOT NULL, updated_by TEXT, updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP);
INSERT INTO site_settings(key,value) VALUES ('registration_open','true'),('saas_submissions_open','true') ON CONFLICT DO NOTHING;
