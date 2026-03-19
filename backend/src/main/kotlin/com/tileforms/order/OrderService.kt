package com.tileforms.order

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.util.UUID

sealed class OrderError {
    data class NotFound(val id: UUID) : OrderError()
    data class InvalidStatusTransition(val from: String, val to: String) : OrderError()
    data class ValidationError(val message: String) : OrderError()
}

@Service
@Transactional(readOnly = true)
class OrderService(private val orderRepository: OrderRepository) {

    fun getOrderById(id: UUID): Either<OrderError, OrderDto> =
        orderRepository.findById(id)
            .map { it.toDto().right() as Either<OrderError, OrderDto> }
            .orElseGet { OrderError.NotFound(id).left() }

    fun getOrdersByUser(userId: UUID, page: Int, size: Int): List<OrderDto> =
        orderRepository.findByUserId(userId, PageRequest.of(page, size))
            .content.map { it.toDto() }

    fun getOrderByTracking(trackingNumber: String): Either<OrderError, OrderDto> =
        orderRepository.findByTrackingNumber(trackingNumber)
            .map { it.toDto().right() as Either<OrderError, OrderDto> }
            .orElseGet { OrderError.NotFound(UUID.randomUUID()).left() }

    @Transactional
    fun createOrder(request: CreateOrderRequest): Either<OrderError, OrderDto> {
        if (request.items.isEmpty()) {
            return OrderError.ValidationError("Order must have at least one item").left()
        }
        val totalAmount = request.items.fold(BigDecimal.ZERO) { acc, item ->
            acc + (item.unitPrice * BigDecimal(item.quantity))
        }
        val order = OrderEntity(
            email = request.email,
            shippingAddressId = request.shippingAddressId,
            billingAddressId = request.billingAddressId,
            totalAmount = totalAmount,
            currency = request.currency
        )
        val savedOrder = orderRepository.save(order)
        return savedOrder.toDto().right()
    }

    @Transactional
    fun updateOrderStatus(id: UUID, request: UpdateOrderStatusRequest): Either<OrderError, OrderDto> {
        val order = orderRepository.findById(id).orElse(null)
            ?: return OrderError.NotFound(id).left()
        val newStatus = runCatching { OrderStatus.valueOf(request.status.uppercase()) }
            .getOrElse { return OrderError.ValidationError("Invalid status: ${request.status}").left() }
        val updatedOrder = order.copy(
            status = newStatus,
            trackingNumber = request.trackingNumber ?: order.trackingNumber
        )
        return orderRepository.save(updatedOrder).toDto().right()
    }
}
