# Cloud SQL PostgreSQL instance
resource "google_sql_database_instance" "tileforms" {
  name             = "tileforms-db"
  database_version = "POSTGRES_16"
  region           = var.region

  settings {
    tier              = var.db_tier
    availability_type = "ZONAL"
    disk_autoresize   = true
    disk_size         = 10
    disk_type         = "PD_SSD"

    backup_configuration {
      enabled                        = true
      start_time                     = "03:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
    }

    ip_configuration {
      ipv4_enabled    = false
      private_network = "projects/${var.project_id}/global/networks/default"
    }

    database_flags {
      name  = "max_connections"
      value = "100"
    }
  }

  deletion_protection = true

  depends_on = [google_project_service.apis]
}

resource "google_sql_database" "tileforms" {
  name     = var.db_name
  instance = google_sql_database_instance.tileforms.name
}

resource "google_sql_user" "tileforms" {
  name     = var.db_user
  instance = google_sql_database_instance.tileforms.name
  password = var.db_password
}
