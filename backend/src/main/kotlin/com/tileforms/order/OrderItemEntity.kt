package com.tileforms.order

import jakarta.persistence.*
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "order_items")
data class OrderItemEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    val order: OrderEntity? = null,

    @Column(name = "product_variant_id", nullable = false)
    val productVariantId: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val quantity: Int = 1,

    @Column(name = "unit_price", nullable = false, precision = 10, scale = 2)
    val unitPrice: BigDecimal = BigDecimal.ZERO
)
