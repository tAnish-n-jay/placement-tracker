CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('member', 'supervisor', 'admin', 'founder')),
  is_active BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE submissions (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  subject VARCHAR(50) NOT NULL CHECK (subject IN ('DSA', 'OS', 'DBMS', 'CN', 'OOP', 'Language')),
  language VARCHAR(30),
  questions_solved INT NOT NULL DEFAULT 0,
  screenshot_url TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  reviewer_comment TEXT,
  submitted_at TIMESTAMP DEFAULT NOW(),
  reviewed_at TIMESTAMP
);

CREATE TABLE streaks (
  id SERIAL PRIMARY KEY,
  user_id INT UNIQUE REFERENCES users(id) ON DELETE CASCADE,
  current_streak INT DEFAULT 0,
  max_streak INT DEFAULT 0,
  last_activity_date DATE
);

CREATE TABLE heatmap_entries (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  questions_count INT DEFAULT 0,
  UNIQUE(user_id, date)
);

CREATE TABLE badges (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  required_streak INT NOT NULL
);

CREATE TABLE user_badges (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  badge_id INT REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, badge_id)
);

CREATE TABLE notices (
  id SERIAL PRIMARY KEY,
  created_by INT REFERENCES users(id) ON DELETE SET NULL,
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE absence_records (
  id SERIAL PRIMARY KEY,
  user_id INT REFERENCES users(id) ON DELETE CASCADE,
  absent_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO badges (name, description, required_streak) VALUES
  ('7 Day Streak',   'Submitted work for 7 days in a row',   7),
  ('30 Day Streak',  'Submitted work for 30 days in a row',  30),
  ('50 Day Streak',  'Submitted work for 50 days in a row',  50),
  ('100 Day Streak', 'Submitted work for 100 days in a row', 100),
  ('200 Day Streak', 'Submitted work for 200 days in a row', 200),
  ('365 Day Streak', 'Submitted work for 365 days in a row', 365);