# Generated by Django 4.2.4 on 2023-11-23 00:40

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='ReservationRequest',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('openDate', models.DateTimeField()),
                ('closeDate', models.DateTimeField()),
                ('location', models.TextField()),
                ('shootType', models.TextField()),
                ('notes', models.TextField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
