# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

This is **@alveusgg/control-api**, a TypeScript/Hono REST API that provides a unified control interface for Axis network cameras via the VAPIX protocol. It abstracts camera-specific operations (PTZ, imaging, IR control) behind a consistent HTTP API with WebSocket support for real-time events.

## Build and Development Commands

```powershell
npm install        # Install dependencies
npm run dev        # Start dev server with hot reload (tsx watch)
npm run build      # Production build via Vite (outputs to dist/)
npm run start      # Run production build
```

The dev server runs on the port specified in `configs/service.json` (default: 1229).

## Architecture

### Entry Point and Server

- `src/index.ts` - Entry point: initializes managers, registers modules, starts server
- `src/server/server.ts` - Hono server setup, module registration, manager initialization

### Module System

Modules are feature groups (PTZ, Imaging, DayNight, etc.) that register routes with the Hono app:

- Each module implements the `Module` interface (`src/modules/module.ts`)
- Modules are enabled/disabled via `configs/service.json` → `moduleMap`
- Module registration: `src/modules/module.ts` exports array of all modules
- Pattern: each module has an `index.ts` that wires handlers to routes using middleware

**Module structure:**

```
src/modules/{module_name}/
  index.ts           # Route registration with middleware
  *_handler.ts       # Individual endpoint handlers
```

### Middleware Chain

Routes use a standard middleware chain (order matters):

1. `AuthorizationMiddleware` - Validates `Authorization: ApiKey <key>` header
2. `CameraMiddleware` - Resolves `X-Camera-Name` header to camera object, sets on context
3. `CapabilitiesMiddleware(...)` - Validates camera supports required capabilities

### Managers (Singleton Pattern)

All managers are singletons exported from `src/managers/index.ts`:

- **ConfigManager** - Loads `configs/cameras.json` and `configs/service.json`
- **CameraManager** - Maintains camera instances with DigestClient for VAPIX auth
- **VAPIXManager** - Makes authenticated HTTP calls to camera VAPIX API
- **WebSocketManager** - Handles outbound WS connections to clients, processes camera events

### Camera Configuration

Cameras are defined in `configs/cameras.json`:

```json
{
	"name": "garden", // Used in X-Camera-Name header (case-insensitive)
	"host": "garden.cam", // Camera hostname
	"capabilities": ["PTZ", "Screenshots", "IrCutFilter"], // Feature flags
	"topics": ["ptz", "heartbeat", "ir"] // WebSocket event subscriptions
}
```

Credentials come from environment variables: `{CAMERA_NAME_UPPERCASE}_USERNAME` and `{CAMERA_NAME_UPPERCASE}_PASSWORD`

### VAPIX Communication

- Uses digest authentication via `digest-fetch` library
- `VAPIXManager.URLBuilder()` constructs standard Axis CGI URLs
- `VAPIXManager.makeAPICall()` handles authenticated requests
- `VAPIXManager.GetParameter()`/`SetParameter()` for camera parameter access

### WebSocket Events & Observer Pattern

**Event Flow:**

1. Camera connects to Axis VAPIX WebSocket (`ws://{host}/vapix/ws-data-stream`) via `CameraManager.connectWebsocket()`
2. Camera subscribes to topics (ptz, ir, heartbeat) defined in `configs/cameras.json`
3. When events arrive, `WebSocketManager.processMessage()` dispatches to registered observers
4. Observers process events and broadcast formatted messages to connected clients

**Observer Interface** (`src/models/observer.ts`):

```typescript
interface Observer {
	name: string;
	cameras: CameraTopics; // Per-camera topic subscriptions: { "cameraName": ["ptz", "ir"] }
	topics: string[]; // Global topic subscriptions (all cameras)
	handler: (camera, topic, timestamp, data) => void;
}
```

**Registration** (`src/managers/websocket_manager.ts`):

- Observers are registered in the `observers` array at the top of the file
- `registerObserver()` adds observers to two registries:
  - `#observers.topics[topic]` — global subscriptions (observer receives events from ALL cameras for that topic)
  - `#observers.cameras[camera][topic]` — per-camera subscriptions (observer receives events only from specific cameras)
- Special topic `"all"` receives every event for that scope

**Message Dispatch** (`processMessage()`):
When an event arrives, observers are collected from four groups and all are invoked:

1. Global "all" topic subscribers
2. Global topic-specific subscribers
3. Per-camera "all" subscribers
4. Per-camera topic-specific subscribers

**Creating a New Observer:**

1. Create `src/observers/{name}_observer.ts` implementing the `Observer` interface
2. Export from `src/observers/index.ts`
3. Add to the `observers` array in `websocket_manager.ts`

**Existing Observers:**

- `PTZObserver` — Listens to `ptz` topic globally, fetches position/speed and broadcasts movement state
- `IRObserver` — Listens to `ir` topic globally, broadcasts day/night filter status changes

## Environment Variables

Copy `.env.example` to `.env`:

- `SHARED_KEY` - API authentication key
- `{CAMERA}_USERNAME` / `{CAMERA}_PASSWORD` - Per-camera VAPIX credentials (uppercase camera name)

## Config Files

- `cameras.json` - Camera definitions and capabilities
- `service.json` - Server ports, enabled modules

## Path Aliases

TypeScript paths configured: `@/*` → `src/*`
