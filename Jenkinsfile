pipeline {
    agent any 
    tools {nodejs "node"}
    environment {
        CI = 'true' 
    }
    stages {
        stage('install dependencies') {
            steps {
                sh "npm install"
            }
        }
        stage('Lint project') {
            steps {
                sh "npm run lint"
            }
        }
        stage('Build project') {
            steps {
                sh "npm run build"
            }
        }
        stage('Build and push docker image to ECR') {
          steps {
              script {
                    docker.withRegistry('https://175453773225.dkr.ecr.eu-west-2.amazonaws.com', 'AKIASRWO4DWUTLVZ5MKS') {
                        sh '''
                            docker build -t pomodoro .
                            docker tag pomodoro:latest 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                            docker push 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                        '''
                  }
              }
           }
        }
    }
}