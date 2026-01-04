from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from api import views

# 1. IMPORTAMOS LAS VISTAS DE SEGURIDAD (NUEVO)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

# 2. CONFIGURACIÓN DEL ROUTER (ESTO SE QUEDA IGUAL)
router = DefaultRouter()
router.register(r'pacientes', views.PacienteViewSet)
router.register(r'citas', views.CitaViewSet)
router.register(r'tratamientos', views.TratamientoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Tus rutas médicas (Pacientes, Citas, Tratamientos)
    path('api/', include(router.urls)),

    # 3. RUTAS DE LOGIN / SEGURIDAD (NUEVO)
    # Aquí pedimos la "pulsera VIP" (Token) con usuario y contraseña
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    
    # Aquí renovamos la pulsera si caduca (Opcional pero recomendado)
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]