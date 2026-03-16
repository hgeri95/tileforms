package com.tileforms.email

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.mail.javamail.MimeMessageHelper
import org.springframework.stereotype.Service
import java.math.BigDecimal
import java.util.UUID

data class OrderConfirmationData(
    val orderId: UUID,
    val email: String,
    val customerName: String,
    val totalAmount: BigDecimal,
    val currency: String,
    val items: List<OrderItemEmailData>
)

data class OrderItemEmailData(
    val productName: String,
    val quantity: Int,
    val unitPrice: BigDecimal
)

data class ShippingUpdateData(
    val orderId: UUID,
    val email: String,
    val customerName: String,
    val trackingNumber: String,
    val carrier: String,
    val estimatedDelivery: String?
)

sealed class EmailError {
    data class SendFailed(val message: String) : EmailError()
}

@Service
class EmailService(private val mailSender: JavaMailSender) {

    fun sendOrderConfirmation(data: OrderConfirmationData): Either<EmailError, Unit> =
        try {
            val message = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(message, true, "UTF-8")
            helper.setTo(data.email)
            helper.setSubject("TileForms - Order Confirmation #${data.orderId}")
            helper.setText(buildOrderConfirmationHtml(data), true)
            mailSender.send(message)
            Unit.right()
        } catch (e: Exception) {
            EmailError.SendFailed(e.message ?: "Failed to send email").left()
        }

    fun sendShippingUpdate(data: ShippingUpdateData): Either<EmailError, Unit> =
        try {
            val message = mailSender.createMimeMessage()
            val helper = MimeMessageHelper(message, true, "UTF-8")
            helper.setTo(data.email)
            helper.setSubject("TileForms - Your Order Has Shipped!")
            helper.setText(buildShippingUpdateHtml(data), true)
            mailSender.send(message)
            Unit.right()
        } catch (e: Exception) {
            EmailError.SendFailed(e.message ?: "Failed to send shipping update").left()
        }

    private fun buildOrderConfirmationHtml(data: OrderConfirmationData): String = """
        <html>
        <body>
            <h1>Thank you for your order, ${data.customerName}!</h1>
            <p>Order ID: ${data.orderId}</p>
            <p>Total: ${data.totalAmount} ${data.currency}</p>
            <h2>Items:</h2>
            <ul>
                ${data.items.joinToString("") { "<li>${it.productName} x${it.quantity} - ${it.unitPrice} ${data.currency}</li>" }}
            </ul>
            <p>We'll send you a shipping update when your order is on its way.</p>
            <p>Thank you for choosing TileForms!</p>
        </body>
        </html>
    """.trimIndent()

    private fun buildShippingUpdateHtml(data: ShippingUpdateData): String = """
        <html>
        <body>
            <h1>Your order is on its way, ${data.customerName}!</h1>
            <p>Order ID: ${data.orderId}</p>
            <p>Tracking Number: ${data.trackingNumber}</p>
            <p>Carrier: ${data.carrier}</p>
            ${data.estimatedDelivery?.let { "<p>Estimated Delivery: $it</p>" } ?: ""}
            <p>Thank you for shopping with TileForms!</p>
        </body>
        </html>
    """.trimIndent()
}
