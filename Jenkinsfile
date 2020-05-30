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
        stage('Docker build') {
            steps {
               docker.build('pomodoro')
            }
        }
        stage('Upload docker image to ECR') {
          steps {
                docker.withRegistry('175453773225.dkr.ecr.eu-west-2.amazonaws.com', 'ecr:us-west-2:aws-static') {
                    docker.image('pomodoro').push('latest')
                }
           }
        }
    }
}