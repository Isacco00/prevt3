package it.prevt.backend.repository;

import it.prevt.backend.entity.User;

public interface UserRepository extends AbstractRepository {
    User findByEmail(String email);
}
