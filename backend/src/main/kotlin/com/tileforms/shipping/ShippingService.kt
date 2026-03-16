package com.tileforms.shipping

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.stereotype.Service
import java.util.UUID

sealed class ShippingError {
    data class NotFound(val trackingNumber: String) : ShippingError()
    data class ApiError(val message: String) : ShippingError()
}

@Service
class ShippingService {

    fun createShipment(request: CreateShipmentRequest): Either<ShippingError, ShipmentResponse> =
        try {
            // In production: call GLS API to create shipment label
            val trackingNumber = "GLS${UUID.randomUUID().toString().replace("-", "").uppercase().take(12)}"
            ShipmentResponse(
                trackingNumber = trackingNumber,
                labelUrl = "https://gls-group.com/labels/$trackingNumber",
                estimatedDelivery = "3-5 business days",
                carrier = "GLS"
            ).right()
        } catch (e: Exception) {
            ShippingError.ApiError(e.message ?: "GLS API error").left()
        }

    fun trackShipment(trackingNumber: String): Either<ShippingError, TrackingResponse> =
        try {
            // In production: call GLS tracking API
            TrackingResponse(
                trackingNumber = trackingNumber,
                status = "IN_TRANSIT",
                events = listOf(
                    TrackingEvent(
                        timestamp = "2024-01-15T10:00:00Z",
                        location = "Budapest Depot",
                        description = "Package picked up"
                    ),
                    TrackingEvent(
                        timestamp = "2024-01-16T08:30:00Z",
                        location = "Vienna Hub",
                        description = "Package in transit"
                    )
                ),
                estimatedDelivery = "2024-01-18",
                carrier = "GLS"
            ).right()
        } catch (e: Exception) {
            ShippingError.NotFound(trackingNumber).left()
        }
}
