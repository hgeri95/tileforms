package com.tileforms.auth

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class LoginRequest(
    @field:Email @field:NotBlank val email: String,
    @field:NotBlank val password: String
)

data class RegisterRequest(
    @field:Email @field:NotBlank val email: String,
    @field:NotBlank @field:Size(min = 8) val password: String,
    val firstName: String?,
    val lastName: String?
)

data class AuthResponse(
    val token: String,
    val email: String,
    val role: String,
    val firstName: String?,
    val lastName: String?
)

data class GuestTokenResponse(
    val sessionId: String,
    val token: String
)
