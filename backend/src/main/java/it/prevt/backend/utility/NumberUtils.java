package it.prevt.backend.utility;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Component
public class NumberUtils {

	public static final BigDecimal ONE_HUNDRED = BigDecimal.valueOf(100);

	public static BigDecimal nullToZero(BigDecimal value) {
		return value != null ? value : BigDecimal.ZERO;
	}

	private static boolean isZero(BigDecimal value) {
		return value.compareTo(BigDecimal.ZERO) == 0;
	}

	public static boolean isNullOrZero(BigDecimal value) {
		return value == null || isZero(value);
	}

	public static boolean isNullOrZero(Long value) {
		return value == null || value.longValue() == 0L;
	}

	public static boolean notNullNotZero(Long value) {
		return !isNullOrZero(value);
	}

	public static boolean isStrictlyPositive(BigDecimal value) {
		return nullToZero(value).compareTo(BigDecimal.ZERO) > 0;
	}

	public static boolean isPositive(BigDecimal value) {
		return isStrictlyPositive(value) || isZero(nullToZero(value));
	}

	public static boolean isNegative(BigDecimal value) {
		return !isStrictlyPositive(value);
	}

	public static boolean isStrictlyNegative(BigDecimal value) {
		return !isPositive(value);
	}

	public static BigDecimal multiply(BigDecimal first, BigDecimal second) {
		return nullToZero(first).multiply(nullToZero(second));
	}

	public static BigDecimal divide(BigDecimal dividend, BigDecimal divisor) {
		if (dividend == null || divisor == null || BigDecimal.ZERO.compareTo(divisor) == 0) {
			return BigDecimal.ZERO;
		} else {
			return dividend.divide(divisor, 19, RoundingMode.HALF_UP);
		}
	}

	public static BigDecimal sum(List<BigDecimal> values) {
		return sum(CollectionUtils.toSafeStream(values));
	}

	public static BigDecimal sum(Stream<BigDecimal> values) {
		return values.map(NumberUtils::nullToZero).reduce(BigDecimal.ZERO, BigDecimal::add);
	}

	public static BigDecimal max(Stream<BigDecimal> values) {
		List<BigDecimal> list = values.filter(Objects::nonNull).toList();
		return list.isEmpty() ? BigDecimal.ZERO : list.stream().max(BigDecimal::compareTo).get();
	}

	public static BigDecimal max(BigDecimal first, BigDecimal second) {
		BigDecimal safeFirst = nullToZero(first);
		BigDecimal safeSecond = nullToZero(second);

		return safeFirst.compareTo(safeSecond) > 0 ? safeFirst : safeSecond;
	}

	public static BigDecimal min(BigDecimal first, BigDecimal second) {
		BigDecimal safeFirst = nullToZero(first);
		BigDecimal safeSecond = nullToZero(second);

		return safeFirst.compareTo(safeSecond) < 0 ? safeFirst : safeSecond;
	}

}
