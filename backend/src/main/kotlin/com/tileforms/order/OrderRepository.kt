package com.tileforms.order

import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository
import java.math.BigDecimal
import java.util.UUID

@Repository
interface OrderRepository : JpaRepository<OrderEntity, UUID> {
    fun findByUserId(userId: UUID, pageable: Pageable): Page<OrderEntity>
    fun findByEmail(email: String, pageable: Pageable): Page<OrderEntity>
    fun findByTrackingNumber(trackingNumber: String): java.util.Optional<OrderEntity>
    fun findByStatus(status: OrderStatus, pageable: Pageable): Page<OrderEntity>
    fun countByStatus(status: OrderStatus): Long

    @Query("SELECT SUM(o.totalAmount) FROM OrderEntity o WHERE o.status IN :statuses")
    fun sumTotalAmountByStatusIn(statuses: List<OrderStatus>): BigDecimal?
}
