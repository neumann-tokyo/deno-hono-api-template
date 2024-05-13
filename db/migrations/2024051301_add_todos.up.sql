begin
;


create table
  todos (
    id serial primary key,
    user_id integer references users (id) on delete cascade on update cascade,
    title varchar(200) not null,
    finished_at timestamp,
    created_at timestamp not null default now(),
    updated_at timestamp not null default now()
  );


commit
;
