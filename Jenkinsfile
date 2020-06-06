pipeline {
    agent any 
    tools {nodejs "node"}
    environment {
        CI = 'true' 
    }
    stages {
        stage('Build and push docker image to ECR') {
          steps {
              script {
                withDockerRegistry(url: 'https://175453773225.dkr.ecr.eu-west-2.amazonaws.com') {
                    sh '''
                        docker build -t pomodoro .
                        docker push 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                    '''
                }
              }
           }
        }
    }
}