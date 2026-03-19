package com.tileforms.product

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface ProductRepository : JpaRepository<ProductEntity, UUID> {
    fun findByIsActiveTrue(pageable: Pageable): Page<ProductEntity>
    fun findByCategoryAndIsActiveTrue(category: ProductCategory, pageable: Pageable): Page<ProductEntity>
    fun findByIdAndIsActiveTrue(id: UUID): java.util.Optional<ProductEntity>
}

@Repository
interface ProductVariantRepository : JpaRepository<ProductVariantEntity, UUID> {
    fun findByProductId(productId: UUID): List<ProductVariantEntity>
    fun findBySkuIgnoreCase(sku: String): java.util.Optional<ProductVariantEntity>
}
