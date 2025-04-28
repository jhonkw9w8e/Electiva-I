from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import GroupViewSet, LoginView, AssignEditorRoleView, UserViewSet, AssignUserGroupsView

router = DefaultRouter()
router.register('roles', GroupViewSet, basename='roles')
router.register('usuarios', UserViewSet, basename='usuarios')

urlpatterns = [
    path('login/', LoginView.as_view(), name='login_usuario'),
    path('assign-editor/', AssignEditorRoleView.as_view(), name='assign-editor'),
    path('usuarios/assign-groups/', AssignUserGroupsView.as_view(), name='assign-user-groups'),
]

