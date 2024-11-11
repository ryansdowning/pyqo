set -o errexit

pip3 install uv
uv sync

cd pyqo
uv run python manage.py collectstatic --no-input
uv run ./manage.py spectacular --color --file schema.yml
cd ../