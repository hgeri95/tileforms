package com.tileforms.order

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/orders")
class OrderController(private val orderService: OrderService) {

    @PostMapping
    fun createOrder(@Valid @RequestBody request: CreateOrderRequest): ResponseEntity<Any> =
        when (val result = orderService.createOrder(request)) {
            is Either.Right -> ResponseEntity.status(HttpStatus.CREATED).body(result.value)
            is Either.Left -> ResponseEntity.badRequest()
                .body(mapOf("error" to (result.value as? OrderError.ValidationError)?.message))
        }

    @GetMapping("/{id}")
    fun getOrder(
        @PathVariable id: UUID,
        @AuthenticationPrincipal user: UserDetails?
    ): ResponseEntity<Any> =
        when (val result = orderService.getOrderById(id)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Order not found"))
        }

    @GetMapping("/track/{trackingNumber}")
    fun trackOrder(@PathVariable trackingNumber: String): ResponseEntity<Any> =
        when (val result = orderService.getOrderByTracking(trackingNumber)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(mapOf("error" to "Tracking information not found"))
        }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    fun updateStatus(
        @PathVariable id: UUID,
        @Valid @RequestBody request: UpdateOrderStatusRequest
    ): ResponseEntity<Any> =
        when (val result = orderService.updateOrderStatus(id, request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.badRequest()
                .body(mapOf("error" to "Failed to update order status"))
        }
}
