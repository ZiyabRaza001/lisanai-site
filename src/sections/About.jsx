import './About.css'

export default function About() {
  return (
    <section className="about" id="about">
      <div className="container">
        <div className="about__inner">
          <div className="about__header">
            <div className="section-tag">About</div>
            <h2 className="section-title">
              Why I built <span className="about__title-accent">LisanAI</span>
            </h2>
          </div>

          <div className="about__card">
            <div className="about__avatar">ZR</div>
            <div className="about__body">
              <p>
                I'm a 21-year-old computer science student who builds AI-based products — and for almost
                as long, I've tried, and failed, to learn Arabic.
              </p>
              <p>
                Every app I tried followed the same pattern: a strong first few days, then life got in
                the way, and a few weeks later I'd be starting over from zero. The material was never
                the problem. Actually showing up for it was.
              </p>
              <p>
                So I built LisanAI to solve that problem for myself first. Instead of another app
                competing for a spot on your home screen, it lives inside WhatsApp — the one app that's
                already open in your hand every day. No download, no new habit to build, no excuse to
                forget it exists.
              </p>
              <p>
                Underneath, it's over 60 structured lessons, built the way a real tutor would teach —
                proper grammar explanations, full vocabulary, and corrections that tell you exactly what
                went wrong instead of just marking you wrong. I've spent months testing and refining how
                it responds, corrects, and adapts, so it actually feels like learning from a patient
                tutor, not filling out a worksheet.
              </p>
              <p className="about__closing">
                If you've ever tried to learn Arabic and given up for the same reasons I did, I built
                this for you as much as for myself.
              </p>
              <p className="about__signature">— Ziyab, founder of LisanAI</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
