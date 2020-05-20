aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 175453773225.dkr.ecr.eu-west-2.amazonaws.com

docker pull 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
docker run -p 80:80  175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest
