
create TABLE user_status(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

create TABLE progect_status(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

create TABLE task_status(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255)
);

create TABLE users(
  id SERIAL PRIMARY KEY,
  telegram_id INTEGER,
  status_id INTEGER,
  FOREIGN KEY (status_id) REFERENCES user_status (id),
  name VARCHAR(255)
);

create TABLE projects(
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  status_id INTEGER,
  FOREIGN KEY (status_id) REFERENCES progect_status (id)
);

create TABLE tasks(
  id SERIAL PRIMARY KEY,
  user_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users (id),
  project_id INTEGER,
  FOREIGN KEY (project_id) REFERENCES projects (id)
);

INSERT INTO progect_status (
  name
) values (
  'active'
);

INSERT INTO user_status (
  name
) values (
  'bad_worker'
);

INSERT INTO task_status (
  name
) values (
  'in_work'
);

INSERT INTO projects (
  name,
  status_id
) values (
  'White Alley',
  4
);

ALTER TABLE tasks ADD COLUMN status_id INTEGER REFERENCES task_status (id);
ALTER TABLE tasks ADD COLUMN date VARCHAR(255), ADD COLUMN executor VARCHAR(255), ADD COLUMN description VARCHAR(255);
ALTER TABLE task_status ADD COLUMN name_ru text;
UPDATE task_status SET name_ru = 'закрыто' WHERE id = 1;