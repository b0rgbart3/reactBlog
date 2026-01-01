import { BannerNav } from "../components/banner-nav";
import orangePill from "../assets/memes/orange_pill.jpeg";
import fortune from "../assets/memes/fortune_favors.jpg";
import elementzero from "../assets/memes/element_zero.jpg";
import buymore from "../assets/memes/buy_more.jpg";
import keepcalm from "../assets/memes/keep_calm.jpg";
import unstoppable from "../assets/memes/unstoppable.jpg";
import rigged from "../assets/memes/rigged.jpg";

export function Memes() {
    return (
        <>



            <img src={orangePill} />
            <img src={rigged} />

            <img src={elementzero} />
            <img src={buymore} />
            <img src={keepcalm} />

            <img src={fortune} />

            <img src={unstoppable} />

        </>
    )
}