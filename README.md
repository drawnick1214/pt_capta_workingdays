# API de Fechas Hábiles - Colombia

API REST para calcular fechas hábiles en Colombia, considerando días festivos, horarios laborales y zona horaria local.

## 🚀 Características

- ✅ Cálculo de días y horas hábiles
- ✅ Consideración de festivos colombianos (actualización automática desde API externa)
- ✅ Horario laboral: Lunes a Viernes, 8:00 AM - 5:00 PM
- ✅ Hora de almuerzo: 12:00 PM - 1:00 PM
- ✅ Manejo de zona horaria Colombia (America/Bogota)
- ✅ Respuestas en formato UTC (ISO 8601)
- ✅ Implementado 100% en TypeScript con tipado estricto

## 📋 Requisitos

- Node.js >= 18.0.0
- npm

## 🛠️ Instalación

1. Clonar el repositorio:

```bash
git clone git@github.com:drawnick1214/pt_capta_workingdays.git
cd pt_capta_workingdays
```

2. Instalar dependencias:

```bash
npm install
```

3. Compilar TypeScript:

```bash
npm run tsc
```

## 🏃 Ejecución

### Modo desarrollo

```bash
npm run dev
```

### Modo producción

```bash
npm start
```

El servidor se iniciará en el puerto 3000 por defecto (configurable con variable de entorno `PORT`).

## 📡 API Endpoints

### `GET /*` (cualquier ruta)

Calcula una fecha hábil sumando días y/o horas hábiles.

#### Parámetros Query String

| Parámetro | Tipo    | Requerido | Descripción                                                                                        |
| --------- | ------- | --------- | -------------------------------------------------------------------------------------------------- |
| `days`    | integer | No\*      | Número de días hábiles a sumar                                                                     |
| `hours`   | integer | No\*      | Número de horas hábiles a sumar                                                                    |
| `date`    | string  | No        | Fecha/hora inicial en UTC (ISO 8601 con sufijo Z). Si no se provee, usa la hora actual en Colombia |

\*Al menos uno de `days` o `hours` debe ser proporcionado.

#### Ejemplos de Uso

**Ejemplo 1: Sumar 1 hora desde ahora**

```bash
curl "http://localhost:3000/?hours=1"
```

**Ejemplo 2: Sumar 1 día y 4 horas**

```bash
curl "http://localhost:3000/?days=1&hours=4"
```

**Ejemplo 3: Con fecha específica**

```bash
curl "http://localhost:3000/?date=2025-04-10T15:00:00.000Z&days=5&hours=4"
```

#### Respuesta Exitosa (200 OK)

```json
{
  "date": "2025-08-01T14:00:00.000Z"
}
```

#### Respuesta de Error (400 Bad Request)

```json
{
  "error": "InvalidParameters",
  "message": "At least one of \"days\" or \"hours\" parameters is required"
}
```

## 🧪 Reglas de Negocio

### Días Hábiles

- Lunes a Viernes
- Excluye festivos colombianos (obtenidos de https://content.capta.co/Recruitment/WorkingDays.json)

### Horario Laboral

- Inicio: 8:00 AM (hora Colombia)
- Fin: 5:00 PM (hora Colombia)
- Almuerzo: 12:00 PM - 1:00 PM (no computa como tiempo hábil)

### Ajuste de Fechas

Si la fecha inicial está fuera del horario laboral o en un día no hábil, se ajusta **hacia atrás** al momento laboral más cercano:

- Sábados/Domingos → Viernes anterior a las 5:00 PM
- Antes de 8:00 AM → Día anterior a las 5:00 PM
- Después de 5:00 PM → Mismo día a las 5:00 PM
- Durante almuerzo (12:00-1:00 PM) → 12:00 PM del mismo día

### Orden de Suma

1. Primero se suman los días hábiles
2. Luego se suman las horas hábiles

## 📁 Estructura del Proyecto

```
working-days-api/
├── src/
│   ├── index.ts                          # Punto de entrada (servidor Express)
│   ├── routes/
│   │   └── calculateRoute.ts             # Ruta GET /calculate
│   ├── controllers/
│   │   └── calculateController.ts        # Controlador principal
│   ├── services/
│   │   └── workingDaysService.ts         # Lógica de fechas hábiles
│   ├── utils/
│   │   ├── holidays.ts                   # Obtención y caché de festivos
│   │   ├── timezone.ts                   # Conversión UTC ↔ America/Bogota
│   │   └── dateUtils.ts                  # Helpers: isWorkDay, addWorkHours
│   ├── types/
│   │   └── index.d.ts                    # Tipos e interfaces globales
│   └── config/
│       └── env.ts                        # Variables de entorno
├── build/                                # Código compilado (generado)
├── package.json
├── tsconfig.json
├── .gitignore
├── README.md
└── vercel.json
```

## 🔧 Tecnologías Utilizadas

- **Express**: Framework web para Node.js
- **TypeScript**: Lenguaje con tipado estático
- **Luxon**: Librería para manejo de fechas y zonas horarias
- **Axios**: Cliente HTTP para obtener festivos

## 🌐 Despliegue

### Variables de Entorno

- `PORT`: Puerto del servidor (default: 3000)

### Plataformas Recomendadas

- **Vercel**: Despliegue automático desde GitHub
- **AWS Lambda + API Gateway**: Usando AWS CDK (bonus)

### Ejemplo de Despliegue en Vercel

- https://pt-capta-workingdays-qbu24j479-drawnick1214s-projects.vercel.app/

## 🧩 Validación

La API cumple con los siguientes requisitos de validación automática:

- ✅ Nombres de parámetros exactos: `days`, `hours`, `date`
- ✅ Formato de respuesta exitosa: `{ "date": "..." }`
- ✅ Formato de respuesta de error: `{ "error": "...", "message": "..." }`
- ✅ Códigos de estado HTTP correctos (200, 400, 500)
- ✅ Content-Type: application/json

## 📝 Notas Adicionales

- La API descarga automáticamente los festivos colombianos al iniciar
- Todos los cálculos se realizan en hora local de Colombia (America/Bogota)
- Las respuestas siempre se devuelven en UTC
- El código está completamente tipado con TypeScript

## 👨‍💻 Desarrollo

Para agregar nuevas funcionalidades o modificar la lógica:

1. Edita `src/index.ts`
2. Ejecuta `npm run build` para compilar
3. Prueba con `npm run dev`

## 📄 Licencia

MIT
