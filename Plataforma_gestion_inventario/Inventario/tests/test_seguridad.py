# tests/test_seguridad.py
from django.urls import reverse
from django.test import TestCase, RequestFactory
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.authtoken.models import Token
from seguridad.serializers import GroupSerializer, UserSerializer, LoginSerializer, AssignUserGroupsSerializer
from seguridad.views import AssignEditorRoleView, AssignUserGroupsView
from seguridad.permissions import IsAdmin, IsEditor

User = get_user_model()

class SecuritySerializerTests(TestCase):
    def setUp(self):
        self.user = User.objects.create_user('u','u@e','p')
        self.group = Group.objects.create(name='G1')
        perm = Permission.objects.first()
        if perm:
            self.group.permissions.add(perm)

    def test_group_serializer(self):
        s = GroupSerializer(self.group)
        self.assertEqual(s.data['name'], 'G1')

    def test_user_serializer(self):
        self.user.groups.add(self.group)
        Token.objects.create(user=self.user)
        s = UserSerializer(self.user)
        self.assertIn(self.group.id, s.data['groups'])

    def test_login_serializer(self):
        u = User.objects.create_user('u2', email='u2@test.com', password='pwd')
        s = LoginSerializer(data={'email':u.email,'contraseña':'pwd'})
        self.assertTrue(s.is_valid())
        out = s.validated_data
        self.assertIn('token', out)
        s_bad = LoginSerializer(data={'email':'x','contraseña':'pwd'})
        self.assertFalse(s_bad.is_valid())

    def test_assign_groups_serializer(self):
        s = AssignUserGroupsSerializer(data={'user_id':self.user.id,'groups':[self.group.id]})
        self.assertTrue(s.is_valid())
        s_bad = AssignUserGroupsSerializer(data={'user_id':999,'groups':[self.group.id]})
        self.assertFalse(s_bad.is_valid())

class SecurityViewTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('ad','ad@test.com','pwd')
        self.user = User.objects.create_user('u3','u3@test.com','pwd')
        self.client = APIClient()

    def test_group_viewset_permissions(self):
        url = reverse('roles-list')
        self.assertEqual(self.client.get(url).status_code, 403)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get(url).status_code, 200)

    def test_login_view(self):
        r = self.client.post(reverse('login_usuario'), {'email':self.user.email,'contraseña':'pwd'})
        self.assertEqual(r.status_code, 200)
        self.assertIn('token', r.data)
        r_bad = self.client.post(reverse('login_usuario'), {'email':'x','contraseña':'pwd'})
        self.assertEqual(r_bad.status_code, 400)

    def test_user_viewset_permissions(self):
        url = reverse('usuarios-list')
        self.assertEqual(self.client.get(url).status_code, 403)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.get(url).status_code, 200)

    def test_assign_editor_role(self):
        r = self.client.post(reverse('assign-editor'), {})
        self.assertEqual(r.status_code, 400)
        r2 = self.client.post(reverse('assign-editor'), {'email':'new@test.com'})
        self.assertEqual(r2.status_code, 200)

    def test_assign_user_groups_view(self):
        self.client.force_authenticate(self.user)
        self.assertEqual(self.client.post(reverse('assign-user-groups'), {'user_id':self.user.id,'groups':[]}).status_code, 403)
        self.client.force_authenticate(self.admin)
        self.assertEqual(self.client.post(reverse('assign-user-groups'), {'user_id':self.user.id,'groups':[]}).status_code, 200)

class PermissionTests(TestCase):
    def setUp(self):
        self.user_admin = User.objects.create_user('ad2','ad2@test.com','pwd')
        ga = Group.objects.create(name='Administrador')
        self.user_admin.groups.add(ga)
        self.user_editor = User.objects.create_user('ed','ed@test.com','pwd')
        ge = Group.objects.create(name='Editor')
        self.user_editor.groups.add(ge)
        self.perm_admin = IsAdmin()
        self.perm_editor = IsEditor()
        self.factory = RequestFactory()

    def test_is_admin(self):
        req = self.factory.get('/')
        req.user = self.user_admin
        self.assertTrue(self.perm_admin.has_permission(req, None))
        req.user = self.user_editor
        self.assertFalse(self.perm_admin.has_permission(req, None))

    def test_is_editor(self):
        req = self.factory.get('/')
        req.user = self.user_editor
        self.assertTrue(self.perm_editor.has_permission(req, None))
        req.user = self.user_admin
        self.assertFalse(self.perm_editor.has_permission(req, None))
