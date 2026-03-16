package com.tileforms.auth

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.BadCredentialsException
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

sealed class AuthError {
    object InvalidCredentials : AuthError()
    object EmailAlreadyExists : AuthError()
    data class UnexpectedError(val message: String) : AuthError()
}

@Service
class AuthService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder,
    private val jwtTokenProvider: JwtTokenProvider,
    private val authenticationManager: AuthenticationManager
) : UserDetailsService {

    override fun loadUserByUsername(username: String): UserDetails =
        userRepository.findByEmail(username)
            .orElseThrow { UsernameNotFoundException("User not found: $username") }

    fun login(request: LoginRequest): Either<AuthError, AuthResponse> =
        try {
            authenticationManager.authenticate(
                UsernamePasswordAuthenticationToken(request.email, request.password)
            )
            val user = userRepository.findByEmail(request.email)
                .orElseThrow { UsernameNotFoundException("User not found") }
            val token = jwtTokenProvider.generateToken(user)
            AuthResponse(
                token = token,
                email = user.email,
                role = user.role.name,
                firstName = user.firstName,
                lastName = user.lastName
            ).right()
        } catch (e: BadCredentialsException) {
            AuthError.InvalidCredentials.left()
        } catch (e: Exception) {
            AuthError.UnexpectedError(e.message ?: "Unknown error").left()
        }

    fun register(request: RegisterRequest): Either<AuthError, AuthResponse> {
        if (userRepository.existsByEmail(request.email)) {
            return AuthError.EmailAlreadyExists.left()
        }
        val user = UserEntity(
            email = request.email,
            passwordHash = passwordEncoder.encode(request.password),
            firstName = request.firstName,
            lastName = request.lastName,
            role = UserRole.CUSTOMER
        )
        val savedUser = userRepository.save(user)
        val token = jwtTokenProvider.generateToken(savedUser)
        return AuthResponse(
            token = token,
            email = savedUser.email,
            role = savedUser.role.name,
            firstName = savedUser.firstName,
            lastName = savedUser.lastName
        ).right()
    }
}
