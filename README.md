# Corelia Cloud CMS

**Corelia** is a lightweight, static-page templated CMS (Content Management System) tailored for ecommerce and/or blogs of all sizes. It empowers merchants to generate fast, elegant product detail pages using a simple HTML templating system—with zero server-side rendering. Just static files, served lightning-fast.

## Tech Stack

Corelia uses battle-tested libraries and modern tools:

- **Node.js** `^20.19.2`
- **Express** `^5.1.0` as the web framework
- **PostgreSQL** via `pg` `^8.16.0` to manage product data
- **Bootstrap** `^5.3.5` for responsive design
- **Argon2** `^0.43.0` for password hashing
- NGINX for static delivery (recommended for production)
- Static templater for HTML product page generation

## Payment Processor Integration

Corelia ** DOES NOT handle payments or store payment info**. It is intentionally **not PCI-compliant**, and relies on third-party solutions. Merchants are encouraged to embed or integrate checkout services such as:

- [Stripe Checkout](https://stripe.com/checkout)
- [PayPal](https://www.paypal.com/buttons/)
- [Square](https://developer.squareup.com/docs/checkout/overview)

> Developers are responsible for selecting and configuring a secure provider that meets compliance requirements.
