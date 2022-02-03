# Photo Sharing Gallery

A JavaScript gallery and refactoring exercise with paginated nature, architecture, and fashion collections, image downloads, and a fixed three-item legacy API boundary.

## User flow

```text
choose category -> load API pages -> compose 9-image grid -> previous / next -> download
```

The `src/do-not-refactor` directory represents the supplied API and image fixture boundary. Application work outside that directory focuses on responsive interactions, maintainable modules, pagination, and testability.

## Local setup

```bash
npm install
npm start
```

Or:

```bash
docker compose up --build
```

## Attribution and boundaries

This repository originated as a technical refactoring exercise. The bundled GIFs illustrate the target/recorded interaction but are not a current automated verification result.

- The gallery supports three fixture categories.
- Nine visible items require composing multiple three-item API responses.
- Network timing and download behavior depend on the legacy API contract.
- Tests and the Docker application were not run during the portfolio review.
