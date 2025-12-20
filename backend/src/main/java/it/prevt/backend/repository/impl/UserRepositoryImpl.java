package it.prevt.backend.repository.impl;

import it.prevt.backend.entity.UserEntity;
import it.prevt.backend.repository.UserRepository;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Repository
public class UserRepositoryImpl extends AbstractRepositoryImpl implements UserRepository {

    @Override
    public UserEntity findByEmail(String email) {
        Class<UserEntity> clazz = UserEntity.class;
        Map<String, Object> parameters = new HashMap<>();

        StringBuilder strQueryFrom = new StringBuilder(" SELECT u FROM " + clazz.getSimpleName() + " u ");
        StringBuilder strQueryWhere = new StringBuilder(" WHERE 1=1 ");

        // Parameters
        if (email != null) {
            strQueryWhere.append(" AND u.email = :email ");
            parameters.put("email", email);
        }
        String strQueryFinal = (strQueryFrom.append(strQueryWhere.toString())).toString();
        TypedQuery<UserEntity> query = entityManager.createQuery(strQueryFinal, clazz);
        parameters.forEach(query::setParameter);
        return getResultSingle(query);
    }
}
