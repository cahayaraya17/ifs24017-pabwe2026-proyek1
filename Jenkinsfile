groovy
pipeline {
  agent {
    docker {
      image 'node:22'
      args '-u root'
    }
  }

  stages {
    stage('Check Environment') {
      steps {
        sh 'node --version'
        sh 'npm --version'
      }
    }

    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Install dependencies') {
      steps {
        sh 'npm install'
        sh 'npm run install:all'
      }
    }

    stage('Build frontend') {
      steps {
        sh 'npm run build'
      }
    }

    stage('Test backend') {
      steps {
        sh 'npm test'
      }
    }

    stage('Test frontend (coverage 100%)') {
      steps {
        sh 'npm run test:client'
      }
    }
  }

  post {
    always {
      echo 'CampusPulse pipeline finished. Check stage results above.'
    }
  }
}
