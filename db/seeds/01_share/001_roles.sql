begin
;


insert into
  permissions (
    identifier,
    display_name,
    description,
    display_order,
    created_at,
    updated_at
  )
values
  (
    'sign_in',
    'Sign in',
    'Sign in the system',
    0,
    now(),
    now()
  ),
  (
    'roles',
    'Edit roles and permissions',
    'Edit roles and permissions',
    1,
    now(),
    now()
  ),
  (
    'users_management',
    'users management',
    'manage users',
    2,
    now(),
    now()
  ),
  (
    'invitations',
    'invite new users',
    'invite new users',
    3,
    now(),
    now()
  ),
  (
    'todos',
    'Use todos feature',
    'Use todos feature',
    4,
    now(),
    now()
  );


insert into
  roles (
    identifier,
    display_name,
    description,
    display_order,
    created_at,
    updated_at
  )
values
  (
    'admin',
    'Administrator',
    'Administrator',
    0,
    now(),
    now()
  ),
  (
    'general',
    'General user',
    'General user',
    1,
    now(),
    now()
  ),
  (
    'rejected',
    'Rejected user',
    'Rejected user',
    2,
    now(),
    now()
  ),
  (
    'leaved',
    'Leaved user',
    'Leaved user',
    3,
    now(),
    now()
  );


insert into
  roles_permissions (role_identifier, permission_identifier)
values
  ('admin', 'sign_in'),
  ('admin', 'roles'),
  ('admin', 'users_management'),
  ('admin', 'invitations'),
  ('admin', 'todos'),
  ('general', 'sign_in'),
  ('general', 'invitations'),
  ('general', 'todos');


end;
