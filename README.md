# Learning Dashboard

Android-focused learning dashboard built with React Native and TypeScript. Run with `npm install`, `npm run android` (with an Android SDK/device configured), or `npm test`.

## Architecture

The screen is the presentation layer; a ViewModel-style React hook owns loading, error, and offline state; and a repository owns course loading, caching, and lesson updates. Course/progress rules are pure domain functions. This keeps UI state separate from persistence and makes business logic testable. The included course fixture stands in for a mock API.

## Offline support

AsyncStorage keeps a versioned JSON snapshot of courses and completed lessons on-device. The repository refreshes from the mock source and falls back to the saved snapshot if refreshing fails; lesson changes are persisted immediately. Replace the fixture loader with an HTTP client without changing the UI contract.

## Security

In production, store authentication tokens in Android Keystore-backed encrypted storage (or iOS Keychain), never plain preferences or AsyncStorage. Use short-lived tokens, TLS, and server-side authorization. The demo login does not authenticate or store a token.

## Scale improvements

- Replace the fixture with a typed, authenticated API, pagination, and request retries.
- Use Room/SQLite for indexed course, lesson, and progress data plus transactional updates.
- Add background synchronization with conflict handling and observable connectivity.
- Add dependency injection, structured logging/crash reporting, and performance monitoring.
- Add accessibility/UI automation, broader unit tests, and CI builds for release variants.

## iOS/macOS counterpart

Use SwiftUI views with an Observable view model and a repository protocol; fetch with URLSession, persist course/progress snapshots in SwiftData (or SQLite), and store tokens in Keychain. Keep progress calculation in a separately tested domain layer.
