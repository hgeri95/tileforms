package com.tileforms.cart

import jakarta.validation.constraints.Positive
import java.util.UUID

data class AddToCartRequest(
    val productVariantId: UUID,
    @field:Positive val quantity: Int = 1
)

data class UpdateCartItemRequest(
    @field:Positive val quantity: Int
)
