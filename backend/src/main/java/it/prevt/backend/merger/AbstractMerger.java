package it.prevt.backend.merger;

import java.lang.reflect.InvocationTargetException;

public abstract class AbstractMerger<K, V> /* implements BeanEntityMerger<K, V> */ {

	public V mapNew(K bean, Class<V> clazz) {
		try {
			V v = clazz.getDeclaredConstructor().newInstance();
			doMerge(bean, v);
			return v;
		} catch (IllegalAccessException | IllegalArgumentException | InvocationTargetException | NoSuchMethodException
				| SecurityException | InstantiationException e) {
			throw new RuntimeException(e);
		}
	}

	public void merge(K bean, V entity) {
		failOnNull(bean, "bean is null");
		failOnNull(entity, "entity is null");
		doMerge(bean, entity);
	}

	protected abstract void doMerge(K bean, V entity);

	protected <E extends Enum<E>> String getOrNull(E val) {
		return val != null ? val.name() : null;
	}

	private <T> void failOnNull(T object, String message) {
		if (object == null) {
			throw new IllegalArgumentException(message);
		}
	}
}
