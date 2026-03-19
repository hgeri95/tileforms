terraform {
  required_version = ">= 1.6"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }

  backend "gcs" {
    bucket = "tileforms-terraform-state"
    prefix = "terraform/state"
  }
}

provider "google" {
  project = var.project_id
  region  = var.region
}

# Enable required APIs
resource "google_project_service" "apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "redis.googleapis.com",
    "storage.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "vpcaccess.googleapis.com",
  ])

  service            = each.value
  disable_on_destroy = false
}

# Artifact Registry for Docker images
resource "google_artifact_registry_repository" "tileforms" {
  location      = var.region
  repository_id = "tileforms"
  format        = "DOCKER"
  description   = "TileForms Docker images"

  depends_on = [google_project_service.apis]
}

# VPC Connector for Cloud Run to access Cloud SQL and Redis
resource "google_vpc_access_connector" "tileforms" {
  name          = "tileforms-vpc-connector"
  region        = var.region
  ip_cidr_range = "10.8.0.0/28"
  network       = "default"

  depends_on = [google_project_service.apis]
}

# Service Account for Cloud Run services
resource "google_service_account" "cloudrun_sa" {
  account_id   = "tileforms-cloudrun-sa"
  display_name = "TileForms Cloud Run Service Account"
}

# Backend Cloud Run service
resource "google_cloud_run_v2_service" "backend" {
  name     = "tileforms-backend"
  location = var.region

  template {
    service_account = google_service_account.cloudrun_sa.email

    vpc_access {
      connector = google_vpc_access_connector.tileforms.id
      egress    = "PRIVATE_RANGES_ONLY"
    }

    containers {
      image = var.backend_image

      ports {
        container_port = 8080
      }

      env {
        name  = "SPRING_PROFILES_ACTIVE"
        value = "prod"
      }
      env {
        name  = "SPRING_DATASOURCE_URL"
        value = "jdbc:postgresql:///${var.db_name}?cloudSqlInstance=${var.project_id}:${var.region}:tileforms-db&socketFactory=com.google.cloud.sql.postgres.SocketFactory"
      }
      env {
        name  = "SPRING_DATASOURCE_USERNAME"
        value = var.db_user
      }
      env {
        name  = "SPRING_DATA_REDIS_HOST"
        value = google_redis_instance.tileforms.host
      }
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
      env {
        name  = "STRIPE_API_KEY"
        value = var.stripe_api_key
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 3
    }
  }

  depends_on = [
    google_project_service.apis,
    google_vpc_access_connector.tileforms,
  ]
}

# Frontend Cloud Run service
resource "google_cloud_run_v2_service" "frontend" {
  name     = "tileforms-frontend"
  location = var.region

  template {
    containers {
      image = var.frontend_image

      ports {
        container_port = 4000
      }

      env {
        name  = "PORT"
        value = "4000"
      }

      resources {
        limits = {
          cpu    = "1"
          memory = "256Mi"
        }
      }
    }

    scaling {
      min_instance_count = 0
      max_instance_count = 5
    }
  }

  depends_on = [google_project_service.apis]
}

# Allow public access to Cloud Run services
resource "google_cloud_run_v2_service_iam_member" "backend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public" {
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
