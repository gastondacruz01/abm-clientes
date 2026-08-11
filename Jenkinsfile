// Jenkinsfile — Pipeline CI del proyecto (SDLC: build + test en cada push/PR)
pipeline {
  agent any

  tools { nodejs 'node18' } // Configurar NodeJS 18+ en Manage Jenkins > Tools

  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install') {
      steps { sh 'npm ci || npm install' }
    }
    stage('Test') {
      steps { sh 'npm test' }
    }
    stage('Smoke') {
      steps {
        sh '''
          npm start &
          APP_PID=$!
          sleep 2
          curl -sf http://localhost:3000/api/health
          kill $APP_PID
        '''
      }
    }
  }

  post {
    failure { echo '❌ Pipeline fallido: revisar tests de la US en curso.' }
    success { echo '✅ Build OK — apto para merge a main.' }
  }
}
