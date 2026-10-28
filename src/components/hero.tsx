import Image from 'next/image';
import { Arrow, ButtonLink, Eyebrow } from './ui';
import Link from 'next/link';
import styles from './hero.module.css';

/** Editorial examples only. These annotations are not editor controls. */
export function Hero() {
  return (
    <>
      <section className={`${styles.hero} section-wrap`} aria-labelledby="hero-title">
        <div className={styles.copy}>
          <Eyebrow>ESTUDIO CREATIVO DE PERSONALIZACIÓN</Eyebrow>
          <h1 id="hero-title" className={styles.title}>
            <span>Tu idea,</span> <span>nuestro próximo</span> <em>gran diseño.</em>
          </h1>
          <p className={styles.description}>
            Personaliza productos que cuentan tu historia. Desde pequeños detalles hasta grandes
            ideas para tu marca.
          </p>
          <div className={styles.actions}>
            <ButtonLink href="/productos">Empieza a crear</ButtonLink>
            <Link href="/productos" className={styles.explore}>
              Explora nuestros productos <Arrow />
            </Link>
          </div>
          <p className={styles.signature}>
            <span aria-hidden="true" />
            Lo cotidiano, con algo de ti.
          </p>
        </div>
        <figure className={styles.stage} aria-describedby="hero-image-note">
          <div className={styles.scene}>
            <Image
              src="/images/hero-personalized-02.webp"
              alt="Ejemplos de personalización: tote bag con un sol y olas, sudadera verde con una estrella y taza con el nombre ana."
              width={1122}
              height={1402}
              sizes="(max-width: 600px) calc(100vw - 40px), (max-width: 1100px) 48vw, 520px"
              loading="eager"
              fetchPriority="high"
              className={styles.photograph}
            />
            <span className={`${styles.marker} ${styles.designMarker}`} aria-hidden="true">
              01
            </span>
            <span className={`${styles.marker} ${styles.storyMarker}`} aria-hidden="true">
              02
            </span>
            <span className={`${styles.marker} ${styles.nameMarker}`} aria-hidden="true">
              03
            </span>
          </div>
          <div className={styles.seal} aria-hidden="true">
            <Image src="/brand/isotype.svg" alt="" width={48} height={48} />
            <span>Es hora de crear.</span>
          </div>
          <figcaption className={styles.caption}>
            <ol className={styles.notes} aria-label="Detalles de personalización">
              <li>
                <span>01</span>
                <div>
                  <em>Tu diseño</em>
                  <small>Una tote bag.</small>
                </div>
              </li>
              <li>
                <span>02</span>
                <div>
                  <em>Tu historia</em>
                  <small>Una sudadera.</small>
                </div>
              </li>
              <li>
                <span>03</span>
                <div>
                  <em>Tu nombre</em>
                  <small>Una taza.</small>
                </div>
              </li>
            </ol>
            <p id="hero-image-note">Una escena conceptual. Infinitas formas de hacerla tuya.</p>
          </figcaption>
        </figure>
      </section>
      <div className={styles.ribbon}>
        <ul className="section-wrap" aria-label="La esencia de GENHORA">
          <li>
            <span aria-hidden="true">01</span>Diseñado para ti.
          </li>
          <li>
            <span aria-hidden="true">02</span>Hecho con intención.
          </li>
          <li>
            <span aria-hidden="true">03</span>Creado para conectar.
          </li>
          <li className={styles.ribbonSignature}>Es hora de crear.</li>
        </ul>
      </div>
    </>
  );
}
