package com.tileforms.auth

import arrow.core.Either
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/auth")
class AuthController(private val authService: AuthService) {

    @PostMapping("/login")
    fun login(@Valid @RequestBody request: LoginRequest): ResponseEntity<Any> =
        when (val result = authService.login(request)) {
            is Either.Right -> ResponseEntity.ok(result.value)
            is Either.Left -> when (result.value) {
                is AuthError.InvalidCredentials ->
                    ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(mapOf("error" to "Invalid email or password"))
                is AuthError.EmailAlreadyExists ->
                    ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(mapOf("error" to "Email already exists"))
                is AuthError.UnexpectedError ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(mapOf("error" to "An unexpected error occurred"))
            }
        }

    @PostMapping("/register")
    fun register(@Valid @RequestBody request: RegisterRequest): ResponseEntity<Any> =
        when (val result = authService.register(request)) {
            is Either.Right -> ResponseEntity.status(HttpStatus.CREATED).body(result.value)
            is Either.Left -> when (result.value) {
                is AuthError.EmailAlreadyExists ->
                    ResponseEntity.status(HttpStatus.CONFLICT)
                        .body(mapOf("error" to "Email already in use"))
                else ->
                    ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(mapOf("error" to "Registration failed"))
            }
        }
}
