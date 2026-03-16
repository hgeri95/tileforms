package com.tileforms.product

import jakarta.persistence.*
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

enum class ProductCategory { BOX, COFFEE_TABLE }

@Entity
@Table(name = "products")
data class ProductEntity(
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false)
    val name: String = "",

    @Column(columnDefinition = "TEXT")
    val description: String? = null,

    @Column(name = "base_price", nullable = false, precision = 10, scale = 2)
    val basePrice: BigDecimal = BigDecimal.ZERO,

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    val category: ProductCategory = ProductCategory.BOX,

    @Column(name = "image_url")
    val imageUrl: String? = null,

    @Column(name = "is_active")
    val isActive: Boolean = true,

    @OneToMany(mappedBy = "product", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    val variants: List<ProductVariantEntity> = emptyList(),

    @Column(name = "created_at")
    val createdAt: OffsetDateTime = OffsetDateTime.now(),

    @Column(name = "updated_at")
    val updatedAt: OffsetDateTime = OffsetDateTime.now()
)
