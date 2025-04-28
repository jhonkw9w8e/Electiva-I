from django.test import TestCase
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from rest_framework.authtoken.models import Token

from AppInventario.models import Producto, Stock, NotificacionStock, Usuario, MovimientoInventario, Devolucion
from AppInventario.serializers import (
    ProductoSerializer, StockSerializer,
    NotificacionStockSerializer, UsuarioSerializer,
    MovimientoInventarioSerializer, DevolucionSerializer
)

from seguridad.serializers import (
    GroupSerializer, UserSerializer, LoginSerializer, AssignUserGroupsSerializer
)

User = get_user_model()

class SerializerCoverageTests(TestCase):
    def test_producto_serializer_required(self):
        s = ProductoSerializer(data={})
        self.assertFalse(s.is_valid())
        for f in ['nombre', 'codigo', 'categoria', 'cantidad', 'precio']:
            self.assertIn(f, s.errors)

    def test_stock_serializer_valid_and_invalid(self):
        p = Producto.objects.create(nombre="S", codigo="C6", categoria="Cat", cantidad=1, precio=1)
        s0 = Stock.objects.create(producto=p, cantidad=1, umbral_minimo=1)
        s = StockSerializer(instance=s0, data={'nueva_cantidad': 2}, partial=True)
        self.assertTrue(s.is_valid())
        obj = s.save()
        self.assertEqual(obj.cantidad, 3)

        s_bad = StockSerializer(instance=s0, data={'nueva_cantidad': -10}, partial=True)
        self.assertFalse(s_bad.is_valid())
        self.assertIn('nueva_cantidad', s_bad.errors)
        self.assertEqual(s_bad.errors['nueva_cantidad'][0], 'La cantidad resultante no puede ser negativa.')

    def test_notificacion_and_usuario_serializer(self):
        data = {'nombre_producto': 'X', 'stock_actual': 1, 'umbral_configurado': 1, 'estado': True}
        self.assertTrue(NotificacionStockSerializer(data=data).is_valid())

        u_data = {'nombre': 'U', 'email': 'u@e.com', 'contraseña': 'p'}
        su = UsuarioSerializer(data=u_data)
        self.assertTrue(su.is_valid())

    def test_movimiento_and_devolucion_serializer(self):
        p = Producto.objects.create(nombre="MV", codigo="C7", categoria="Cat", cantidad=1, precio=1)
        m = MovimientoInventario.objects.create(producto=p, tipo_movimiento='Salida', cantidad=1)
        self.assertEqual(MovimientoInventarioSerializer(m).data['producto_nombre'], p.nombre)

        u = Usuario.objects.create(nombre="User", email="user@test.com", contraseña="pass")
        d = DevolucionSerializer(data={'producto': p.id, 'cantidad': 1, 'motivo': 'x', 'reincorpora': True})
        self.assertTrue(d.is_valid())

    def test_group_serializer_and_user_serializer(self):
        g = Group.objects.create(name="TestGroup")
        p = Permission.objects.first()
        g.permissions.add(p)
        gs = GroupSerializer(instance=g)
        self.assertIn('permissions', gs.data)

        u = User.objects.create_user(username="testuser", email="test@e.com", password="pass1234")
        u.groups.add(g)
        us = UserSerializer(instance=u)
        self.assertIn('groups', us.data)

    def test_login_serializer_success_and_failure(self):
        u = User.objects.create(email="login@test.com", username="loginuser")
        u.set_password('password123')
        u.save()
        Token.objects.create(user=u)

        s = LoginSerializer(data={'email': 'login@test.com', 'contraseña': 'password123'})
        self.assertTrue(s.is_valid())
        data = s.validated_data
        self.assertIn('token', data)

        s_fail = LoginSerializer(data={'email': 'login@test.com', 'contraseña': 'wrongpass'})
        self.assertFalse(s_fail.is_valid())

    def test_assign_user_groups_serializer(self):
        g = Group.objects.create(name="AssignGroup")
        u = Usuario.objects.create(nombre="AssignUser", email="assign@test.com", contraseña="pass")
        data = {'user_id': u.id, 'groups': [g.id]}
        s = AssignUserGroupsSerializer(data=data)
        self.assertTrue(s.is_valid())

    def test_stock_serializer_update(self):
        producto = Producto.objects.create(nombre="Producto X", codigo="123", categoria="Cat", cantidad=10, precio=100)
        stock = Stock.objects.create(producto=producto, cantidad=10, umbral_minimo=5)
        
        s = StockSerializer(instance=stock, data={'nueva_cantidad': 5}, partial=True)
        self.assertTrue(s.is_valid())
        updated_stock = s.save()
        self.assertEqual(updated_stock.cantidad, 15)

    def test_stock_serializer_invalid_quantity(self):
        s = StockSerializer(data={'nueva_cantidad': -5})
        self.assertFalse(s.is_valid())
        self.assertIn('nueva_cantidad', s.errors)
        self.assertEqual(s.errors['nueva_cantidad'][0], 'La nueva cantidad no puede ser negativa.')
