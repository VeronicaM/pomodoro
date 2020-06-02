pipeline {
    agent any 
    tools {nodejs "node"}
    stages {
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