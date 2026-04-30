"use client";
import { BannerNav } from "../components/banner-nav";

const books = [
  {
    title: "Gradually, then Suddenly",
    author: "Parker Lewis",
    image:
      "https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1704252448i/204730461.jpg",
    link: "https://www.amazon.com/Gradually-Then-Suddenly-Parker-Lewis/dp/B0CRD86PWZ",
  },
  {
    title: "Broken Money",
    author: "Lyn Alden",
    image:
      "https://cdn.prod.website-files.com/64fee27528c4095c908b5078/66192f88571bebeb4974ac89_Broken%20_money_border-min.avif", // TODO: add cover image URL
    link: "https://www.amazon.com/Broken-Money-Financial-System-Failing/dp/B0CG83QBJ6",
  },
  {
    title: "The Bitcoin Standard",
    author: "Saifedean Ammous",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1517051735i/36448501.jpg",
    link: "https://www.amazon.com/Bitcoin-Standard-Decentralized-Alternative-Central/dp/1119473861",
  },
  {
    title: "The Price of Tomorrow",
    author: "Jeff Booth",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1577711076i/50157837.jpg",
    link: "https://www.amazon.com/Price-Tomorrow-Deflation-Abundant-Future/dp/1999257405",
  },
  {
    title: "Abundance Through Scarcity",
    author: "Ioni Appelberg",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1685002488i/162107335.jpg",
    link: "https://www.amazon.com/Abundance-Through-Scarcity-Ioni-Appelberg/dp/9916723087",
  },
  {
    title: "Proof of Money",
    author: "Terence Michael",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1683170402i/147006050.jpg",
    link: "https://www.amazon.com/PROOF-MONEY-Behind-Bitcoin-About/dp/B0C2RM94BB",
  },
  {
    title: "The Hidden Cost of Money",
    author: "Seb Bunney",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1701891456i/203361423.jpg",
    link: "https://www.amazon.com/Hidden-Cost-Money-Financial-Forces/dp/1738934101",
  },
  {
    title: "The Genesis Book",
    author: "Aaron Van Wirdum",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1703246002i/204250558.jpg",
    link: "https://www.amazon.com/Genesis-Book-Projects-Inspired-Bitcoin/dp/B0CQLMQRH7",
  },
  {
    title: "A Progressive's Case for Bitcoin",
    author: "C. Jason Maier",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1681448300i/131133208.jpg",
    link: "https://www.amazon.com/Progressives-Case-Bitcoin-Equitable-Peaceful/dp/B0C1J3DC2X",
  },
  {
    title: "The Big Print",
    author: "Larry Lepard",
    image:
      "https://m.media-amazon.com/images/S/compressed.photo.goodreads.com/books/1739028382i/227804284.jpg",
    link: "https://www.amazon.com/Big-Print-Happened-America-Sound/dp/B0DVTCVX8J",
  },
];

export function Resources() {
  return (
    <>
      <div className="siteWrapper">
        <BannerNav page="resources" />
        <div className="basicContainer">
          <h1>Bitcoin related Resources</h1>
          <p>
            This is just a short list of the resources in the bitcoin space that
            are at top of mind for me.
          </p>

          <h2>Recommended Books</h2>
          <div className="bookGrid">
            {books.map((book) => (
              <div key={book.title} className="bookCard">
                <a href={book.link} target="new">
                  {book.image ? (
                    <img
                      className="bookThumb"
                      src={book.image}
                      alt={book.title}
                    />
                  ) : (
                    <div className="bookThumbPlaceholder">No Cover</div>
                  )}
                  <div className="bookTitle">{book.title}</div>
                  <div className="bookAuthor">by {book.author}</div>
                </a>
              </div>
            ))}
          </div>
          <h2>Recommended Podcasts</h2>
          <ul>
            <li>
              <a
                href="https://www.fountain.fm/show/BMElezTqi1mcOc4PnwSH"
                target="new"
              >
                <div>Bitcoin Unleashed - Oliver Velez</div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@WhatBitcoinDidPod" target="new">
                <div>What Bitcoin Did - Danny Knowles</div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@BTCSessions" target="new">
                <div>BTC Sessions</div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@nataliebrunell" target="new">
                <div>Natalie Brunell</div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@RobinSeyr" target="new">
                <div>Robin Seyr</div>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/watch?v=g2aE7hVKH1o&list=PLoB1eZWSVHVbHsHgaIIp0cy0MSDoz7uo0"
                target="new"
              >
                <div>The Hurdle Rate Podcast (hosted by Swan Bitcoin)</div>
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/@rajatsonifinance" target="new">
                <div>Rajat Soni, CFA</div>
              </a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/@thebitcoinmatrixpodcast"
                target="new"
              >
                <div>The Bitcoin Matrix Podcast</div>
              </a>
            </li>
          </ul>
          <h2>Recommended Products</h2>
          <ul>
            <li>
              <a href="https://coldcard.com/" target="new">
                <div>Cold Card</div>
              </a>
            </li>
            <li>
              <a href="https://sparrowwallet.com/" target="new">
                <div>Sparrow Wallet</div>
              </a>
            </li>
            <li>
              <a href="https://aqua.net/" target="new">
                <div>Aqua Wallet</div>
              </a>
            </li>
          </ul>
          <h2>Recommended Businesses</h2>
          <ul>
            <li>
              <a href="https://river.com/" target="new">
                <div>River</div>
              </a>
            </li>
            <li>
              <a href="https://zaprite.com/" target="new">
                <div>Zaprite</div>
              </a>
            </li>
            <li>
              <a href="https://www.thebitcoinway.com/" target="new">
                <div>The Bitcoin Way</div>
              </a>
            </li>
            <li>
              <a href="https://www.strategy.com/" target="new">
                <div>Strategy</div>
              </a>
            </li>
            <li>
              <a href="https://strive.com/" target="new">
                <div>Strive Asset Management</div>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
