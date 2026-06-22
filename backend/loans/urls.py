from django.urls import path
from .views import ApplyLoanView, MyLoansView, RepayLoanView, AdminLoanListView, AdminLoanDetailView

urlpatterns = [
    path("apply/", ApplyLoanView.as_view()),
    path("my-loans/", MyLoansView.as_view()),
    path("<int:loan_id>/repay/", RepayLoanView.as_view()),
    # Admin
    path("admin/loans/", AdminLoanListView.as_view()),
    path("admin/loans/<int:loan_id>/", AdminLoanDetailView.as_view()),
]