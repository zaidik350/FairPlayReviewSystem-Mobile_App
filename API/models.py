"""
Supabase Table Schema Reference
================================
This file documents the expected table structures in Supabase.
The application uses the Supabase client directly (not SQLAlchemy).

users:
  - id            SERIAL PRIMARY KEY
  - name          TEXT NOT NULL
  - email         TEXT UNIQUE NOT NULL
  - password_hash TEXT NOT NULL
  - avatar        TEXT
  - created_at    TIMESTAMPTZ DEFAULT now()

matches:
  - id            SERIAL PRIMARY KEY
  - name          TEXT NOT NULL
  - teams         TEXT NOT NULL
  - venue         TEXT NOT NULL
  - date          TEXT NOT NULL
  - status        TEXT NOT NULL DEFAULT 'upcoming'   -- 'upcoming' | 'live' | 'completed'
  - created_at    TIMESTAMPTZ DEFAULT now()

reviews:
  - id                SERIAL PRIMARY KEY
  - match_id          INTEGER REFERENCES matches(id)
  - match_name        TEXT NOT NULL
  - user_id           INTEGER REFERENCES users(id)
  - over              TEXT NOT NULL
  - original_decision TEXT NOT NULL                  -- 'OUT' | 'NOT OUT'
  - decision          TEXT NOT NULL                  -- 'OUT' | 'NOT OUT'
  - impact            TEXT NOT NULL                  -- 'In-line' | 'Outside'
  - pitch             TEXT NOT NULL                  -- 'In-line' | 'Outside'
  - wickets           TEXT NOT NULL                  -- 'Hitting' | 'Missing'
  - video_uri         TEXT
  - created_at        TIMESTAMPTZ DEFAULT now()

notifications:
  - id            SERIAL PRIMARY KEY
  - user_id       INTEGER REFERENCES users(id)
  - message       TEXT NOT NULL
  - read          BOOLEAN DEFAULT FALSE
  - created_at    TIMESTAMPTZ DEFAULT now()

notification_settings:
  - id                     SERIAL PRIMARY KEY
  - user_id                INTEGER UNIQUE REFERENCES users(id)
  - match_alerts           BOOLEAN DEFAULT TRUE
  - review_updates         BOOLEAN DEFAULT TRUE
  - system_notifications   BOOLEAN DEFAULT FALSE
"""
