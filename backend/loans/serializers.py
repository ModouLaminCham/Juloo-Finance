from rest_framework import serializers
from .models import Loan, Repayment


class RepaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Repayment
        fields = ["id", "amount", "paid_at"]


class LoanSerializer(serializers.ModelSerializer):
    repayments = RepaymentSerializer(many=True, read_only=True)

    class Meta:
        model = Loan
        fields = [
            "id",
            "loan_type",
            "amount",
            "interest_rate",
            "duration_months",
            "collateral",
            "status",
            "total_repayment",
            "remaining_balance",
            "created_at",
            "repayments",
        ]


class AdminLoanSerializer(serializers.ModelSerializer):
    account_number = serializers.CharField(source="account.account_number", read_only=True)
    borrower = serializers.CharField(source="account.user.username", read_only=True)

    class Meta:
        model = Loan
        fields = [
            "id",
            "account_number",
            "borrower",
            "loan_type",
            "amount",
            "interest_rate",
            "duration_months",
            "collateral",
            "status",
            "total_repayment",
            "remaining_balance",
            "created_at",
        ]
        read_only_fields = [
            "id", "account_number", "borrower", "loan_type", "amount",
            "interest_rate", "duration_months", "collateral",
            "total_repayment", "remaining_balance", "created_at",
        ]


class AdminLoanStatusSerializer(serializers.Serializer):
    status = serializers.ChoiceField(choices=["APPROVED", "REJECTED", "ACTIVE", "CLOSED"])