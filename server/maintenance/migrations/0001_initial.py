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
            name='Maintenance',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('maintenance_date', models.DateField()),
                ('operating_hours', models.PositiveIntegerField()),
                ('order_number', models.CharField(max_length=255)),
                ('order_date', models.DateField()),
                ('machine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='maintenance_records', to='machines.machine')),
                ('maintenance_organization', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='maintenance_organizations', to='machines.reference')),
                ('maintenance_type', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name='maintenance_types', to='machines.reference')),
            ],
        ),
    ]
