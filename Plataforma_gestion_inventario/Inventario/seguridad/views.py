from rest_framework import viewsets
from rest_framework import status
from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import PermissionDenied
from rest_framework.permissions import IsAdminUser, IsAuthenticated, AllowAny
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import GroupSerializer, UserSerializer, LoginSerializer, AssignUserGroupsSerializer
from rest_framework.authtoken.models import Token  

User = get_user_model()

class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [IsAdminUser]


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user  = serializer.validated_data['usuario']
        token = serializer.validated_data['token']
        return Response({
            "mensaje":    "Inicio de sesión exitoso",
            "usuario_id": user.id,
            "username":  user.username,
            "email":      user.email,
            "token":      token
        }, status=status.HTTP_200_OK)



# Vista para manejar los usuarios
class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAdminUser]


class AssignEditorRoleView(APIView):
    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({"error": "El campo 'email' es obligatorio."},
                            status=status.HTTP_400_BAD_REQUEST)

        user, created = User.objects.get_or_create(
            email=email,
            defaults={"username": email}
        )
        if created:
            user.set_password("password123")
            user.save()

        editor_group, _ = Group.objects.get_or_create(name="Editor")

        user.groups.add(editor_group)
        user.save()

        return Response({
            "email": user.email,
            "created_user": created,
            "groups": [g.name for g in user.groups.all()]
        })


class AssignUserGroupsView(APIView):
    authentication_classes = [TokenAuthentication]  
    permission_classes = [IsAuthenticated]  
    def post(self, request):
        if not request.user.is_staff and not request.user.is_superuser:
            raise PermissionDenied("No tiene permiso para realizar esta acción.")
        
        asign_serializer = AssignUserGroupsSerializer(data=request.data)
        asign_serializer.is_valid(raise_exception=True)

        user = User.objects.get(pk=asign_serializer.validated_data['user_id'])
        groups = asign_serializer.validated_data['groups']

        user.groups.set(groups)
        user.save()

        return Response(UserSerializer(user).data, status=status.HTTP_200_OK)
