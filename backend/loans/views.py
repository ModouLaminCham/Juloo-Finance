from decimal import Decimal, InvalidOperation
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from accounts.models import Account
from .models import Loan
from .serializers import LoanSerializer


class ApplyLoanView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        account = Account.objects.filter(user=request.user).first()
        if not account:
            return Response({"detail": "No account found"}, status=404)

        loan_type = str(request.data.get("loan_type", "")).strip()
        if not loan_type:
            return Response({"detail": "Loan type is required"}, status=400)

        try:
            amount = Decimal(str(request.data.get("amount", 0)))
        except (InvalidOperation, TypeError, ValueError):
            return Response({"detail": "Invalid amount"}, status=400)

        if amount <= 0:
            return Response({"detail": "Amount must be greater than zero"}, status=400)

        loan = Loan.objects.create(account=account, loan_type=loan_type, amount=amount)
        serializer = LoanSerializer(loan)
        return Response(serializer.data, status=201)


class MyLoansView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        account = Account.objects.filter(user=request.user).first()
        if not account:
            return Response([], status=200)

        loans = account.loans.all().order_by("-created_at")
        serializer = LoanSerializer(loans, many=True)
        return Response(serializer.data)
