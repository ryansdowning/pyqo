# Generated by Django 5.1.3 on 2024-11-10 19:49

import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="item",
            name="code",
            field=models.UUIDField(default=uuid.uuid4, editable=False),
        ),
    ]
