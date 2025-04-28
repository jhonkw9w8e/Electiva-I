from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework import serializers
from rest_framework.authtoken.models import Token
from AppInventario.models import Usuario

class GroupSerializer(serializers.ModelSerializer):
    permissions = serializers.PrimaryKeyRelatedField(many=True, queryset=Permission.objects.all())
    
    class Meta:
        model = Group
        fields = ['id', 'name', 'permissions']

class UserSerializer(serializers.ModelSerializer):
    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all()
    )
    token = serializers.CharField(write_only=True, required=False)  # Opcional, para enviar el token con el usuario

    class Meta:
        model = get_user_model()
        fields = ['id', 'username', 'email', 'groups', 'token']


User = get_user_model()
from django.contrib.auth import get_user_model
from rest_framework import serializers
from rest_framework.authtoken.models import Token

User = get_user_model()

class LoginSerializer(serializers.Serializer):
    email       = serializers.EmailField()
    contraseña  = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data['email'].strip().lower()
        pwd   = data['contraseña']

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Usuario con ese email no existe.")

        if getattr(user, 'contraseña', None):
            if user.contraseña != pwd:
                raise serializers.ValidationError("Contraseña incorrecta.")
        else:
            if not user.check_password(pwd):
                raise serializers.ValidationError("Contraseña incorrecta.")

        token, _ = Token.objects.get_or_create(user=user)

        return {
            'usuario': user,
            'token':   token.key
        }


class AssignUserGroupsSerializer(serializers.Serializer):
    user_id = serializers.IntegerField()
    groups = serializers.PrimaryKeyRelatedField(
        many=True,
        queryset=Group.objects.all()
    )

    def validate_user_id(self, value):
        try:
            Usuario.objects.get(pk=value)
        except Usuario.DoesNotExist:
            raise serializers.ValidationError("Usuario no encontrado.")
        return value
