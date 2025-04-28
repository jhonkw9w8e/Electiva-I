from django.db import models
from django.conf import settings
# Create your models here.

class Producto(models.Model):
    nombre    = models.CharField(max_length=255)
    codigo    = models.CharField(max_length=50, unique=True)
    categoria = models.CharField(max_length=100)
    cantidad  = models.PositiveIntegerField()
    precio    = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.nombre} ({self.codigo})"

class Stock(models.Model):
    producto = models.OneToOneField(Producto, on_delete=models.CASCADE, related_name="stock")
    cantidad = models.PositiveIntegerField(default=0)
    umbral_minimo = models.PositiveIntegerField(default=5)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def actualizar_stock(self, delta):
        new_total = self.cantidad + delta
        if new_total < 0:
            raise ValueError("La cantidad resultante no puede ser negativa.")
        self.cantidad = new_total
        self.save()
        if self.cantidad < self.umbral_minimo:
            # La lógica para generar notificación se maneja en HU003 o en señales.
            return f"¡Alerta! El stock de {self.producto.nombre} está por debajo del umbral mínimo."
        return f"Stock actualizado correctamente. Nueva cantidad: {self.cantidad}"


class NotificacionStock(models.Model):
    nombre_producto = models.CharField(max_length=255)
    stock_actual = models.PositiveIntegerField()
    umbral_configurado = models.PositiveIntegerField()
    estado = models.BooleanField(default=True) 
    def __str__(self):
        return f"{self.nombre_producto} - {'Alerta' if self.estado else 'Normal'}"


class Usuario(models.Model):
    nombre = models.CharField(max_length=255)
    email = models.EmailField(unique=True)
    contraseña = models.CharField(max_length=128)  

    def __str__(self):
        return self.nombre
    
class MovimientoInventario(models.Model):
    MOVIMIENTO_CHOICES = [
        ('Entrada', 'Entrada'),
        ('Salida', 'Salida')
    ]
    producto = models.ForeignKey(Producto, on_delete=models.CASCADE)
    tipo_movimiento = models.CharField(max_length=20, choices=MOVIMIENTO_CHOICES)
    cantidad = models.PositiveIntegerField()
    fecha = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.producto.nombre} - {self.tipo_movimiento} - {self.cantidad}"

class Devolucion(models.Model):
    producto = models.ForeignKey('Producto', on_delete=models.PROTECT)
    cantidad = models.PositiveIntegerField()
    motivo = models.TextField()
    reincorpora = models.BooleanField(default=True)
    fecha = models.DateTimeField(auto_now_add=True)
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True)

    def __str__(self):
        return f"Devolución {self.producto.nombre} x{self.cantidad}"  
    

