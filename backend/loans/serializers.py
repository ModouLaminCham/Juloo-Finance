from rest_framework import serializers
from .models import Loan


class LoanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Loan
        fields = ["id", "loan_type", "amount", "status", "created_at"]
