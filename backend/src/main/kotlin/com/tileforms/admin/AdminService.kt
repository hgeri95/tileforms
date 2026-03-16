package com.tileforms.admin

import com.tileforms.analytics.AnalyticsService
import com.tileforms.analytics.DashboardStats
import com.tileforms.order.OrderDto
import com.tileforms.order.OrderRepository
import com.tileforms.order.toDto
import com.tileforms.product.ProductDto
import com.tileforms.product.ProductRepository
import com.tileforms.product.toDto
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional(readOnly = true)
class AdminService(
    private val analyticsService: AnalyticsService,
    private val orderRepository: OrderRepository,
    private val productRepository: ProductRepository
) {
    fun getDashboard(): DashboardStats = analyticsService.getDashboardStats()

    fun getAllOrders(page: Int, size: Int): List<OrderDto> =
        orderRepository.findAll(PageRequest.of(page, size))
            .content.map { it.toDto() }

    fun getAllProducts(page: Int, size: Int): List<ProductDto> =
        productRepository.findAll(PageRequest.of(page, size))
            .content.map { it.toDto() }
}
