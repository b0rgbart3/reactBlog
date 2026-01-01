import { BannerNav } from "../components/banner-nav";
import { useState } from "react";
import axios from "axios";

export function About() {

    const [sent, setSent] = useState(false);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // console.log('BD: formData: ', formData);
        try {
            const response = await axios.post('/api/contact', formData);
            if (response.status === 200) {
                setSent(true);
            }
        } catch (err) {
            // console.log(err.response?.status); // 404?
            // console.log(err.response?.config?.url);
            // console.log(err.response?.config?.method);
        }
    };

    return (
        <>
            <BannerNav page='about' />
            <div className='basicContainer'>
                <h1>About Moon Math</h1>
                <p>This is a blog about bitcoin.  Moon-Math refers to the meme that bitcoiners often site -- that the Bitcoin price is <b><i>"going to the moon!"</i></b> and because
                    I think there are so many interesting little nuggets one can discover when you start falling down the rabbit hole and studying bitcoin, and most of my insights have
                    something to do with Math, and / or computer science.
                    I wanted a place where I could publish my thoughts and share them with the community.   Admittedly, my articles are not written with the intention of orange-pilling newbies.  They're more little esoteric fascinations that I've come across along the way and might be intersting to other bitcoiners who will understand the context, but might have a different perspective.
                    The logo also includes the mathematical symbol for infinity - which is a nod to 's book entitled, "Everything Divided by Twenty One Million".
                </p>
                <p>As an engineer, I wanted a place to publish these articles that didn't have a pay-wall, or promote some other entity, so I decided to build my own blog.  I wouldn't say it was 'vibe-coded', but it was definitely AI assisted.</p>
                <p>As a designer, I also wanted to have my own bitcoin related merch - t-shirts and such, and a place to sell / share them with other bitcoiners.  I love typography and graphic design and I wanted to design bitcoin t-shirts that I myself wanted to wear.</p>
                <p>Also, check out the resources section - where I promote my favorite brands and bitcoin related resources.</p>
                <p>These articles, merch, and resources are my way of contributing to the community, and helping to spread the gospel.  I haven't had much luck at orange-pilling, but maybe some of my ideas or designs will help others in their orange-pilling efforts.</p><p>Thanks for checking out Moon-Math!</p>

<br></br>
                <div className="divider"></div>
                {/* <div className="divider"></div> */}
                <h1>Copyright on Moon-Math Content</h1>
                <p>All of my articles and designs published on this blog site are copyrighted by Bart Dority 2026.</p>
                <p>If you would like to reproduce any of this content, please
                    contact me directly first to obtain the rights.  Thank you.</p>

<br></br>
                <div className="divider"></div>
                <h1>Contact Me</h1>

                                <p>You can connect with me on Nostr:<br></br>
                    Bitcoin Bubble - npub1gh5nll9l4rcvgjp60el65r9myjx7ms7a2msctwysx9yn6rv4v73qcj4uq8</p>
                    <p>-------</p>
                <p>You can follow me on Twitter: <a href='https://x.com/bartell_SF'>@bartell_SF</a></p>
                         <p>-------</p>

{ sent && (
    <>
    <p className='thankYou'>Thanks for contacting me.</p></>
)}
                         { !sent && (<>
                <p>Or you can send me an email:</p>


                <form onSubmit={handleSubmit} className='contactForm'>
                    <input
                        name="name"
                        placeholder="Your name"
                        onChange={handleChange}
                        required
                    />
                    <input
                        name="email"
                        type="email"
                        placeholder="Your email"
                        onChange={handleChange}
                        required
                    />
                    <textarea
                        name="message"
                        placeholder="Your message"
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">Send</button>
                </form>
</>
                )}
            </div>
        </>
    )
}