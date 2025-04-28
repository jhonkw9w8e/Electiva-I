from rest_framework.test import APITestCase,APIClient
from rest_framework import status
from django.urls import reverse
from AppInventario.models import Producto, NotificacionStock
from django.contrib.auth import get_user_model
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import Group
from AppInventario.models import Usuario

User = get_user_model()

class ProductoCreateViewTests(APITestCase):
    def setUp(self):
        self.url_create = reverse('producto-create')
        self.url_list = reverse('producto-list')
    
    def test_create_producto_success(self):
        data = {
            "nombre": "Producto A",
            "codigo": "A123",
            "categoria": "Categoria 1"
        }
        response = self.client.post(self.url_create, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Producto.objects.count(), 1)
    
    def test_create_producto_invalid(self):
        data = {"nombre": "", "codigo": "A123", "categoria": "Categoria 1"}
        response = self.client.post(self.url_create, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_productos(self):
        Producto.objects.create(nombre="Producto A", codigo="A123", categoria="Categoria 1")
        response = self.client.get(self.url_list)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

class StockUpdateViewTests(APITestCase):
    def setUp(self):
        self.producto = Producto.objects.create(nombre="Producto A", codigo="A123", categoria="Categoria 1")
        self.stock_url = reverse('stock-update', args=[self.producto.codigo])

    def test_update_stock_success(self):
        data = {"nueva_cantidad": 150}
        response = self.client.post(self.stock_url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.producto.refresh_from_db()
        self.assertEqual(self.producto.stock.cantidad, 150)
    
    def test_update_stock_error(self):
        data = {"nueva_cantidad": -1}
        response = self.client.post(self.stock_url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
    
    def test_get_stock(self):
        response = self.client.get(self.stock_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('cantidad', response.data)

    def test_delete_stock(self):
        response = self.client.delete(self.stock_url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class NotificacionStockViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('notificacion-stock-list')
        self.producto = Producto.objects.create(nombre="Producto A", codigo="A123", categoria="Categoria 1")

    def test_create_notificacion_stock_success(self):
        data = {"producto": self.producto.id, "estado": True}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_notificacion_stock_invalid(self):
        data = {"producto": None, "estado": True}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_get_notificaciones_stock(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_notificacion_stock(self):
        notificacion = NotificacionStock.objects.create(producto=self.producto, estado=False)
        url = reverse('notificacion-stock-detail', args=[notificacion.pk])
        data = {"estado": True}
        response = self.client.put(url, data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_delete_notificacion_stock(self):
        notificacion = NotificacionStock.objects.create(producto=self.producto, estado=True)
        url = reverse('notificacion-stock-detail', args=[notificacion.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)

class UsuarioRegistroViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('usuario-registro')

    def test_create_usuario_success(self):
        data = {
            "nombre": "Usuario A",
            "email": "usuarioa@example.com",
            "contraseña": "password123"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Usuario.objects.count(), 1)

    def test_create_usuario_invalid(self):
        data = {"nombre": "", "email": "usuarioa@example.com", "contraseña": "password123"}
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class MovimientoInventarioViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('movimiento-inventario-list')

    def test_create_movimiento_inventario_success(self):
        data = {
            "producto": 1,
            "tipo_movimiento": "Entrada",
            "cantidad": 100
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_movimientos_inventario(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class ReporteInventarioViewTests(APITestCase):
    def setUp(self):
        self.url_pdf = reverse('reporte-inventario', args=["pdf"])
        self.url_excel = reverse('reporte-inventario', args=["excel"])

    def test_reporte_inventario_pdf(self):
        response = self.client.get(self.url_pdf)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reporte_inventario_excel(self):
        response = self.client.get(self.url_excel)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_reporte_inventario_invalid(self):
        url_invalid = reverse('reporte-inventario', args=["txt"])
        response = self.client.get(url_invalid)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class DevolucionViewTests(APITestCase):
    def setUp(self):
        self.url = reverse('devolucion-list')

    def test_create_devolucion_success(self):
        data = {
            "producto": 1,
            "cantidad": 1,
            "motivo": "Defectuoso"
        }
        response = self.client.post(self.url, data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_get_devoluciones(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

class LoginViewTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user('user', 'user@test.com', 'password123')
        self.url = reverse('login')

    def test_login_successful(self):
        response = self.client.post(self.url, {'email': 'user@test.com', 'contraseña': 'password123'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        response = self.client.post(self.url, {'email': 'user@test.com', 'contraseña': 'wrongpassword'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

class AssignEditorRoleViewTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.url = reverse('assign_editor')
    
    def test_assign_editor_role(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(self.url, {'email': 'newuser@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(email='newuser@test.com')
        self.assertTrue(user.groups.filter(name="Editor").exists())

class AssignUserGroupsViewTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.user = User.objects.create_user('user', 'user@test.com', 'userpass')
        self.url = reverse('assign_user_groups')
    
    def test_assign_user_groups_success(self):
        group = Group.objects.create(name="TestGroup")
        token = Token.objects.create(user=self.admin)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        response = client.post(self.url, {'user_id': self.user.id, 'groups': [group.id]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.user.groups.filter(name="TestGroup").exists())

    def test_assign_user_groups_permission_denied(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post(self.url, {'user_id': self.user.id, 'groups': []})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        
class SeguridadViewTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_superuser('admin', 'admin@test.com', 'adminpass')
        self.user = User.objects.create_user('user', 'user@test.com', 'userpass')

    def test_login_successful(self):
        url = reverse('login')
        response = self.client.post(url, {'email': 'user@test.com', 'contraseña': 'userpass'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('token', response.data)

    def test_login_invalid_credentials(self):
        url = reverse('login')
        response = self.client.post(url, {'email': 'user@test.com', 'contraseña': 'wrongpass'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_crud_admin_only(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('user-list')
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        r2 = self.client.get(url)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)

    def test_group_crud_admin_only(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('group-list')
        r = self.client.get(url)
        self.assertEqual(r.status_code, status.HTTP_403_FORBIDDEN)

        self.client.force_authenticate(user=self.admin)
        r2 = self.client.get(url)
        self.assertEqual(r2.status_code, status.HTTP_200_OK)

    def test_assign_editor_role(self):
        self.client.force_authenticate(user=self.admin)
        url = reverse('assign_editor')
        response = self.client.post(url, {'email': 'newuser@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(User.objects.filter(email='newuser@test.com').exists())
        user = User.objects.get(email='newuser@test.com')
        self.assertTrue(user.groups.filter(name="Editor").exists())

    def test_assign_user_groups_success(self):
        group = Group.objects.create(name="TestGroup")
        token = Token.objects.create(user=self.admin)

        client = APIClient()
        client.credentials(HTTP_AUTHORIZATION='Token ' + token.key)

        url = reverse('assign_user_groups')
        response = client.post(url, {'user_id': self.user.id, 'groups': [group.id]})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.user.groups.filter(name="TestGroup").exists())

    def test_assign_user_groups_permission_denied(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('assign_user_groups')
        response = self.client.post(url, {'user_id': self.user.id, 'groups': []})
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)