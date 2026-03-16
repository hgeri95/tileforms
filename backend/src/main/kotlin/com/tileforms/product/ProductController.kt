package com.tileforms.product

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/products")
class ProductController(private val productService: ProductService) {

    @GetMapping
    fun getProducts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "12") size: Int,
        @RequestParam(required = false) category: String?
    ): ResponseEntity<ProductPageDto> =
        ResponseEntity.ok(productService.getProducts(page, size, category))

    @GetMapping("/{id}")
    fun getProduct(@PathVariable id: UUID): ResponseEntity<Any> =
        when (val result = productService.getProductById(id)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Product not found"))
        }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    fun createProduct(@Valid @RequestBody request: CreateProductRequest): ResponseEntity<Any> =
        when (val result = productService.createProduct(request)) {
            is Either.Right -> ResponseEntity.status(HttpStatus.CREATED).body(result.value)
            is Either.Left -> ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(mapOf("error" to (result.value as? ProductError.ValidationError)?.message))
        }

    @PostMapping("/{id}/variants")
    @PreAuthorize("hasRole('ADMIN')")
    fun addVariant(
        @PathVariable id: UUID,
        @Valid @RequestBody request: CreateVariantRequest
    ): ResponseEntity<Any> =
        when (val result = productService.addVariant(id, request)) {
            is Either.Right -> ResponseEntity.status(HttpStatus.CREATED).body(result.value)
            is Either.Left -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Product not found"))
        }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    fun deleteProduct(@PathVariable id: UUID): ResponseEntity<Any> =
        when (val result = productService.deleteProduct(id)) {
            is Either.Right -> ResponseEntity.noContent().build()
            is Either.Left -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Product not found"))
        }
}
