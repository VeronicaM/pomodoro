pipeline {
    agent any
    stages {
        stage('Lint js files') {
            steps {
                withNPM(npmrcConfig:'artifactory-npmrc'){
                    sh 'npm run lint'
                }
            }
        }
    }
}