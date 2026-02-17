# 🔄 Actualización del Frontend para Geocodificación

## � Flujo Completo de Datos (Frontend ↔ Backend)

### **Registro de Usuario**

```
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Usuario rellena formulario                             │
│                                                                 │
│ 1. Usuario escribe ciudad en input                              │
│ 2. Frontend llama: GET /api/geocode/autocomplete?query=Barc     │
│ 3. Backend devuelve: [{city, country, latitude, longitude}]    │
│ 4. Usuario elige una opción del dropdown                        │
│ 5. Frontend obtiene coordenadas de esa opción                   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Validaciones locales (UX)                              │
│                                                                 │
│ ✓ City es requerido (del dropdown)                              │
│ ✓ Country es requerido (código ISO, ej: ES)                     │
│ ✓ Latitude y Longitude vienen del dropdown (nunca null)        │
│ ✓ Title tiene 20-130 caracteres                                 │
│ ✓ Description tiene 30-2400 caracteres                          │
│ ✓ Email es válido                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Envía POST /auth/register con:                         │
│                                                                 │
│ {                                                               │
│   "email": "user@example.com",              ← Frontend valida   │
│   "password": "segura123",                  ← Frontend valida   │
│   "name": "Juan García",                    ← Frontend valida   │
│   "title": "Técnico de iluminación",        ← Frontend valida   │
│   "description": "Experiencia en...",       ← Frontend valida   │
│   "city": "Barcelona",                      ← Del autocomplete   │
│   "country": "ES",                          ← Del autocomplete   │
│   "latitude": 41.3851,                      ← Del autocomplete   │
│   "longitude": 2.1734,                      ← Del autocomplete   │
│   "can_move": true,                         ← Usuario elige      │
│   "roles": ["user"]                         ← Default o usuario  │
│ }                                                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: Validaciones (express-validator)                       │
│                                                                 │
│ Validator                       Status                          │
│ ─────────────────────────────── ────────────────────────────   │
│ Email es válido                 ✓ express-validator            │
│ Password min 4 chars            ✓ express-validator            │
│ Name es string                  ✓ express-validator            │
│ Title: 20-130 chars             ✓ express-validator            │
│ Description: 30-2400 chars      ✓ express-validator            │
│ City: 3-20 chars                ✓ express-validator (EXISTS)   │
│ Country: 2 chars ISO            ✓ express-validator (EXISTS)   │
│ Latitude: -90 a 90              ✓ express-validator (EXISTS)    │
│ Longitude: -180 a 180           ✓ express-validator (EXISTS)    │
│                                                                 │
│ Si falla validación → 400 Bad Request + errores                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: Middleware de Geocodificación                          │
│                                                                 │
│ 1. Verifica: ¿Ya hay coordenadas válidas en req.body?          │
│    SÍ → Skip geocoding (confía en el autocomplete del front)    │
│    NO → Intenta geocodificar fallback (nunca debería pasar)    │
│                                                                 │
│ 2. Si fallback falla → Continúa sin coords                     │
│    (El validator luego rechazará por coords requeridas)        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ BACKEND: Controller (authController.register)                   │
│                                                                 │
│ 1. Verifica: ¿Email ya existe?                                  │
│    SÍ → 400 "Email ya registrado"                              │
│    NO → Continúa                                               │
│                                                                 │
│ 2. Hash password con bcrypt($BCRYPT_SALT)                      │
│                                                                 │
│ 3. Crea usuario con todos los datos (incluidas coords)         │
│                                                                 │
│ 4. Genera JWT token                                            │
│                                                                 │
│ 5. Devuelve: 200 OK + token en cookie                          │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ FRONTEND: Recibe respuesta                                       │
│                                                                 │
│ 200 OK          → Usuario registrado, redirige a dashboard      │
│ 400 Bad Request → Muestra errores de validación al usuario      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 📝 Interfaz de Usuario Actualizada

```typescript
export interface User {
    id_user?: number;
    email: string;
    password: string;
    name: string;
    title?: string;
    description?: string;
    
    // 📍 Ubicación geográfica
    city: string;               // ⭐ OBLIGATORIO - Ciudad (ej: "Barcelona")
    country: string;            // ⭐ OBLIGATORIO - Código ISO país (ej: "ES", "AR", "MX")
    latitude: number;           // ⭐ OBLIGATORIO - Viene del autocomplete
    longitude: number;          // ⭐ OBLIGATORIO - Viene del autocomplete
    can_move?: boolean;
    postal_code?: string;       // Opcional
    
    photo?: string;
    roles: string[];
    created_at?: Date;
    updated_at?: Date;
}
```

## 🎨 Formulario de Registro (Paso a Paso)

### Antes (problemático):
```html
<input name="city" placeholder="Ubicación" />
<!-- ❌ Problemas:
     - Usuarios escribían: "CABA", "Capital federal", "Argentina"
     - Inconsistencia de datos
     - No se podía filtrar por distancia sin coords
-->
```

### Ahora (flujo validado):
```html
<!-- 1️⃣ PAÍS: Select obligatorio (el usuario elige código ISO) -->
<label>País de trabajo *</label>
<select name="country" required [(ngModel)]="selectedCountry">
  <option value="">Selecciona un país</option>
  <option value="ES">🇪🇸 España</option>
  <option value="AR">🇦🇷 Argentina</option>
  <option value="MX">🇲🇽 México</option>
  <!-- ... más países -->
</select>

<!-- 2️⃣ CIUDAD: Input con autocompletado (obligatorio) -->
<label>Ciudad (autocompleta mientras escribes) *</label>
<input 
  name="cityInput" 
  placeholder="Escribe una ciudad (ej: Barcelona)" 
  [(ngModel)]="cityInput"
  (input)="onCitySearch($event)"
  required
/>

<!-- 3️⃣ DROPDOWN: Opciones del autocomplete -->
<ul *ngIf="cityOptions.length > 0" class="autocomplete-dropdown">
  <li *ngFor="let option of cityOptions" 
      (click)="selectCity(option)">
    {{ option.city }}, {{ option.country }}
  </li>
</ul>

<!-- 4️⃣ FEEDBACK: Ciudad seleccionada con coordenadas -->
<div *ngIf="selectedCity" class="selected-city">
  ✅ Seleccionado: {{ selectedCity.city }}, {{ selectedCity.country }}
  📍 Coordenadas: {{ selectedCity.latitude }}, {{ selectedCity.longitude }}
</div>

<!-- 5️⃣ DESPLAZAMIENTO: Checkbox opcional -->
<label>
  <input type="checkbox" name="can_move" [(ngModel)]="can_move" />
  Dispuesto a desplazarme a otras ciudades
</label>

<!-- SUBMIT: Enviará city+country+latitude+longitude al backend -->
<button (click)="onRegister()" [disabled]="!selectedCity">
  Registrate
</button>
```

### TypeScript Component Logic:

```typescript
export class RegisterComponent {
  selectedCountry = 'ES';
  cityInput = '';
  cityOptions: any[] = [];
  selectedCity: any = null;
  can_move = false;
  
  constructor(private http: HttpClient) {}

  // PASO 1: Usuario escribe ciudad → Llama autocomplete del backend
  onCitySearch(event: any) {
    const query = event.target.value;
    
    if (query.length < 2) {
      this.cityOptions = [];
      return;
    }

    // 🌐 Llama: GET /api/geocode/autocomplete?query=Barc&limit=5
    this.http.get(`/api/geocode/autocomplete?query=${query}&limit=5`)
      .subscribe((options: any) => {
        this.cityOptions = options;
        console.log('Opciones recibidas del backend:', options);
        // [
        //   { city: "Barcelona", country: "ES", latitude: 41.3851, longitude: 2.1734 },
        //   { city: "Barce (pueblo)", country: "IT", latitude: 44.0206, longitude: 8.0650 }
        // ]
      });
  }

  // PASO 2: Usuario elige una opción del dropdown
  selectCity(option: any) {
    this.selectedCity = {
      city: option.city,
      country: option.country,
      latitude: option.latitude,      // ← Backend te lo da en autocomplete
      longitude: option.longitude     // ← Backend te lo da en autocomplete
    };
    this.cityInput = `${option.city}, ${option.country}`;
    this.cityOptions = [];
  }

  // PASO 3: Usuario hace click en "Registrate"
  onRegister() {
    if (!this.selectedCity) {
      alert('Por favor, selecciona una ciudad del dropdown');
      return;
    }

    const userData = {
      email: this.email,
      password: this.password,
      name: this.name,
      title: this.title,
      description: this.description,
      city: this.selectedCity.city,
      country: this.selectedCity.country,
      latitude: this.selectedCity.latitude,        // ← Del autocomplete
      longitude: this.selectedCity.longitude,      // ← Del autocomplete
      can_move: this.can_move,
      roles: ['user']
    };

    // 🌐 Llama: POST /auth/register
    this.http.post('/auth/register', userData)
      .subscribe(
        (response: any) => {
          console.log('✅ Registrado correctamente');
          this.router.navigate(['/dashboard']);
        },
        (error: any) => {
          console.error('❌ Error en registro:', error);
          // Error 400: mostrar validaciones
          // Error 500: error del servidor
        }
      );
  }
}
```

## 📋 Lista de Códigos ISO Comunes

```typescript
export const COUNTRIES = [
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  // ... más según necesites
];
```

## � Endpoints que el Frontend Necesita

### 1️⃣ Autocomplete de Ciudades (Mientras escribe)

```
GET /api/geocode/autocomplete?query=Barc&limit=5
```

**Request:**
```bash
curl "http://localhost:3000/api/geocode/autocomplete?query=Barcelona&limit=5"
```

**Response 200 OK:**
```json
[
  {
    "display_name": "Barcelona, Cataluña, España",
    "city": "Barcelona",
    "country": "ES",
    "latitude": 41.3851,
    "longitude": 2.1734
  },
  {
    "display_name": "Barcelona, DTTO Metropolitano, Venezuela",
    "city": "Barcelona",
    "country": "VE",
    "latitude": 10.1307,
    "longitude": -64.6901
  }
]
```

**¿Qué hace el frontend?**
- Muestra ambas opciones en dropdown
- Usuario elige la correcta
- Frontend obtiene city+country+latitude+longitude de esa opción

### 2️⃣ Registrar Usuario

```
POST /auth/register
Content-Type: application/json
```

**Request (lo que DEBE enviar el frontend):**
```json
{
  "email": "user@example.com",
  "password": "segura123",
  "name": "Juan García",
  "title": "Técnico de iluminación profesional especializado",
  "description": "Más de 5 años de experiencia en iluminación para eventos, teatros y conciertos",
  "city": "Barcelona",
  "country": "ES",
  "latitude": 41.3851,
  "longitude": 2.1734,
  "can_move": true,
  "roles": ["user"]
}
```

**Response 200 OK:**
```json
{
  "code": 1,
  "message": "Usuario registrado correctamente"
}
```

**Response 400 Bad Request (validación fallida):**
```json
{
  "errors": [
    {
      "param": "city",
      "msg": "City is required"
    },
    {
      "param": "latitude",
      "msg": "Latitude is required (from autocomplete)"
    }
  ]
}
```

**¿Qué hace el backend?**
1. Valida que city+country+latitude+longitude existan y sean válidos
2. Confía en las coordenadas (las obtuviste del autocomplete)
3. Crea el usuario en BD
4. Devuelve 200 + token en cookie

---

## 🎯 Resumen: Responsabilidades

| Paso | Quién | Qué Hace | Validación |
|------|------|----------|-----------|
| 1 | Frontend | Usuario escribe ciudad | - |
| 2 | Frontend | Llama `/api/geocode/autocomplete` | - |
| 3 | Backend | Busca ciudades en Nominatim (OpenStreetMap) | ✓ Validate query |
| 4 | Backend | Devuelve opciones con coords | - |
| 5 | Frontend | Muestra dropdown al usuario | ✓ Check not empty |
| 6 | Frontend | Usuario elige opción | ✓ Check selected |
| 7 | Frontend | Obtiene city+country+lat+lon de la opción | - |
| 8 | Frontend | Rellena formulario con esos datos | ✓ Validate format |
| 9 | Frontend | Usuario rellena title, description, etc. | ✓ Validate length |
| 10 | Frontend | Llama `POST /auth/register` con todos los datos | - |
| 11 | Backend | Valida TODOS los campos | ✓ express-validator |
| 12 | Backend | Verifica email único | ✓ Check BD |
| 13 | Backend | Crea usuario | - |
| 14 | Backend | Devuelve 200 OK + token | - |
| 15 | Frontend | Guarda token en cookie, redirige a dashboard | - |

---

## 💡 Casos de Uso

### Caso 1: Usuario elige bien (Flow exitoso)
```
Usuario: "Quiero registrarme en Barcelona"
         ↓
Frontend: GET /api/geocode/autocomplete?query=Barcel
         ↓
Backend: [{city: "Barcelona", country: "ES", latitude: 41.3851, longitude: 2.1734}, ...]
         ↓
User: Elige "Barcelona, ES"
         ↓
Frontend: POST /auth/register {city: "Barcelona", country: "ES", latitude: 41.3851, longitude: 2.1734, ...}
         ↓
Backend: ✅ Valida todo, crea usuario
         ↓
Frontend: ✅ Muestra "Registrado correctamente"
```

### Caso 2: Usuario intenta meter ciudad inventada
```
User: Intenta escribir "XyZCity" (ciudad que no existe)
         ↓
Frontend: GET /api/geocode/autocomplete?query=XyZCity
         ↓
Backend: [] (array vacío, no encontrada)
         ↓
Frontend: Dropdown vacío, button "Registrate" deshabilitado
         ↓
User: No puede continuar
         ↓
User: Intenta escribir "Barcelona" correctamente → funciona
```

### Caso 3: Usuario intenta hackear mandando coords falsas
```
User: Intenta POST /auth/register {city: "Barcelona", latitude: 999, ...}
         ↓
Backend: ❌ Valida: "Latitude should be a valid decimal between -90 and 90"
         ↓
Backend: Devuelve 400 Bad Request
         ↓
Frontend: Muestra error al usuario
```

---

## 📋 Lista de Códigos ISO Comunes

```typescript
export const COUNTRIES = [
  { code: 'ES', name: 'España', flag: '🇪🇸' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
  { code: 'MX', name: 'México', flag: '🇲🇽' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴' },
  { code: 'PE', name: 'Perú', flag: '🇵🇪' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾' },
  { code: 'US', name: 'Estados Unidos', flag: '🇺🇸' },
  // ... más según necesites
];
```
