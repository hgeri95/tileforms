variable "project_id" {
  description = "GCP Project ID"
  type        = string
}

variable "region" {
  description = "GCP region for resources"
  type        = string
  default     = "europe-west3"
}

variable "zone" {
  description = "GCP zone for resources"
  type        = string
  default     = "europe-west3-a"
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"
}

variable "db_name" {
  description = "PostgreSQL database name"
  type        = string
  default     = "tileforms"
}

variable "db_user" {
  description = "PostgreSQL database user"
  type        = string
  default     = "tileforms"
}

variable "db_password" {
  description = "PostgreSQL database password"
  type        = string
  sensitive   = true
}

variable "db_tier" {
  description = "Cloud SQL instance tier"
  type        = string
  default     = "db-f1-micro"
}

variable "redis_memory_size_gb" {
  description = "Redis Memorystore memory size in GB"
  type        = number
  default     = 1
}

variable "backend_image" {
  description = "Docker image for backend Cloud Run service"
  type        = string
}

variable "frontend_image" {
  description = "Docker image for frontend Cloud Run service"
  type        = string
}

variable "jwt_secret" {
  description = "JWT signing secret"
  type        = string
  sensitive   = true
}

variable "stripe_api_key" {
  description = "Stripe API key for payments"
  type        = string
  sensitive   = true
}
