from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Producto, Stock, NotificacionStock, Usuario, MovimientoInventario, Devolucion
from .serializers import (
    ProductoSerializer, StockSerializer, NotificacionStockSerializer, UsuarioSerializer, MovimientoInventarioSerializer, DevolucionSerializer
)

class ProductoCreateView(APIView):
    def post(self, request):
        serializer = ProductoSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        productos = Producto.objects.all()
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

class StockUpdateView(APIView):
    def post(self, request, codigo):
        producto = get_object_or_404(Producto, codigo=codigo)
        stock, created = Stock.objects.get_or_create(producto=producto)
        serializer = StockSerializer(stock, data=request.data, partial=True)
        if serializer.is_valid():
            try:
                serializer.save()  # Actualiza cantidad
                mensaje = stock.actualizar_stock(serializer.validated_data.get('nueva_cantidad', 0))
                return Response({"message": mensaje, "cantidad_actual": stock.cantidad}, status=status.HTTP_200_OK)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, codigo):
        producto = get_object_or_404(Producto, codigo=codigo)
        stock = get_object_or_404(Stock, producto=producto)
        serializer = StockSerializer(stock)
        return Response(serializer.data)
    
    def delete(self, request, codigo):
        producto = get_object_or_404(Producto, codigo=codigo)
        stock = get_object_or_404(Stock, producto=producto)
        stock.delete()
        return Response({"message": "Stock eliminado correctamente"}, status=status.HTTP_204_NO_CONTENT)

class NotificacionStockView(APIView):
    def get(self, request):
        notificaciones = NotificacionStock.objects.filter(estado=True)
        serializer = NotificacionStockSerializer(notificaciones, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = NotificacionStockSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        notificacion = get_object_or_404(NotificacionStock, pk=pk)
        serializer = NotificacionStockSerializer(notificacion, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Notificación actualizada", "notificacion": serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        notificacion = get_object_or_404(NotificacionStock, pk=pk)
        notificacion.delete()
        return Response({"message": "Notificación eliminada correctamente"}, status=status.HTTP_204_NO_CONTENT)

class UsuarioRegistroView(APIView):
    def post(self, request):
        serializer = UsuarioSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Usuario registrado correctamente", "usuario": serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        usuarios = Usuario.objects.all()
        serializer = UsuarioSerializer(usuarios, many=True)
        return Response(serializer.data)

class MovimientoInventarioView(APIView):
    def get(self, request):
        movimientos = MovimientoInventario.objects.all()
        serializer = MovimientoInventarioSerializer(movimientos, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MovimientoInventarioSerializer(data=request.data)
        if serializer.is_valid():
            movimiento = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ProductoBusquedaView(APIView):
    def get(self, request):
        nombre = request.query_params.get('nombre', None)
        codigo = request.query_params.get('codigo', None)
        categoria = request.query_params.get('categoria', None)
        productos = Producto.objects.all()
        if nombre:
            productos = productos.filter(nombre__icontains=nombre)
        if codigo:
            productos = productos.filter(codigo__icontains=codigo)
        if categoria:
            productos = productos.filter(categoria__icontains=categoria)
        serializer = ProductoSerializer(productos, many=True)
        return Response(serializer.data)

class ReporteInventarioView(APIView):
    def get(self, request, formato):
        if formato not in ["pdf", "excel"]:
            return Response({"error": "Formato no soportado."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": f"Exportando reporte en {formato.upper()}."})

class DevolucionView(APIView):
    def post(self, request):
        serializer = DevolucionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(usuario=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request):
        qs = Devolucion.objects.all().order_by('-fecha')
        data = DevolucionSerializer(qs, many=True).data
        return Response(data)
 