package com.tileforms.product

import arrow.core.Either
import io.mockk.every
import io.mockk.mockk
import io.mockk.verify
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import java.math.BigDecimal
import java.util.Optional
import java.util.UUID

class ProductServiceTest {

    private lateinit var productRepository: ProductRepository
    private lateinit var variantRepository: ProductVariantRepository
    private lateinit var productService: ProductService

    private val testProduct = ProductEntity(
        id = UUID.randomUUID(),
        name = "Mosaic Box",
        description = "A beautiful tile-covered box",
        basePrice = BigDecimal("49.99"),
        category = ProductCategory.BOX,
        isActive = true
    )

    @BeforeEach
    fun setUp() {
        productRepository = mockk()
        variantRepository = mockk()
        productService = ProductService(productRepository, variantRepository)
    }

    @Test
    fun `getProductById returns product when found`() {
        every { productRepository.findByIdAndIsActiveTrue(testProduct.id) } returns Optional.of(testProduct)

        val result = productService.getProductById(testProduct.id)

        assertTrue(result is Either.Right)
        val product = (result as Either.Right).value
        assertEquals(testProduct.name, product.name)
        assertEquals(testProduct.basePrice, product.basePrice)
    }

    @Test
    fun `getProductById returns error when not found`() {
        val nonExistentId = UUID.randomUUID()
        every { productRepository.findByIdAndIsActiveTrue(nonExistentId) } returns Optional.empty()

        val result = productService.getProductById(nonExistentId)

        assertTrue(result is Either.Left)
        val error = (result as Either.Left).value
        assertTrue(error is ProductError.NotFound)
    }

    @Test
    fun `getProducts returns paginated results`() {
        val pageable = PageRequest.of(0, 12)
        every { productRepository.findByIsActiveTrue(any()) } returns PageImpl(listOf(testProduct))

        val result = productService.getProducts(0, 12, null)

        assertEquals(1, result.content.size)
        assertEquals(testProduct.name, result.content.first().name)
    }

    @Test
    fun `createProduct returns created product`() {
        val request = CreateProductRequest(
            name = "New Table",
            description = "A coffee table",
            basePrice = BigDecimal("299.99"),
            category = "COFFEE_TABLE",
            imageUrl = null
        )
        every { productRepository.save(any()) } returns testProduct.copy(
            name = request.name,
            basePrice = request.basePrice,
            category = ProductCategory.COFFEE_TABLE
        )

        val result = productService.createProduct(request)

        assertTrue(result is Either.Right)
        verify { productRepository.save(any()) }
    }

    @Test
    fun `createProduct returns error for invalid category`() {
        val request = CreateProductRequest(
            name = "New Product",
            description = null,
            basePrice = BigDecimal("99.99"),
            category = "INVALID_CATEGORY",
            imageUrl = null
        )

        val result = productService.createProduct(request)

        assertTrue(result is Either.Left)
        assertTrue((result as Either.Left).value is ProductError.ValidationError)
    }
}
