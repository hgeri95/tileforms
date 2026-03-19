package com.tileforms.cart

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.readValue
import org.springframework.data.redis.core.RedisTemplate
import org.springframework.stereotype.Service
import java.time.Duration
import java.util.UUID

sealed class CartError {
    object NotFound : CartError()
    data class ItemNotFound(val itemId: String) : CartError()
}

@Service
class CartService(
    private val redisTemplate: RedisTemplate<String, Any>,
    private val objectMapper: ObjectMapper
) {
    private val cartTtl = Duration.ofDays(7)
    private val cartPrefix = "cart:"

    fun getCart(cartId: String): Either<CartError, CartModel> {
        val data = redisTemplate.opsForValue().get("$cartPrefix$cartId")
            ?: return CartError.NotFound.left()
        return objectMapper.readValue<CartModel>(data.toString()).right()
    }

    fun getOrCreateCart(cartId: String?, userId: String?): CartModel {
        val id = cartId ?: UUID.randomUUID().toString()
        return when (val existing = cartId?.let { getCart(it) }) {
            is Either.Right -> existing.value
            else -> {
                val cart = CartModel(id = id, userId = userId, sessionId = if (userId == null) id else null)
                saveCart(cart)
                cart
            }
        }
    }

    fun addItem(cartId: String, request: AddToCartRequest, itemDetails: CartItemModel): Either<CartError, CartModel> {
        val cart = getCart(cartId).fold({ CartModel(id = cartId, userId = null, sessionId = cartId) }, { it })
        val existingItemIndex = cart.items.indexOfFirst { it.productVariantId == request.productVariantId }
        val updatedItems = if (existingItemIndex >= 0) {
            cart.items.toMutableList().also { items ->
                val existing = items[existingItemIndex]
                items[existingItemIndex] = existing.copy(quantity = existing.quantity + request.quantity)
            }
        } else {
            cart.items + itemDetails
        }
        val updatedCart = cart.copy(items = updatedItems)
        saveCart(updatedCart)
        return updatedCart.right()
    }

    fun removeItem(cartId: String, itemId: String): Either<CartError, CartModel> {
        val cart = getCart(cartId).fold({ return CartError.NotFound.left() }, { it })
        if (cart.items.none { it.id == itemId }) {
            return CartError.ItemNotFound(itemId).left()
        }
        val updatedCart = cart.copy(items = cart.items.filter { it.id != itemId })
        saveCart(updatedCart)
        return updatedCart.right()
    }

    fun clearCart(cartId: String): Either<CartError, Unit> {
        val cart = getCart(cartId).fold({ return CartError.NotFound.left() }, { it })
        saveCart(cart.copy(items = emptyList()))
        return Unit.right()
    }

    private fun saveCart(cart: CartModel) {
        val json = objectMapper.writeValueAsString(cart)
        redisTemplate.opsForValue().set("$cartPrefix${cart.id}", json, cartTtl)
    }
}
