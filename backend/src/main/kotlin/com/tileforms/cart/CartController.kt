package com.tileforms.cart

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.math.BigDecimal
import java.util.UUID

@RestController
@RequestMapping("/api/cart")
class CartController(private val cartService: CartService) {

    @GetMapping("/{cartId}")
    fun getCart(@PathVariable cartId: String): ResponseEntity<Any> =
        when (val result = cartService.getCart(cartId)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.notFound().build()
        }

    @PostMapping
    fun createCart(
        @RequestHeader(value = "X-Session-Id", required = false) sessionId: String?,
        @RequestHeader(value = "X-User-Id", required = false) userId: String?
    ): ResponseEntity<CartModel> {
        val cart = cartService.getOrCreateCart(sessionId, userId)
        return ResponseEntity.ok(cart)
    }

    @PostMapping("/{cartId}/items")
    fun addItem(
        @PathVariable cartId: String,
        @Valid @RequestBody request: AddToCartRequest
    ): ResponseEntity<Any> {
        // In production, fetch real product details from ProductService
        val itemDetails = CartItemModel(
            productVariantId = request.productVariantId,
            productName = "Product",
            variantInfo = "Default",
            price = BigDecimal("49.99"),
            quantity = request.quantity,
            imageUrl = null
        )
        return when (val result = cartService.addItem(cartId, request, itemDetails)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.badRequest().body(mapOf("error" to "Failed to add item"))
        }
    }

    @DeleteMapping("/{cartId}/items/{itemId}")
    fun removeItem(
        @PathVariable cartId: String,
        @PathVariable itemId: String
    ): ResponseEntity<Any> =
        when (val result = cartService.removeItem(cartId, itemId)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.notFound().build()
        }

    @DeleteMapping("/{cartId}")
    fun clearCart(@PathVariable cartId: String): ResponseEntity<Any> =
        when (val result = cartService.clearCart(cartId)) {
            is Either.Right -> ResponseEntity.noContent().build()
            is Either.Left -> ResponseEntity.notFound().build()
        }
}
