package com.tileforms.product

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

sealed class ProductError {
    data class NotFound(val id: UUID) : ProductError()
    data class VariantNotFound(val id: UUID) : ProductError()
    data class ValidationError(val message: String) : ProductError()
}

@Service
@Transactional(readOnly = true)
class ProductService(
    private val productRepository: ProductRepository,
    private val variantRepository: ProductVariantRepository
) {
    fun getProducts(page: Int, size: Int, category: String?): ProductPageDto {
        val pageable = PageRequest.of(page, size)
        val productPage = if (category != null) {
            val cat = runCatching { ProductCategory.valueOf(category.uppercase()) }
                .getOrNull() ?: return ProductPageDto(emptyList(), 0, 0, page)
            productRepository.findByCategoryAndIsActiveTrue(cat, pageable)
        } else {
            productRepository.findByIsActiveTrue(pageable)
        }
        return ProductPageDto(
            content = productPage.content.map { it.toDto() },
            totalElements = productPage.totalElements,
            totalPages = productPage.totalPages,
            currentPage = page
        )
    }

    fun getProductById(id: UUID): Either<ProductError, ProductDto> =
        productRepository.findByIdAndIsActiveTrue(id)
            .map { it.toDto().right() as Either<ProductError, ProductDto> }
            .orElseGet { ProductError.NotFound(id).left() }

    @Transactional
    fun createProduct(request: CreateProductRequest): Either<ProductError, ProductDto> =
        runCatching {
            val category = ProductCategory.valueOf(request.category.uppercase())
            val product = ProductEntity(
                name = request.name,
                description = request.description,
                basePrice = request.basePrice,
                category = category,
                imageUrl = request.imageUrl
            )
            productRepository.save(product).toDto().right()
        }.getOrElse {
            ProductError.ValidationError(it.message ?: "Invalid category").left()
        }

    @Transactional
    fun addVariant(productId: UUID, request: CreateVariantRequest): Either<ProductError, ProductVariantDto> {
        val product = productRepository.findById(productId)
            .orElse(null) ?: return ProductError.NotFound(productId).left()
        val variant = ProductVariantEntity(
            product = product,
            color = request.color,
            size = request.size,
            sku = request.sku,
            priceOverride = request.priceOverride,
            stockQuantity = request.stockQuantity,
            imageUrl = request.imageUrl
        )
        return variantRepository.save(variant).toDto().right()
    }

    @Transactional
    fun deleteProduct(id: UUID): Either<ProductError, Unit> {
        val product = productRepository.findById(id)
            .orElse(null) ?: return ProductError.NotFound(id).left()
        productRepository.delete(product)
        return Unit.right()
    }
}
