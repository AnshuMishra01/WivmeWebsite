import Navigation from '@/components/Navigation';

export default function ContactPage() {
  return (
    <>
      <Navigation />
      <main className="contact-page">
        <section className="contact-hero">
          <div className="container contact-hero__inner">
            <p className="label label--violet">Contact Wivme</p>
            <h1 className="contact-hero__title">Let&apos;s talk retention outcomes.</h1>
            <p className="contact-hero__subtitle">
              Reach us directly through the founders.
            </p>
          </div>
        </section>

        <section className="contact-details">
          <div className="container contact-details__grid">
            <article className="contact-card contact-card--violet">
              <h2>Founder Email</h2>
              <p>bhargav@wivmeai.com</p>
              <a href="mailto:bhargav@wivmeai.com">Send email</a>
            </article>

            <article className="contact-card contact-card--coral">
              <h2>Founder Email</h2>
              <p>anshu@wivmeai.com</p>
              <a href="mailto:anshu@wivmeai.com">Send email</a>
            </article>

            <article className="contact-card contact-card--sage">
              <h2>Phone</h2>
              <p>+91 8015620461</p>
              <a href="tel:+918015620461">Call now</a>
            </article>
          </div>
        </section>
      </main>
    </>
  );
}
