# Gastos App 📱

Una aplicación web progresiva (PWA) para el registro y seguimiento de gastos personales, construida con React, TypeScript y Tailwind CSS.

## 🚀 Características Principales

- **Registro de Gastos**: Agrega gastos con monto, categoría, subcategoría y notas
- **Categorización**: Sistema flexible de categorías y subcategorías
- **Pagos con Tarjeta**: Marca gastos como pagos con tarjeta para mejor seguimiento
- **Sincronización**: Sincronización automática con el servidor
- **PWA**: Instalable como aplicación nativa en dispositivos móviles
- **Offline First**: Funciona sin conexión a internet
- **Diseño Responsivo**: Interfaz optimizada para móviles y escritorio

## 🛠️ Tecnologías

- **Frontend**: React + TypeScript
- **Estilos**: Tailwind CSS
- **Estado**: React Query + Zustand
- **Formularios**: React Hook Form + Zod
- **UI Components**: Headless UI
- **Iconos**: Heroicons
- **PWA**: Vite PWA

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/gastos.git
cd gastos
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

## 🏗️ Estructura del Proyecto

```
src/
├── modules/
│   ├── common/          # Componentes y utilidades compartidas
│   ├── expenses/        # Módulo de gastos
│   │   ├── domain/      # Entidades y lógica de negocio
│   │   ├── infrastructure/ # Adaptadores y servicios
│   │   └── ui/          # Componentes de interfaz
│   └── categories/      # Módulo de categorías
├── common/              # Utilidades globales
└── main.tsx            # Punto de entrada
```

## 🎯 Características Técnicas

- **Arquitectura Hexagonal**: Separación clara entre dominio, infraestructura y UI
- **TypeScript**: Tipado estático para mejor mantenibilidad
- **React Query**: Manejo eficiente de estado del servidor
- **Zustand**: Estado global simple y eficiente
- **Tailwind**: Estilos utilitarios para desarrollo rápido
- **PWA**: Instalable y funcionamiento offline

## 📱 Uso

1. **Registrar un Gasto**:
   - Ingresa el monto
   - Selecciona categoría y subcategoría
   - Marca si es pago con tarjeta
   - Agrega notas opcionales
   - Confirma el registro

2. **Ver Gastos**:
   - Lista de gastos recientes
   - Filtrado por categoría
   - Búsqueda por texto
   - Ordenamiento por fecha

3. **Instalar como PWA**:
   - En iOS: Compartir → "Añadir a Pantalla de Inicio"
   - En Android: Menú → "Instalar App"

## 🤝 Contribuir

1. Fork el proyecto
2. Crea tu rama de feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## ✨ Próximas Características

- [ ] Gráficos de gastos por categoría
- [ ] Exportación de datos
- [ ] Presupuestos mensuales
- [ ] Recordatorios de pagos
- [ ] Múltiples monedas
