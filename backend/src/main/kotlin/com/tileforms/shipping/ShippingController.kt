package com.tileforms.shipping

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/shipping")
class ShippingController(private val shippingService: ShippingService) {

    @PostMapping("/shipments")
    @PreAuthorize("hasRole('ADMIN')")
    fun createShipment(@Valid @RequestBody request: CreateShipmentRequest): ResponseEntity<Any> =
        when (val result = shippingService.createShipment(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.badRequest()
                .body(mapOf("error" to (result.value as? ShippingError.ApiError)?.message))
        }

    @GetMapping("/track/{trackingNumber}")
    fun trackShipment(@PathVariable trackingNumber: String): ResponseEntity<Any> =
        when (val result = shippingService.trackShipment(trackingNumber)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.notFound().build()
        }
}
