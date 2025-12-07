# Terraform starter - do not apply as-is

terraform {
  required_version = ">= 1.6.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# Placeholder VPC (replace with module "vpc" in real setup)
resource "aws_vpc" "main" {
  cidr_block = "10.0.0.0/16"
  tags = { Name = "easy11-vpc" }
}

output "vpc_id" {
  value = aws_vpc.main.id
}


