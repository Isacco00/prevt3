package it.prevt.backend.utility;

import jakarta.validation.constraints.NotNull;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.Month;
import java.time.Year;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import java.util.function.Function;

@Component
public class CalcUtility {

    public final static int CURRENCY_JAVA_PRECISION = 2;

    public final static int CURRENCY_PRECISION = 4;

    public static final int EXCHANGE_RATE_PRECISION = 12;

    public static final int DIVISION_PRECISION = 19;

    private static final BigDecimal hundred = BigDecimal.valueOf(100);

    public <T> Integer sumIntegerValues(List<T> list, Function<T, Integer> getter) {
        if (list == null || list.isEmpty()) {
            return 0;
        }

        if (getter != null) {
            return list.stream().map(getter).map(this::mapToInteger).reduce(0, Integer::sum);
        } else {
            return 0;
        }
    }

    public <T> BigDecimal sumBigDecimalValues(List<T> list, Function<T, BigDecimal> getter) {
        if (list == null || list.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (getter != null) {
            return list.stream().map(getter).map(this::mapToBigDecimal).reduce(BigDecimal.ZERO, BigDecimal::add);
        } else {
            return BigDecimal.ZERO;
        }
    }

    public <T> BigDecimal averageBigDecimalValue(List<T> list, Function<T, BigDecimal> getter) {
        BigDecimal sum = this.sumBigDecimalValues(list, getter);
        BigDecimal avg = this.divide(sum,
                new BigDecimal((int) list.stream().filter(Objects::nonNull).count()));
        return avg;
    }

    public <T> BigDecimal averageIntegerValue(List<T> list, Function<T, Integer> getter) {
        Integer sum = this.sumIntegerValues(list, getter);
        return this.divide(new BigDecimal(sum), new BigDecimal(list.size()));
    }

    public <T> BigDecimal sumBigDecimalValuesNullableIfAllNull(BigDecimal... values) {
        if (Arrays.stream(values).allMatch(Objects::isNull)) {
            return null;
        }
        return sumBigDecimalValues(values);
    }

    public <T> BigDecimal sumBigDecimalValues(BigDecimal... values) {
        return Arrays.stream(values).map(this::mapToBigDecimal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public <T> BigDecimal min(BigDecimal... values) {
        return Arrays.stream(values).map(this::mapToBigDecimal).min(BigDecimal::compareTo).orElse(null);
    }

    public <T> BigDecimal min(List<T> list, Function<T, BigDecimal> getter) {
        if (list == null || list.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (getter != null) {
            return list.stream().map(getter).map(this::mapToBigDecimal).min(BigDecimal::compareTo).orElse(null);
        } else {
            return BigDecimal.ZERO;
        }
    }

    public <T> BigDecimal max(BigDecimal... values) {
        return Arrays.stream(values).map(this::mapToBigDecimal).max(BigDecimal::compareTo).orElse(null);
    }

    public <T> BigDecimal max(List<T> list, Function<T, BigDecimal> getter) {
        if (list == null || list.isEmpty() || getter == null) {
            return BigDecimal.ZERO;
        }

        return list.stream().map(getter).map(this::mapToBigDecimal).max(BigDecimal::compareTo).orElse(null);
    }

    public <T> BigDecimal sumBigDecimalValuesNullable(List<T> list, Function<T, BigDecimal> getter) {
        if (list == null || list.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (list.stream().map(getter).anyMatch(Objects::isNull)) {
            return null;
        }

        return list.stream().map(getter).map(this::mapToBigDecimal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public <T> BigDecimal sumBigDecimalValuesNullableIfAllNull(List<T> list, Function<T, BigDecimal> getter) {
        if (list == null || list.isEmpty()) {
            return BigDecimal.ZERO;
        }

        if (list.stream().map(getter).allMatch(Objects::isNull)) {
            return null;
        }

        return list.stream().map(getter).map(this::mapToBigDecimal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public <T> BigDecimal sumBigDecimalValuesNullable(BigDecimal... values) {
        if (Arrays.stream(values).anyMatch(Objects::isNull)) {
            return null;
        }
        return Arrays.stream(values).map(this::mapToBigDecimal).reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    public BigDecimal mapToBigDecimal(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        } else {
            return value;
        }
    }

    public Integer mapToInteger(Integer value) {
        if (value == null) {
            return 0;
        } else {
            return value;
        }
    }

    public BigDecimal divideNullable(BigDecimal dividend, BigDecimal divisor) {
        return divide(dividend, divisor, CalcUtility.DIVISION_PRECISION, true);
    }

    public BigDecimal divide(BigDecimal dividend, BigDecimal divisor) {
        return divide(dividend, divisor, CalcUtility.DIVISION_PRECISION, false);
    }

    public BigDecimal divide(BigDecimal dividend, BigDecimal divisor, int precision) {
        return divide(dividend, divisor, precision, false);
    }

    private BigDecimal divide(BigDecimal dividend, BigDecimal divisor, int precision, boolean returnNull) {
        if (dividend == null || divisor == null || BigDecimal.ZERO.compareTo(divisor) == 0) {
            return returnNull ? null : BigDecimal.ZERO; // TODO: check if correct
        } else {
            return dividend.divide(divisor, precision, RoundingMode.HALF_UP);
        }
    }

    public BigDecimal negate(BigDecimal value) {
        if (value == null) {
            return BigDecimal.ZERO;
        } else {
            return value.multiply(BigDecimal.valueOf(-1));
        }
    }

    public Boolean isNegative(BigDecimal value) {
        if (value == null) {
            return false;
        } else {
            if (value.compareTo(BigDecimal.ZERO) < 0) {
                return true;
            }
            return false;
        }
    }

    // 100% - value
    public BigDecimal percRemainder(BigDecimal value) {

        if (value == null) {
            return perc(hundred);
        } else {
            return perc(hundred.subtract(value));
        }
    }

    public BigDecimal interestBasedOnDates(BigDecimal interestPercentage, @NotNull LocalDate fromDate,
                                           @NotNull LocalDate toDate) {
        return interestBasedOnDays(interestPercentage, this.daysFraction(fromDate, toDate));
    }

    public BigDecimal estimateDaysInAYearBasedOnDateRange(@NotNull LocalDate fromDate, @NotNull LocalDate toDate) {
        BigDecimal daysInAYear = BigDecimal.valueOf(365);
        // (start AND end is the same leap year ) OR (29 Feb is between dates)
        if (fromDate.getYear() == toDate.getYear() && Year.of(fromDate.getYear()).isLeap()) {
            return daysInAYear.add(BigDecimal.ONE);
        }
        if (((fromDate.isBefore(toDate) || fromDate.isEqual(toDate)) && (this.is29FebBetweenDates(fromDate, toDate)))
                || ((fromDate.isAfter(toDate)) && (this.is29FebBetweenDates(toDate, fromDate)))) {
            return daysInAYear.add(BigDecimal.ONE);
        }
        return daysInAYear;
    }

    private boolean is29FebBetweenDates(@NotNull LocalDate fromDate, @NotNull LocalDate toDate) {
        for (LocalDate date = fromDate; date.isBefore(toDate); date = date.plusDays(1)) {
            if (is29Feb(date)) {
                return true;
            }
        }
        return false;
    }

    private boolean is29Feb(@NotNull LocalDate date) {
        return date.getMonth() == Month.FEBRUARY && date.getDayOfMonth() == 29;
    }

    private BigDecimal interestBasedOnDays(BigDecimal interestPercentage, BigDecimal daysFraction) {
        BigDecimal interest = this.multiply(daysFraction, perc(interestPercentage));
        return interest;
    }

    public BigDecimal daysFraction(@NotNull LocalDate fromDate, @NotNull LocalDate toDate) {
        BigDecimal days = new BigDecimal(ChronoUnit.DAYS.between(fromDate, toDate));
        BigDecimal daysInAYear = this.estimateDaysInAYearBasedOnDateRange(fromDate, toDate);
        return this.divide(days, daysInAYear);
    }

    public BigDecimal perc(BigDecimal percentage) {
        if (percentage == null) {
            return BigDecimal.ZERO;
        }
        return this.divide(percentage, hundred);
    }

    public BigDecimal toPerc(BigDecimal percentage) {
        if (percentage == null) {
            return BigDecimal.ZERO;
        }
        return percentage.multiply(hundred);
    }

    public <T> BigDecimal calculatePercentage(T entity, Function<T, BigDecimal> partialAmountGetter,
                                              Function<T, BigDecimal> totalAmountGetter) {
        BigDecimal partial = NumberUtils.nullToZero(partialAmountGetter.apply(entity));
        BigDecimal total = NumberUtils.nullToZero(totalAmountGetter.apply(entity));
        return calculatePercentage(partial, total);

    }

    public <T> BigDecimal calculatePercentage(BigDecimal partial, BigDecimal total) {

        BigDecimal safePartial = NumberUtils.nullToZero(partial);
        BigDecimal safeTotal = NumberUtils.nullToZero(total);

        if (NumberUtils.isNullOrZero(safeTotal)) {
            return null;
        } else {
            return divide(safePartial, safeTotal).multiply(hundred);
        }

    }

    public BigDecimal multiply(BigDecimal first, BigDecimal second) {
        return NumberUtils.nullToZero(first).multiply(NumberUtils.nullToZero(second));
    }

    public BigDecimal roundNdecimal(BigDecimal value, int precision) {
        return NumberUtils.nullToZero(value).setScale(precision, RoundingMode.HALF_UP);
    }

    public double roundNDecimal(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();
        long factor = (long) Math.pow(10, places);
        value = value * factor;
        long tmp = Math.round(value);
        return (double) tmp / factor;
    }

    public BigDecimal round2Decimal(BigDecimal value) {
        return this.roundNdecimal(value, 2);
    }

    public BigDecimal round0Decimal(BigDecimal value) {
        return this.roundNdecimal(value, 0);
    }

    public BigDecimal subtractBigDecimalValues(BigDecimal... values) {
        return values[0].add(Arrays.asList(values).subList(1, values.length).stream().map(this::mapToBigDecimal)
                .reduce(BigDecimal.ZERO, BigDecimal::subtract));
    }

    public BigDecimal subtractBigDecimalValuesNullable(BigDecimal... values) {
        if (Arrays.stream(values).anyMatch(Objects::isNull)) {
            return null;
        }
        return subtractBigDecimalValues(values);
    }

    public BigDecimal comparePercentageChangingTwoNumbers(BigDecimal value1, BigDecimal value2) {
        BigDecimal safeSubtract = subtractBigDecimalValuesNullable(value1, value2);
        if (safeSubtract.compareTo(BigDecimal.ZERO) == 0) {
            return null; // N.A.
        }
        return divide(safeSubtract, value1);
    }

    public static double round(double value, int places) {
        if (places < 0) throw new IllegalArgumentException();

        BigDecimal bd = BigDecimal.valueOf(value);
        bd = bd.setScale(places, RoundingMode.HALF_UP);
        return bd.doubleValue();
    }
}
