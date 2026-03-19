package com.tileforms.product

import jakarta.persistence.*
import java.math.BigDecimal
import java.util.UUID

@Entity
@Table(name = "product_variants")
data class ProductVariantEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    val product: ProductEntity? = null,

    val color: String? = null,
    val size: String? = null,

    @Column(nullable = false, unique = true)
    val sku: String = "",

    @Column(name = "price_override", precision = 10, scale = 2)
    val priceOverride: BigDecimal? = null,

    @Column(name = "stock_quantity")
    val stockQuantity: Int = 0,

    @Column(name = "image_url")
    val imageUrl: String? = null
)
