pipeline {
    agent any 
    tools {nodejs "node"}
    stages {
        stage('Install dependencies') {
            steps {
                sh 'npm install  --unsafe-perm'
            }
        }
        stage('Lint js files') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Build and push docker image to ECR') {
          steps {
              script {
                docker.withRegistry('https://175453773225.dkr.ecr.eu-west-2.amazonaws.com', 'ecr:us-west-2:aws-static') {
                    docker.image(pomodoro).push('latest')
                }
              }
           }
        }
    }
}