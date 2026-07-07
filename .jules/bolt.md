## 2024-05-18 - [Optimize Node.js HTTP stream accumulation]
**Learning:** Implicitly coercing Buffer objects to strings via string concatenation (`data += chunk`) in HTTP response handlers is inefficient. It forces V8 to repeatedly allocate intermediate strings.
**Action:** Always push `chunk` buffers into an array and use `Buffer.concat(chunks).toString('utf8')` on the 'end' event. This minimizes allocations and significantly improves performance for larger payloads.
