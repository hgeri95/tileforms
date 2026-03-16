output "backend_url" {
  description = "Backend Cloud Run service URL"
  value       = google_cloud_run_v2_service.backend.uri
}

output "frontend_url" {
  description = "Frontend Cloud Run service URL"
  value       = google_cloud_run_v2_service.frontend.uri
}

output "database_connection_name" {
  description = "Cloud SQL connection name"
  value       = google_sql_database_instance.tileforms.connection_name
}

output "redis_host" {
  description = "Redis Memorystore host IP"
  value       = google_redis_instance.tileforms.host
}

output "artifact_registry_url" {
  description = "Artifact Registry URL for Docker images"
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/tileforms"
}

output "product_images_bucket" {
  description = "Cloud Storage bucket for product images"
  value       = google_storage_bucket.product_images.name
}
