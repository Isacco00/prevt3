package it.prevt.backend.repository;

import jakarta.persistence.TypedQuery;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface AbstractRepository {

	public static final String format = "dd/MM/uuuu"; // set the format to whatever you need

	public static final String HYPHENED_FORMAT = "uuuu-MM-dd";

	// Long ID should be used for almost every Entity
	<T> T find(Class<T> clazz, UUID id);

	<T> T retrieve(Class<T> clazz, UUID id);

	<T> T find(Class<T> clazz, UUID id, String... filters);

	<T> Boolean exists(Class<T> clazz, UUID id);

	// Integer ID should only be used for edoc
	<T> T find(Class<T> clazz, Integer id);

	<T> T find(Class<T> clazz, Integer id, String... filters);

	<T> Boolean exists(Class<T> clazz, Integer id);

	<T> Boolean exists(Class<T> clazz, Map<String, ?> params);

	<T> List<T> findBy(Class<T> clazz, Map<String, ?> params, String... filters);

	<T> List<T> findBy(Class<T> clazz, Map<String, ?> params, boolean distinct, String... filters);

	<T> T getResultSingle(TypedQuery<T> query);

	<T> List<T> getResultList(TypedQuery<T> query);

	void delete(Object o);

	void save(Object o);

	void refresh(Object o);

	void flush();

	// This contains both Hypened and Slashed parser
	LocalDate fromString(String value);

	// reverse of fromString method
	String toBeDate(LocalDate date);

	<T> void deleteById(long tokenEntity, Class<T> clazz);

	<T> void deleteByIds(List<Long> tokens, Class<T> clazz);

}
