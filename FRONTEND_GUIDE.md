# 🔄 Actualización del Frontend para Geocodificación

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
    town?: string;              // ⭐ OPCIONAL - Ciudad específica (ej: "Barcelona")
    country: string;            // ⭐ OBLIGATORIO - Código ISO país (ej: "ES", "AR", "MX")
    can_move?: boolean;
    
    // 📍 Coordenadas (automáticas desde backend, solo si hay town)
    latitude?: number;          // Generado automáticamente si hay town
    longitude?: number;         // Generado automáticamente si hay town
    postal_code?: string;       // Opcional
    
    photo?: string;
    roles: string[];
    created_at?: Date;
    updated_at?: Date;
}
```

## 📊 Casos de Uso

### **1️⃣ Técnico Local (con ciudad específica)**
```json
{
  "town": "Barcelona",
  "country": "ES",
  "can_move": false
  // → Backend geocodifica: latitude: 41.3851, longitude: 2.1734
  // → Frontend muestra: "📍 Barcelona, España - A 504 km"
}
```

### **2️⃣ Técnico Nacional (sin ciudad, trabaja en todo el país)**
```json
{
  "town": null,  // ⭐ Sin ciudad específica
  "country": "ES",
  "can_move": true
  // → Sin coordenadas (latitude/longitude = null)
  // → Frontend muestra: "🌍 España (Nacional)"
}
```

### **3️⃣ Técnico que se Desplaza**
```json
{
  "town": "Madrid",
  "country": "ES",
  "can_move": true
  // → Backend geocodifica Madrid como base
  // → Frontend muestra: "📍 Madrid, España (se desplaza)"
}
```

## 🎨 Cambios en el Formulario de Registro/Edición

### Antes (problemático):
```html
<input name="town" placeholder="Ubicación" />
<!-- ❌ Usuarios escribían: "CABA", "Capital federal", "Argentina" -->
```

### Ahora (flexible y claro):
```html
<!-- País (OBLIGATORIO - dropdown) -->
<select name="country" required>
  <option value="">Selecciona un país *</option>
  <option value="ES">🇪🇸 España</option>
  <option value="AR">🇦🇷 Argentina</option>
  <option value="MX">🇲🇽 México</option>
  <!-- ... más países -->
</select>

<!-- Ciudad (OPCIONAL) -->
<input name="town" placeholder="Ciudad (opcional, ej: Barcelona)" />
<small>💡 Deja vacío si trabajas en todo el país</small>

<!-- Checkbox de desplazamiento -->
<label>
  <input type="checkbox" name="can_move" />
  Dispuesto a desplazarme
</label>
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

## 🔧 Ejemplo de Componente Angular

```typescript
// user-form.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html'
})
export class UserFormComponent {
  countries = [
    { code: 'ES', name: 'España', flag: '🇪🇸' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷' },
    { code: 'MX', name: 'México', flag: '🇲🇽' },
    // ... más
  ];
  
  userForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    country: ['ES', Validators.required],  // ⭐ OBLIGATORIO
    town: [''],  // ⭐ OPCIONAL
    can_move: [false]
    // latitude/longitude NO se envían, el backend los genera solo si hay town
  });
  
  onSubmit() {
    const userData = this.userForm.value;
    // El backend automáticamente agregará latitude/longitude
    this.userService.register(userData).subscribe(
      response => {
        console.log('Usuario registrado con coordenadas:', response);
        // response incluirá: { ...userData, latitude: 40.4168, longitude: -3.7038 }
      }
    );
  }
}
```

```html
<!-- user-form.component.html -->
<form [formGroup]="userForm" (ngSubmit)="onSubmit()">
  <input formControlName="name" placeholder="Nombre" />
  <input formControlName="email" placeholder="Email" />
  
  <!-- País (OBLIGATORIO) -->
  <select formControlName="country" required>
    <option value="">Selecciona país *</option>
    <option *ngFor="let country of countries" [value]="country.code">
      {{ country.flag }} {{ country.name }}
    </option>
  </select>
  
  <!-- Ciudad (OPCIONAL) -->
  <input formControlName="town" placeholder="Ciudad (opcional)" />
  <small class="hint">
    💡 Deja vacío si ofreces servicios en todo {{ selectedCountryName }}
  </small>
  
  <label>
    <input type="checkbox" formControlName="can_move" />
    Dispuesto a desplazarme
  </label>
  
  <button type="submit">Registrar</button>
</form>
```
NO necesitas validar que town y country estén juntos
// porque country es obligatorio y town es opcional

// Solo validar que country esté presente
countryValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const country = control.get('country')?.value;
    
    if (!country) {
      return { countryRequired: true };
    }
    
    // Validar que sea código ISO válido (2 letras mayúsculas)
    if (!/^[A-Z]{2}$/.test(country)) {
      return { invalidCountryCode
      return { townWithoutCountry: true };
    }
    if (country && !town) {
      return { countryWithoutTown: true };
    }
    
    return null;
  };
}
```

## 📊 Mostrar Distancia en Tarjetas de Usuarios

```typescript
// user-card.component.ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-user-card',
  template: `
    <d
      <!-- Mostrar ubicación según lo que tenga -->
      <p *ngIf="user.town && user.country">
        📍 {{ user.town }}, {{ getCountryName(user.country) }}
      </p>
      <p *ngIf="!user.town && user.country">
        🌍 {{ getCountryName(user.country) }} (Nacional)
      </p>
      
      <!-- Mostrar distancia SOLO si ambos tienen coordenadas -->
      <p *ngIf="distance !== null" class="distance">
        📏 A {{ distance }} km de ti
      </p>
      
      <!-- Indicar si se desplaza -->
      <span *ngIf="user.can_move" class="badge">
        🚗 Se desplaza
      </span- Mostrar distancia si hay coordenadas -->
      <p *ngIf="distance !== null" class="distance">
        📏 A {{ distance }} km de ti
      </p>
    </div>
  `
})
export class UserCardComponent {
  @Input() user!: User;
  @Input() currentUser!: User;
  
  get distance(): number | null {
    if (!this.user.latitude || !this.user.longitude ||
        !this.currentUser.latitude || !this.currentUser.longitude) {
      return null;
    }
    
    return this.calculateDistance(
      this.currentUser.latitude,
      this.currentUser.longitude,
      this.user.latitude,
      this.user.longitude
    );
  }
  
  calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Radio de la Tierra en km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return Math.round(R * c * 10) / 10; // Redondear a 1 decimal
  }
  showNationalUsers: boolean = true; // ⭐ Mostrar usuarios sin ciudad específica
  
  get filteredUsers(): User[] {
    return this.users.filter(user => {
      // 1. Filtrar por país (opcional)
      // if (user.country !== this.selectedCountry) return false;
      
      // 2. Si el usuario no tiene coordenadas (trabaja a nivel nacional)
      if (!user.latitude || !user.longitude) {
        return this.showNationalUsers; // Mostrar según preferencia
      }
      
      // 3. Si yo (currentUser) no tengo coordenadas, mostrar todos
      if (!this.currentUser.latitude || !this.currentUser.longitude) {
        return true;
      }
      
      // 4. Calcular distancia y filtrar
      const distance = this.calculateDistance(
        this.currentUser.latitude,
        this.currentUser.longitude,
        user.latitude,
        user.longitude
      );
      
      return distance <= this.maxDistance;
    });
  }
  
  get sortedUsers(): User[] {
    return this.filteredUsers.sort((a, b) => {
      // Usuarios sin coordenadas van al final
      if (!a.latitude && b.latitude) return 1;
      if (a.latitude && !b.latitude) return -1;
      if (!a.latitude && !b.latitude) return 0;
      
      // Ordenar por distancia
      const distA = this.calculateDistance(
        this.currentUser.latitude!,
        this.currentUser.longitude!,
        a.latitude!,
        a.longitude!
      );
      const distB = this.calculateDistance(
        this.currentUser.latitude!,
        this.currentUser.longitude!,
        b.latitude!,
        b.longitude!
      );
      return distA - distB;
    });
  }
  
  // ... método calculateDistance igual que arriba
}
```

```html
<!-- user-list.component.html -->
<div class="filters">
  <label>
    Mostrar técnicos a menos de:
    <input type="range" [(ngModel)]="maxDistance" min="10" max="500" step="10">
    {{ maxDistance }} km
  </label>
  
  <label>
    <input type="checkbox" [(ngModel)]="showNationalUsers">
    Incluir técnicos de cobertura nacional
  </label>
</div>
Flexible:** Técnicos locales o nacionales
2. **País obligatorio:** Siempre sabes de dónde es el técnico
3. **Ciudad opcional:** Algunos trabajan en todo el país
4. **Datos limpios:** Dropdown evita "CABA", "Capital federal", etc.
5. **Geocodificación precisa:** "Buenos Aires, AR" vs "Buenos Aires, CR"
6. **UX mejorada:** Usuario ve banderas 🇪🇸 🇦🇷
7. **Validación fácil:** Solo 2 letras en mayúsculas
8. **Estándar ISO:** Compatible con cualquier API/librería
9. **Búsqueda mixta:** Combina técnicos locales + nacionales
    [currentUser]="currentUser">
  </app-user-card>
</div>

<p *ngIf="sortedUsers.length === 0">
  No hay técnicos disponibles con los filtros seleccionados
    <input type="range" [(ngModel)]="maxDistance" min="10" max="500" step="10">
    {{ maxDistance }} km
  </label>
</div>

<div class="user-grid">
  <app-user-card 
    *ngFor="let user of nearbyUsers"
    [user]="user"
    [currentUser]="currentUser">
  </app-user-card>
</div>

<p *ngIf="nearbyUsers.length === 0">
  No hay técnicos en un radio de {{ maxDistance }} km
</p>
```

## ✅ Ventajas del Nuevo Sistema

1. **Datos limpios:** Dropdown de países evita "CABA", "Capital federal", etc.
2. **Geocodificación precisa:** "Buenos Aires, AR" vs "Buenos Aires, CR" (Costa Rica)
3. **UX mejorada:** Usuario ve banderas 🇪🇸 🇦🇷 en lugar de códigos
4. **Validación fácil:** Solo 2 letras en mayúsculas
5. **Estándar ISO:** Compatible con cualquier API/librería

## 🚨 Migración de Usuarios Existentes

Los 7 usuarios actuales se normalizarán automáticamente con:
```bash
node scripts/normalize-user-locations.js
```

Esto convertirá:
- ✅ "Capital federal" → town: "Buenos Aires", country: "AR"
- ✅ "CABA" → town: "Buenos Aires", country: "AR"
- ✅ "Argentina" → town: null, country: "AR" (necesita completar)
- ✅ "barcelona" → town: "Barcelona", country: "ES"
- ✅ "Madrid" → town: "Madrid", country: "ES"
