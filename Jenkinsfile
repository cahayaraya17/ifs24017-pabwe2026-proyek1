pipeline {
  agent any
  tools {
    nodejs 'Node20'
  }
  stages {
    stage('Checkout') {
      steps { checkout scm }
    }
    stage('Install dependencies') {
      steps {
        sh 'npm install'
        sh 'npm run install:all'
      }
    }
    stage('Build frontend') {
      steps { sh 'npm run build' }
    }
    stage('Test backend') {
      steps { sh 'npm test' }
    }
    stage('Test frontend (coverage 100%)') {
      steps { sh 'npm run test:client' }
    }
    stage('Deployment placeholder') {
      steps {
        echo 'Configure deployment credentials and commands for your hosting provider.'
        echo 'Do not store secrets in the Jenkinsfile or Git repository.'
      }
    }
  }
  post {
    always { echo 'CampusPulse pipeline finished. Check stage results above.' }
  }
}
