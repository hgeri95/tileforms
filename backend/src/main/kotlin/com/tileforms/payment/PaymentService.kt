package com.tileforms.payment

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.UUID

sealed class PaymentError {
    data class NotFound(val id: UUID) : PaymentError()
    data class ProcessingError(val message: String) : PaymentError()
}

@Service
@Transactional(readOnly = true)
class PaymentService(
    private val paymentRepository: PaymentRepository,
    @Value("\${stripe.api.key:sk_test_placeholder}") private val stripeApiKey: String
) {
    fun getPaymentByOrder(orderId: UUID): Either<PaymentError, PaymentDto> =
        paymentRepository.findByOrderId(orderId)
            .map { it.toDto().right() as Either<PaymentError, PaymentDto> }
            .orElseGet { PaymentError.NotFound(orderId).left() }

    @Transactional
    fun createPaymentIntent(request: CreatePaymentIntentRequest): Either<PaymentError, PaymentIntentResponse> =
        try {
            // In production: call Stripe API to create a PaymentIntent
            // val paymentIntent = PaymentIntent.create(params, RequestOptions.builder().setApiKey(stripeApiKey).build())
            val mockClientSecret = "pi_mock_${UUID.randomUUID()}_secret_${UUID.randomUUID()}"
            val mockPaymentIntentId = "pi_mock_${UUID.randomUUID()}"

            val payment = PaymentEntity(
                orderId = request.orderId,
                provider = PaymentProvider.valueOf(request.provider.uppercase()),
                transactionId = mockPaymentIntentId,
                amount = request.amount,
                currency = request.currency,
                status = PaymentStatus.PENDING
            )
            paymentRepository.save(payment)

            PaymentIntentResponse(
                clientSecret = mockClientSecret,
                paymentIntentId = mockPaymentIntentId,
                amount = request.amount,
                currency = request.currency
            ).right()
        } catch (e: Exception) {
            PaymentError.ProcessingError(e.message ?: "Payment processing failed").left()
        }

    @Transactional
    fun confirmPayment(request: ConfirmPaymentRequest): Either<PaymentError, PaymentDto> {
        val payment = paymentRepository.findByTransactionId(request.paymentIntentId)
            .orElse(null) ?: return PaymentError.ProcessingError("Payment intent not found").left()
        val confirmed = payment.copy(status = PaymentStatus.COMPLETED)
        return paymentRepository.save(confirmed).toDto().right()
    }
}
