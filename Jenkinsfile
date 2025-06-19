pipeline {
  agent any

  environment {
    AWS_REGION = 'ap-south-1'
    ECR_REGISTRY = '<790791785116>.dkr.ecr.ap-south-1.amazonaws.com'
    IMAGE_NAME = 'aws-free-tier-node-app'
    ECR_IMAGE = "${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
    CLUSTER_NAME = 'dev-cluster'
  }

  stages {
    stage('Checkout Code') {
      steps {
        git 'https://github.com/27Priyank/aws-free-tier-node-app.git'
      }
    }

    stage('Docker Build & Push to ECR') {
      steps {
        sh """
          docker build -t ${IMAGE_NAME} .
          docker tag ${IMAGE_NAME} ${ECR_IMAGE}
          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          docker push ${ECR_IMAGE}
        """
      }
    }

    stage('Deploy to EKS') {
      steps {
        sh """
          aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
          sed 's|<your-ecr-repo-url>|${ECR_REGISTRY}|g' k8s/deployment.yaml > k8s/deploy-temp.yaml
          kubectl apply -f k8s/deploy-temp.yaml
          kubectl apply -f k8s/service.yaml
        """
      }
    }
  }

  post {
    success {
      echo '✅ Deployed successfully to EKS!'
    }
    failure {
      echo '❌ Deployment failed. Check logs.'
    }
  }
}

