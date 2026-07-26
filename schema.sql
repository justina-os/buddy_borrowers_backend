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


-- select * from requests;
select * from resources;


-- ALTER TABLE requests
-- ADD COLUMN lender_id BIGINT NOT NULL,
-- ADD CONSTRAINT fk_lender
-- FOREIGN KEY (lender_id)
-- REFERENCES users(user_id);


-- ALTER TABLE requests
-- DROP COLUMN lender_id;