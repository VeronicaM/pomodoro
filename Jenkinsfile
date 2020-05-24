pipeline {
    agent any
    stages {
        stage('Lint js files') {
            steps {
                sh '''  echo "Setting bin path to enable npm to run"
                        PATH=/sbin:/usr/sbin:/usr/bin:/usr/local/bin 
                        npm run lint
                    '''
            }
        }
    }
}