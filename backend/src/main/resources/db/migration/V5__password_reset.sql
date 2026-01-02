create table password_reset_tokens
(
    id         uuid primary key,
    user_id    uuid         not null,
    expires_at timestamp    not null,
    used       boolean      not null default false,

    constraint fk_prt_user
        foreign key (user_id)
            references "user" (id)
);

