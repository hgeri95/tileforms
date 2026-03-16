package com.tileforms.payment

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

enum class PaymentProvider { GOOGLE_PAY, STRIPE }
enum class PaymentStatus { PENDING, COMPLETED, FAILED, REFUNDED }

@Entity
@Table(name = "payments")
data class PaymentEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(name = "order_id", nullable = false)
    val orderId: UUID = UUID.randomUUID(),

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val provider: PaymentProvider = PaymentProvider.STRIPE,

    @Column(name = "transaction_id")
    val transactionId: String? = null,

    @Column(nullable = false, precision = 10, scale = 2)
    val amount: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false)
    val currency: String = "EUR",

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: PaymentStatus = PaymentStatus.PENDING,

    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now()
)
