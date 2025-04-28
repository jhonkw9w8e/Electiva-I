from django.test import TestCase
from django.contrib.auth import get_user_model
from AppInventario.models import Producto, Stock, NotificacionStock, Usuario, MovimientoInventario, Devolucion

User = get_user_model()

class ModelCoverageTests(TestCase):
    def test_producto_str(self):
        p = Producto.objects.create(nombre="X", codigo="C1", categoria="Cat", cantidad=1, precio=1)
        self.assertEqual(str(p), "X (C1)")

    def test_stock_defaults_and_actualizar_stock(self):
        p = Producto.objects.create(nombre="Y", codigo="C2", categoria="Cat", cantidad=1, precio=1)
        s = Stock.objects.create(producto=p)
        self.assertEqual(s.cantidad, 0)
        self.assertEqual(s.umbral_minimo, 5)
        msg = s.actualizar_stock(1)
        s.refresh_from_db()
        self.assertIn("Stock actualizado correctamente", msg)

    def test_stock_alerta_and_excepcion(self):
        p = Producto.objects.create(nombre="Z", codigo="C3", categoria="Cat", cantidad=1, precio=1)
        s = Stock.objects.create(producto=p, cantidad=1, umbral_minimo=2)
        msg = s.actualizar_stock(0)
        self.assertIn("Alerta", msg)
        with self.assertRaises(ValueError):
            s.actualizar_stock(-10)

    def test_notificacion_str(self):
        n = NotificacionStock.objects.create(nombre_producto="NP", stock_actual=0, umbral_configurado=1, estado=False)
        self.assertIn("Normal", str(n))

    def test_usuario_str(self):
        u = Usuario.objects.create(nombre="U1", email="u1@example.com", contraseña="pass")
        self.assertEqual(str(u), "U1")

    def test_movimiento_str(self):
        p = Producto.objects.create(nombre="M", codigo="C4", categoria="Cat", cantidad=1, precio=1)
        m = MovimientoInventario.objects.create(producto=p, tipo_movimiento="Entrada", cantidad=3)
        self.assertIn("Entrada", str(m))

    def test_devolucion_str(self):
        p = Producto.objects.create(nombre="D", codigo="C5", categoria="Cat", cantidad=1, precio=1)
        u = Usuario.objects.create(nombre="U2", email="u2@example.com", contraseña="pass")
        d = Devolucion.objects.create(producto=p, cantidad=2, motivo="Motivo", reincorpora=True, usuario=None)
        self.assertIn("Devolución", str(d))
