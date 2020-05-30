REPO_REVISION=$(git rev-parse HEAD)
TIMESTAMP=$(date +"%Y%m%d-%H%M%S")
ECR_REVISION_TAG="$TIMESTAMP-$REPO_REVISION"

service docker start

aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin 175453773225.dkr.ecr.eu-west-2.amazonaws.com

docker build -t pomodoro .
docker tag pomodoro:latest 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest

printf "\n\nPushing Docker image to ECR..."
docker push 175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest

npm pack
VERSION=$(exec node -p "require('./package.json').version")
APPLICATION=$(exec node -p "require('./package.json').name")

printf "\n\n${APPLICATION}:${VERSION} can now be deployed:\n\n
[
    \"Name\": \"pomodoro\",
    \"ContainerRepo\": \"${S3_IMAGE_NAME}\",
    \"ContainerTag\": \"${ECR_REVISION_TAG}\",
]\n\n"

echo "${APPLICATION}:${VERSION}'s docker image [175453773225.dkr.ecr.eu-west-2.amazonaws.com/pomodoro:latest] can now be deployed." > "./build.txt"
