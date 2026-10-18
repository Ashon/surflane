# Security policy

## Supported versions

`@surflane/design-tokens` and `@surflane/ui` are released together with the same version. During 0.x, security fixes ship in a new patch release of the latest minor version only.

| Version | Supported |
| ------- | --------- |
| 0.1.x   | Yes       |

## Reporting a vulnerability

Please report vulnerabilities privately through GitHub: open the repository's **Security** tab and choose **Report a vulnerability**. Do not open a public issue, discussion or pull request for a suspected vulnerability.

Include the affected package and version, a description of the impact, and steps or a minimal example that reproduces it.

Reports are handled on a best-effort basis by the maintainer. A confirmed vulnerability is fixed in a patch release and disclosed in a GitHub security advisory, with credit to the reporter if they want it.

## Scope

In scope:

- `@surflane/design-tokens` and `@surflane/ui` as published on npm
- The catalog site at https://surflane.page

Out of scope:

- Vulnerabilities in dependencies such as Base UI or React; report those to their maintainers. If Surflane's use of a dependency makes a vulnerability exploitable, report that here.
- The example applications in `examples/`, which exist only to verify framework integration.
