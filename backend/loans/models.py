from django.db import models
from accounts.models import Account


class Loan(models.Model):
    STATUS_CHOICES = (
        ("PENDING", "Pending"),
        ("APPROVED", "Approved"),
        ("REJECTED", "Rejected"),
    )

    account = models.ForeignKey(Account, on_delete=models.CASCADE, related_name="loans")
    loan_type = models.CharField(max_length=50)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default="PENDING")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.loan_type} - {self.amount} - {self.status}"
