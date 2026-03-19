package com.tileforms.i18n

import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.math.RoundingMode

enum class SupportedCurrency(val code: String, val symbol: String) {
    EUR("EUR", "€"),
    HUF("HUF", "Ft"),
    USD("USD", "$"),
    GBP("GBP", "£")
}

data class CurrencyConversionResult(
    val originalAmount: BigDecimal,
    val originalCurrency: String,
    val convertedAmount: BigDecimal,
    val targetCurrency: String
)

@Service
class CurrencyService {
    // In production, fetch rates from a real exchange rate API
    private val exchangeRates = mapOf(
        "EUR" to mapOf("HUF" to BigDecimal("390.00"), "USD" to BigDecimal("1.08"), "GBP" to BigDecimal("0.86")),
        "HUF" to mapOf("EUR" to BigDecimal("0.00256"), "USD" to BigDecimal("0.00277"), "GBP" to BigDecimal("0.00221")),
        "USD" to mapOf("EUR" to BigDecimal("0.926"), "HUF" to BigDecimal("361.11"), "GBP" to BigDecimal("0.796")),
        "GBP" to mapOf("EUR" to BigDecimal("1.163"), "HUF" to BigDecimal("453.49"), "USD" to BigDecimal("1.256"))
    )

    fun convert(amount: BigDecimal, from: String, to: String): CurrencyConversionResult {
        if (from == to) return CurrencyConversionResult(amount, from, amount, to)
        val rate = exchangeRates[from.uppercase()]?.get(to.uppercase()) ?: BigDecimal.ONE
        val converted = (amount * rate).setScale(2, RoundingMode.HALF_UP)
        return CurrencyConversionResult(amount, from, converted, to)
    }

    fun getSupportedCurrencies(): List<Map<String, String>> =
        SupportedCurrency.values().map { mapOf("code" to it.code, "symbol" to it.symbol) }
}
