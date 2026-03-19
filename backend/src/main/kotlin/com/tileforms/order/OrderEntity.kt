package com.tileforms.order

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

enum class OrderStatus { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }

@Entity
@Table(name = "orders")
data class OrderEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(name = "user_id")
    val userId: UUID? = null,

    @Column(nullable = false)
    val email: String = "",

    @Column(name = "shipping_address_id")
    val shippingAddressId: UUID? = null,

    @Column(name = "billing_address_id")
    val billingAddressId: UUID? = null,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val status: OrderStatus = OrderStatus.PENDING,

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    val totalAmount: BigDecimal = BigDecimal.ZERO,

    @Column(nullable = false)
    val currency: String = "EUR",

    @Column(name = "tracking_number")
    val trackingNumber: String? = null,

    @OneToMany(mappedBy = "order", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val items: List<OrderItemEntity> = emptyList(),

    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: OffsetDateTime = OffsetDateTime.now()
)
