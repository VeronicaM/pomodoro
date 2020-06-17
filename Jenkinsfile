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
        stage('Build project') {
            steps {
                sh "npm build"
            }
        }
        stage('Build docker image') {
            steps {
                sh '''
                    docker build -t pomodoro .
                    docker tag pomodoro:latest 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                '''
            }
        }
        stage('Build and push docker image to ECR') {
          steps {
              script {
                  withNPM(npmrcConfig: '4e990de0-36d4-4ff8-9362-2bab52346c51'){
                      withDockerRegistry(url: 'https://175453773225.dkr.ecr.eu-west-2.amazonaws.com') {
                        sh '''
                            docker push 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
                        '''
                    }
                  }
              }
           }
        }
    }
}