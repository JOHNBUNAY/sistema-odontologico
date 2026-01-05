from django.test import TestCase
from .models import Paciente
from django.db.utils import IntegrityError

class PruebasPaciente(TestCase):

    def test_crear_paciente_exitoso(self):
        """Prueba 1: Verificar que se puede crear un paciente normal"""
        paciente = Paciente.objects.create(
            nombre="John Maicol Prueba",
            cedula="1234567890",
            fecha_nacimiento="1990-01-01",
            telefono="0999999999"
        )
        # Verificamos que realmente se guardó, debería haber 1.
        self.assertEqual(Paciente.objects.count(), 1)
        self.assertEqual(paciente.nombre, "John Maicol Prueba")

    def test_cedula_unica(self):
        """Prueba 2: Verificar que el sistema BLOQUEA cédulas repetidas"""
        # 1. Creamos el primer paciente
        Paciente.objects.create(
            nombre="Paciente Original", 
            cedula="11111", 
            fecha_nacimiento="2000-01-01"
        )
        
        # 2. Intentamos crear un impostor con la MISMA cédula
        # El sistema DEBERÍA fallar. Si no falla, el test nos avisa.
        with self.assertRaises(IntegrityError):
            Paciente.objects.create(
                nombre="Paciente Impostor", 
                cedula="11111", # ¡REPETIDA!
                fecha_nacimiento="2000-01-01"
            )