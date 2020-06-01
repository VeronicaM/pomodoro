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
                  withDockerRegistry(url: 'https://175453773225.dkr.ecr.eu-west-2.amazonaws.com') {
                    sh '''
                        sudo docker build -t pomodoro .
                        sudo docker push 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                    '''
                }
              }
           }
        }
    }
}