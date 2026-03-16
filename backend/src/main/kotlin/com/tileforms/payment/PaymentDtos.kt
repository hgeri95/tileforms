package com.tileforms.payment

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

data class CreatePaymentIntentRequest(
    val orderId: UUID,
    @field:DecimalMin("0.01") val amount: BigDecimal,
    val currency: String = "EUR",
    val provider: String = "STRIPE"
)

data class PaymentIntentResponse(
    val clientSecret: String,
    val paymentIntentId: String,
    val amount: BigDecimal,
    val currency: String
)

data class ConfirmPaymentRequest(
    @field:NotBlank val paymentIntentId: String,
    val provider: String = "STRIPE"
)

data class PaymentDto(
    val id: UUID,
    val orderId: UUID,
    val provider: String,
    val transactionId: String?,
    val amount: BigDecimal,
    val currency: String,
    val status: String,
    val createdAt: OffsetDateTime
)

fun PaymentEntity.toDto(): PaymentDto = PaymentDto(
    id = id,
    orderId = orderId,
    provider = provider.name,
    transactionId = transactionId,
    amount = amount,
    currency = currency,
    status = status.name,
    createdAt = createdAt
)
