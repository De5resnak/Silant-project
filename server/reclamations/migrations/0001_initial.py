# Generated by Django 5.1.2 on 2024-10-09 18:50

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('machines', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Reclamation',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('parts_used', models.TextField()),
                ('recovery_date', models.DateField()),
                ('downtime', models.PositiveIntegerField()),
                ('failure_node', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='failure_nodes', to='machines.reference')),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='reclamations', to='machines.machine')),
                ('recovery_method', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='recovery_methods', to='machines.reference')),
            ],
        ),
    ]
