import './footer.css';
import Image from 'next/image';
import ScrollIntoView from '@app/components/ScrollIntoView/ScrollIntoView';
import Link from 'next/link';
import testIds from '@app/utils/test-ids';

const FooterNote = () => (
  <div className="text-sm font-open-sans-condensed text-gray-c1 float-right">
    <span>©2025 BY CHRISTOPHER RICHARD LEE </span>
    <a
        className="underline"
        href="https://crlapples.vercel.app"
        target="_blank"
        rel="noreferrer noopener"
      >
      <span>Built by crlapples </span>
    </a>
  </div>
);

const Footer = () => (
  <footer
    className="w-full m-h-56 bg-highlight leading-7 text-black text-gray-c1"
    data-testid={testIds.LAYOUT.FOOTER}
  >
    <div className="max-w-full-content mx-auto sm:flex gap-16 pt-14 pb-10 px-3">
      <div className="flex-1 relative">
        <div className="">
          <p className="uppercase mb-5 sm:mb-10 text-3xl tracking-[.35em]">
            Contact Me
          </p>
          <div className="text-2xl tracking-wider max-w-[350px]">
            <section className="mt-6 sm:mt-12 uppercase">
              <p>
                Feel free to reach out with any questions or concerns. I look
                forward to meeting you!
              </p>
            </section>
            <section className="mt-8 sm:mt-14">
              <p>CRLAPPLES19@GMAIL.COM</p>
              <p>385-227-1642</p>
            </section>
          </div>
          <div className="mt-10 sm:mt-24 mb-5">
            <ul
              aria-label="Social Bar"
              className="flex gap-4 sm:absolute bottom-0 left-0"
            >
              <li>
                <a
                  href="http://www.facebook.com"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    width={32}
                    height={32}
                    alt="Facebook"
                    src="https://static.wixstatic.com/media/4057345bcf57474b96976284050c00df.png"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://www.x.com/crlapples19"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    width={32}
                    height={32}
                    src="https://static.wixstatic.com/media/2be684_810b1f12e8d04a30b1ec920caf3af383~mv2.png"
                    alt="X"
                  />
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/crlapples19"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Image
                    width={32}
                    height={32}
                    src="https://static.wixstatic.com/media/e1aa082f7c0747168d9cf43e77046142.png"
                    alt="Instagram"
                  />
                </a>
              </li>
            </ul>
          </div>
          <Link
            className="absolute right-0 sm:-right-10 bottom-0"
            href="/#top"
            scroll={false}
          >
            <Image
              className="rotate-180"
              width={31}
              height={18}
              alt="back to top"
              src="/common/arrow.svg"
            />
          </Link>
        </div>
      </div>
      <div className="flex-1 relative">
        <form>
          <ScrollIntoView hashName="#contact" />
          <div className="font-open-sans-condensed">
            <input
              className="footer-form-input"
              id="contact-form-name"
              type="text"
              name="name"
              placeholder="Name"
              aria-required="false"
              maxLength={100}
            />

            <input
              className="footer-form-input"
              id="contact-form-email"
              type="email"
              name="email"
              placeholder="email"
              required
              aria-required="true"
              pattern="^.+@.+\.[a-zA-Z]{2,63}$"
              maxLength={250}
            />
            <input
              className="footer-form-input"
              id="contact-form-subject"
              type="text"
              name="subject"
              placeholder="Subject"
              aria-required="false"
            />
            <textarea
              className="footer-form-input h-24"
              id="contact-form-message"
              name="message"
              placeholder="Message"
              aria-required="false"
            />
            <div
              aria-disabled="false"
              className="flex justify-end my-4 sm:mt-12"
            >
              <button
                className="btn-secondary w-full p-1 text-lg w-full sm:w-32"
                aria-disabled="false"
              >
                <span>Submit</span>
              </button>
            </div>
            <div className="mt-10 mb-5">
              <div className="sm:absolute right-0 bottom-0">
                <FooterNote />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </footer>
);

export default Footer;
