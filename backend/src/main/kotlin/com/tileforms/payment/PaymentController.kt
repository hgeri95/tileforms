package com.tileforms.payment

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*
import java.util.UUID

@RestController
@RequestMapping("/api/payments")
class PaymentController(private val paymentService: PaymentService) {

    @PostMapping("/intent")
    fun createPaymentIntent(@Valid @RequestBody request: CreatePaymentIntentRequest): ResponseEntity<Any> =
        when (val result = paymentService.createPaymentIntent(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.badRequest()
                .body(mapOf("error" to (result.value as? PaymentError.ProcessingError)?.message))
        }

    @PostMapping("/confirm")
    fun confirmPayment(@Valid @RequestBody request: ConfirmPaymentRequest): ResponseEntity<Any> =
        when (val result = paymentService.confirmPayment(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.badRequest()
                .body(mapOf("error" to "Payment confirmation failed"))
        }

    @GetMapping("/order/{orderId}")
    fun getPaymentByOrder(@PathVariable orderId: UUID): ResponseEntity<Any> =
        when (val result = paymentService.getPaymentByOrder(orderId)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> ResponseEntity.notFound().build()
        }
}
