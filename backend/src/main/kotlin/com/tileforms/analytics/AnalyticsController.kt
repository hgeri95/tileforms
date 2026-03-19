package com.tileforms.analytics

import org.springframework.http.ResponseEntity
import org.springframework.security.access.prepost.PreAuthorize
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/analytics")
@PreAuthorize("hasRole('ADMIN')")
class AnalyticsController(private val analyticsService: AnalyticsService) {

    @GetMapping("/dashboard")
    fun getDashboardStats(): ResponseEntity<DashboardStats> =
        ResponseEntity.ok(analyticsService.getDashboardStats())
}
