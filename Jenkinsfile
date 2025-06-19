pipeline {
  agent any

  environment {
    AWS_REGION = 'ap-south-1'
    ECR_REGISTRY = '<your_aws_account_id>.dkr.ecr.ap-south-1.amazonaws.com'
    IMAGE_NAME = 'aws-free-tier-node-app'
    ECR_IMAGE = "${ECR_REGISTRY}/${IMAGE_NAME}:${BUILD_NUMBER}"
    CLUSTER_NAME = 'dev-cluster'
  }

  stages {
    stage('Checkout') {
      steps {
        git 'https://github.com/your-username/aws-free-tier-node-app.git'
      }
    }

    stage('Docker Build & Push') {
      steps {
        sh '''
          docker build -t ${IMAGE_NAME} .
          docker tag ${IMAGE_NAME} ${ECR_IMAGE}
          aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REGISTRY}
          docker push ${ECR_IMAGE}
        '''
      }
    }

    stage('Deploy to EKS') {
      steps {
        sh '''
          aws eks update-kubeconfig --region ${AWS_REGION} --name ${CLUSTER_NAME}
          sed "s|<your-ecr-repo-url>|${ECR_REGISTRY}|g" k8s/deployment.yaml > k8s/deploy-temp.yaml
          kubectl apply -f k8s/deploy-temp.yaml
          kubectl apply -f k8s/service.yaml
        '''
      }
    }
  }
}
