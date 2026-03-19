package com.tileforms.shipping

import jakarta.validation.constraints.NotBlank
import java.util.UUID

data class CreateShipmentRequest(
    val orderId: UUID,
    @field:NotBlank val recipientName: String,
    @field:NotBlank val street: String,
    @field:NotBlank val city: String,
    @field:NotBlank val postalCode: String,
    @field:NotBlank val country: String,
    val phoneNumber: String?,
    val weightKg: Double = 1.0
)

data class ShipmentResponse(
    val trackingNumber: String,
    val labelUrl: String?,
    val estimatedDelivery: String?,
    val carrier: String = "GLS"
)

data class TrackingResponse(
    val trackingNumber: String,
    val status: String,
    val events: List<TrackingEvent>,
    val estimatedDelivery: String?,
    val carrier: String = "GLS"
)

data class TrackingEvent(
    val timestamp: String,
    val location: String,
    val description: String
)
