import './App.css'
import loriImage from './assets/lorita.png'
import secondImage from './assets/rosita.png'
import LiquidGlass from './components/LiquidGlass'
import instagramIcon from './assets/instagram.png'
import tiktokIcon from './assets/tiktok.png'
import twitterIcon from './assets/twitter.png'
import loveSupportIcon from './assets/love-support.png'

function App() {

  const handleInstagramClick = (e) => {
    e.preventDefault()

    const link = e.currentTarget

    link.classList.remove('clicked')

    void link.offsetWidth

    link.classList.add('clicked')

    setTimeout(() => {
      window.open(
        link.href,
        '_blank',
        'noopener,noreferrer'
      )
    }, 450)
  }

  return (
    <main className="page">

      <div
        className="background"
        style={{ backgroundImage: `url(${loriImage})` }}
      ></div>

      <div className="background-overlay"></div>

      <section className="glass-board">

        <LiquidGlass backgroundImage={loriImage}>

          <div className="profile">

            <div className="second-image">
              <img src={secondImage} alt="Rosita" />
            </div>

            <h1>Lori Rosita</h1>

            <p className="bio">
              Lifestyle • Beauty • Creator
            </p>

            <div className="socials">

              {/* INSTAGRAM */}
              <a
                href="https://www.instagram.com/liliy_lorix/"
                target="_blank"
                rel="noreferrer"
                onClick={handleInstagramClick}
              >
                <img
                  src={instagramIcon}
                  alt="Instagram"
                />
              </a>

              {/* TIKTOK */}
              <a href="#">
                <img
                  src={tiktokIcon}
                  alt="TikTok"
                />
              </a>

              {/* TWITTER */}
              <a href="#">
                <img
                  src={twitterIcon}
                  alt="Twitter"
                />
              </a>

              {/* LOVE SUPPORT */}
              <a href="#">
                <img
                  src={loveSupportIcon}
                  alt="Love Support"
                />
              </a>

            </div>

          </div>

        </LiquidGlass>

      </section>

    </main>
  )
}

export default App