-- create TYPE request_status as enum (
--     'requested',
--     'accepted',
--     'rejected',
--     'returned'
-- )


-- CREATE TYPE status as enum(
--     'available',
--     'rented'
-- )

-- CREATE type category as ENUM(
--     'Object',
--     'Skill'
-- )

-- CREATE TABLE resources(
--     resource_id BIGSERIAL PRIMARY KEY,
--     resource_name varchar(255) not NULL,
--     resource_description TEXT,
--     price INTEGER,
--     status status not null ,
--     category category not null,
--     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--     owner_id BIGINT not null,
--     FOREIGN KEY (owner_id) REFERENCES users(user_id)
-- )



-- CREATE table requests(
--     request_id BIGSERIAL PRIMARY KEY,
--     requester_id BIGINT not NULL ,
--     FOREIGN KEY (requester_id) REFERENCES users(user_id),
--     offers TEXT,
--     status request_status not NULL,
--     resource_id BIGINT not NULL,
--     FOREIGN KEY (resource_id) REFERENCES resources(resource_id),
--     requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

-- )


-- select * from users;
-- select * from resources;


-- ALTER TABLE requests
-- ADD COLUMN lender_id BIGINT NOT NULL,
-- ADD CONSTRAINT fk_lender
-- FOREIGN KEY (lender_id)
-- REFERENCES users(user_id);


-- ALTER TABLE requests
-- DROP COLUMN lender_id;

-- delete from users where user_id=1;
-- SELECT * from users;
-- delete from resources where owner_id=1;


SELECT * from users;


-- create table messages(
--     msg_id BIGSERIAL PRIMARY KEY,
--     message TEXT not null,
--     sender_id int not null ,
--     foreign KEY (sender_id) REFERENCES  users(user_id),
--     request_id INT NOT NULL REFERENCES requests(request_id),
--     sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- CREATE TABLE pending_signup(
--     id BIGSERIAL PRIMARY KEY,
--     mail_id VARCHAR(255) NOT NULL,
--     user_name TEXT NOT NULL,
--     password TEXT NOT NULL,
--     code VARCHAR(6) NOT NULL,
--     expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 minutes')
-- );


-- alter TABLE pending_signup
-- add CONSTRAINT unique_mail UNIQUE(mail_id)