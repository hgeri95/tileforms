package com.tileforms.cart

import java.math.BigDecimal
import java.util.UUID

data class CartItemModel(
    val id: String = UUID.randomUUID().toString(),
    val productVariantId: UUID,
    val productName: String,
    val variantInfo: String,
    val price: BigDecimal,
    val quantity: Int,
    val imageUrl: String?
)

data class CartModel(
    val id: String,
    val userId: String?,
    val sessionId: String?,
    val items: List<CartItemModel> = emptyList(),
    val totalAmount: BigDecimal = items.fold(BigDecimal.ZERO) { acc, item ->
        acc + (item.price * BigDecimal(item.quantity))
    }
)
