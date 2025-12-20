package it.prevt.backend.repository;

import it.prevt.backend.entity.UserEntity;

import java.util.Optional;

public interface UserRepository extends AbstractRepository {
    UserEntity findByEmail(String email);
}
