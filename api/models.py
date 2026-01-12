from django.db import models

class Paciente(models.Model):
    nombre = models.CharField(max_length=100)
    cedula = models.CharField(max_length=20, unique=True)
    telefono = models.CharField(max_length=15, blank=True)
    email = models.EmailField(blank=True)
    fecha_nacimiento = models.DateField(blank=True, null=True)

   # --- DATOS DEL APODERADO / REPRESENTANTE LEGAL ---
    # Solo se llenan si el paciente es menor o dependiente
    tiene_representante = models.BooleanField(default=False)
    
    rep_nombres = models.CharField(max_length=100, blank=True, null=True)
    rep_apellidos = models.CharField(max_length=100, blank=True, null=True)
    rep_relacion = models.CharField(max_length=50, blank=True, null=True) # Ej: Padre, Madre, Tío
    rep_tipo_documento = models.CharField(max_length=20, default='CEDULA')
    rep_cedula = models.CharField(max_length=20, blank=True, null=True)
    rep_email = models.EmailField(blank=True, null=True)
    rep_telefono = models.CharField(max_length=20, blank=True, null=True)
    rep_direccion = models.TextField(blank=True, null=True)
    # --- DATOS DEMOGRÁFICOS ADICIONALES (NUEVO) ---
    SEXO_OPCIONES = [
        ('M', 'Masculino'),
        ('F', 'Femenino'),
        ('O', 'Otro'),
    ]
    sexo = models.CharField(max_length=1, choices=SEXO_OPCIONES, default='M')
    direccion = models.TextField(blank=True, null=True)
    ocupacion = models.CharField(max_length=100, blank=True, null=True)
    # --- SECCIÓN 1: MOTIVO DE CONSULTA (MSP) ---
    motivo_consulta = models.TextField(blank=True, null=True)
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
    # --- SECCIÓN 5: EXAMEN DEL SISTEMA ESTOMATOGNÁTICO (MSP) ---
    # True = Con Patología (Rojo), False = Sano
    labios = models.BooleanField(default=False)
    mejillas = models.BooleanField(default=False)
    maxilar_superior = models.BooleanField(default=False)
    maxilar_inferior = models.BooleanField(default=False)
    lengua = models.BooleanField(default=False)
    paladar = models.BooleanField(default=False)
    piso_boca = models.BooleanField(default=False)
    carrillos = models.BooleanField(default=False)
    glandulas_salivales = models.BooleanField(default=False)
    orofaringe = models.BooleanField(default=False)
    atm = models.BooleanField(default=False)
    ganglios = models.BooleanField(default=False)
    
    # Espacio para describir la patología encontrada (como dice el formulario)
    descripcion_estomatognatico = models.TextField(blank=True, null=True)
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