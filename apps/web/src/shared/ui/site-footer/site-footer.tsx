import Image from "next/image";

import styles from "./site-footer.module.css";

export function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <a
          className={styles.identity}
          href="https://manuylov.com/"
          rel="noreferrer"
          target="_blank"
        >
          <Image
            alt=""
            aria-hidden="true"
            className={styles.mark}
            height={64}
            src="/brand/alex-manuylov-mark.svg"
            width={64}
          />
          <div>
            <strong>Alexandr Manuylov</strong>
            <span>Web &amp; App Development</span>
          </div>
        </a>

        <address className={styles.contacts}>
          <a href="mailto:manuylov_aleks@icloud.com">
            <MailIcon />
            <span>manuylov_aleks@icloud.com</span>
          </a>
          <a
            href="https://t.me/Aleks_Manuilov"
            rel="noreferrer"
            target="_blank"
          >
            <TelegramIcon />
            <span>@Aleks_Manuilov</span>
          </a>
        </address>

        <p className={styles.copyright}>
          © {new Date().getFullYear()} Alexandr Manuylov. Сайт и программный
          код защищены авторским правом. Фотографии используются на условиях
          указанных лицензий.
        </p>
      </div>
    </footer>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M4.8 6.5h14.4c.72 0 1.3.58 1.3 1.3v8.4c0 .72-.58 1.3-1.3 1.3H4.8c-.72 0-1.3-.58-1.3-1.3V7.8c0-.72.58-1.3 1.3-1.3Z" />
      <path d="m4.2 7.4 7.8 6 7.8-6" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M20.6 4.3 17.8 19c-.2 1-1 1.25-1.82.78l-4.3-3.17-2.08 2c-.23.23-.42.42-.86.42l.3-4.38 7.98-7.2c.35-.3-.08-.48-.54-.18L6.62 13.5l-4.24-1.33c-.92-.29-.94-.92.2-1.37L19.16 4.4c.77-.28 1.44.18 1.43-.1Z" />
    </svg>
  );
}
