from django.db import models

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    cedula = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    fecha_nacimiento = models.DateField()
    creado_en = models.DateTimeField(auto_now_add=True)

    #nuevos campo antecedentes del paciente
    alergia_antibioticos = models.BooleanField(default=False)
    alergia_anestesia = models.BooleanField(default=False)
    hemorragias = models.BooleanField(default=False)
    vih_sida = models.BooleanField(default=False)
    tuberculosis = models.BooleanField(default=False)
    asma = models.BooleanField(default=False)
    diabetes = models.BooleanField(default=False)
    hipertension = models.BooleanField(default=False)
    enfermedad_cardiaca = models.BooleanField(default=False)
    otros_antecedentes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return self.nombre

class Cita(models.Model):
    ESTADOS = [
        ('PENDIENTE', 'Pendiente'),
        ('COMPLETADA', 'Completada'),
        ('CANCELADA', 'Cancelada')
    ]
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField()
    motivo = models.TextField()
    estado = models.CharField(max_length=20, choices=ESTADOS, default='PENDIENTE')

    def __str__(self):
        return f"{self.paciente.nombre} - {self.fecha_hora}"

class Tratamiento(models.Model):
    paciente = models.ForeignKey(Paciente, on_delete=models.CASCADE)
    fecha = models.DateField(auto_now_add=True)
    descripcion = models.TextField()
    # Aquí guardaremos el estado de los dientes en formato JSON
    # Ej: {"diente_18": "caries", "diente_21": "resina"}
    odontograma = models.JSONField(default=dict, blank=True)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    def __str__(self):
        return f"Tratamiento {self.paciente.nombre} - {self.fecha}"