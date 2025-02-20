-- migrate:up

create table User (
    id integer not null primary key autoincrement,
    name text
);

insert or ignore into User (id, name) values (1, "Jane");
insert or ignore into User (id, name) values (2, "Joe");
insert or ignore into User (id, name) values (3, "Jerry");

-- migrate:down

drop table User;
