-- ============ TYPES ============

CREATE TYPE request_status AS ENUM (
    'requested',
    'accepted',
    'rejected',
    'returned'
);

CREATE TYPE status AS ENUM (
    'available',
    'rented'
);

CREATE TYPE category AS ENUM (
    'Object',
    'Skill'
);

-- ============ TABLES ============

CREATE TABLE users(
    user_id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    password TEXT NOT NULL,
    user_name TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources(
    resource_id BIGSERIAL PRIMARY KEY,
    resource_name VARCHAR(255) NOT NULL,
    resource_description TEXT,
    price INTEGER,
    status status NOT NULL,
    category category NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    owner_id BIGINT NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(user_id)
);

CREATE TABLE requests(
    request_id BIGSERIAL PRIMARY KEY,
    requester_id BIGINT NOT NULL,
    lender_id BIGINT NOT NULL,
    offers TEXT,
    status request_status NOT NULL,
    resource_id BIGINT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (requester_id) REFERENCES users(user_id),
    FOREIGN KEY (lender_id) REFERENCES users(user_id),
    FOREIGN KEY (resource_id) REFERENCES resources(resource_id)
);

CREATE TABLE messages(
    msg_id BIGSERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    sender_id INT NOT NULL,
    request_id INT NOT NULL REFERENCES requests(request_id),
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (sender_id) REFERENCES users(user_id)
);

CREATE TABLE pending_signup(
    id BIGSERIAL PRIMARY KEY,
    mail_id VARCHAR(255) NOT NULL,
    user_name TEXT NOT NULL,
    password TEXT NOT NULL,
    code VARCHAR(6) NOT NULL,
    expires_at TIMESTAMP DEFAULT (CURRENT_TIMESTAMP + INTERVAL '5 minutes'),
    CONSTRAINT unique_mail UNIQUE(mail_id)
);