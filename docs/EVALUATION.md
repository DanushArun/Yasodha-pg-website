# Yasodha PG — Evaluation guide

Start with the smallest path that exercises the project. Distinguish source inspection,
syntax/build checks, functional behavior and domain validation when recording a result.

## Guided reading and demonstration

1. **Explore the property.** Open the site and gallery. Images and amenities are supplied content;
verify them with the property operator.

2. **Submit synthetic enquiries.** Use the booking or email-subscription controls in an authorized
test environment. Avoid real prospective-tenant data during evaluation.

3. **Verify the storage destination.** Check whether a submission reached the configured sheet or
the CSV fallback. Startup can create or initialize worksheet headers.

4. **Check deployment persistence.** Inspect the hosting configuration and fallback file
durability. A success response without a durable record is not evidence of reliable enquiry
delivery.

## Declared checks

These commands/checks describe the intended verification path. Their presence in this
guide does not claim that they passed. See the dated evidence below and the README for setup.

```text
python -m py_compile server.py
```

## Evidence levels

| Level | What it establishes | What it does not establish |
| --- | --- | --- |
| Source review | A path exists in tracked code | Successful runtime behavior |
| Syntax/build | Parser/compiler accepts that path | End-to-end correctness |
| Behavioral check | A specific input/output case passed | Generalization beyond cases |
| Domain evaluation | Performance on a stated target setting | Other users/data/environments |

## What to record

- Commit, environment, dependency versions and date.
- Input provenance and whether data is synthetic, public or privately supplied.
- Absolute pass/fail/skip counts; keep failed cases and their root causes.
- Whether external services, hardware or a production deployment were actually exercised.
- Expected output and an artifact showing the observation.

## Review scenarios

- **Server routes define the contract:** The booking path is /submit_booking, not the old
documentation route.

- **Fallback is visible:** A CSV fallback is a distinct operational mode with its own durability
requirements.

- **Startup has side effects:** Use a dedicated test sheet because initialization can alter headers.

## Documentation inspection — 7 October 2026

The documentation was traced to committed source and checked for local links, balanced
code fences and supported implementation claims. Historical notebook outputs remain labeled
as historical. Live provider access, private databases and hardware behavior are not inferred
from configuration or dependency files. Any fresh run is recorded separately in the README.

## Next evidence to collect

- Test sheet and fallback paths with synthetic enquiries.
- Review durable storage and credential handling.
- Capture published-site delivery and gallery acceptance evidence.
