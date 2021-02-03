module.exports = {
  apps: [{
    name: 'jwt-auth-server',
    script: './index.js'
  }],
  deploy: {
    production: {
      user: 'ubuntu',
      host: 'ec2-3-129-65-176.us-east-2.compute.amazonaws.com',
      key: '~/.ssh/tutorial.pem',
      ref: 'origin/master',
      repo: 'git@github.com:mallett002/jwt-auth-server.git',
      path: '/home/ubuntu/jwt-auth-server',
      'post-deploy': 'npm install && pm2 startOrRestart ecosystem.config.js'
    }
  }
}