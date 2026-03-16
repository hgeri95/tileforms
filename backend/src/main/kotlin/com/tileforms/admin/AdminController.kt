package com.tileforms.admin

import com.tileforms.analytics.DashboardStats
import com.tileforms.order.OrderDto
import com.tileforms.product.ProductDto
import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
class AdminController(private val adminService: AdminService) {

    @GetMapping("/dashboard")
    fun getDashboard(): ResponseEntity<DashboardStats> =
        ResponseEntity.ok(adminService.getDashboard())

    @GetMapping("/orders")
    fun getAllOrders(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<List<OrderDto>> =
        ResponseEntity.ok(adminService.getAllOrders(page, size))

    @GetMapping("/products")
    fun getAllProducts(
        @RequestParam(defaultValue = "0") page: Int,
        @RequestParam(defaultValue = "20") size: Int
    ): ResponseEntity<List<ProductDto>> =
        ResponseEntity.ok(adminService.getAllProducts(page, size))
}
