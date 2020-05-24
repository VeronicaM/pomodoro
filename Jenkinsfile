pipeline {
    agent any
    stages {
        stage('Lint js files') {
            steps {
                withNPM(){
                    sh 'npm run lint'
                }
            }
        }
    }
}