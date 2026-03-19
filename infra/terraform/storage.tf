# Cloud Storage bucket for product images
resource "google_storage_bucket" "product_images" {
  name          = "${var.project_id}-tileforms-images"
  location      = var.region
  force_destroy = false

  uniform_bucket_level_access = true

  cors {
    origin          = ["*"]
    method          = ["GET", "HEAD"]
    response_header = ["Content-Type", "Cache-Control"]
    max_age_seconds = 3600
  }

  lifecycle_rule {
    condition {
      age = 365
    }
    action {
      type          = "SetStorageClass"
      storage_class = "NEARLINE"
    }
  }

  versioning {
    enabled = false
  }
}

# Make product images publicly readable
resource "google_storage_bucket_iam_member" "public_read" {
  bucket = google_storage_bucket.product_images.name
  role   = "roles/storage.objectViewer"
  member = "allUsers"
}
