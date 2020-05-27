pipeline {
    agent any
    tools {nodejs "node"}
    stages {
        stage('Install dependencies') {
            steps {
                sh '''
                    npm install --unsafe-perm node-sass@4.12.0 -g
                    npm install  
                '''
            }
        }
        stage('Lint js files') {
            steps {
                sh 'npm run lint'
            }
        }
        stage('Make Docker Image and upload to ECR') {
          steps {
                withAWS(region:'eu-west-2',credentials:'aws-static') {
                   sh './make-runner.sh'
                }
           }
        }
    }
}