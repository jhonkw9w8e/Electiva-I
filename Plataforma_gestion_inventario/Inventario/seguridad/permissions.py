from rest_framework.permissions import BasePermission

class IsAdmin(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Administrador").exists()

class IsEditor(BasePermission):
    def has_permission(self, request, view):
        return request.user.groups.filter(name="Editor").exists()
