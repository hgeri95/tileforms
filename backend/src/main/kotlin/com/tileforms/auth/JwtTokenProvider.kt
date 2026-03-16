package com.tileforms.auth

import arrow.core.Either
import arrow.core.left
import arrow.core.right
import io.jsonwebtoken.*
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

sealed class JwtError {
    object Expired : JwtError()
    object Invalid : JwtError()
}

@Component
class JwtTokenProvider(
    @Value("\${app.jwt.secret}") private val jwtSecret: String,
    @Value("\${app.jwt.expiration-ms}") private val jwtExpirationMs: Long
) {
    private val secretKey: SecretKey by lazy {
        Keys.hmacShaKeyFor(jwtSecret.toByteArray())
    }

    fun generateToken(userDetails: UserEntity): String =
        Jwts.builder()
            .subject(userDetails.email)
            .claim("role", userDetails.role.name)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + jwtExpirationMs))
            .signWith(secretKey)
            .compact()

    fun validateToken(token: String): Either<JwtError, String> =
        try {
            val claims = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
            claims.payload.subject.right()
        } catch (e: ExpiredJwtException) {
            JwtError.Expired.left()
        } catch (e: JwtException) {
            JwtError.Invalid.left()
        }
}
