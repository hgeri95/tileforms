package com.tileforms.analytics

import com.tileforms.order.OrderRepository
import com.tileforms.order.OrderStatus
import com.tileforms.product.ProductRepository
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.OffsetDateTime

data class DashboardStats(
    val totalProducts: Long,
    val totalOrders: Long,
    val pendingOrders: Long,
    val totalRevenue: BigDecimal,
    val recentOrders: List<RecentOrderSummary>
)

data class RecentOrderSummary(
    val id: String,
    val email: String,
    val status: String,
    val totalAmount: BigDecimal,
    val createdAt: OffsetDateTime
)

@Service
@Transactional(readOnly = true)
class AnalyticsService(
    private val orderRepository: OrderRepository,
    private val productRepository: ProductRepository
) {
    fun getDashboardStats(): DashboardStats {
        val totalProducts = productRepository.count()
        val totalOrders = orderRepository.count()
        val pendingOrders = orderRepository.countByStatus(OrderStatus.PENDING)
        val revenueStatuses = listOf(OrderStatus.PAID, OrderStatus.SHIPPED, OrderStatus.DELIVERED)
        val totalRevenue = orderRepository.sumTotalAmountByStatusIn(revenueStatuses) ?: BigDecimal.ZERO
        val recentOrders = orderRepository.findAll(PageRequest.of(0, 10))
            .content.map { order ->
                RecentOrderSummary(
                    id = order.id.toString(),
                    email = order.email,
                    status = order.status.name,
                    totalAmount = order.totalAmount,
                    createdAt = order.createdAt
                )
            }
        return DashboardStats(
            totalProducts = totalProducts,
            totalOrders = totalOrders,
            pendingOrders = pendingOrders,
            totalRevenue = totalRevenue,
            recentOrders = recentOrders
        )
    }
}
