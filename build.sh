set -o errexit

cd backend
bash build.sh
cd ../frontend
yarn build