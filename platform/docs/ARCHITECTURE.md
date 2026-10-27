# Sazón Platform — Arquitectura

**Objetivo:** que cada ejecutivo pase de 5 a 20 cuentas. Eso exige automatizar lo repetitivo (monitoreo, reportes, tareas rutinarias) y dejar al ejecutivo las decisiones y la relación con el cliente. **Métrica guía:** horas de ejecutivo por cuenta por semana.

## Principios
1. **La base de datos es la fuente de verdad.** Nada de datos en el HTML ni en `localStorage`.
2. **Seguridad en el servidor.** Autenticación real y RLS en Postgres; el navegador nunca decide quién ve qué.
3. **La IA propone, el humano aprueba** cualquier acción hacia clientes o plataformas.
4. **La IA no inventa números.** Todo dato que muestra viene de métricas calculadas, no de texto generado.
5. **Cada conector es reemplazable.** Si una plataforma cambia, falla un conector, no el producto.

## Stack
| Capa | Elección |
|---|---|
| App web | Next.js + TypeScript + Tailwind + shadcn/ui (Vercel) |
| Datos y acceso | Supabase: Postgres, Auth, RLS, Storage, Vault |
| Workers | Servicio Node con cola (BullMQ + Redis) para conectores y trabajos programados |
| IA | Capa común de modelos; modelo fuerte para razonar, modelo barato para clasificar |
| Mensajería | WhatsApp Business API |
| Cobro | Mercado Pago (suscripciones) + facturación electrónica SUNAT |
| Calidad | Sentry, PostHog, GitHub Actions, staging y producción |

## Roles
- **admin:** toda la organización.
- **executive:** solo las cuentas asignadas.
- **client:** solo sus marcas, solo lectura de resultados.

Implementado en `platform/supabase/migrations/0001_core.sql` y probado con `platform/supabase/tests/run-local.sh`.

## Portal del cliente = dashboard de resultados
Solo lectura sobre datos ya procesados, en tres niveles:
1. **Dashboard base fijo** con los indicadores clave (ventas, pedidos, ticket, conversión, rating, tiempo de preparación, inversión en ads y retorno).
2. **Pregúntale a Sofia:** el cliente consulta en lenguaje natural. La IA no escribe SQL libre: elige métricas, dimensiones y filtros de un **catálogo de métricas** definido por nosotros, y el sistema calcula. Así los números son siempre correctos y auditables.
3. **Dashboards propios:** se guardan como una definición declarativa (`dashboards.spec`, JSON), nunca como código. Permiten compartirlos y duplicarlos sin riesgo.

El cliente no ve tareas internas, alertas, cuentas de plataforma ni reportes en borrador.

## Herramienta del ejecutivo (el corazón del producto)
- **Cartera:** todas sus cuentas con puntaje de salud y lo que requiere atención hoy.
- **Cola de tareas diaria** priorizada (reglas + IA), con "hecho / descartar".
- **Alertas:** tienda pausada, tiempo de preparación alto, caída de rating, quiebre de stock.
- **Reporte semanal automático:** la IA redacta, el ejecutivo revisa y aprueba con un clic.
- **Copiloto:** propone promos, ads y cambios de carta con impacto estimado.
- **CRM de outbound compartido** (reemplaza el `localStorage` actual).

## Conectores (Rappi, PedidosYa, DiDi)
Interfaz común: `connect()`, `fetchDaily(brand, day)`, `health()`. Orden de preferencia por plataforma:
1. API o integración oficial de partner.
2. Ingesta de reportes (CSV o email).
3. Automatización de navegador con credenciales del cliente, **solo con autorización escrita en el contrato** y revisando los términos de cada plataforma. Es el más frágil: se aísla en el worker y se monitorea.

Las credenciales se guardan cifradas (Vault); la base solo guarda una referencia.

## Seguridad
- RLS en todas las tablas; escritura de métricas solo con `service_role` desde workers.
- Ninguna clave de IA o de plataforma en el frontend.
- Registro de auditoría de acciones sensibles.
- Cumplimiento de la Ley de Protección de Datos Personales (Perú) en contratos y retención.

## Hoja de ruta
| Fase | Alcance |
|---|---|
| Sprint 0 (sem. 1) | Esquema + RLS probado (hecho), higiene del repo, proyecto Supabase, auth real, CI |
| Sem. 2–4 | App Next.js: login, cartera, cola de tareas, CRM compartido, carga de métricas por CSV |
| Sem. 5–8 | Primer conector (Rappi), alertas, puntaje de salud |
| Sem. 9–12 | Reportes automáticos, portal del cliente con "Pregúntale a Sofia", cobro, WhatsApp |

## Costos mensuales estimados (referenciales, verificar precios vigentes)
Supabase Pro ~US$25 · Vercel Pro ~US$20 por usuario · worker + Redis ~US$15–40 · Sentry/PostHog gratis al inicio · IA ~US$50–300 según uso · WhatsApp API por conversación.

## Decisiones pendientes
- Crear el proyecto Supabase de Sazón (puede tener costo).
- Qué plataforma conectar primero y con qué método.
- Dominio y marca del portal de clientes.
