# Memorystore Redis instance
resource "google_redis_instance" "tileforms" {
  name           = "tileforms-redis"
  memory_size_gb = var.redis_memory_size_gb
  region         = var.region
  tier           = "BASIC"
  redis_version  = "REDIS_7_0"
  display_name   = "TileForms Redis Cache"

  authorized_network = "projects/${var.project_id}/global/networks/default"

  labels = {
    environment = var.environment
    project     = "tileforms"
  }

  depends_on = [google_project_service.apis]
}
