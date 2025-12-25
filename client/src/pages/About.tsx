import { BannerNav } from "../components/banner-nav";
import '../styles/basics.css';
import '../styles/typography.css';

export function About() {
    return (
            <>
              <BannerNav page='about' />
        <div className='basicContainer'>
            <h1>About Moon Math</h1>
            <p>This is a blog about bitcoin.  Moon-Math refers to the meme that bitcoiners often site -- that the Bitcoin price is <b><i>"going to the moon!"</i></b> and because 
                I think there are so many interesting little nuggets one can discover when you start falling down the rabbit hole and studying bitcoin, and most of my insights have
                something to do with Math, and / or computer science.  I wanted a place where I could publish my thoughts and share them with the community.   Admittedly, my articles are not written with the intention of orange-pilling newbies.  They're more little esoteric fascinations that I've come across along the way and might be intersting to other bitcoiners who will understand the context, but might have a different perspective.

            </p>
            <p>I wanted a place to publish these articles that didn't have a pay-wall, or promote some other entity, so I decided to build my own blog.  I wouldn't say it was 'vibe-coded', but it was definitely AI assisted.</p>
            <p>As a designer, I also wanted to have my own bitcoin related merch - t-shirts and such, and a place to sell / share them with other bitcoiners.  I love typography and graphic design and I wanted to design bitcoin t-shirts that I myself wanted to wear.</p>
            <p>Also, check out the resources section - where I promote my favorite brands and bitcoin related resources.</p>
            <p>Thanks for checking out Moon-Math!</p>
        </div>
        </>
    )
}