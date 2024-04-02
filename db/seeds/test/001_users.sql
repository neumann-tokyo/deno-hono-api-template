begin
;


insert into
  users (
    id,
    email,
    password_digest,
    display_name,
    timezone,
    language,
    created_at,
    updated_at
  )
values
  (
    1,
    'admin1@example.com',
    -- password
    '$2a$15$G6wLTu4ad1Hjxdb4hCE/1.0AQdaheG.IB0rJQyBuEKWDEbPgJOf82',
    'Administrator',
    'Asia/Tokyo',
    'en_US',
    now(),
    now()
  ),
  (
    2,
    'general1@example.com',
    -- password
    '$2a$15$G6wLTu4ad1Hjxdb4hCE/1.0AQdaheG.IB0rJQyBuEKWDEbPgJOf82',
    'General user',
    'Asia/Tokyo',
    'en_US',
    now(),
    now()
  ),
  (
    3,
    'rejected1@example.com',
    -- password
    '$2a$15$G6wLTu4ad1Hjxdb4hCE/1.0AQdaheG.IB0rJQyBuEKWDEbPgJOf82',
    'Rejected user',
    'Asia/Tokyo',
    'en_US',
    now(),
    now()
  );


alter sequence
  users_id_seq restart 4;


insert into
  users_roles (user_id, role_identifier)
values
  (1, 'admin'),
  (2, 'general'),
  (3, 'rejected');


end;
