from rest_framework import viewsets
from .models import Paciente, Cita, Tratamiento
from .serializers import PacienteSerializer, CitaSerializer, TratamientoSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('-creado_en')
    serializer_class = PacienteSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().order_by('fecha_hora')
    serializer_class = CitaSerializer

# --- ESTA ES LA CLASE QUE CAMBIAMOS ---
class TratamientoViewSet(viewsets.ModelViewSet):
    # 👇 ESTA LÍNEA ES LA QUE FALTABA PARA QUE EL ROUTER NO SE ROMPA
    queryset = Tratamiento.objects.all()
    serializer_class = TratamientoSerializer
    
    def get_queryset(self):
        # Aquí inicia la lógica de filtrado
        queryset = Tratamiento.objects.all().order_by('-fecha')
        
        # Permitir filtrar por paciente: /api/tratamientos/?paciente=1
        paciente_id = self.request.query_params.get('paciente')
        if paciente_id is not None:
            queryset = queryset.filter(paciente=paciente_id)
            
        return queryset