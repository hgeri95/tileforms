package com.tileforms.product

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.PositiveOrZero
import java.math.BigDecimal
import java.util.UUID

data class ProductVariantDto(
    val id: UUID,
    val color: String?,
    val size: String?,
    val sku: String,
    val priceOverride: BigDecimal?,
    val stockQuantity: Int,
    val imageUrl: String?
)

data class ProductDto(
    val id: UUID,
    val name: String,
    val description: String?,
    val basePrice: BigDecimal,
    val category: String,
    val imageUrl: String?,
    val isActive: Boolean,
    val variants: List<ProductVariantDto>
)

data class CreateProductRequest(
    @field:NotBlank val name: String,
    val description: String?,
    @field:NotNull @field:DecimalMin("0.01") val basePrice: BigDecimal,
    @field:NotBlank val category: String,
    val imageUrl: String?
)

data class CreateVariantRequest(
    val color: String?,
    val size: String?,
    @field:NotBlank val sku: String,
    val priceOverride: BigDecimal?,
    @field:PositiveOrZero val stockQuantity: Int,
    val imageUrl: String?
)

data class ProductPageDto(
    val content: List<ProductDto>,
    val totalElements: Long,
    val totalPages: Int,
    val currentPage: Int
)

fun ProductEntity.toDto(): ProductDto = ProductDto(
    id = id,
    name = name,
    description = description,
    basePrice = basePrice,
    category = category.name,
    imageUrl = imageUrl,
    isActive = isActive,
    variants = variants.map { it.toDto() }
)

fun ProductVariantEntity.toDto(): ProductVariantDto = ProductVariantDto(
    id = id,
    color = color,
    size = size,
    sku = sku,
    priceOverride = priceOverride,
    stockQuantity = stockQuantity,
    imageUrl = imageUrl
)
