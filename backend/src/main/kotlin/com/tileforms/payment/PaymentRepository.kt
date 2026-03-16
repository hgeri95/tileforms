package com.tileforms.payment

import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.UUID

@Repository
interface PaymentRepository : JpaRepository<PaymentEntity, UUID> {
    fun findByOrderId(orderId: UUID): java.util.Optional<PaymentEntity>
    fun findByTransactionId(transactionId: String): java.util.Optional<PaymentEntity>
}
