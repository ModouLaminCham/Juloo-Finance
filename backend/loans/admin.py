from django.contrib import admin
from .models import Loan, Repayment


class RepaymentInline(admin.TabularInline):
    model = Repayment
    extra = 0
    readonly_fields = ["amount", "paid_at"]


@admin.register(Loan)
class LoanAdmin(admin.ModelAdmin):
    list_display = ["id", "account", "loan_type", "amount", "status", "created_at"]
    list_filter = ["status", "loan_type"]
    search_fields = ["account__user__username", "loan_type"]
    actions = ["approve_loans", "reject_loans", "activate_loans"]
    inlines = [RepaymentInline]

    def approve_loans(self, request, queryset):
        queryset.update(status="APPROVED")
    approve_loans.short_description = "Mark selected loans as APPROVED"

    def reject_loans(self, request, queryset):
        queryset.update(status="REJECTED")
    reject_loans.short_description = "Mark selected loans as REJECTED"

    def activate_loans(self, request, queryset):
        queryset.update(status="ACTIVE")
    activate_loans.short_description = "Mark selected loans as ACTIVE"
