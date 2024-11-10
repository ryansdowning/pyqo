set -o errexit

cd pyqo
uv run python -m gunicorn pyqo.wsgi:application -k uvicorn.workers.UvicornWorker