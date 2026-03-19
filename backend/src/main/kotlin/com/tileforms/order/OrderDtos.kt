package com.tileforms.order

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Positive
import java.math.BigDecimal
import java.time.OffsetDateTime
import java.util.UUID

data class OrderItemDto(
    val id: UUID,
    val productVariantId: UUID,
    val quantity: Int,
    val unitPrice: BigDecimal
)

data class OrderDto(
    val id: UUID,
    val userId: UUID?,
    val email: String,
    val shippingAddressId: UUID?,
    val billingAddressId: UUID?,
    val status: String,
    val totalAmount: BigDecimal,
    val currency: String,
    val trackingNumber: String?,
    val items: List<OrderItemDto>,
    val createdAt: OffsetDateTime
)

data class CreateOrderItemRequest(
    val productVariantId: UUID,
    @field:Positive val quantity: Int,
    val unitPrice: BigDecimal
)

data class CreateOrderRequest(
    @field:Email @field:NotBlank val email: String,
    val shippingAddressId: UUID?,
    val billingAddressId: UUID?,
    val currency: String = "EUR",
    val items: List<CreateOrderItemRequest>
)

data class UpdateOrderStatusRequest(
    @field:NotBlank val status: String,
    val trackingNumber: String?
)

fun OrderEntity.toDto(): OrderDto = OrderDto(
    id = id,
    userId = userId,
    email = email,
    shippingAddressId = shippingAddressId,
    billingAddressId = billingAddressId,
    status = status.name,
    totalAmount = totalAmount,
    currency = currency,
    trackingNumber = trackingNumber,
    items = items.map { OrderItemDto(it.id, it.productVariantId, it.quantity, it.unitPrice) },
    createdAt = createdAt
)
