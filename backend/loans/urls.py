from django.urls import path
from .views import ApplyLoanView, MyLoansView

urlpatterns = [
    path("apply/", ApplyLoanView.as_view()),
    path("mine/", MyLoansView.as_view()),
]
