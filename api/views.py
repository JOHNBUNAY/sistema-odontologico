
from rest_framework import viewsets
from .models import Paciente, Cita, Tratamiento
from .serializers import PacienteSerializer, CitaSerializer, TratamientoSerializer

class PacienteViewSet(viewsets.ModelViewSet):
    queryset = Paciente.objects.all().order_by('-creado_en')
    serializer_class = PacienteSerializer

class CitaViewSet(viewsets.ModelViewSet):
    queryset = Cita.objects.all().order_by('fecha_hora')
    serializer_class = CitaSerializer

class TratamientoViewSet(viewsets.ModelViewSet):
    queryset = Tratamiento.objects.all().order_by('-fecha')
    serializer_class = TratamientoSerializer
# Create your views here.
