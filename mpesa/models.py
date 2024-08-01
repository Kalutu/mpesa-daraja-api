from django.db import models

class Payment(models.Model):
    phone_number = models.CharField(max_length=15)
    amount = models.IntegerField()

    def __str__(self):
        return f'{self.phone_number} - {self.amount}'
